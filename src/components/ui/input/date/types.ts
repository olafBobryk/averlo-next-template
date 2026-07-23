export type ISODateString = string;

export type DateRangeValue = {
	end: ISODateString;
	start: ISODateString;
};

export type DateRangePresetKey =
	| "last_7_days"
	| "last_30_days"
	| "this_month"
	| "last_month";

export type DateRangeChangeReason =
	| DateRangePresetKey
	| "clear"
	| "custom"
	| "today";

export type DateSelectionValue = ISODateString | DateRangeValue | null;
