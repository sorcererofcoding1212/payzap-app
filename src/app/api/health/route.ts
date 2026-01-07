import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    console.log("Health check at", new Date().toISOString());
    return NextResponse.json({
      msg: "ok",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      msg: "Internal server error",
      success: false,
    });
  }
};
