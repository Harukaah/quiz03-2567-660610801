import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Sirapob Yongmarnwong",
    studentId: "660610801",
  });
};
