export const LOADING_SCREEN_SESSION_LANGUAGE_KEY =
	"averlo-loading-screen-language";

let introClaimedInDocument = false;

export function shouldPlayLoadingIntroForDocument(): boolean {
	if (introClaimedInDocument) return false;

	try {
		const language = document.documentElement.lang || "und";
		const navigation = performance.getEntriesByType("navigation")[0] as
			| PerformanceNavigationTiming
			| undefined;
		const previousLanguage = window.sessionStorage.getItem(
			LOADING_SCREEN_SESSION_LANGUAGE_KEY,
		);
		window.sessionStorage.setItem(
			LOADING_SCREEN_SESSION_LANGUAGE_KEY,
			language,
		);
		const shouldPlay =
			previousLanguage === null ||
			previousLanguage !== language ||
			navigation?.type === "reload";
		if (shouldPlay) introClaimedInDocument = true;
		return shouldPlay;
	} catch {
		introClaimedInDocument = true;
		return true;
	}
}
