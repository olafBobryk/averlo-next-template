"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OrganizationSelectionCard } from "@/app/(site)/_components/organization/OrganizationSelectionCard";
import { DashboardDetailField } from "@/app/(site)/dashboard/_components/detail/DashboardDetailField";
import { Icon } from "@/components/ui/icons/Icon";
import { EmailInput, PasswordInput } from "@/components/ui/input";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import {
	getSafeContinuationPath,
	withSafeContinuation,
} from "@/lib/auth/continuation";
import { hrefFor } from "@/lib/routes";
import { AuthScreen } from "./AuthScreen";
import { PasswordRecoveryRequestForm } from "./PasswordRecoveryRequestForm";
import { PasswordResetForm } from "./PasswordResetForm";

function AuthLoadingFrame({
	children,
	description,
	icon,
	label,
	title,
}: {
	children: React.ReactNode;
	description: React.ReactNode;
	icon: React.ComponentProps<typeof AuthScreen>["icon"];
	label: string;
	title: React.ReactNode;
}) {
	return (
		<>
			<span className="sr-only" role="status">
				{label}
			</span>
			<div aria-busy="true" data-loading-region={label}>
				<AuthScreen description={description} icon={icon} title={title}>
					{children}
				</AuthScreen>
			</div>
		</>
	);
}

type AuthLoadingLinkProps = Pick<
	React.ComponentProps<typeof Button>,
	"className" | "size" | "variant" | "textVariant"
> & {
	children: React.ReactNode;
	route: "auth.login" | "auth.forgot-password" | "auth.sign-in-options";
};

function AuthLoadingLink(props: AuthLoadingLinkProps) {
	const { route, children, ...presentation } = props;
	return (
		<Suspense
			fallback={
				<Button {...presentation} href={hrefFor(route)}>
					{children}
				</Button>
			}
		>
			<AuthLoadingContinuationLink {...props} />
		</Suspense>
	);
}

function AuthLoadingContinuationLink({
	children,
	route,
	...props
}: AuthLoadingLinkProps) {
	const searchParams = useSearchParams();
	const next = getSafeContinuationPath(searchParams.get("next") ?? undefined);
	return (
		<Button {...props} href={withSafeContinuation(hrefFor(route), next)}>
			{children}
		</Button>
	);
}

export function LoginLoadingView() {
	return (
		<AuthLoadingFrame
			description="Sign in to continue to your dashboard."
			icon="lock"
			label="Loading sign in"
			title="Sign in"
		>
			<div className="grid gap-4">
				<EmailInput.Skeleton
					label="Email"
					required
					value="operator@averlo.local"
				/>
				<PasswordInput.Skeleton
					label="Password"
					labelAction={
						<AuthLoadingLink
							className="text-muted-foreground"
							size="none"
							textVariant="caption"
							variant="bare"
							route="auth.forgot-password"
						>
							Forgot password?
						</AuthLoadingLink>
					}
					required
					value="demo-password"
				/>
				<Button.Skeleton className="w-full" variant="primary">
					Sign in
				</Button.Skeleton>
			</div>
			<Divider>or</Divider>
			<Button.Skeleton className="w-full" variant="secondary">
				Enter demo organization
			</Button.Skeleton>
			<AuthLoadingLink
				className="w-full"
				route="auth.sign-in-options"
				size="none"
				variant="bare"
			>
				Use magic link
			</AuthLoadingLink>
		</AuthLoadingFrame>
	);
}

export function SignInOptionsLoadingView() {
	return (
		<AuthLoadingFrame
			description="Enter your email address to receive a sign-in link."
			icon="link"
			label="Loading magic link sign in"
			title="Magic link"
		>
			<div className="grid gap-4">
				<EmailInput.Skeleton label="Email" required />
				<Button.Skeleton className="w-full" variant="primary">
					Request magic link
				</Button.Skeleton>
			</div>
			<AuthLoadingLink
				className="w-full"
				route="auth.login"
				size="none"
				variant="bare"
			>
				Use password
			</AuthLoadingLink>
		</AuthLoadingFrame>
	);
}

export function ForgotPasswordLoadingView() {
	return (
		<AuthLoadingFrame
			description="Enter your email to receive a password reset link."
			icon="mail"
			label="Loading password recovery"
			title="Reset your password"
		>
			<PasswordRecoveryRequestForm.Skeleton />
			<AuthLoadingLink className="w-full" route="auth.login" variant="ghost">
				Return to sign in
			</AuthLoadingLink>
		</AuthLoadingFrame>
	);
}

export function ResetPasswordLoadingView() {
	return (
		<AuthLoadingFrame
			description="Choose a new password for your account."
			icon="lock"
			label="Loading password reset"
			title="Choose a new password"
		>
			<PasswordResetForm.Skeleton />
		</AuthLoadingFrame>
	);
}

export function SetPasswordLoadingView() {
	return (
		<AuthLoadingFrame
			description="Choose a password to finish setting up your account."
			icon="lock"
			label="Loading password setup"
			title="Finish account setup"
		>
			<div className="grid gap-4">
				<PasswordInput.Skeleton
					label="New password"
					required
					showStrength
					value="a-secure-password"
				/>
				<PasswordInput.Skeleton
					label="Confirm new password"
					required
					value="a-secure-password"
				/>
				<Button.Skeleton className="w-full" variant="primary">
					Set password
				</Button.Skeleton>
			</div>
		</AuthLoadingFrame>
	);
}

export function InvitationLoadingView() {
	return (
		<AuthLoadingFrame
			description="Review this invitation before joining the organization."
			icon="mail"
			label="Loading invitation"
			title="Review invitation"
		>
			<dl className="grid gap-4 sm:grid-cols-2">
				<DashboardDetailField.Skeleton
					icon={<Icon name="building" size="sm" />}
					label="Organization"
					value="Averlo Studio"
				/>
				<DashboardDetailField.Skeleton
					icon={<Icon name="mail" size="sm" />}
					label="Recipient"
					value="member@example.com"
				/>
				<DashboardDetailField.Skeleton
					icon={<Icon name="shield" size="sm" />}
					label="Access"
					value="Member"
				/>
			</dl>
			<div className="grid gap-3">
				<Button.Skeleton className="w-full" variant="primary">
					Accept invitation
				</Button.Skeleton>
				<AuthLoadingLink className="w-full" route="auth.login" variant="ghost">
					Return to sign in
				</AuthLoadingLink>
			</div>
		</AuthLoadingFrame>
	);
}

export function SelectOrganizationLoadingView() {
	return (
		<>
			<span className="sr-only" role="status">
				Loading organization selection
			</span>
			<div
				aria-busy="true"
				data-loading-region="Loading organization selection"
			>
				<OrganizationSelectionCard.Skeleton
					description="Choose an organization to continue."
					headingIcon="building"
				/>
			</div>
		</>
	);
}
