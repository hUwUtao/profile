/**
 * But wait, we have class:list
 * > dirty asf, ima dim
 */

type GenericScalarString = string | number | boolean | undefined | null;

function eson(str: string) {
	return str !== "" ? str : undefined;
}

export default function mixin(
	...stl: (GenericScalarString | GenericScalarString[])[]
) {
	return eson(
		(
			stl
				.flat()
				.filter(
					(i: GenericScalarString) =>
						![undefined, 0, null, false, ""].includes(i),
				) as string[]
		)
			.flatMap((i) =>
				i
					.toString()
					.split(" ")
					.filter((i) => i !== ""),
			)
			.join(" "),
	);
}
