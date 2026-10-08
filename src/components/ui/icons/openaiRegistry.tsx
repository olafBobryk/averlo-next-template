/*! @license OpenAI Apps SDK UI (MIT)
Copyright 2025 OpenAI

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
"use client";

import {
	Archive,
	ArrowLeft,
	ArrowRight,
	ArrowRotateCw,
	ArrowUp,
	ArrowUpRight,
	AtSign,
	Bell,
	BellFilled,
	BuildingWorkspace,
	Calendar,
	Camera,
	CameraFilledPhoto,
	ChatTripleDots,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Code,
	ComposeEditSquare,
	Copy,
	DotsHorizontal,
	DotsVertical,
	ExitLogout,
	ExternalLink,
	Eye,
	EyeClosed,
	Flag,
	Flash,
	Hamburger,
	History,
	Home,
	ImageSquare,
	InfoCircle,
	Link,
	Lock,
	Mail,
	MembersFilled,
	Minus,
	Nodes,
	Notebook,
	Paperclip,
	Pencil,
	Pin,
	PinFilled,
	Plus,
	QuestionMarkCircle,
	Quote,
	Search,
	SettingsCog,
	SettingsSlider,
	ShieldCheck,
	SidebarLeft,
	Sparkles,
	SparklesFilled,
	Stack,
	Star,
	StarFilled,
	Stop,
	Storage,
	Text,
	Trash,
	Undo,
	User,
	Users,
	Warning,
	X,
} from "@openai/apps-sdk-ui/components/Icon";
import type { ComponentType, SVGProps } from "react";
import {
	createIconRegistry,
	type IconRegistry,
	type IconRenderProps,
} from "./iconRegistry";
import { phosphorIconRegistry } from "./phosphorRegistry";

type SdkIcon = ComponentType<SVGProps<SVGSVGElement>>;

// SDK glyphs have fixed optical weights. Select real filled variants where
// supplied; preserve legacy fill requests through the fallback for other names.
function adapt(
	name: string,
	Outline: SdkIcon,
	Filled?: SdkIcon,
): ComponentType<IconRenderProps> {
	const Adapter = ({ weight, title, ...props }: IconRenderProps) => {
		const Glyph =
			weight === "fill"
				? (Filled ?? phosphorIconRegistry[name] ?? Outline)
				: Outline;
		return (
			<Glyph
				{...props}
				{...(weight === "fill" && !Filled ? { weight } : {})}
				aria-hidden={props["aria-hidden"] ?? true}
			/>
		);
	};
	Adapter.displayName = `OpenAIIcon(${name})`;
	return Adapter;
}

// Flash is a single closed outline. Its filled treatment deliberately fills
// that silhouette, never arbitrary paths in the rest of the SDK icon set.
function BoltIcon({ weight, className, title, ...props }: IconRenderProps) {
	return (
		<Flash
			{...props}
			className={[
				className,
				weight === "fill" ? "[&_path]:fill-current" : undefined,
			]
				.filter(Boolean)
				.join(" ")}
		/>
	);
}

const openaiOverrides: Partial<IconRegistry> = {
	bolt: BoltIcon,
	archive: adapt("archive", Archive),
	at: adapt("at", AtSign),
	code: adapt("code", Code),
	"arrow-right": adapt("arrow-right", ArrowRight),
	"arrow-left": adapt("arrow-left", ArrowLeft),
	"arrow-up": adapt("arrow-up", ArrowUp),
	"arrow-up-right": adapt("arrow-up-right", ArrowUpRight),
	"external-link": adapt("external-link", ExternalLink),
	"caret-left": adapt("caret-left", ChevronLeft),
	"caret-right": adapt("caret-right", ChevronRight),
	bell: adapt("bell", Bell, BellFilled),
	building: adapt("building", BuildingWorkspace),
	calendar: adapt("calendar", Calendar),
	cards: adapt("cards", Stack),
	chat: adapt("chat", ChatTripleDots),
	chevron: adapt("chevron", ChevronDown),
	"chevron-down": adapt("chevron-down", ChevronDown),
	check: adapt("check", Check),
	copy: adapt("copy", Copy),
	database: adapt("database", Storage),
	ellipsis: adapt("ellipsis", DotsHorizontal),
	"ellipsis-vertical": adapt("ellipsis-vertical", DotsVertical),
	mail: adapt("mail", Mail),
	eye: adapt("eye", Eye),
	"eye-closed": adapt("eye-closed", EyeClosed),
	link: adapt("link", Link),
	lock: adapt("lock", Lock),
	paperclip: adapt("paperclip", Paperclip),
	pin: adapt("pin", Pin, PinFilled),
	menu: adapt("menu", Hamburger),
	minus: adapt("minus", Minus),
	search: adapt("search", Search),
	plus: adapt("plus", Plus),
	question: adapt("question", QuestionMarkCircle),
	info: adapt("info", InfoCircle),
	quote: adapt("quote", Quote),
	redo: adapt("redo", ArrowRotateCw),
	sparkle: adapt("sparkle", Sparkles, SparklesFilled),
	sliders: adapt("sliders", SettingsSlider),
	"text-format": adapt("text-format", Text),
	undo: adapt("undo", Undo),
	close: adapt("close", X),
	cross: adapt("cross", X),
	flag: adapt("flag", Flag),
	gear: adapt("gear", SettingsCog),
	home: adapt("home", Home),
	history: adapt("history", History),
	image: adapt("image", ImageSquare),
	"list-structure": adapt("list-structure", Nodes),
	"log-out": adapt("log-out", ExitLogout),
	shield: adapt("shield", ShieldCheck),
	"sidebar-collapse": adapt("sidebar-collapse", SidebarLeft),
	compose: adapt("compose", ComposeEditSquare),
	pencil: adapt("pencil", Pencil),
	trash: adapt("trash", Trash),
	user: adapt("user", User),
	users: adapt("users", Users, MembersFilled),
	warning: adapt("warning", Warning),
	star: adapt("star", Star, StarFilled),
	stop: adapt("stop", Stop, Stop),
	camera: adapt("camera", Camera, CameraFilledPhoto),
	notes: adapt("notes", Notebook),
	"add-image": adapt("add-image", ImageSquare),
};

// Brand marks, spinner, send, and rich-text glyphs without a matching SDK symbol remain
// explicit Phosphor fallbacks. Keep this provider interchangeable per app.
export const openaiIconRegistry = createIconRegistry({
	...phosphorIconRegistry,
	...openaiOverrides,
});
