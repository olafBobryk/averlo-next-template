"use client";

import { OrganizationSelectionCard } from "@/app/(site)/_components/organization/OrganizationSelectionCard";
import { DashboardDetailField } from "@/app/(site)/dashboard/_components/detail/DashboardDetailField";
import { Icon } from "@/components/ui/icons/Icon";
import { EmailInput } from "@/components/ui/input/EmailInput";
import { PasswordInput } from "@/components/ui/input/PasswordInput";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
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
		<div aria-busy="true" aria-label={label} role="status">
			<AuthScreen description={description} icon={icon} title={title}>
				{children}
			</AuthScreen>
		</div>
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
						<Button.Skeleton
							className="text-muted-foreground"
							size="none"
							textVariant="caption"
							variant="ghost"
						>
							Forgot password?
						</Button.Skeleton>
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
			<Button.Skeleton className="w-full" variant="ghost">
				Use magic link
			</Button.Skeleton>
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
			<Button.Skeleton className="w-full" variant="ghost">
				Use password
			</Button.Skeleton>
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
			<Button.Skeleton className="w-full" variant="ghost">
				Return to sign in
			</Button.Skeleton>
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
				<Button.Skeleton className="w-full" variant="ghost">
					Return to sign in
				</Button.Skeleton>
			</div>
		</AuthLoadingFrame>
	);
}

export function SelectOrganizationLoadingView() {
	return (
		<div
			aria-busy="true"
			aria-label="Loading organization selection"
			role="status"
		>
			<OrganizationSelectionCard.Skeleton
				description="Choose an organization to continue."
				headingIcon="building"
			/>
		</div>
	);
}
