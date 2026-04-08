import { describe, expectTypeOf, test } from 'vitest';

import { ResolutionPath } from '../../../../src/instruction-encoding/resolvers/shared';

describe('ResolutionContext', () => {
    test('ResolutionPath should be a readonly array of strings', () => {
        expectTypeOf<ResolutionPath>().toEqualTypeOf<readonly string[]>();
    });
});
