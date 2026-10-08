/** Browser-rendered sRGB evidence, including alpha compositing against the owner fill. */
export function measureRenderedContrast(
	element: HTMLElement,
	surface: HTMLElement,
) {
	const canvas = document.createElement("canvas");
	canvas.width = 3;
	canvas.height = 1;
	const context = canvas.getContext("2d", { willReadFrequently: true });
	if (!context) throw new Error("Contrast evidence requires a canvas context.");
	const owner = getComputedStyle(surface).backgroundColor;
	const style = getComputedStyle(element);
	context.fillStyle = owner;
	context.fillRect(0, 0, 3, 1);
	context.fillStyle = style.backgroundColor;
	context.fillRect(0, 0, 2, 1);
	context.fillStyle = style.color;
	context.fillRect(0, 0, 1, 1);
	const pixels = context.getImageData(0, 0, 3, 1).data;
	const luminance = (offset: number) =>
		[0.2126, 0.7152, 0.0722].reduce((sum, weight, index) => {
			const value = pixels[offset + index] / 255;
			return (
				sum +
				weight *
					(value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
			);
		}, 0);
	const ratio = (first: number, second: number) =>
		(Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
	return {
		text: ratio(luminance(0), luminance(4)),
		boundary: ratio(luminance(4), luminance(8)),
	};
}
