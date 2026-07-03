import { redirect } from "next/navigation";

export default function RevealRootPlaygroundRedirect() {
	redirect("/internal/playground/motion");
}
