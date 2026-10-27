import { NextResponse } from "next/server";
import { getContactFieldErrors } from "@/app/(site)/(marketing)/contact/_lib/validation";
import { isHoneypotTriggered } from "@/lib/forms/guard";

const demoMessage = "Demo complete. Nothing was sent or stored.";

export async function POST(request: Request) {
	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return NextResponse.json(
			{ message: "Invalid form submission." },
			{ status: 400 },
		);
	}
	if (isHoneypotTriggered(formData, { fieldName: "website" })) {
		return NextResponse.json({ message: demoMessage });
	}
	const email = formData.get("email");
	const message = formData.get("message");
	const fieldErrors = getContactFieldErrors(
		typeof email === "string" ? email.trim() : "",
		typeof message === "string" ? message.trim() : "",
	);
	if (fieldErrors.email || fieldErrors.message) {
		return NextResponse.json(
			{ message: "Check the highlighted fields.", fieldErrors },
			{ status: 400 },
		);
	}
	return NextResponse.json({ message: demoMessage });
}
