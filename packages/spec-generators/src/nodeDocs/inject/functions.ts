/**
 * Per-node `## Functions` markdown blocks injected at the `end` slot.
 * Ported verbatim from the hand-written pages under packages/nodes/docs.
 * NOTE: This will be replaced with TSDoc-extracted content in the next PR.
 */
export const functions: Record<string, string> = {
    accountBumpValueNode: `## Functions

### \`accountBumpValueNode(name)\`

Helper function that creates a \`AccountBumpValueNode\` object from the account name.

\`\`\`ts
const node = accountBumpValueNode('associatedTokenAccount');
\`\`\``,
    accountLinkNode: `## Functions

### \`accountLinkNode(name, program?)\`

Helper function that creates an \`AccountLinkNode\` object from the name of the \`AccountNode\` we are referring to. If the account is from another program, the \`program\` parameter must be provided as either a \`string\` or a \`ProgramLinkNode\`.

\`\`\`ts
const node = accountLinkNode('myAccount');
const nodeFromAnotherProgram = accountLinkNode('myAccount', 'myOtherProgram');
\`\`\``,
    accountNode: `## Functions

### \`accountNode(input)\`

Helper function that creates a \`AccountNode\` object from an input object.

\`\`\`ts
const node = accountNode({
    name: 'myCounter',
    data: structTypeNode([
        structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() }),
        structFieldTypeNode({ name: 'value', type: numberTypeNode('u64') }),
    ]),
});
\`\`\``,
    accountValueNode: `## Functions

### \`accountValueNode(name)\`

Helper function that creates a \`AccountValueNode\` object from the account name.

\`\`\`ts
const node = accountValueNode('mint');
\`\`\``,
    amountTypeNode: `## Functions

### \`amountTypeNode(number, decimals, unit?)\`

Helper function that creates a \`AmountTypeNode\` object from a \`NumberTypeNode\`, a number of decimals and an optional unit.

\`\`\`ts
const node = amountTypeNode(numberTypeNode('u64'), 2, 'USD');
const nodeWithoutUnits = amountTypeNode(numberTypeNode('u16'), 2);
\`\`\``,
    argumentValueNode: `## Functions

### \`argumentValueNode(name)\`

Helper function that creates a \`ArgumentValueNode\` object from the argument name.

\`\`\`ts
const node = argumentValueNode('amount');
\`\`\``,
    arrayTypeNode: `## Functions

### \`arrayTypeNode(item, count)\`

Helper function that creates a \`ArrayTypeNode\` object from a \`TypeNode\` and a \`CountNode\`.

\`\`\`ts
const node = arrayTypeNode(publicKeyTypeNode(), prefixedCountNode(numberTypeNode('u32')));
\`\`\``,
    arrayValueNode: `## Functions

### \`arrayValueNode(items)\`

Helper function that creates a \`ArrayValueNode\` object from an array of value nodes.

\`\`\`ts
const node = arrayValueNode([numberValueNode(1), numberValueNode(2), numberValueNode(3)]);
\`\`\``,
    booleanTypeNode: `## Functions

### \`booleanTypeNode(size?)\`

Helper function that creates a \`BooleanTypeNode\` object from a \`NumberTypeNode\` (defaulting to \`u8\` if not provided).

\`\`\`ts
const node = booleanTypeNode(numberTypeNode('u32'));
const implicitU8Node = booleanTypeNode(); // u8 by default
\`\`\``,
    booleanValueNode: `## Functions

### \`booleanValueNode(items)\`

Helper function that creates a \`BooleanValueNode\` object from a boolean.

\`\`\`ts
const node = booleanValueNode(true);
\`\`\``,
    bytesTypeNode: `## Functions

### \`bytesTypeNode()\`

Helper function that creates a \`BytesTypeNode\` object.

\`\`\`ts
const node = bytesTypeNode();
\`\`\``,
    bytesValueNode: `## Functions

### \`bytesValueNode(encoding, data)\`

Helper function that creates a \`BytesValueNode\` object from an encoding and an encoded data string.

\`\`\`ts
const node = bytesValueNode('base16', '010203');
const utf8Node = bytesValueNode('utf8', 'Hello');
\`\`\``,
    conditionalValueNode: `## Functions

### \`conditionalValueNode(input)\`

Helper function that creates a \`ConditionalValueNode\` object from an input object.

\`\`\`ts
const node = conditionalValueNode({
    condition: argumentValueNode('amount'),
    value: numberValueNode(0),
    ifTrue: accountValueNode('mint'),
    ifFalse: programIdValueNode(),
});
\`\`\``,
    constantDiscriminatorNode: `## Functions

### \`constantDiscriminatorNode(constant, offset?)\`

Helper function that creates a \`ConstantDiscriminatorNode\` object from a constant value node and an optional offset.

\`\`\`ts
const node = constantDiscriminatorNode(constantValueNodeFromString('utf8', 'Hello'), 64);
\`\`\``,
    constantNode: `## Functions

### \`constantNode(name, type, value, docs?)\`

Helper function that creates a \`ConstantNode\` object from its attributes.

\`\`\`ts
const node = constantNode('maxSize', numberTypeNode('u64'), numberValueNode(1000));
\`\`\``,
    constantPdaSeedNode: `## Functions

### \`constantPdaSeedNode(type, value)\`

Helper function that creates a \`ConstantPdaSeedNode\` object from a type node and a value node.

\`\`\`ts
const node = constantPdaSeedNode(numberTypeNode('u32'), numberValueNode(42));
\`\`\`

### \`constantPdaSeedNodeFromString(encoding, data)\`

Helper function that creates a \`ConstantPdaSeedNode\` object of type \`StringTypeNode\` from an encoding and a string of data.

\`\`\`ts
constantPdaSeedNodeFromString('utf8', 'Hello');

// Equivalent to:
constantPdaSeedNode(stringTypeNode('utf8'), stringValueNode('Hello'));
\`\`\`

### \`constantValueNodeFromBytes(encoding, data)\`

Helper function that creates a \`ConstantValueNode\` object of type \`BytesTypeNode\` from an encoding and a string of data.

\`\`\`ts
constantValueNodeFromBytes('base16', 'FF99CC');

// Equivalent to:
constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'FF99CC'));
\`\`\``,
    constantValueNode: `## Functions

### \`constantValueNode(type, value)\`

Helper function that creates a \`ConstantValueNode\` object from a type and a value node

\`\`\`ts
const node = constantValueNode(numberTypeNode('u32'), numberValueNode(42));
\`\`\`

### \`constantValueNodeFromString(encoding, data)\`

Helper function that creates a \`ConstantValueNode\` object of type \`StringTypeNode\` from an encoding and a string of data.

\`\`\`ts
constantValueNodeFromString('utf8', 'Hello');

// Equivalent to:
constantValueNode(stringTypeNode('utf8'), stringValueNode('Hello'));
\`\`\`

### \`constantValueNodeFromBytes(encoding, data)\`

Helper function that creates a \`ConstantValueNode\` object of type \`BytesTypeNode\` from an encoding and a string of data.

\`\`\`ts
constantValueNodeFromBytes('base16', 'FF99CC');

// Equivalent to:
constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'FF99CC'));
\`\`\``,
    dateTimeTypeNode: `## Functions

### \`dateTimeTypeNode(number)\`

Helper function that creates a \`DateTimeTypeNode\` object from a \`NumberTypeNode\`.

\`\`\`ts
const node = dateTimeTypeNode(numberTypeNode('u64'));
\`\`\``,
    definedTypeLinkNode: `## Functions

### \`definedTypeLinkNode(name, program?)\`

Helper function that creates a \`DefinedTypeLinkNode\` object from the name of the \`DefinedTypeNode\` we are referring to. If the defined type is from another program, the \`program\` parameter must be provided as either a \`string\` or a \`ProgramLinkNode\`.

\`\`\`ts
const node = definedTypeLinkNode('myDefinedType');
const nodeFromAnotherProgram = definedTypeLinkNode('myDefinedType', 'myOtherProgram');
\`\`\``,
    definedTypeNode: `## Functions

### \`definedTypeNode(input)\`

Helper function that creates a \`DefinedTypeNode\` object from an input object.

\`\`\`ts
const node = definedTypeNode({
    name: 'person',
    docs: ['This type describes a Person.'],
    type: structTypeNode([
        structFieldTypeNode({ name: 'name', type: stringTypeNode('utf8') }),
        structFieldTypeNode({ name: 'age', type: numberTypeNode('u8') }),
    ]),
});
\`\`\``,
    enumEmptyVariantTypeNode: `## Functions

### \`enumEmptyVariantTypeNode(name)\`

Helper function that creates a \`EnumEmptyVariantTypeNode\` object from its name.

\`\`\`ts
const node = enumEmptyVariantTypeNode('myVariantName');
\`\`\``,
    enumStructVariantTypeNode: `## Functions

### \`enumStructVariantTypeNode(name, struct, discriminator?)\`

Helper function that creates a \`EnumStructVariantTypeNode\` object from its name and data.

\`\`\`ts
const node = enumStructVariantTypeNode(
    'coordinates',
    structTypeNode([
        structFieldTypeNode({ name: 'x', type: numberTypeNode('u32') }),
        structFieldTypeNode({ name: 'y', type: numberTypeNode('u32') }),
    ]),
);
\`\`\``,
    enumTupleVariantTypeNode: `## Functions

### \`enumTupleVariantTypeNode(name, tuple, discriminator?)\`

Helper function that creates a \`EnumTupleVariantTypeNode\` object from its name and data.

\`\`\`ts
const node = enumTupleVariantTypeNode('coordinates', tupleTypeNode([numberTypeNode('u32'), numberTypeNode('u32')]));
\`\`\``,
    enumTypeNode: `## Functions

### \`enumTypeNode(variants, options?)\`

Helper function that creates a \`EnumTypeNode\` object from an array of \`EnumVariantTypeNode\` objects and an optional \`size\` attribute that can be passed in the \`options\` object as a second argument.

\`\`\`ts
const node = enumTypeNode(variants);
const nodeWithU32Discriminator = enumTypeNode(variants, { size: numberTypeNode('u32') });
\`\`\``,
    enumValueNode: `## Functions

### \`enumValueNode(enum, variant, value?)\`

Helper function that creates a \`EnumValueNode\` object from an enum type, a variant name, and an optional value node for its data. The first argument can be a \`DefinedTypeLinkNode\` or a \`string\` matching the name of the defined enum type.

\`\`\`ts
const node = enumValueNode('myEnum', 'myVariant');
const nodeWithExplicitEnum = enumValueNode(definedTypeLinkNode('myEnum'), 'myVariant');

const nodeWithData = enumValueNode(
    'myEnum',
    'myVariantWithData',
    structValueNode([
        structFieldValueNode('name', stringValueNode('Alice')),
        structFieldValueNode('age', numberValueNode(42)),
    ]),
);
\`\`\``,
    errorNode: `## Functions

### \`errorNode(input)\`

Helper function that creates a \`ErrorNode\` object from an input object.

\`\`\`ts
const node = errorNode({
    name: 'invalidAmountArgument',
    code: 1,
    message: 'The amount argument is invalid.',
});
\`\`\``,
    eventNode: `## Functions

### \`eventNode(input)\`

Helper function that creates an \`EventNode\` object from an input object.

\`\`\`ts
const node = eventNode({
    name: 'transferEvent',
    data: structTypeNode([
        structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() }),
        structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),
    ]),
});
\`\`\``,
    fieldDiscriminatorNode: `## Functions

### \`fieldDiscriminatorNode(field, offset?)\`

Helper function that creates a \`FieldDiscriminatorNode\` object from a field name and an optional offset.

\`\`\`ts
const node = fieldDiscriminatorNode('accountState', 64);
\`\`\``,
    fixedCountNode: `## Functions

### \`fixedCountNode(value)\`

Helper function that creates a \`FixedCountNode\` object from a number.

\`\`\`ts
const node = fixedCountNode(42);
\`\`\``,
    fixedSizeTypeNode: `## Functions

### \`fixedSizeTypeNode(type, size)\`

Helper function that creates a \`FixedSizeTypeNode\` object from a type node and a fixed byte length.

\`\`\`ts
const node = fixedSizeTypeNode(stringTypeNode('utf8'), 32);
\`\`\``,
    hiddenPrefixTypeNode: `## Functions

### \`hiddenPrefixTypeNode(type, prefix)\`

Helper function that creates a \`HiddenPrefixTypeNode\` object from a type node and an array of constant value nodes.

\`\`\`ts
const node = hiddenPrefixTypeNode(numberTypeNode('u32'), [
    constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ffff')),
]);
\`\`\``,
    hiddenSuffixTypeNode: `## Functions

### \`hiddenSuffixTypeNode(type, suffix)\`

Helper function that creates a \`HiddenSuffixTypeNode\` object from a type node and an array of constant value nodes.

\`\`\`ts
const node = hiddenSuffixTypeNode(numberTypeNode('u32'), [
    constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ffff')),
]);
\`\`\``,
    identityValueNode: `## Functions

### \`identityValueNode()\`

Helper function that creates a \`IdentityValueNode\` object.

\`\`\`ts
const node = identityValueNode();
\`\`\``,
    instructionAccountLinkNode: `## Functions

### \`instructionAccountLinkNode(name, instruction?)\`

Helper function that creates an \`InstructionAccountLinkNode\` object from the name of the \`InstructionAccountNode\` we are referring to. If the account is from another instruction, the \`instruction\` parameter must be provided as either a \`string\` or a \`InstructionLinkNode\`. When providing an \`InstructionLinkNode\`, we can also provide a \`ProgramLinkNode\` to point to a different program.

\`\`\`ts
// Links to an account in the current instruction.
const node = instructionAccountLinkNode('myAccount');

// Links to an account in another instruction but within the same program.
const nodeFromAnotherInstruction = instructionAccountLinkNode('myAccount', 'myOtherInstruction');

// Links to an account in another instruction from another program.
const nodeFromAnotherProgram = instructionAccountLinkNode(
    'myAccount',
    instructionLinkNode('myOtherInstruction', 'myOtherProgram'),
);
\`\`\``,
    instructionAccountNode: `## Functions

### \`instructionAccountNode(input)\`

Helper function that creates a \`InstructionAccountNode\` object from an input object.

\`\`\`ts
const node = instructionAccountNode({
    name: 'authority',
    isWritable: false,
    isSigner: true,
    docs: ['This account that has the authority to perform this instruction.'],
});
\`\`\``,
    instructionArgumentLinkNode: `## Functions

### \`instructionArgumentLinkNode(name, instruction?)\`

Helper function that creates an \`InstructionArgumentLinkNode\` object from the name of the \`InstructionArgumentNode\` we are referring to. If the argument is from another instruction, the \`instruction\` parameter must be provided as either a \`string\` or a \`InstructionLinkNode\`. When providing an \`InstructionLinkNode\`, we can also provide a \`ProgramLinkNode\` to point to a different program.

\`\`\`ts
// Links to an argument in the current instruction.
const node = instructionArgumentLinkNode('myArgument');

// Links to an argument in another instruction but within the same program.
const nodeFromAnotherInstruction = instructionArgumentLinkNode('myArgument', 'myOtherInstruction');

// Links to an argument in another instruction from another program.
const nodeFromAnotherProgram = instructionArgumentLinkNode(
    'myArgument',
    instructionLinkNode('myOtherInstruction', 'myOtherProgram'),
);
\`\`\``,
    instructionArgumentNode: `## Functions

### \`instructionArgumentNode(input)\`

Helper function that creates a \`InstructionArgumentNode\` object from an input object.

\`\`\`ts
const node = instructionArgumentNode({
    name: 'amount',
    type: numberTypeNode('u64'),
    docs: ['This amount of tokens to transfer.'],
});
\`\`\``,
    instructionByteDeltaNode: `## Functions

### \`instructionByteDeltaNode(value, options?)\`

Helper function that creates a \`InstructionByteDeltaNode\` object from a value node and some options.

\`\`\`ts
const node = instructionByteDeltaNode(numberValueNode(42), { withHeader: false });
\`\`\``,
    instructionLinkNode: `## Functions

### \`instructionLinkNode(name, program?)\`

Helper function that creates an \`InstructionLinkNode\` object from the name of the \`InstructionNode\` we are referring to. If the instruction is from another program, the \`program\` parameter must be provided as either a \`string\` or a \`ProgramLinkNode\`.

\`\`\`ts
const node = instructionLinkNode('myInstruction');
const nodeFromAnotherProgram = instructionLinkNode('myInstruction', 'myOtherProgram');
\`\`\``,
    instructionNode: `## Functions

### \`instructionNode(input)\`

Helper function that creates a \`InstructionNode\` object from an input object.

\`\`\`ts
const node = instructionNode({
    name: 'increment',
    accounts: [
        instructionAccountNode({ name: 'counter', isWritable: true, isSigner: false }),
        instructionAccountNode({ name: 'authority', isWritable: false, isSigner: true }),
    ],
    arguments: [instructionArgumentNode({ name: 'amount', type: numberTypeNode('u8') })],
});
\`\`\`

### \`getAllInstructionArguments(instruction)\`

Helper function that returns all arguments — including extra arguments — of an instruction as a \`InstructionArgumentNode[]\`.

\`\`\`ts
const allArguments = getAllInstructionArguments(instruction);
\`\`\`

### \`getAllInstructionsWithSubs()\`

Helper function that returns all instructions with their nested sub-instructions, if any. It can be called on a \`RootNode\`, \`ProgramNode\`, or \`InstructionNode\`.

\`\`\`ts
const allInstructionsFromTheRoot = getAllInstructionsWithSubs(rootNode);
const allInstructionsFromThisProgram = getAllInstructionsWithSubs(programNode);
const allInstructionsFromThisInstruction = getAllInstructionsWithSubs(instructionNode);
\`\`\``,
    instructionRemainingAccountsNode: `## Functions

### \`instructionRemainingAccountsNode(value, options?)\`

Helper function that creates a \`InstructionRemainingAccountsNode\` object from a value node and some options.

\`\`\`ts
const node = instructionRemainingAccountsNode(argumentValueNode('signers'), {
    isSigner: true,
    isOptional: true,
});
\`\`\``,
    instructionStatusNode: `## Functions

### \`instructionStatusNode(lifecycle, message?)\`

Helper function that creates an \`InstructionStatusNode\` object.

\`\`\`ts
const statusNode = instructionStatusNode('deprecated', 'Use the newInstruction instead');
\`\`\``,
    mapEntryValueNode: `## Functions

### \`mapEntryValueNode(key, value)\`

Helper function that creates a \`MapEntryValueNode\` object from two \`ValueNode\` objects. The first one represents the key of the entry, and the second one represents the value of the entry.

\`\`\`ts
const node = mapEntryValueNode(stringValueNode('total'), numberValueNode(42));
\`\`\``,
    mapTypeNode: `## Functions

### \`mapTypeNode(key, value, count)\`

Helper function that creates a \`MapTypeNode\` object from a key \`TypeNode\`, a value \`TypeNode\` and a \`CountNode\`.

\`\`\`ts
const node = mapTypeNode(publicKeyTypeNode(), numberTypeNode('u32'), prefixedCountNode(numberTypeNode('u32')));
\`\`\``,
    mapValueNode: `## Functions

### \`mapValueNode(entries)\`

Helper function that creates a \`MapValueNode\` object from an array of \`MapEntryValueNode\` objects. Each object represents a key-value pair in the map.

\`\`\`ts
const node = mapValueNode([
    mapEntryValueNode(stringValueNode('apples'), numberValueNode(12)),
    mapEntryValueNode(stringValueNode('bananas'), numberValueNode(34)),
    mapEntryValueNode(stringValueNode('carrots'), numberValueNode(56)),
]);
\`\`\``,
    noneValueNode: `## Functions

### \`noneValueNode()\`

Helper function that creates a \`NoneValueNode\` object.

\`\`\`ts
const node = noneValueNode();
\`\`\``,
    numberTypeNode: `## Functions

### \`numberTypeNode(format, endian)\`

Helper function that creates a \`NumberTypeNode\` object from a provided format and endianess.

\`\`\`ts
const littleEndianNode = numberTypeNode('u32'); // Little-endian by default.

const bigEndianNode = numberTypeNode('u32', 'be');
\`\`\`

### \`isSignedInteger(node)\`

Checks if the provided \`NumberTypeNode\` represents a signed integer.

\`\`\`ts
isSignedInteger(numberTypeNode('u32')); // false
isSignedInteger(numberTypeNode('i32')); // true
\`\`\`

### \`isUnsignedInteger(node)\`

Checks if the provided \`NumberTypeNode\` represents an unsigned integer.

\`\`\`ts
isUnsignedInteger(numberTypeNode('u32')); // true
isUnsignedInteger(numberTypeNode('i32')); // false
\`\`\`

### \`isInteger(node)\`

Checks if the provided \`NumberTypeNode\` represents an integer.

\`\`\`ts
isInteger(numberTypeNode('u32')); // true
isInteger(numberTypeNode('i32')); // true
isInteger(numberTypeNode('f32')); // false
\`\`\`

### \`isDecimal(node)\`

Checks if the provided \`NumberTypeNode\` represents a decimal number.

\`\`\`ts
isDecimal(numberTypeNode('u32')); // false
isDecimal(numberTypeNode('i32')); // false
isDecimal(numberTypeNode('f32')); // true
\`\`\``,
    numberValueNode: `## Functions

### \`numberValueNode(number)\`

Helper function that creates a \`NumberValueNode\` object from any \`number\`.

\`\`\`ts
const node = numberValueNode(42);
\`\`\``,
    optionTypeNode: `## Functions

### \`optionTypeNode(item, options?)\`

Helper function that creates a \`OptionTypeNode\` object from the item \`TypeNode\` and an optional configuration object.

\`\`\`ts
const node = optionTypeNode(publicKeyTypeNode());
const nodeWithCustomPrefix = optionTypeNode(publicKeyTypeNode(), { prefix: numberTypeNode('u16') });
const fixedNode = optionTypeNode(publicKeyTypeNode(), { fixed: true });
\`\`\``,
    payerValueNode: `## Functions

### \`payerValueNode()\`

Helper function that creates a \`PayerValueNode\` object.

\`\`\`ts
const node = payerValueNode();
\`\`\``,
    pdaLinkNode: `## Functions

### \`pdaLinkNode(name, program?)\`

Helper function that creates a \`PdaLinkNode\` object from the name of the \`PdaNode\` we are referring to. If the PDA is from another program, the \`program\` parameter must be provided as either a \`string\` or a \`ProgramLinkNode\`.

\`\`\`ts
const node = pdaLinkNode('myPda');
const nodeFromAnotherProgram = pdaLinkNode('myPda', 'myOtherProgram');
\`\`\``,
    pdaNode: `## Functions

### \`pdaNode(input)\`

Helper function that creates a \`pdaNode\` object from an input object.

\`\`\`ts
const node = pdaNode({
    name: 'counter',
    seeds: [variablePdaSeedNode('authority', publicKeyTypeNode())],
    docs: ['The counter PDA derived from its authority.'],
});
\`\`\``,
    pdaSeedValueNode: `## Functions

### \`pdaSeedValueNode(name, value)\`

Helper function that creates a \`PdaSeedValueNode\` object from the name of the variable seed and its value.

\`\`\`ts
const node = pdaSeedValueNode('mint', accountValueNode('mint'));
\`\`\``,
    pdaValueNode: `## Functions

### \`pdaValueNode(pda, seeds)\`

Helper function that creates a \`PdaValueNode\` object from a PDA definition and an array of seed values. When a \`string\` is provided as the \`pda\` definition, it is used as a \`PdaLinkNode\`.

\`\`\`ts
const node = pdaValueNode('associatedToken', [
    pdaSeedValueNode('mint', publicKeyValueNode('G345gmp34svbGxyXuCvKVVHDbqJQ66y65vVrx7m7FmBE')),
    pdaSeedValueNode('owner', publicKeyValueNode('Nzgr9bYfMRq5768bHfXsXoPTnLWAXgQNosRBxK63jRH')),
]);
\`\`\``,
    postOffsetTypeNode: `## Functions

### \`postOffsetTypeNode(type, offset, strategy?)\`

Helper function that creates a \`PostOffsetTypeNode\` object from a child \`TypeNode\`, an offset and — optionally — a strategy which defaults to \`"relative"\`.

\`\`\`ts
const relativeOffsetNode = postOffsetTypeNode(numberTypeNode('u32'), 2);
const absoluteOffsetNode = postOffsetTypeNode(numberTypeNode('u32'), -2, 'absolute');
\`\`\``,
    preOffsetTypeNode: `## Functions

### \`preOffsetTypeNode(type, offset, strategy?)\`

Helper function that creates a \`PreOffsetTypeNode\` object from a child \`TypeNode\`, an offset and — optionally — a strategy which defaults to \`"relative"\`.

\`\`\`ts
const relativeOffsetNode = preOffsetTypeNode(numberTypeNode('u32'), 2);
const absoluteOffsetNode = preOffsetTypeNode(numberTypeNode('u32'), -2, 'absolute');
\`\`\``,
    prefixedCountNode: `## Functions

### \`prefixedCountNode(prefix)\`

Helper function that creates a \`PrefixedCountNode\` object from a number node.

\`\`\`ts
const node = prefixedCountNode(numberTypeNode(u32));
\`\`\``,
    programIdValueNode: `## Functions

### \`programIdValueNode()\`

Helper function that creates a \`ProgramIdValueNode\` object.

\`\`\`ts
const node = programIdValueNode();
\`\`\``,
    programLinkNode: `## Functions

### \`programLinkNode(name)\`

Helper function that creates a \`ProgramLinkNode\` object from the name of the \`ProgramNode\` we are referring to.

\`\`\`ts
const node = programLinkNode('myProgram');
\`\`\``,
    programNode: `## Functions

### \`programNode(input)\`

Helper function that creates a \`ProgramNode\` object from an input object

\`\`\`ts
const node = programNode({
    name: 'counter',
    publicKey: '7ovtg4pFqjQdSwFAUCu8gTnh5thZHzAyJFXy3Ssnj3yK',
    version: '1.42.6',
    accounts: [],
    instructions: [],
    definedTypes: [],
    pdas: [],
    events: [],
    errors: [],
});
\`\`\`

### \`getAllPrograms(node)\`

Helper function that returns all \`ProgramNodes\` under a given node. This can be a \`RootNode\`, a \`ProgramNode\` — returning itself in an array — or an array of \`ProgramNode\`.

\`\`\`ts
const allPrograms = getAllPrograms(rootNode);
\`\`\`

### \`getAllPdas(node)\`

Helper function that returns all \`PdaNodes\` under a given node. This can be a \`RootNode\`, a \`ProgramNode\` or an array of \`ProgramNode\`.

\`\`\`ts
const allPdas = getAllPdas(rootNode);
\`\`\`

### \`getAllAccounts(node)\`

Helper function that returns all \`AccountNodes\` under a given node. This can be a \`RootNode\`, a \`ProgramNode\` or an array of \`ProgramNode\`.

\`\`\`ts
const allAccounts = getAllAccounts(rootNode);
\`\`\`

### \`getAllEvents(node)\`

Helper function that returns all \`EventNodes\` under a given node. This can be a \`RootNode\`, a \`ProgramNode\` or an array of \`ProgramNode\`.

\`\`\`ts
const allEvents = getAllEvents(rootNode);
\`\`\`

### \`getAllDefinedTypes(node)\`

Helper function that returns all \`DefinedTypeNodes\` under a given node. This can be a \`RootNode\`, a \`ProgramNode\` or an array of \`ProgramNode\`.

\`\`\`ts
const allDefinedTypes = getAllDefinedTypes(rootNode);
\`\`\`

### \`getAllInstructions(node)\`

Helper function that returns all \`InstructionNodes\` under a given node. This can be a \`RootNode\`, a \`ProgramNode\` or an array of \`ProgramNode\`.

\`\`\`ts
const allInstructions = getAllInstructions(rootNode);
\`\`\`

### \`getAllErrors(node)\`

Helper function that returns all \`ErrorNodes\` under a given node. This can be a \`RootNode\`, a \`ProgramNode\` or an array of \`ProgramNode\`.

\`\`\`ts
const allErrors = getAllErrors(rootNode);
\`\`\``,
    publicKeyTypeNode: `## Functions

### \`publicKeyTypeNode()\`

Helper function that creates a \`PublicKeyTypeNode\` object.

\`\`\`ts
const node = publicKeyTypeNode();
\`\`\``,
    publicKeyValueNode: `## Functions

### \`publicKeyValueNode(publicKey, identifier?)\`

Helper function that creates a \`PublicKeyValueNode\` object from a base58 encoded public key and an optional identifier.

\`\`\`ts
const node = publicKeyValueNode('7rA1KcBdW5hKmMasQdRVBFsD6T1nLtYuR6y59TJNgevR');
\`\`\``,
    remainderCountNode: `## Functions

### \`remainderCountNode()\`

Helper function that creates a \`RemainderCountNode\` object.

\`\`\`ts
const node = remainderCountNode();
\`\`\``,
    remainderOptionTypeNode: `## Functions

### \`remainderOptionTypeNode(item)\`

Helper function that creates a \`RemainderOptionTypeNode\` object from the item \`TypeNode\`.

\`\`\`ts
const node = remainderOptionTypeNode(publicKeyTypeNode());
\`\`\``,
    resolverValueNode: `## Functions

### \`resolverValueNode(name, options)\`

Helper function that creates a \`ResolverValueNode\` object from the resolver name and some options.

\`\`\`ts
const node = resolverValueNode('resolveCustomTokenProgram', {
    docs: [
        'If the mint account has more than 0 decimals and the ',
        'delegated amount is greater than zero, than we use our ',
        'own custom token program. Otherwise, we use Token 2022.',
    ],
    dependsOn: [accountValueNode('mint'), argumentValueNode('delegatedAmount')],
});
\`\`\``,
    rootNode: `## Functions

### \`rootNode(program, additionalPrograms?)\`

Helper function that creates a \`RootNode\` object from a \`ProgramNode\` and an optional array of additional \`ProgramNodes\`. Note that the \`standard\` is automatically set to \`"codama"\` and the \`version\` is set to the Codama version installed.

\`\`\`ts
const node = rootNode(programNode({ ... }));
\`\`\``,
    sentinelTypeNode: `## Functions

### \`sentinelTypeNode(type, sentinel)\`

Helper function that creates a \`SentinelTypeNode\` object from a type node and a constant value node.

\`\`\`ts
const sentinel = constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ff'));
const node = sentinelTypeNode(stringTypeNode('utf8'), sentinel);
\`\`\``,
    setTypeNode: `## Functions

### \`setTypeNode(item, count)\`

Helper function that creates a \`SetTypeNode\` object from a \`TypeNode\` and a \`CountNode\`.

\`\`\`ts
const node = setTypeNode(publicKeyTypeNode(), prefixedCountNode(numberTypeNode('u32')));
\`\`\``,
    setValueNode: `## Functions

### \`setValueNode(items)\`

Helper function that creates a \`SetValueNode\` object from an array of value nodes.

\`\`\`ts
const node = setValueNode([numberValueNode(1), numberValueNode(2), numberValueNode(3)]);
\`\`\``,
    sizeDiscriminatorNode: `## Functions

### \`sizeDiscriminatorNode(size)\`

Helper function that creates a \`SizeDiscriminatorNode\` object from a size.

\`\`\`ts
const node = sizeDiscriminatorNode(165);
\`\`\``,
    sizePrefixTypeNode: `## Functions

### \`sizePrefixTypeNode(type, prefix)\`

Helper function that creates a \`SizePrefixTypeNode\` object from a type node and a \`NumberTypeNode\` prefix.

\`\`\`ts
const node = sizePrefixTypeNode(stringTypeNode('utf8'), numberTypeNode('u32'));
\`\`\``,
    solAmountTypeNode: `## Functions

### \`solAmountTypeNode(number)\`

Helper function that creates a \`SolAmountTypeNode\` object from a \`NumberTypeNode\`.

\`\`\`ts
const node = solAmountTypeNode(numberTypeNode('u64'));
\`\`\``,
    someValueNode: `## Functions

### \`someValueNode(value)\`

Helper function that creates a \`SomeValueNode\` object from a value node

\`\`\`ts
const node = someValueNode(numberValueNode(42));
\`\`\``,
    stringTypeNode: `## Functions

### \`stringTypeNode(encoding)\`

Helper function that creates a \`StringTypeNode\` object from an encoding.

\`\`\`ts
const node = stringTypeNode('utf8');
\`\`\``,
    stringValueNode: `## Functions

### \`stringValueNode(string)\`

Helper function that creates a \`StringValueNode\` object from a string value.

\`\`\`ts
const node = stringValueNode('Hello');
\`\`\``,
    structFieldTypeNode: `## Functions

### \`structFieldTypeNode(input)\`

Helper function that creates a \`StructFieldTypeNode\` object from an input object.

\`\`\`ts
const authorityField = structFieldTypeNode({
    name: 'authority',
    type: publicKeyTypeNode(),
});

const ageFieldWithDefaultValue = structFieldTypeNode({
    name: 'age',
    type: numberTypeNode('u8'),
    defaultValue: numberValueNode(42),
});
\`\`\``,
    structFieldValueNode: `## Functions

### \`structFieldValueNode(name, value)\`

Helper function that creates a \`StructFieldValueNode\` object from a field name and a value node.

\`\`\`ts
const node = structFieldValueNode('age', numberValueNode(42));
\`\`\``,
    structTypeNode: `## Functions

### \`structTypeNode(fields)\`

Helper function that creates a \`StructTypeNode\` object from an array of \`StructFieldTypeNode\` objects.

\`\`\`ts
const node = structTypeNode([
    structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() }),
    structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),
]);
\`\`\``,
    structValueNode: `## Functions

### \`structValueNode(fields)\`

Helper function that creates a \`StructValueNode\` object from an array of field value nodes.

\`\`\`ts
const node = structValueNode([
    structFieldValueNode('name', stringValueNode('Alice')),
    structFieldValueNode('age', numberValueNode(42)),
]);
\`\`\``,
    tupleTypeNode: `## Functions

### \`tupleTypeNode(items)\`

Helper function that creates a \`TupleTypeNode\` object from an array of \`TypeNodes\`.

\`\`\`ts
const node = tupleTypeNode([publicKeyTypeNode(), numberTypeNode('u64')]);
\`\`\``,
    tupleValueNode: `## Functions

### \`tupleValueNode(items)\`

Helper function that creates a \`TupleValueNode\` object from an array of value nodes.

\`\`\`ts
const node = tupleValueNode([stringValueNode('Alice'), numberValueNode(42)]);
\`\`\``,
    variablePdaSeedNode: `## Functions

### \`variablePdaSeedNode(name, type, docs?)\`

Helper function that creates a \`VariablePdaSeedNode\` object from a name, a type node and optional documentation.

\`\`\`ts
const node = variablePdaSeedNode('amount', numberTypeNode('u32'));
\`\`\``,
    zeroableOptionTypeNode: `## Functions

### \`zeroableOptionTypeNode(item, zeroValue?)\`

Helper function that creates a \`ZeroableOptionTypeNode\` object from a \`TypeNode\` and an optional zero value.

\`\`\`ts
const node = zeroableOptionTypeNode(publicKeyTypeNode());

const nodeWithZeroValue = zeroableOptionTypeNode(
    numbetypeNode('u32'),
    constantValueNode(bytesTypeNode(), bytesValueNode('base16', 'ffffffff')),
);
\`\`\``,
};
