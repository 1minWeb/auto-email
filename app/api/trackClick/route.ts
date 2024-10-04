import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const subject = req.nextUrl.searchParams.get("subject");

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    await pool.query("INSERT INTO clicks (email, subject) VALUES ($1,&2)", [
      email,
      subject,
    ]);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const thankYouUrl = new URL("/thank-you", baseUrl);

    return NextResponse.redirect(thankYouUrl);
  } catch (error) {
    console.error("Error logging click:", error);
    return NextResponse.json(
      { message: "Error logging click" },
      { status: 500 }
    );
  }
}
