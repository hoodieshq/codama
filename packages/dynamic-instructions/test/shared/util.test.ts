import { describe, expect, expectTypeOf, test } from 'vitest';

import { formatValueType, safeStringify } from '../../src/shared/util';

describe('formatValueType', () => {
    test('should return "null" for null', () => {
        expect(formatValueType(null)).toBe('null');
    });

    test('should return array description with length', () => {
        expect(formatValueType([1, 2, 3])).toBe('array (length 3)');
        expect(formatValueType([])).toBe('array (length 0)');
    });

    test('should return Uint8Array description with length', () => {
        expect(formatValueType(new Uint8Array([1, 2]))).toBe('Uint8Array (length 2)');
        expect(formatValueType(new Uint8Array())).toBe('Uint8Array (length 0)');
    });

    test('should return "object" for plain objects', () => {
        expect(formatValueType({ key: 'value' })).toBe('object');
    });

    test('should return "object" for class instances', () => {
        expect(formatValueType(new Date())).toBe('object');
    });

    test('should return typeof for primitives', () => {
        expect(formatValueType('hello')).toBe('string');
        expect(formatValueType(42)).toBe('number');
        expect(formatValueType(true)).toBe('boolean');
        expect(formatValueType(undefined)).toBe('undefined');
        expect(formatValueType(42n)).toBe('bigint');
    });
});

describe('safeStringify', () => {
    test('should stringify plain objects', () => {
        expect(safeStringify({ a: 1 })).toBe('{"a":1}');
    });

    test('should stringify arrays', () => {
        expect(safeStringify([1, 2, 3])).toBe('[1,2,3]');
    });

    test('should stringify primitives', () => {
        expect(safeStringify('hello')).toBe('"hello"');
        expect(safeStringify(42)).toBe('42');
        expect(safeStringify(null)).toBe('null');
        expect(safeStringify(true)).toBe('true');
    });

    test('should convert BigInt to string', () => {
        expect(safeStringify(42n)).toBe('"42"');
        expect(safeStringify({ amount: 1000n })).toBe('{"amount":"1000"}');
    });

    test('should return non-serializable object for circular references', () => {
        const circular: Record<string, unknown> = {};
        circular.self = circular;
        expect(safeStringify(circular)).toBe('non-serializable object');
    });

    test('should always return a string', () => {
        expectTypeOf(safeStringify).returns.toBeString();
    });
});
