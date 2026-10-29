import { describe, expect, it } from 'vitest'
import { isRoomCodeValid, normalizeRoomCode } from './room-code'
describe('room code', () => { it('normalizes', () => expect(normalizeRoomCode(' ab 12cd ')).toBe('AB12CD')); it('validates', () => { expect(isRoomCodeValid('AB12CD')).toBe(true); expect(isRoomCodeValid('AB-C')).toBe(false) }) })
