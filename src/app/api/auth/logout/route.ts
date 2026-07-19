import { NextResponse } from "next/server";
import { signOutCurrentSession } from "@/lib/auth/server";

export async function POST() {
	await signOutCurrentSession();
	return NextResponse.json({ message: "Signed out." });
}
