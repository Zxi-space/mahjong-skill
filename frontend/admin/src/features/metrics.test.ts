import { describe, expect, it } from 'vitest'
import { formatCount } from './metrics'
describe('stats display', () => { it('does not fake missing values', () => expect(formatCount(undefined)).toBe('—')); it('formats numbers', () => expect(formatCount(1000)).toContain('1,000')) })
