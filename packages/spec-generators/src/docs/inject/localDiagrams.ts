/**
 * Per-node diagram markdown injected at the `afterDescription` slot.
 * These are currently external image URLs ported from the hand-written docs.
 * TODO: consider using Mermaid diagrams later.
 */
export const localDiagrams: Record<string, string> = {
    accountNode: '![Diagram](https://github.com/codama-idl/codama/assets/3642397/77974dad-212e-49b1-8e41-5d466c273a02)',
    // TODO: Port the remaining `![Diagram](…)` lines from packages/nodes/docs/** (see: grep -rn "!\[Diagram\]").
};
