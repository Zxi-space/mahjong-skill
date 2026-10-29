export function normalizeRoomCode(input: string): string { return input.trim().toUpperCase().replace(/\s+/g, '') }
export function isRoomCodeValid(code: string): boolean { return /^[A-Z0-9]{6}$/.test(code) }
