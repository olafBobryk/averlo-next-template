import { redirect } from "next/navigation";

export default function DashboardMembersRedirectPage() {
	redirect("/dashboard/administration#members");
}
