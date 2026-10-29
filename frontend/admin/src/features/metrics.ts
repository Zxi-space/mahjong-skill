export function formatCount(value: number | null | undefined): string { return value == null ? '—' : value.toLocaleString('zh-CN') }
