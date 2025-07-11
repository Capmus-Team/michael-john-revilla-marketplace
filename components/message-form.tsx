"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface MessageFormProps {
  listingId: string;
  sellerEmail: string;
}

export function MessageForm({ listingId, sellerEmail }: MessageFormProps) {
  const [message, setMessage] = useState("I want to buy your item!");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save message to database
      const { error } = await supabase.from("messages").insert({
        listing_id: listingId,
        buyer_email: buyerEmail,
        buyer_name: buyerName,
        message: message,
        seller_email: sellerEmail,
      });

      if (error) throw error;

      // Send email notification (you would implement this with your email service)
      await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerEmail,
          buyerEmail,
          buyerName,
          message,
          listingId,
        }),
      });

      setSuccess(true);
      setMessage("");
      setBuyerEmail("");
      setBuyerName("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-green-600 text-lg font-semibold mb-2">
              Message Sent Successfully!
            </div>
            <p className="text-gray-600">
              The seller will receive your message and can contact you directly.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send seller a message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="buyerName">Your Name</Label>
            <Input
              id="buyerName"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="buyerEmail">Your Email</Label>
            <Input
              id="buyerEmail"
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="resize-none"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
