import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM clicks ORDER BY clicked_at DESC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching click data:", error);
    return NextResponse.json(
      { message: "Error fetching click data" },
      { status: 500 }
    );
  }
}
