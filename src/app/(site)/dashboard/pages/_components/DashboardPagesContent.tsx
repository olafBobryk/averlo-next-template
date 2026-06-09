"use client";

import clsx from "clsx";
import * as React from "react";
import { Icon } from "@/components/ui/icons/Icon";
import { MultiselectInput } from "@/components/ui/input/MultiselectInput";
import { TextInput } from "@/components/ui/input/TextInput";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";
import {
	type DashboardPageGroupId,
	dashboardPageGroups,
	getDashboardPageStarPresentation,
	getDashboardStarEligiblePages,
	groupDashboardPages,
	reportDashboardPageMatchesQuery,
} from "../../_components/entities/pages/presentation";
import { useDashboardSettingsContext } from "../../_components/providers/DashboardSettingsProvider";

const allGroupIds = dashboardPageGroups.map((group) => group.id);

export function DashboardPagesContent() {
	const { dashboardSidebarRouteIds, toggleDashboardSidebarRoute } =
		useDashboardSettingsContext();
	const [query, setQuery] = React.useState("");
	const [selectedGroupIds, setSelectedGroupIds] =
		React.useState<DashboardPageGroupId[]>(allGroupIds);
	const starEligiblePages = getDashboardStarEligiblePages();
	const filteredPages = starEligiblePages.filter(
		(page) =>
			selectedGroupIds.includes(page.groupId) &&
			reportDashboardPageMatchesQuery(page, query),
	);
	const groupedPages = groupDashboardPages(filteredPages);
	const trimmedQuery = query.trim();

	return (
		<div className="flex min-w-0 max-w-full flex-col gap-6">
			<div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
				<div className="flex min-w-0 flex-col gap-6">
					<MultiselectInput
						label="Groups"
						options={dashboardPageGroups.map((group) => ({
							value: group.id,
							label: group.label,
							description: group.description,
						}))}
						value={selectedGroupIds}
						onChange={(value) =>
							setSelectedGroupIds(value as DashboardPageGroupId[])
						}
						className="gap-2"
					/>
					<div className="space-y-2">
						<TextInput
							label="Search pages"
							placeholder="Name, path, or keyword..."
							value={query}
							onChange={setQuery}
						/>
						<Text variant="caption" tone="muted">
							Showing {filteredPages.length} of {starEligiblePages.length} pages
						</Text>
					</div>
				</div>
			</div>

			{groupedPages.length > 0 ? (
				<div className="flex min-w-0 flex-col gap-6 pt-0">
					{groupedPages.map((group) => (
						<section key={group.id} className="flex min-w-0 flex-col gap-3">
							<div className="flex min-w-0 flex-col gap-1">
								<Text as="p" variant="headingMd" className="break-words">
									{group.label}
								</Text>
								<Text variant="body" tone="muted" className="break-words">
									{group.description}
								</Text>
							</div>
							<div className="grid min-w-0 pt-3">
								{group.pages.map((page) => {
									const starred = dashboardSidebarRouteIds.includes(
										page.routeId,
									);
									const starPresentation = getDashboardPageStarPresentation(
										page,
										starred,
									);

									return (
										<div
											key={page.routeId}
											className="flex w-full max-w-xl min-w-0 items-start justify-between gap-3 py-3"
										>
											<Button
												variant="ghost"
												href={page.path}
												align="left"
												className="min-w-0 flex-1 whitespace-normal"
												contentClassName="w-full! min-w-0 items-start whitespace-normal"
											>
												<div className="flex h-8 w-8 shrink-0 items-center justify-center">
													<Icon name={page.icon} size="md" />
												</div>
												<div className="flex min-w-0 flex-col gap-1 text-left">
													<Text
														as="h3"
														variant="headingXs"
														className="break-words [overflow-wrap:anywhere]"
													>
														{page.label}
													</Text>
													<Text
														variant="body"
														tone="muted"
														className="break-words [overflow-wrap:anywhere]"
													>
														{page.description}
													</Text>
													<Text
														variant="caption"
														tone="muted"
														className="break-all [overflow-wrap:anywhere]"
													>
														{page.path}
													</Text>
												</div>
											</Button>
											<div className="flex shrink-0 items-center gap-3 md:justify-end">
												<Button
													type="button"
													variant="ghost"
													size="icon"
													aria-label={starPresentation.ariaLabel}
													aria-pressed={starred}
													onClick={() =>
														toggleDashboardSidebarRoute(page.routeId)
													}
													className={clsx(
														"rounded-lg opacity-50",
														starPresentation.className,
													)}
												>
													<Icon
														name="star"
														size="lg"
														weight={starPresentation.weight}
													/>
												</Button>
											</div>
										</div>
									);
								})}
							</div>
						</section>
					))}
				</div>
			) : (
				<div>
					<Text as="p" variant="body" tone="muted">
						{trimmedQuery
							? "No pages match your search."
							: "No pages match the selected groups."}
					</Text>
				</div>
			)}
		</div>
	);
}
