import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the service role key for server-side operations
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the incoming data
    const { name, type, status, description } = body;
    if (!name || !type || !status) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, or status" },
        { status: 400 }
      );
    }

    // Insert the property into the Supabase table
    const { data, error } = await supabase.from("properties").insert([
      {
        name,
        type,
        status,
        description: description || null,
      },
    ]);

    if (error || !data) {
      console.error("Error inserting property:", error);
      return NextResponse.json(
        { error: "Failed to create property" },
        { status: 500 }
      );
    }

    return NextResponse.json({ property: data[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
