import { writable } from "svelte/store";

export const socket = writable(null);
export const username = writable("");
export const currentGame = writable("");
