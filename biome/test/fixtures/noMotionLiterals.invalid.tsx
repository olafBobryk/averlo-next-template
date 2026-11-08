// expect 11
export const spring = { type: "spring", stiffness: 320, damping: 30 };
export const timed = { duration: 0.3, delay: 0.05 };
export const reduced = (isReduced: boolean) => ({
	duration: isReduced ? 0 : 0.18,
});
export const bezier = { ease: [0.2, 0, 0, 1] };
export const Prop = () => <Motion duration={0.4} />;
export const EaseProp = () => <Motion ease={[0, 0, 1, 1]} />;
export const curve = "ease-[cubic-bezier(0.2,0,0,1)] opacity-0";
export const Timed = () => <div className="transition-opacity duration-200" />;
export const Arbitrary = () => <div className={`p-2 delay-[120ms]`} />;
