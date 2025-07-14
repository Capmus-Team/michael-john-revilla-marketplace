import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { stripe_reauth: string } }
) {
  try {
    const { stripe_reauth } = params;
    //console.log("Stripe reauth:", stripe_reauth);

    if (stripe_reauth === "true") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    // Always return a response
    return NextResponse.json({
      status: "success",
      reauth: stripe_reauth,
    });
  } catch (error) {
    console.error("Reauth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
