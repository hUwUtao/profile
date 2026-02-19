import type { Options } from "canvas-confetti";

const chrono = new Date();
const date = chrono.getDate();
const month = chrono.getMonth() + 1;

function randomInRange(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

const parcf: Options = {
	particleCount: 1,
	startVelocity: 0,
	zIndex: -10,
};

async function confetti(o: (frame: number) => Options) {
	const { default: confetti } = await import("canvas-confetti");
	let counter = 0;
	let killswitch = true;
	(function frame() {
		counter++;
		confetti(o(counter));
		killswitch && requestAnimationFrame(frame);
	})();
	return () => {
		killswitch = false;
	};
}

function lazy(
	a: {
		cond: boolean;
		draw: (frame: number) => Options;
	}[],
) {
	return new Promise<() => void>((ok, _panic) => {
		a.forEach((e) => {
			e.cond && confetti(e.draw).then((b) => ok(b));
		});
	});
}

async function invoke() {
	return await lazy([
		{
			cond:
				(month === 11 && date > 20) ||
				month === 12 ||
				(month === 1 && date < 20),
			draw: (frame) => ({
				...parcf,
				origin: {
					x: Math.random(),
					// since particles fall down, skew start toward the top
					y: Math.random() * Math.sin(frame) - 0.2,
				},
				colors: ["#fff2"],
				shapes: ["circle"],
				gravity: randomInRange(0.4, 0.6),
				scalar: randomInRange(0.4, 1),
				drift: randomInRange(-0.5, 0.4),
			}),
		},
	]);
}

// bs raw js state engine
let fkill: (() => void) | undefined;

export default function dispatchPreferences(enable: boolean) {
	import.meta.env.DEV && console.log("Particle is ", enable);
	if (!enable && fkill) return fkill();
	enable &&
		invoke().then((k) => {
			fkill = k;
		});
}
