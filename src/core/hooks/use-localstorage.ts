import { type StorageProperties, createStorage } from "./lib/create-storage";

// borrowed from mantine

export function useLocalStorage<T = string>(props: StorageProperties<T>) {
	return createStorage<T>("localStorage", "use-local-storage")(props);
}
