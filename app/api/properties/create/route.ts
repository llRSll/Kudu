import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Request body:", body); // Debug: log incoming data

    const { name, type, status, description } = body;
    if (!name || !type || !status) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, or status" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("properties")
      .insert([
        {
          name,
          type,
          status,
          description: description || null,
        },
      ])
      .select(); // Add .select() to get inserted row(s)

    console.log("Supabase insert result:", { data, error }); // Debug: log response

    if (error) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No data returned from insert." },
        { status: 500 }
      );
    }

    return NextResponse.json({ property: data[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
