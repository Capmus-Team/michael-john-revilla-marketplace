export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  location: string;
  seller_email: string;
  seller_name: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  listing_id: string;
  buyer_email: string;
  buyer_name: string | null;
  message: string;
  created_at: string;
}

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  category: string;
  seller_email: string;
  seller_name: string;
  image_url?: string;
}

export interface CreateMessageData {
  listing_id: string;
  buyer_email: string;
  buyer_name: string;
  message: string;
}

export const CATEGORIES = [
  "Electronics",
  "Vehicles",
  "Property Rentals",
  "Apparel",
  "Classifieds",
  "Entertainment",
  "Family",
  "Free Stuff",
  "Garden & Outdoor",
  "Hobbies",
  "Home Goods",
  "Home Improvement",
  "Home Sales",
  "Musical Instruments",
  "Office Supplies",
  "Pet Supplies",
  "Sporting Goods",
  "Toys & Games",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Post = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  image_url: string[] | null;
  university_email_domain: string | null;
  user_id: string;
  created_at: string;
  category_id: number;
  videos: string[] | null;
  video_type: string | null;
  thumbnail: string | null;
  email: string | null;
  ip: string | null;
  subcategory_id: number | null;
  access_token: string | null;
  status: string | null;
  university_id: number | null;
  time_posted: string;
  time_modified: string;
  linkedin_url: string | null;
  source: string | null;
  university: string | null;
  university_email: string | null;
  category?: Category | null;
  subcategory?: { id: number; name: string } | null;
};
