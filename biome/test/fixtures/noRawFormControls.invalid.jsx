// expect 4
export const Text = () => <input type="text" />;
export const Untyped = () => <input name="query" />;
export const Area = () => <textarea rows={2}></textarea>;
export const Check = () => (
	<label>
		<input type="checkbox" />
	</label>
);
