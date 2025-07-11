import { type NextRequest, NextResponse } from "next/server";

import { emailService } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { sellerEmail, buyerEmail, buyerName, message, listingId } =
      await request.json();

    // Here you would integrate with your email service (SendGrid, Resend, etc.)
    // For now, we'll just log the email that would be sent
    console.log("Email would be sent to:", sellerEmail);
    console.log("From:", buyerEmail);
    console.log("Message:", message);

    // Example with a hypothetical email service:

    await emailService.send({
      // to: sellerEmail,
      // from: "noreply@marketplace.com",
      // subject: "New message about your listing",
      // html: `
      //   <h2>You have a new message about your listing</h2>
      //   <p><strong>From:</strong> ${buyerName} (${buyerEmail})</p>
      //   <p><strong>Message:</strong></p>
      //   <p>${message}</p>
      //   <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/listing/${listingId}">View Listing</a></p>
      // `,
      from: "onboarding@resend.dev",
      to: sellerEmail,
      subject: "New message about your listing", //"Hello World",
      html: `
        <h2>You have a new message about your listing</h2>
        <p><strong>From:</strong> ${buyerName} (${buyerEmail})</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><a href="${request.headers.get("origin")}/listing/${listingId}">View Listing</a></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
