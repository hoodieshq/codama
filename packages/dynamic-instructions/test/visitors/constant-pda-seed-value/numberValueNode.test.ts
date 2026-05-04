import { numberValueNode } from 'codama';
import { describe, expect, test } from 'vitest';

import { makeConstantVisitor } from './constant-pda-seed-value-test-utils';

describe('constant-pda-seed-value: visitNumberValue', () => {
    test('should encode valid u8 (0)', async () => {
        const result = await makeConstantVisitor().visitNumberValue(numberValueNode(0));
        expect(result).toEqual(new Uint8Array([0]));
    });

    test('should encode valid u8 (255)', async () => {
        const result = await makeConstantVisitor().visitNumberValue(numberValueNode(255));
        expect(result).toEqual(new Uint8Array([255]));
    });

    test('should throw for value out of u8 range', async () => {
        await expect(makeConstantVisitor().visitNumberValue(numberValueNode(256))).rejects.toThrow(/out of range/);
    });
});
