import { address } from '@solana/addresses';
import { getUtf8Codec } from '@solana/codecs';
import { mapValueNode, programNode, rootNode, stringValueNode } from 'codama';
import { describe, expect, test } from 'vitest';

import { resolveConstantPdaSeedValue } from '../../src/resolvers/resolve-constant-pda-seed-value';
import { PDA_SEED_VALUE_SUPPORTED_NODE_KINDS } from '../../src/visitors/constant-pda-seed-value';

const PROGRAM_PUBLIC_KEY = '11111111111111111111111111111111';
const ctx = {
    programId: address(PROGRAM_PUBLIC_KEY),
    root: rootNode(programNode({ name: 'test', publicKey: PROGRAM_PUBLIC_KEY })),
};

describe('resolveConstantPdaSeedValue', () => {
    test('should dispatch to the correct visitor method (stringValueNode)', async () => {
        const result = await resolveConstantPdaSeedValue(stringValueNode('hello'), ctx);
        expect(result).toEqual(getUtf8Codec().encode('hello'));
    });

    test('should throw UNEXPECTED_NODE_KIND for unsupported value node kind', async () => {
        await expect(resolveConstantPdaSeedValue(mapValueNode([]), ctx)).rejects.toThrow(
            `Expected node of kind [${PDA_SEED_VALUE_SUPPORTED_NODE_KINDS.join(',')}], got [mapValueNode]`,
        );
    });
});
