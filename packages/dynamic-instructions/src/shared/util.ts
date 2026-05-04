import { NodeKind } from 'codama';

// Duplicated these small internal utilities from @codama/dynamic-address-resolution.
// Avoid exposing them to the public API as they are meant for internal usage only.

export function getMaybeNodeKind(node: unknown): NodeKind | null {
    return (node as { kind: NodeKind }).kind ?? null;
}

export function formatValueType(value: unknown): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return `array (length ${value.length})`;
    if (value instanceof Uint8Array) return `Uint8Array (length ${value.length})`;
    if (typeof value === 'object') return 'object';
    return typeof value;
}

export function safeStringify(value: unknown): string {
    try {
        return JSON.stringify(value, (_key, v: unknown) => (typeof v === 'bigint' ? String(v) : v));
    } catch {
        return `non-serializable ${formatValueType(value)}`;
    }
}
