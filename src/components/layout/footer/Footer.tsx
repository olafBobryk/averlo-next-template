import Link from "next/link";
import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";
import { NAV_LINKS, SOCIAL_LINKS } from "@/config/navConfig";

export default function Footer({
	className = "",
	navLinks = NAV_LINKS,
	socialLinks = SOCIAL_LINKS,
}: {
	className?: string;
	navLinks?: { name: string; link: string }[];
	socialLinks?: { icon: string; href: string; name: string }[];
}) {
	return (
		<footer
			className={
				"flex flex-col items-center padding py-[100px] border-t border-white/[0.15] " +
				className
			}
		>
			<div className="flex flex-col justify-center items-center max relative gap-[25px] ">
				<Logo size="md" />
				<div className="flex justify-center gap-y-[10px] flex-wrap items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-[45px] p-2.5">
					{navLinks.map((item) => (
						<Button href={item.link} key={item.name} variant="ghost">
							{item.name}
						</Button>
					))}
				</div>
				<div className="flex flex-wrap justify-center items-center flex-grow-0 flex-shrink-0 gap-2.5">
					{socialLinks.map((item) => (
						<Button
							key={item.name}
							variant="outline"
							className="w-[50px] h-[50px] !p-0 rounded-full"
							iconSize={15}
							leadingIcon={item.icon as any}
							href={item.href}
						/>
					))}
				</div>
			</div>
		</footer>
	);
}
