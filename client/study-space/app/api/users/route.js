import { NextResponse } from "next/server";
import { createUser } from "@/actions/user.action";

export async function POST(req) {
  const body = await req.json();
  const user = await createUser(body);
  return NextResponse.json(user);
}