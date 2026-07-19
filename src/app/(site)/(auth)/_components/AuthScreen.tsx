import Logo from "@/components/branding/Logo";
import { Card } from "@/components/ui/primitives/Card";
import { StatusMessage } from "@/components/ui/primitives/StatusMessage";
import { Text } from "@/components/ui/primitives/Text";
import {
	AuthDomainError,
	type AuthErrorCode,
	toPublicAuthError,
} from "@/lib/auth/errors";

type AuthScreenProps = {
	children: React.ReactNode;
	description: React.ReactNode;
	message?: string;
	title: React.ReactNode;
};

const successMessages: Record<string, string> = {
	"signed-out": "The session and organization selection were cleared.",
};

function getMessage(message?: string) {
	if (!message) return null;
	if (successMessages[message]) {
		return { text: successMessages[message], tone: "success" as const };
	}
	const publicError = toPublicAuthError(
		new AuthDomainError(message as AuthErrorCode),
	);
	return { text: publicError.message, tone: "danger" as const };
}

export function AuthScreen({
	children,
	description,
	message,
	title,
}: AuthScreenProps) {
	const status = getMessage(message);
	return (
		<Card className="w-full overflow-hidden" padding="none">
			<Card.Header className="gap-5 p-6 sm:p-8">
				<Logo size="sm" className="w-fit" />
				<div className="grid gap-2">
					<Text as="h1" variant="headingLg">
						{title}
					</Text>
					<Text tone="muted" variant="body">
						{description}
					</Text>
				</div>
				{status ? (
					<StatusMessage tone={status.tone}>{status.text}</StatusMessage>
				) : null}
			</Card.Header>
			<Card.Content className="grid gap-5 border-t border-border p-6 sm:p-8">
				{children}
			</Card.Content>
		</Card>
	);
}
