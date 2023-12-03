/**
 * The moment when you "can do this in plain js" and I said NO
 * yea mantine hooks is cool you should try out (and it is prebuilt for ssr)
 */

import { useEffect } from "react";
import popper from "../assets/popper.svg";
import dispatchPreferences from "../core/decors";
import { useLocalStorage } from "../core/hooks/use-localstorage";
import mixin from "../core/mixin";
import style from "../styles/button.module.sass";

export default function Toggler() {
	const [e, setE] = useLocalStorage({
		key: "confetti_disabled",
		defaultValue: "yes",
	});
	useEffect(() => {
		dispatchPreferences(e === "yes");
	}, [e]);
	return (
		<>
			<button
				className={mixin(style.btn)}
				data-disabled={e === "nope"}
				onClick={() => setE(e === "nope" ? "yes" : "nope")}
			>
				<img {...popper} alt="disable particles" />
			</button>
		</>
	);
}
