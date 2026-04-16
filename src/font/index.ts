import { Roboto } from "next/font/google";
// import localFont from "next/font/local";

export const roboto = Roboto({
	variable: "--font-roboto",
	subsets: ["latin"],
	weight: ["300", "400", "500", "700", "800"],
	display: "swap",
});
