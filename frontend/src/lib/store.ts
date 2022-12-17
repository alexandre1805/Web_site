import { writable, type Writable } from 'svelte/store'

export const socket: Writable<any> = writable(null)
export const username: Writable<string> = writable('')
export const currentGame: Writable<string> = writable('')
