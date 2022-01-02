import { n as noop$1, a as safe_not_equal, g as getContext, o as onDestroy, s as setContext } from "./index-6fe57fc4.js";
const MAX_ARRAY_LENGTH = 10;
const MAX_RECURSIVE_DEPTH = 2;
function inspect(value) {
  return formatValue(value, []);
}
function formatValue(value, seenValues) {
  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "function":
      return value.name ? `[function ${value.name}]` : "[function]";
    case "object":
      return formatObjectValue(value, seenValues);
    default:
      return String(value);
  }
}
function formatObjectValue(value, previouslySeenValues) {
  if (value === null) {
    return "null";
  }
  if (previouslySeenValues.includes(value)) {
    return "[Circular]";
  }
  const seenValues = [...previouslySeenValues, value];
  if (isJSONable(value)) {
    const jsonValue = value.toJSON();
    if (jsonValue !== value) {
      return typeof jsonValue === "string" ? jsonValue : formatValue(jsonValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray(value, seenValues);
  }
  return formatObject(value, seenValues);
}
function isJSONable(value) {
  return typeof value.toJSON === "function";
}
function formatObject(object, seenValues) {
  const entries = Object.entries(object);
  if (entries.length === 0) {
    return "{}";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[" + getObjectTag(object) + "]";
  }
  const properties = entries.map(([key, value]) => key + ": " + formatValue(value, seenValues));
  return "{ " + properties.join(", ") + " }";
}
function formatArray(array, seenValues) {
  if (array.length === 0) {
    return "[]";
  }
  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return "[Array]";
  }
  const len = Math.min(MAX_ARRAY_LENGTH, array.length);
  const remaining = array.length - len;
  const items = [];
  for (let i2 = 0; i2 < len; ++i2) {
    items.push(formatValue(array[i2], seenValues));
  }
  if (remaining === 1) {
    items.push("... 1 more item");
  } else if (remaining > 1) {
    items.push(`... ${remaining} more items`);
  }
  return "[" + items.join(", ") + "]";
}
function getObjectTag(object) {
  const tag = Object.prototype.toString.call(object).replace(/^\[object /, "").replace(/]$/, "");
  if (tag === "Object" && typeof object.constructor === "function") {
    const name = object.constructor.name;
    if (typeof name === "string" && name !== "") {
      return name;
    }
  }
  return tag;
}
function devAssert(condition, message) {
  const booleanCondition = Boolean(condition);
  if (!booleanCondition) {
    throw new Error(message);
  }
}
class Location {
  constructor(startToken, endToken, source) {
    this.start = startToken.start;
    this.end = endToken.end;
    this.startToken = startToken;
    this.endToken = endToken;
    this.source = source;
  }
  get [Symbol.toStringTag]() {
    return "Location";
  }
  toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  }
}
class Token {
  constructor(kind, start, end, line, column, value) {
    this.kind = kind;
    this.start = start;
    this.end = end;
    this.line = line;
    this.column = column;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
  get [Symbol.toStringTag]() {
    return "Token";
  }
  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  }
}
const QueryDocumentKeys = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: [
    "name",
    "variableDefinitions",
    "directives",
    "selectionSet"
  ],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name",
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet"
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: ["name", "value"],
  Directive: ["name", "arguments"],
  NamedType: ["name"],
  ListType: ["type"],
  NonNullType: ["type"],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: ["type"],
  ScalarTypeDefinition: ["description", "name", "directives"],
  ObjectTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: [
    "description",
    "name",
    "type",
    "defaultValue",
    "directives"
  ],
  InterfaceTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
};
const kindValues = new Set(Object.keys(QueryDocumentKeys));
function isNode(maybeNode) {
  const maybeKind = maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
  return typeof maybeKind === "string" && kindValues.has(maybeKind);
}
let OperationTypeNode;
(function(OperationTypeNode2) {
  OperationTypeNode2["QUERY"] = "query";
  OperationTypeNode2["MUTATION"] = "mutation";
  OperationTypeNode2["SUBSCRIPTION"] = "subscription";
})(OperationTypeNode || (OperationTypeNode = {}));
let Kind;
(function(Kind2) {
  Kind2["NAME"] = "Name";
  Kind2["DOCUMENT"] = "Document";
  Kind2["OPERATION_DEFINITION"] = "OperationDefinition";
  Kind2["VARIABLE_DEFINITION"] = "VariableDefinition";
  Kind2["SELECTION_SET"] = "SelectionSet";
  Kind2["FIELD"] = "Field";
  Kind2["ARGUMENT"] = "Argument";
  Kind2["FRAGMENT_SPREAD"] = "FragmentSpread";
  Kind2["INLINE_FRAGMENT"] = "InlineFragment";
  Kind2["FRAGMENT_DEFINITION"] = "FragmentDefinition";
  Kind2["VARIABLE"] = "Variable";
  Kind2["INT"] = "IntValue";
  Kind2["FLOAT"] = "FloatValue";
  Kind2["STRING"] = "StringValue";
  Kind2["BOOLEAN"] = "BooleanValue";
  Kind2["NULL"] = "NullValue";
  Kind2["ENUM"] = "EnumValue";
  Kind2["LIST"] = "ListValue";
  Kind2["OBJECT"] = "ObjectValue";
  Kind2["OBJECT_FIELD"] = "ObjectField";
  Kind2["DIRECTIVE"] = "Directive";
  Kind2["NAMED_TYPE"] = "NamedType";
  Kind2["LIST_TYPE"] = "ListType";
  Kind2["NON_NULL_TYPE"] = "NonNullType";
  Kind2["SCHEMA_DEFINITION"] = "SchemaDefinition";
  Kind2["OPERATION_TYPE_DEFINITION"] = "OperationTypeDefinition";
  Kind2["SCALAR_TYPE_DEFINITION"] = "ScalarTypeDefinition";
  Kind2["OBJECT_TYPE_DEFINITION"] = "ObjectTypeDefinition";
  Kind2["FIELD_DEFINITION"] = "FieldDefinition";
  Kind2["INPUT_VALUE_DEFINITION"] = "InputValueDefinition";
  Kind2["INTERFACE_TYPE_DEFINITION"] = "InterfaceTypeDefinition";
  Kind2["UNION_TYPE_DEFINITION"] = "UnionTypeDefinition";
  Kind2["ENUM_TYPE_DEFINITION"] = "EnumTypeDefinition";
  Kind2["ENUM_VALUE_DEFINITION"] = "EnumValueDefinition";
  Kind2["INPUT_OBJECT_TYPE_DEFINITION"] = "InputObjectTypeDefinition";
  Kind2["DIRECTIVE_DEFINITION"] = "DirectiveDefinition";
  Kind2["SCHEMA_EXTENSION"] = "SchemaExtension";
  Kind2["SCALAR_TYPE_EXTENSION"] = "ScalarTypeExtension";
  Kind2["OBJECT_TYPE_EXTENSION"] = "ObjectTypeExtension";
  Kind2["INTERFACE_TYPE_EXTENSION"] = "InterfaceTypeExtension";
  Kind2["UNION_TYPE_EXTENSION"] = "UnionTypeExtension";
  Kind2["ENUM_TYPE_EXTENSION"] = "EnumTypeExtension";
  Kind2["INPUT_OBJECT_TYPE_EXTENSION"] = "InputObjectTypeExtension";
})(Kind || (Kind = {}));
const BREAK = Object.freeze({});
function visit(root, visitor, visitorKeys = QueryDocumentKeys) {
  const enterLeaveMap = new Map();
  for (const kind of Object.values(Kind)) {
    enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
  }
  let stack = void 0;
  let inArray = Array.isArray(root);
  let keys = [root];
  let index = -1;
  let edits = [];
  let node = void 0;
  let key = void 0;
  let parent = void 0;
  const path = [];
  const ancestors = [];
  let newRoot = root;
  do {
    index++;
    const isLeaving = index === keys.length;
    const isEdited = isLeaving && edits.length !== 0;
    if (isLeaving) {
      key = ancestors.length === 0 ? void 0 : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();
      if (isEdited) {
        if (inArray) {
          node = node.slice();
          let editOffset = 0;
          for (const [editKey, editValue] of edits) {
            const arrayKey = editKey - editOffset;
            if (editValue === null) {
              node.splice(arrayKey, 1);
              editOffset++;
            } else {
              node[arrayKey] = editValue;
            }
          }
        } else {
          node = Object.defineProperties({}, Object.getOwnPropertyDescriptors(node));
          for (const [editKey, editValue] of edits) {
            node[editKey] = editValue;
          }
        }
      }
      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else {
      key = parent ? inArray ? index : keys[index] : void 0;
      node = parent ? parent[key] : newRoot;
      if (node === null || node === void 0) {
        continue;
      }
      if (parent) {
        path.push(key);
      }
    }
    let result;
    if (!Array.isArray(node)) {
      var _enterLeaveMap$get, _enterLeaveMap$get2;
      isNode(node) || devAssert(false, `Invalid AST Node: ${inspect(node)}.`);
      const visitFn = isLeaving ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get === void 0 ? void 0 : _enterLeaveMap$get.leave : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null || _enterLeaveMap$get2 === void 0 ? void 0 : _enterLeaveMap$get2.enter;
      result = visitFn === null || visitFn === void 0 ? void 0 : visitFn.call(visitor, node, key, parent, path, ancestors);
      if (result === BREAK) {
        break;
      }
      if (result === false) {
        if (!isLeaving) {
          path.pop();
          continue;
        }
      } else if (result !== void 0) {
        edits.push([key, result]);
        if (!isLeaving) {
          if (isNode(result)) {
            node = result;
          } else {
            path.pop();
            continue;
          }
        }
      }
    }
    if (result === void 0 && isEdited) {
      edits.push([key, node]);
    }
    if (isLeaving) {
      path.pop();
    } else {
      var _node$kind;
      stack = {
        inArray,
        index,
        keys,
        edits,
        prev: stack
      };
      inArray = Array.isArray(node);
      keys = inArray ? node : (_node$kind = visitorKeys[node.kind]) !== null && _node$kind !== void 0 ? _node$kind : [];
      index = -1;
      edits = [];
      if (parent) {
        ancestors.push(parent);
      }
      parent = node;
    }
  } while (stack !== void 0);
  if (edits.length !== 0) {
    newRoot = edits[edits.length - 1][1];
  }
  return newRoot;
}
function getEnterLeaveForKind(visitor, kind) {
  const kindVisitor = visitor[kind];
  if (typeof kindVisitor === "object") {
    return kindVisitor;
  } else if (typeof kindVisitor === "function") {
    return {
      enter: kindVisitor,
      leave: void 0
    };
  }
  return {
    enter: visitor.enter,
    leave: visitor.leave
  };
}
function isWhiteSpace(code) {
  return code === 9 || code === 32;
}
function isDigit(code) {
  return code >= 48 && code <= 57;
}
function isLetter(code) {
  return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function isNameStart(code) {
  return isLetter(code) || code === 95;
}
function isNameContinue(code) {
  return isLetter(code) || isDigit(code) || code === 95;
}
function dedentBlockStringLines(lines) {
  var _firstNonEmptyLine2;
  let commonIndent = Number.MAX_SAFE_INTEGER;
  let firstNonEmptyLine = null;
  let lastNonEmptyLine = -1;
  for (let i2 = 0; i2 < lines.length; ++i2) {
    var _firstNonEmptyLine;
    const line = lines[i2];
    const indent2 = leadingWhitespace(line);
    if (indent2 === line.length) {
      continue;
    }
    firstNonEmptyLine = (_firstNonEmptyLine = firstNonEmptyLine) !== null && _firstNonEmptyLine !== void 0 ? _firstNonEmptyLine : i2;
    lastNonEmptyLine = i2;
    if (i2 !== 0 && indent2 < commonIndent) {
      commonIndent = indent2;
    }
  }
  return lines.map((line, i2) => i2 === 0 ? line : line.slice(commonIndent)).slice((_firstNonEmptyLine2 = firstNonEmptyLine) !== null && _firstNonEmptyLine2 !== void 0 ? _firstNonEmptyLine2 : 0, lastNonEmptyLine + 1);
}
function leadingWhitespace(str) {
  let i2 = 0;
  while (i2 < str.length && isWhiteSpace(str.charCodeAt(i2))) {
    ++i2;
  }
  return i2;
}
function printBlockString(value, options) {
  const escapedValue = value.replace(/"""/g, '\\"""');
  const lines = escapedValue.split(/\r\n|[\n\r]/g);
  const isSingleLine = lines.length === 1;
  const forceLeadingNewLine = lines.length > 1 && lines.slice(1).every((line) => line.length === 0 || isWhiteSpace(line.charCodeAt(0)));
  const hasTrailingTripleQuotes = escapedValue.endsWith('\\"""');
  const hasTrailingQuote = value.endsWith('"') && !hasTrailingTripleQuotes;
  const hasTrailingSlash = value.endsWith("\\");
  const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
  const printAsMultipleLines = !(options !== null && options !== void 0 && options.minimize) && (!isSingleLine || value.length > 70 || forceTrailingNewline || forceLeadingNewLine || hasTrailingTripleQuotes);
  let result = "";
  const skipLeadingNewLine = isSingleLine && isWhiteSpace(value.charCodeAt(0));
  if (printAsMultipleLines && !skipLeadingNewLine || forceLeadingNewLine) {
    result += "\n";
  }
  result += escapedValue;
  if (printAsMultipleLines || forceTrailingNewline) {
    result += "\n";
  }
  return '"""' + result + '"""';
}
function printString(str) {
  return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
}
const escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function escapedReplacer(str) {
  return escapeSequences[str.charCodeAt(0)];
}
const escapeSequences = [
  "\\u0000",
  "\\u0001",
  "\\u0002",
  "\\u0003",
  "\\u0004",
  "\\u0005",
  "\\u0006",
  "\\u0007",
  "\\b",
  "\\t",
  "\\n",
  "\\u000B",
  "\\f",
  "\\r",
  "\\u000E",
  "\\u000F",
  "\\u0010",
  "\\u0011",
  "\\u0012",
  "\\u0013",
  "\\u0014",
  "\\u0015",
  "\\u0016",
  "\\u0017",
  "\\u0018",
  "\\u0019",
  "\\u001A",
  "\\u001B",
  "\\u001C",
  "\\u001D",
  "\\u001E",
  "\\u001F",
  "",
  "",
  '\\"',
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\\\",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\u007F",
  "\\u0080",
  "\\u0081",
  "\\u0082",
  "\\u0083",
  "\\u0084",
  "\\u0085",
  "\\u0086",
  "\\u0087",
  "\\u0088",
  "\\u0089",
  "\\u008A",
  "\\u008B",
  "\\u008C",
  "\\u008D",
  "\\u008E",
  "\\u008F",
  "\\u0090",
  "\\u0091",
  "\\u0092",
  "\\u0093",
  "\\u0094",
  "\\u0095",
  "\\u0096",
  "\\u0097",
  "\\u0098",
  "\\u0099",
  "\\u009A",
  "\\u009B",
  "\\u009C",
  "\\u009D",
  "\\u009E",
  "\\u009F"
];
function print(ast) {
  return visit(ast, printDocASTReducer);
}
const MAX_LINE_LENGTH = 80;
const printDocASTReducer = {
  Name: {
    leave: (node) => node.value
  },
  Variable: {
    leave: (node) => "$" + node.name
  },
  Document: {
    leave: (node) => join(node.definitions, "\n\n")
  },
  OperationDefinition: {
    leave(node) {
      const varDefs = wrap("(", join(node.variableDefinitions, ", "), ")");
      const prefix = join([
        node.operation,
        join([node.name, varDefs]),
        join(node.directives, " ")
      ], " ");
      return (prefix === "query" ? "" : prefix + " ") + node.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable, type, defaultValue, directives }) => variable + ": " + type + wrap(" = ", defaultValue) + wrap(" ", join(directives, " "))
  },
  SelectionSet: {
    leave: ({ selections }) => block(selections)
  },
  Field: {
    leave({ alias, name, arguments: args, directives, selectionSet }) {
      const prefix = wrap("", alias, ": ") + name;
      let argsLine = prefix + wrap("(", join(args, ", "), ")");
      if (argsLine.length > MAX_LINE_LENGTH) {
        argsLine = prefix + wrap("(\n", indent(join(args, "\n")), "\n)");
      }
      return join([argsLine, join(directives, " "), selectionSet], " ");
    }
  },
  Argument: {
    leave: ({ name, value }) => name + ": " + value
  },
  FragmentSpread: {
    leave: ({ name, directives }) => "..." + name + wrap(" ", join(directives, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition, directives, selectionSet }) => join([
      "...",
      wrap("on ", typeCondition),
      join(directives, " "),
      selectionSet
    ], " ")
  },
  FragmentDefinition: {
    leave: ({ name, typeCondition, variableDefinitions, directives, selectionSet }) => `fragment ${name}${wrap("(", join(variableDefinitions, ", "), ")")} on ${typeCondition} ${wrap("", join(directives, " "), " ")}` + selectionSet
  },
  IntValue: {
    leave: ({ value }) => value
  },
  FloatValue: {
    leave: ({ value }) => value
  },
  StringValue: {
    leave: ({ value, block: isBlockString }) => isBlockString ? printBlockString(value) : printString(value)
  },
  BooleanValue: {
    leave: ({ value }) => value ? "true" : "false"
  },
  NullValue: {
    leave: () => "null"
  },
  EnumValue: {
    leave: ({ value }) => value
  },
  ListValue: {
    leave: ({ values }) => "[" + join(values, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields }) => "{" + join(fields, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name, value }) => name + ": " + value
  },
  Directive: {
    leave: ({ name, arguments: args }) => "@" + name + wrap("(", join(args, ", "), ")")
  },
  NamedType: {
    leave: ({ name }) => name
  },
  ListType: {
    leave: ({ type }) => "[" + type + "]"
  },
  NonNullType: {
    leave: ({ type }) => type + "!"
  },
  SchemaDefinition: {
    leave: ({ description, directives, operationTypes }) => wrap("", description, "\n") + join(["schema", join(directives, " "), block(operationTypes)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation, type }) => operation + ": " + type
  },
  ScalarTypeDefinition: {
    leave: ({ description, name, directives }) => wrap("", description, "\n") + join(["scalar", name, join(directives, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join([
      "type",
      name,
      wrap("implements ", join(interfaces, " & ")),
      join(directives, " "),
      block(fields)
    ], " ")
  },
  FieldDefinition: {
    leave: ({ description, name, arguments: args, type, directives }) => wrap("", description, "\n") + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + ": " + type + wrap(" ", join(directives, " "))
  },
  InputValueDefinition: {
    leave: ({ description, name, type, defaultValue, directives }) => wrap("", description, "\n") + join([name + ": " + type, wrap("= ", defaultValue), join(directives, " ")], " ")
  },
  InterfaceTypeDefinition: {
    leave: ({ description, name, interfaces, directives, fields }) => wrap("", description, "\n") + join([
      "interface",
      name,
      wrap("implements ", join(interfaces, " & ")),
      join(directives, " "),
      block(fields)
    ], " ")
  },
  UnionTypeDefinition: {
    leave: ({ description, name, directives, types }) => wrap("", description, "\n") + join(["union", name, join(directives, " "), wrap("= ", join(types, " | "))], " ")
  },
  EnumTypeDefinition: {
    leave: ({ description, name, directives, values }) => wrap("", description, "\n") + join(["enum", name, join(directives, " "), block(values)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description, name, directives }) => wrap("", description, "\n") + join([name, join(directives, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description, name, directives, fields }) => wrap("", description, "\n") + join(["input", name, join(directives, " "), block(fields)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description, name, arguments: args, repeatable, locations }) => wrap("", description, "\n") + "directive @" + name + (hasMultilineItems(args) ? wrap("(\n", indent(join(args, "\n")), "\n)") : wrap("(", join(args, ", "), ")")) + (repeatable ? " repeatable" : "") + " on " + join(locations, " | ")
  },
  SchemaExtension: {
    leave: ({ directives, operationTypes }) => join(["extend schema", join(directives, " "), block(operationTypes)], " ")
  },
  ScalarTypeExtension: {
    leave: ({ name, directives }) => join(["extend scalar", name, join(directives, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) => join([
      "extend type",
      name,
      wrap("implements ", join(interfaces, " & ")),
      join(directives, " "),
      block(fields)
    ], " ")
  },
  InterfaceTypeExtension: {
    leave: ({ name, interfaces, directives, fields }) => join([
      "extend interface",
      name,
      wrap("implements ", join(interfaces, " & ")),
      join(directives, " "),
      block(fields)
    ], " ")
  },
  UnionTypeExtension: {
    leave: ({ name, directives, types }) => join([
      "extend union",
      name,
      join(directives, " "),
      wrap("= ", join(types, " | "))
    ], " ")
  },
  EnumTypeExtension: {
    leave: ({ name, directives, values }) => join(["extend enum", name, join(directives, " "), block(values)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name, directives, fields }) => join(["extend input", name, join(directives, " "), block(fields)], " ")
  }
};
function join(maybeArray, separator = "") {
  var _maybeArray$filter$jo;
  return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter((x2) => x2).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : "";
}
function block(array) {
  return wrap("{\n", indent(join(array, "\n")), "\n}");
}
function wrap(start, maybeString, end = "") {
  return maybeString != null && maybeString !== "" ? start + maybeString + end : "";
}
function indent(str) {
  return wrap("  ", str.replace(/\n/g, "\n  "));
}
function hasMultilineItems(maybeArray) {
  var _maybeArray$some;
  return (_maybeArray$some = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.some((str) => str.includes("\n"))) !== null && _maybeArray$some !== void 0 ? _maybeArray$some : false;
}
function isObjectLike(value) {
  return typeof value == "object" && value !== null;
}
function invariant(condition, message) {
  const booleanCondition = Boolean(condition);
  if (!booleanCondition) {
    throw new Error(message != null ? message : "Unexpected invariant triggered.");
  }
}
const LineRegExp = /\r\n|[\n\r]/g;
function getLocation(source, position) {
  let lastLineStart = 0;
  let line = 1;
  for (const match of source.body.matchAll(LineRegExp)) {
    typeof match.index === "number" || invariant(false);
    if (match.index >= position) {
      break;
    }
    lastLineStart = match.index + match[0].length;
    line += 1;
  }
  return {
    line,
    column: position + 1 - lastLineStart
  };
}
function printLocation(location) {
  return printSourceLocation(location.source, getLocation(location.source, location.start));
}
function printSourceLocation(source, sourceLocation) {
  const firstLineColumnOffset = source.locationOffset.column - 1;
  const body = "".padStart(firstLineColumnOffset) + source.body;
  const lineIndex = sourceLocation.line - 1;
  const lineOffset = source.locationOffset.line - 1;
  const lineNum = sourceLocation.line + lineOffset;
  const columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
  const columnNum = sourceLocation.column + columnOffset;
  const locationStr = `${source.name}:${lineNum}:${columnNum}
`;
  const lines = body.split(/\r\n|[\n\r]/g);
  const locationLine = lines[lineIndex];
  if (locationLine.length > 120) {
    const subLineIndex = Math.floor(columnNum / 80);
    const subLineColumnNum = columnNum % 80;
    const subLines = [];
    for (let i2 = 0; i2 < locationLine.length; i2 += 80) {
      subLines.push(locationLine.slice(i2, i2 + 80));
    }
    return locationStr + printPrefixedLines([
      [`${lineNum} |`, subLines[0]],
      ...subLines.slice(1, subLineIndex + 1).map((subLine) => ["|", subLine]),
      ["|", "^".padStart(subLineColumnNum)],
      ["|", subLines[subLineIndex + 1]]
    ]);
  }
  return locationStr + printPrefixedLines([
    [`${lineNum - 1} |`, lines[lineIndex - 1]],
    [`${lineNum} |`, locationLine],
    ["|", "^".padStart(columnNum)],
    [`${lineNum + 1} |`, lines[lineIndex + 1]]
  ]);
}
function printPrefixedLines(lines) {
  const existingLines = lines.filter(([_, line]) => line !== void 0);
  const padLen = Math.max(...existingLines.map(([prefix]) => prefix.length));
  return existingLines.map(([prefix, line]) => prefix.padStart(padLen) + (line ? " " + line : "")).join("\n");
}
class GraphQLError extends Error {
  constructor(message, nodes, source, positions, path, originalError, extensions) {
    var _this$nodes, _nodeLocations$, _ref;
    super(message);
    this.name = "GraphQLError";
    this.path = path !== null && path !== void 0 ? path : void 0;
    this.originalError = originalError !== null && originalError !== void 0 ? originalError : void 0;
    this.nodes = undefinedIfEmpty(Array.isArray(nodes) ? nodes : nodes ? [nodes] : void 0);
    const nodeLocations = undefinedIfEmpty((_this$nodes = this.nodes) === null || _this$nodes === void 0 ? void 0 : _this$nodes.map((node) => node.loc).filter((loc) => loc != null));
    this.source = source !== null && source !== void 0 ? source : nodeLocations === null || nodeLocations === void 0 ? void 0 : (_nodeLocations$ = nodeLocations[0]) === null || _nodeLocations$ === void 0 ? void 0 : _nodeLocations$.source;
    this.positions = positions !== null && positions !== void 0 ? positions : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => loc.start);
    this.locations = positions && source ? positions.map((pos) => getLocation(source, pos)) : nodeLocations === null || nodeLocations === void 0 ? void 0 : nodeLocations.map((loc) => getLocation(loc.source, loc.start));
    const originalExtensions = isObjectLike(originalError === null || originalError === void 0 ? void 0 : originalError.extensions) ? originalError === null || originalError === void 0 ? void 0 : originalError.extensions : void 0;
    this.extensions = (_ref = extensions !== null && extensions !== void 0 ? extensions : originalExtensions) !== null && _ref !== void 0 ? _ref : Object.create(null);
    Object.defineProperties(this, {
      message: {
        writable: true,
        enumerable: true
      },
      name: {
        enumerable: false
      },
      nodes: {
        enumerable: false
      },
      source: {
        enumerable: false
      },
      positions: {
        enumerable: false
      },
      originalError: {
        enumerable: false
      }
    });
    if (originalError !== null && originalError !== void 0 && originalError.stack) {
      Object.defineProperty(this, "stack", {
        value: originalError.stack,
        writable: true,
        configurable: true
      });
    } else if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GraphQLError);
    } else {
      Object.defineProperty(this, "stack", {
        value: Error().stack,
        writable: true,
        configurable: true
      });
    }
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
  toString() {
    let output = this.message;
    if (this.nodes) {
      for (const node of this.nodes) {
        if (node.loc) {
          output += "\n\n" + printLocation(node.loc);
        }
      }
    } else if (this.source && this.locations) {
      for (const location of this.locations) {
        output += "\n\n" + printSourceLocation(this.source, location);
      }
    }
    return output;
  }
  toJSON() {
    const formattedError = {
      message: this.message
    };
    if (this.locations != null) {
      formattedError.locations = this.locations;
    }
    if (this.path != null) {
      formattedError.path = this.path;
    }
    if (this.extensions != null && Object.keys(this.extensions).length > 0) {
      formattedError.extensions = this.extensions;
    }
    return formattedError;
  }
}
function undefinedIfEmpty(array) {
  return array === void 0 || array.length === 0 ? void 0 : array;
}
function syntaxError(source, position, description) {
  return new GraphQLError(`Syntax Error: ${description}`, void 0, source, [
    position
  ]);
}
let TokenKind;
(function(TokenKind2) {
  TokenKind2["SOF"] = "<SOF>";
  TokenKind2["EOF"] = "<EOF>";
  TokenKind2["BANG"] = "!";
  TokenKind2["DOLLAR"] = "$";
  TokenKind2["AMP"] = "&";
  TokenKind2["PAREN_L"] = "(";
  TokenKind2["PAREN_R"] = ")";
  TokenKind2["SPREAD"] = "...";
  TokenKind2["COLON"] = ":";
  TokenKind2["EQUALS"] = "=";
  TokenKind2["AT"] = "@";
  TokenKind2["BRACKET_L"] = "[";
  TokenKind2["BRACKET_R"] = "]";
  TokenKind2["BRACE_L"] = "{";
  TokenKind2["PIPE"] = "|";
  TokenKind2["BRACE_R"] = "}";
  TokenKind2["NAME"] = "Name";
  TokenKind2["INT"] = "Int";
  TokenKind2["FLOAT"] = "Float";
  TokenKind2["STRING"] = "String";
  TokenKind2["BLOCK_STRING"] = "BlockString";
  TokenKind2["COMMENT"] = "Comment";
})(TokenKind || (TokenKind = {}));
const instanceOf = function instanceOf2(value, constructor) {
  return value instanceof constructor;
};
class Source {
  constructor(body, name = "GraphQL request", locationOffset = {
    line: 1,
    column: 1
  }) {
    typeof body === "string" || devAssert(false, `Body must be a string. Received: ${inspect(body)}.`);
    this.body = body;
    this.name = name;
    this.locationOffset = locationOffset;
    this.locationOffset.line > 0 || devAssert(false, "line in locationOffset is 1-indexed and must be positive.");
    this.locationOffset.column > 0 || devAssert(false, "column in locationOffset is 1-indexed and must be positive.");
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
}
function isSource(source) {
  return instanceOf(source, Source);
}
let DirectiveLocation;
(function(DirectiveLocation2) {
  DirectiveLocation2["QUERY"] = "QUERY";
  DirectiveLocation2["MUTATION"] = "MUTATION";
  DirectiveLocation2["SUBSCRIPTION"] = "SUBSCRIPTION";
  DirectiveLocation2["FIELD"] = "FIELD";
  DirectiveLocation2["FRAGMENT_DEFINITION"] = "FRAGMENT_DEFINITION";
  DirectiveLocation2["FRAGMENT_SPREAD"] = "FRAGMENT_SPREAD";
  DirectiveLocation2["INLINE_FRAGMENT"] = "INLINE_FRAGMENT";
  DirectiveLocation2["VARIABLE_DEFINITION"] = "VARIABLE_DEFINITION";
  DirectiveLocation2["SCHEMA"] = "SCHEMA";
  DirectiveLocation2["SCALAR"] = "SCALAR";
  DirectiveLocation2["OBJECT"] = "OBJECT";
  DirectiveLocation2["FIELD_DEFINITION"] = "FIELD_DEFINITION";
  DirectiveLocation2["ARGUMENT_DEFINITION"] = "ARGUMENT_DEFINITION";
  DirectiveLocation2["INTERFACE"] = "INTERFACE";
  DirectiveLocation2["UNION"] = "UNION";
  DirectiveLocation2["ENUM"] = "ENUM";
  DirectiveLocation2["ENUM_VALUE"] = "ENUM_VALUE";
  DirectiveLocation2["INPUT_OBJECT"] = "INPUT_OBJECT";
  DirectiveLocation2["INPUT_FIELD_DEFINITION"] = "INPUT_FIELD_DEFINITION";
})(DirectiveLocation || (DirectiveLocation = {}));
class Lexer {
  constructor(source) {
    const startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0);
    this.source = source;
    this.lastToken = startOfFileToken;
    this.token = startOfFileToken;
    this.line = 1;
    this.lineStart = 0;
  }
  get [Symbol.toStringTag]() {
    return "Lexer";
  }
  advance() {
    this.lastToken = this.token;
    const token = this.token = this.lookahead();
    return token;
  }
  lookahead() {
    let token = this.token;
    if (token.kind !== TokenKind.EOF) {
      do {
        if (token.next) {
          token = token.next;
        } else {
          const nextToken = readNextToken(this, token.end);
          token.next = nextToken;
          nextToken.prev = token;
          token = nextToken;
        }
      } while (token.kind === TokenKind.COMMENT);
    }
    return token;
  }
}
function isPunctuatorTokenKind(kind) {
  return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
}
function isUnicodeScalarValue(code) {
  return code >= 0 && code <= 55295 || code >= 57344 && code <= 1114111;
}
function isSupplementaryCodePoint(body, location) {
  return isLeadingSurrogate(body.charCodeAt(location)) && isTrailingSurrogate(body.charCodeAt(location + 1));
}
function isLeadingSurrogate(code) {
  return code >= 55296 && code <= 56319;
}
function isTrailingSurrogate(code) {
  return code >= 56320 && code <= 57343;
}
function printCodePointAt(lexer, location) {
  const code = lexer.source.body.codePointAt(location);
  if (code === void 0) {
    return TokenKind.EOF;
  } else if (code >= 32 && code <= 126) {
    const char = String.fromCodePoint(code);
    return char === '"' ? `'"'` : `"${char}"`;
  }
  return "U+" + code.toString(16).toUpperCase().padStart(4, "0");
}
function createToken(lexer, kind, start, end, value) {
  const line = lexer.line;
  const col = 1 + start - lexer.lineStart;
  return new Token(kind, start, end, line, col, value);
}
function readNextToken(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    switch (code) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++position;
        continue;
      case 10:
        ++position;
        ++lexer.line;
        lexer.lineStart = position;
        continue;
      case 13:
        if (body.charCodeAt(position + 1) === 10) {
          position += 2;
        } else {
          ++position;
        }
        ++lexer.line;
        lexer.lineStart = position;
        continue;
      case 35:
        return readComment(lexer, position);
      case 33:
        return createToken(lexer, TokenKind.BANG, position, position + 1);
      case 36:
        return createToken(lexer, TokenKind.DOLLAR, position, position + 1);
      case 38:
        return createToken(lexer, TokenKind.AMP, position, position + 1);
      case 40:
        return createToken(lexer, TokenKind.PAREN_L, position, position + 1);
      case 41:
        return createToken(lexer, TokenKind.PAREN_R, position, position + 1);
      case 46:
        if (body.charCodeAt(position + 1) === 46 && body.charCodeAt(position + 2) === 46) {
          return createToken(lexer, TokenKind.SPREAD, position, position + 3);
        }
        break;
      case 58:
        return createToken(lexer, TokenKind.COLON, position, position + 1);
      case 61:
        return createToken(lexer, TokenKind.EQUALS, position, position + 1);
      case 64:
        return createToken(lexer, TokenKind.AT, position, position + 1);
      case 91:
        return createToken(lexer, TokenKind.BRACKET_L, position, position + 1);
      case 93:
        return createToken(lexer, TokenKind.BRACKET_R, position, position + 1);
      case 123:
        return createToken(lexer, TokenKind.BRACE_L, position, position + 1);
      case 124:
        return createToken(lexer, TokenKind.PIPE, position, position + 1);
      case 125:
        return createToken(lexer, TokenKind.BRACE_R, position, position + 1);
      case 34:
        if (body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
          return readBlockString(lexer, position);
        }
        return readString(lexer, position);
    }
    if (isDigit(code) || code === 45) {
      return readNumber(lexer, position, code);
    }
    if (isNameStart(code)) {
      return readName(lexer, position);
    }
    throw syntaxError(lexer.source, position, code === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : isUnicodeScalarValue(code) || isSupplementaryCodePoint(body, position) ? `Unexpected character: ${printCodePointAt(lexer, position)}.` : `Invalid character: ${printCodePointAt(lexer, position)}.`);
  }
  return createToken(lexer, TokenKind.EOF, bodyLength, bodyLength);
}
function readComment(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 10 || code === 13) {
      break;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      break;
    }
  }
  return createToken(lexer, TokenKind.COMMENT, start, position, body.slice(start + 1, position));
}
function readNumber(lexer, start, firstCode) {
  const body = lexer.source.body;
  let position = start;
  let code = firstCode;
  let isFloat = false;
  if (code === 45) {
    code = body.charCodeAt(++position);
  }
  if (code === 48) {
    code = body.charCodeAt(++position);
    if (isDigit(code)) {
      throw syntaxError(lexer.source, position, `Invalid number, unexpected digit after 0: ${printCodePointAt(lexer, position)}.`);
    }
  } else {
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46) {
    isFloat = true;
    code = body.charCodeAt(++position);
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 69 || code === 101) {
    isFloat = true;
    code = body.charCodeAt(++position);
    if (code === 43 || code === 45) {
      code = body.charCodeAt(++position);
    }
    position = readDigits(lexer, position, code);
    code = body.charCodeAt(position);
  }
  if (code === 46 || isNameStart(code)) {
    throw syntaxError(lexer.source, position, `Invalid number, expected digit but got: ${printCodePointAt(lexer, position)}.`);
  }
  return createToken(lexer, isFloat ? TokenKind.FLOAT : TokenKind.INT, start, position, body.slice(start, position));
}
function readDigits(lexer, start, firstCode) {
  if (!isDigit(firstCode)) {
    throw syntaxError(lexer.source, start, `Invalid number, expected digit but got: ${printCodePointAt(lexer, start)}.`);
  }
  const body = lexer.source.body;
  let position = start + 1;
  while (isDigit(body.charCodeAt(position))) {
    ++position;
  }
  return position;
}
function readString(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  let chunkStart = position;
  let value = "";
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 34) {
      value += body.slice(chunkStart, position);
      return createToken(lexer, TokenKind.STRING, start, position + 1, value);
    }
    if (code === 92) {
      value += body.slice(chunkStart, position);
      const escape = body.charCodeAt(position + 1) === 117 ? body.charCodeAt(position + 2) === 123 ? readEscapedUnicodeVariableWidth(lexer, position) : readEscapedUnicodeFixedWidth(lexer, position) : readEscapedCharacter(lexer, position);
      value += escape.value;
      position += escape.size;
      chunkStart = position;
      continue;
    }
    if (code === 10 || code === 13) {
      break;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      throw syntaxError(lexer.source, position, `Invalid character within String: ${printCodePointAt(lexer, position)}.`);
    }
  }
  throw syntaxError(lexer.source, position, "Unterminated string.");
}
function readEscapedUnicodeVariableWidth(lexer, position) {
  const body = lexer.source.body;
  let point = 0;
  let size = 3;
  while (size < 12) {
    const code = body.charCodeAt(position + size++);
    if (code === 125) {
      if (size < 5 || !isUnicodeScalarValue(point)) {
        break;
      }
      return {
        value: String.fromCodePoint(point),
        size
      };
    }
    point = point << 4 | readHexDigit(code);
    if (point < 0) {
      break;
    }
  }
  throw syntaxError(lexer.source, position, `Invalid Unicode escape sequence: "${body.slice(position, position + size)}".`);
}
function readEscapedUnicodeFixedWidth(lexer, position) {
  const body = lexer.source.body;
  const code = read16BitHexCode(body, position + 2);
  if (isUnicodeScalarValue(code)) {
    return {
      value: String.fromCodePoint(code),
      size: 6
    };
  }
  if (isLeadingSurrogate(code)) {
    if (body.charCodeAt(position + 6) === 92 && body.charCodeAt(position + 7) === 117) {
      const trailingCode = read16BitHexCode(body, position + 8);
      if (isTrailingSurrogate(trailingCode)) {
        return {
          value: String.fromCodePoint(code, trailingCode),
          size: 12
        };
      }
    }
  }
  throw syntaxError(lexer.source, position, `Invalid Unicode escape sequence: "${body.slice(position, position + 6)}".`);
}
function read16BitHexCode(body, position) {
  return readHexDigit(body.charCodeAt(position)) << 12 | readHexDigit(body.charCodeAt(position + 1)) << 8 | readHexDigit(body.charCodeAt(position + 2)) << 4 | readHexDigit(body.charCodeAt(position + 3));
}
function readHexDigit(code) {
  return code >= 48 && code <= 57 ? code - 48 : code >= 65 && code <= 70 ? code - 55 : code >= 97 && code <= 102 ? code - 87 : -1;
}
function readEscapedCharacter(lexer, position) {
  const body = lexer.source.body;
  const code = body.charCodeAt(position + 1);
  switch (code) {
    case 34:
      return {
        value: '"',
        size: 2
      };
    case 92:
      return {
        value: "\\",
        size: 2
      };
    case 47:
      return {
        value: "/",
        size: 2
      };
    case 98:
      return {
        value: "\b",
        size: 2
      };
    case 102:
      return {
        value: "\f",
        size: 2
      };
    case 110:
      return {
        value: "\n",
        size: 2
      };
    case 114:
      return {
        value: "\r",
        size: 2
      };
    case 116:
      return {
        value: "	",
        size: 2
      };
  }
  throw syntaxError(lexer.source, position, `Invalid character escape sequence: "${body.slice(position, position + 2)}".`);
}
function readBlockString(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let lineStart = lexer.lineStart;
  let position = start + 3;
  let chunkStart = position;
  let currentLine = "";
  const blockLines = [];
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
      currentLine += body.slice(chunkStart, position);
      blockLines.push(currentLine);
      const token = createToken(lexer, TokenKind.BLOCK_STRING, start, position + 3, dedentBlockStringLines(blockLines).join("\n"));
      lexer.line += blockLines.length - 1;
      lexer.lineStart = lineStart;
      return token;
    }
    if (code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
      currentLine += body.slice(chunkStart, position);
      chunkStart = position + 1;
      position += 4;
      continue;
    }
    if (code === 10 || code === 13) {
      currentLine += body.slice(chunkStart, position);
      blockLines.push(currentLine);
      if (code === 13 && body.charCodeAt(position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }
      currentLine = "";
      chunkStart = position;
      lineStart = position;
      continue;
    }
    if (isUnicodeScalarValue(code)) {
      ++position;
    } else if (isSupplementaryCodePoint(body, position)) {
      position += 2;
    } else {
      throw syntaxError(lexer.source, position, `Invalid character within String: ${printCodePointAt(lexer, position)}.`);
    }
  }
  throw syntaxError(lexer.source, position, "Unterminated string.");
}
function readName(lexer, start) {
  const body = lexer.source.body;
  const bodyLength = body.length;
  let position = start + 1;
  while (position < bodyLength) {
    const code = body.charCodeAt(position);
    if (isNameContinue(code)) {
      ++position;
    } else {
      break;
    }
  }
  return createToken(lexer, TokenKind.NAME, start, position, body.slice(start, position));
}
function parse(source, options) {
  const parser = new Parser(source, options);
  return parser.parseDocument();
}
class Parser {
  constructor(source, options) {
    const sourceObj = isSource(source) ? source : new Source(source);
    this._lexer = new Lexer(sourceObj);
    this._options = options;
  }
  parseName() {
    const token = this.expectToken(TokenKind.NAME);
    return this.node(token, {
      kind: Kind.NAME,
      value: token.value
    });
  }
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: Kind.DOCUMENT,
      definitions: this.many(TokenKind.SOF, this.parseDefinition, TokenKind.EOF)
    });
  }
  parseDefinition() {
    if (this.peek(TokenKind.BRACE_L)) {
      return this.parseOperationDefinition();
    }
    const hasDescription = this.peekDescription();
    const keywordToken = hasDescription ? this._lexer.lookahead() : this._lexer.token;
    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case "schema":
          return this.parseSchemaDefinition();
        case "scalar":
          return this.parseScalarTypeDefinition();
        case "type":
          return this.parseObjectTypeDefinition();
        case "interface":
          return this.parseInterfaceTypeDefinition();
        case "union":
          return this.parseUnionTypeDefinition();
        case "enum":
          return this.parseEnumTypeDefinition();
        case "input":
          return this.parseInputObjectTypeDefinition();
        case "directive":
          return this.parseDirectiveDefinition();
      }
      if (hasDescription) {
        throw syntaxError(this._lexer.source, this._lexer.token.start, "Unexpected description, descriptions are supported only on type definitions.");
      }
      switch (keywordToken.value) {
        case "query":
        case "mutation":
        case "subscription":
          return this.parseOperationDefinition();
        case "fragment":
          return this.parseFragmentDefinition();
        case "extend":
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(keywordToken);
  }
  parseOperationDefinition() {
    const start = this._lexer.token;
    if (this.peek(TokenKind.BRACE_L)) {
      return this.node(start, {
        kind: Kind.OPERATION_DEFINITION,
        operation: OperationTypeNode.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    }
    const operation = this.parseOperationType();
    let name;
    if (this.peek(TokenKind.NAME)) {
      name = this.parseName();
    }
    return this.node(start, {
      kind: Kind.OPERATION_DEFINITION,
      operation,
      name,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseOperationType() {
    const operationToken = this.expectToken(TokenKind.NAME);
    switch (operationToken.value) {
      case "query":
        return OperationTypeNode.QUERY;
      case "mutation":
        return OperationTypeNode.MUTATION;
      case "subscription":
        return OperationTypeNode.SUBSCRIPTION;
    }
    throw this.unexpected(operationToken);
  }
  parseVariableDefinitions() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseVariableDefinition, TokenKind.PAREN_R);
  }
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: Kind.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  parseVariable() {
    const start = this._lexer.token;
    this.expectToken(TokenKind.DOLLAR);
    return this.node(start, {
      kind: Kind.VARIABLE,
      name: this.parseName()
    });
  }
  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: Kind.SELECTION_SET,
      selections: this.many(TokenKind.BRACE_L, this.parseSelection, TokenKind.BRACE_R)
    });
  }
  parseSelection() {
    return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
  }
  parseField() {
    const start = this._lexer.token;
    const nameOrAlias = this.parseName();
    let alias;
    let name;
    if (this.expectOptionalToken(TokenKind.COLON)) {
      alias = nameOrAlias;
      name = this.parseName();
    } else {
      name = nameOrAlias;
    }
    return this.node(start, {
      kind: Kind.FIELD,
      alias,
      name,
      arguments: this.parseArguments(false),
      directives: this.parseDirectives(false),
      selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  parseArguments(isConst) {
    const item = isConst ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
  }
  parseArgument(isConst = false) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: Kind.ARGUMENT,
      name,
      value: this.parseValueLiteral(isConst)
    });
  }
  parseConstArgument() {
    return this.parseArgument(true);
  }
  parseFragment() {
    const start = this._lexer.token;
    this.expectToken(TokenKind.SPREAD);
    const hasTypeCondition = this.expectOptionalKeyword("on");
    if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
      return this.node(start, {
        kind: Kind.FRAGMENT_SPREAD,
        name: this.parseFragmentName(),
        directives: this.parseDirectives(false)
      });
    }
    return this.node(start, {
      kind: Kind.INLINE_FRAGMENT,
      typeCondition: hasTypeCondition ? this.parseNamedType() : void 0,
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseFragmentDefinition() {
    var _this$_options;
    const start = this._lexer.token;
    this.expectKeyword("fragment");
    if (((_this$_options = this._options) === null || _this$_options === void 0 ? void 0 : _this$_options.allowLegacyFragmentVariables) === true) {
      return this.node(start, {
        kind: Kind.FRAGMENT_DEFINITION,
        name: this.parseFragmentName(),
        variableDefinitions: this.parseVariableDefinitions(),
        typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet()
      });
    }
    return this.node(start, {
      kind: Kind.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseFragmentName() {
    if (this._lexer.token.value === "on") {
      throw this.unexpected();
    }
    return this.parseName();
  }
  parseValueLiteral(isConst) {
    const token = this._lexer.token;
    switch (token.kind) {
      case TokenKind.BRACKET_L:
        return this.parseList(isConst);
      case TokenKind.BRACE_L:
        return this.parseObject(isConst);
      case TokenKind.INT:
        this._lexer.advance();
        return this.node(token, {
          kind: Kind.INT,
          value: token.value
        });
      case TokenKind.FLOAT:
        this._lexer.advance();
        return this.node(token, {
          kind: Kind.FLOAT,
          value: token.value
        });
      case TokenKind.STRING:
      case TokenKind.BLOCK_STRING:
        return this.parseStringLiteral();
      case TokenKind.NAME:
        this._lexer.advance();
        switch (token.value) {
          case "true":
            return this.node(token, {
              kind: Kind.BOOLEAN,
              value: true
            });
          case "false":
            return this.node(token, {
              kind: Kind.BOOLEAN,
              value: false
            });
          case "null":
            return this.node(token, {
              kind: Kind.NULL
            });
          default:
            return this.node(token, {
              kind: Kind.ENUM,
              value: token.value
            });
        }
      case TokenKind.DOLLAR:
        if (isConst) {
          this.expectToken(TokenKind.DOLLAR);
          if (this._lexer.token.kind === TokenKind.NAME) {
            const varName = this._lexer.token.value;
            throw syntaxError(this._lexer.source, token.start, `Unexpected variable "$${varName}" in constant value.`);
          } else {
            throw this.unexpected(token);
          }
        }
        return this.parseVariable();
      default:
        throw this.unexpected();
    }
  }
  parseConstValueLiteral() {
    return this.parseValueLiteral(true);
  }
  parseStringLiteral() {
    const token = this._lexer.token;
    this._lexer.advance();
    return this.node(token, {
      kind: Kind.STRING,
      value: token.value,
      block: token.kind === TokenKind.BLOCK_STRING
    });
  }
  parseList(isConst) {
    const item = () => this.parseValueLiteral(isConst);
    return this.node(this._lexer.token, {
      kind: Kind.LIST,
      values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R)
    });
  }
  parseObject(isConst) {
    const item = () => this.parseObjectField(isConst);
    return this.node(this._lexer.token, {
      kind: Kind.OBJECT,
      fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R)
    });
  }
  parseObjectField(isConst) {
    const start = this._lexer.token;
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return this.node(start, {
      kind: Kind.OBJECT_FIELD,
      name,
      value: this.parseValueLiteral(isConst)
    });
  }
  parseDirectives(isConst) {
    const directives = [];
    while (this.peek(TokenKind.AT)) {
      directives.push(this.parseDirective(isConst));
    }
    return directives;
  }
  parseConstDirectives() {
    return this.parseDirectives(true);
  }
  parseDirective(isConst) {
    const start = this._lexer.token;
    this.expectToken(TokenKind.AT);
    return this.node(start, {
      kind: Kind.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(isConst)
    });
  }
  parseTypeReference() {
    const start = this._lexer.token;
    let type;
    if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
      const innerType = this.parseTypeReference();
      this.expectToken(TokenKind.BRACKET_R);
      type = this.node(start, {
        kind: Kind.LIST_TYPE,
        type: innerType
      });
    } else {
      type = this.parseNamedType();
    }
    if (this.expectOptionalToken(TokenKind.BANG)) {
      return this.node(start, {
        kind: Kind.NON_NULL_TYPE,
        type
      });
    }
    return type;
  }
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: Kind.NAMED_TYPE,
      name: this.parseName()
    });
  }
  peekDescription() {
    return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
  }
  parseDescription() {
    if (this.peekDescription()) {
      return this.parseStringLiteral();
    }
  }
  parseSchemaDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("schema");
    const directives = this.parseConstDirectives();
    const operationTypes = this.many(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);
    return this.node(start, {
      kind: Kind.SCHEMA_DEFINITION,
      description,
      directives,
      operationTypes
    });
  }
  parseOperationTypeDefinition() {
    const start = this._lexer.token;
    const operation = this.parseOperationType();
    this.expectToken(TokenKind.COLON);
    const type = this.parseNamedType();
    return this.node(start, {
      kind: Kind.OPERATION_TYPE_DEFINITION,
      operation,
      type
    });
  }
  parseScalarTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("scalar");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.SCALAR_TYPE_DEFINITION,
      description,
      name,
      directives
    });
  }
  parseObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("type");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: Kind.OBJECT_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(TokenKind.AMP, this.parseNamedType) : [];
  }
  parseFieldsDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseFieldDefinition, TokenKind.BRACE_R);
  }
  parseFieldDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    this.expectToken(TokenKind.COLON);
    const type = this.parseTypeReference();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.FIELD_DEFINITION,
      description,
      name,
      arguments: args,
      type,
      directives
    });
  }
  parseArgumentDefs() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseInputValueDef, TokenKind.PAREN_R);
  }
  parseInputValueDef() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseName();
    this.expectToken(TokenKind.COLON);
    const type = this.parseTypeReference();
    let defaultValue;
    if (this.expectOptionalToken(TokenKind.EQUALS)) {
      defaultValue = this.parseConstValueLiteral();
    }
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.INPUT_VALUE_DEFINITION,
      description,
      name,
      type,
      defaultValue,
      directives
    });
  }
  parseInterfaceTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("interface");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    return this.node(start, {
      kind: Kind.INTERFACE_TYPE_DEFINITION,
      description,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseUnionTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("union");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();
    return this.node(start, {
      kind: Kind.UNION_TYPE_DEFINITION,
      description,
      name,
      directives,
      types
    });
  }
  parseUnionMemberTypes() {
    return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : [];
  }
  parseEnumTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("enum");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();
    return this.node(start, {
      kind: Kind.ENUM_TYPE_DEFINITION,
      description,
      name,
      directives,
      values
    });
  }
  parseEnumValuesDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseEnumValueDefinition, TokenKind.BRACE_R);
  }
  parseEnumValueDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    const name = this.parseEnumValueName();
    const directives = this.parseConstDirectives();
    return this.node(start, {
      kind: Kind.ENUM_VALUE_DEFINITION,
      description,
      name,
      directives
    });
  }
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null") {
      throw syntaxError(this._lexer.source, this._lexer.token.start, `${getTokenDesc(this._lexer.token)} is reserved and cannot be used for an enum value.`);
    }
    return this.parseName();
  }
  parseInputObjectTypeDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("input");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();
    return this.node(start, {
      kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
      description,
      name,
      directives,
      fields
    });
  }
  parseInputFieldsDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseInputValueDef, TokenKind.BRACE_R);
  }
  parseTypeSystemExtension() {
    const keywordToken = this._lexer.lookahead();
    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case "schema":
          return this.parseSchemaExtension();
        case "scalar":
          return this.parseScalarTypeExtension();
        case "type":
          return this.parseObjectTypeExtension();
        case "interface":
          return this.parseInterfaceTypeExtension();
        case "union":
          return this.parseUnionTypeExtension();
        case "enum":
          return this.parseEnumTypeExtension();
        case "input":
          return this.parseInputObjectTypeExtension();
      }
    }
    throw this.unexpected(keywordToken);
  }
  parseSchemaExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("schema");
    const directives = this.parseConstDirectives();
    const operationTypes = this.optionalMany(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);
    if (directives.length === 0 && operationTypes.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.SCHEMA_EXTENSION,
      directives,
      operationTypes
    });
  }
  parseScalarTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("scalar");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    if (directives.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.SCALAR_TYPE_EXTENSION,
      name,
      directives
    });
  }
  parseObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("type");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.OBJECT_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseInterfaceTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("interface");
    const name = this.parseName();
    const interfaces = this.parseImplementsInterfaces();
    const directives = this.parseConstDirectives();
    const fields = this.parseFieldsDefinition();
    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.INTERFACE_TYPE_EXTENSION,
      name,
      interfaces,
      directives,
      fields
    });
  }
  parseUnionTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("union");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const types = this.parseUnionMemberTypes();
    if (directives.length === 0 && types.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.UNION_TYPE_EXTENSION,
      name,
      directives,
      types
    });
  }
  parseEnumTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("enum");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const values = this.parseEnumValuesDefinition();
    if (directives.length === 0 && values.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.ENUM_TYPE_EXTENSION,
      name,
      directives,
      values
    });
  }
  parseInputObjectTypeExtension() {
    const start = this._lexer.token;
    this.expectKeyword("extend");
    this.expectKeyword("input");
    const name = this.parseName();
    const directives = this.parseConstDirectives();
    const fields = this.parseInputFieldsDefinition();
    if (directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }
    return this.node(start, {
      kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
      name,
      directives,
      fields
    });
  }
  parseDirectiveDefinition() {
    const start = this._lexer.token;
    const description = this.parseDescription();
    this.expectKeyword("directive");
    this.expectToken(TokenKind.AT);
    const name = this.parseName();
    const args = this.parseArgumentDefs();
    const repeatable = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const locations = this.parseDirectiveLocations();
    return this.node(start, {
      kind: Kind.DIRECTIVE_DEFINITION,
      description,
      name,
      arguments: args,
      repeatable,
      locations
    });
  }
  parseDirectiveLocations() {
    return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
  }
  parseDirectiveLocation() {
    const start = this._lexer.token;
    const name = this.parseName();
    if (Object.prototype.hasOwnProperty.call(DirectiveLocation, name.value)) {
      return name;
    }
    throw this.unexpected(start);
  }
  node(startToken, node) {
    var _this$_options2;
    if (((_this$_options2 = this._options) === null || _this$_options2 === void 0 ? void 0 : _this$_options2.noLocation) !== true) {
      node.loc = new Location(startToken, this._lexer.lastToken, this._lexer.source);
    }
    return node;
  }
  peek(kind) {
    return this._lexer.token.kind === kind;
  }
  expectToken(kind) {
    const token = this._lexer.token;
    if (token.kind === kind) {
      this._lexer.advance();
      return token;
    }
    throw syntaxError(this._lexer.source, token.start, `Expected ${getTokenKindDesc(kind)}, found ${getTokenDesc(token)}.`);
  }
  expectOptionalToken(kind) {
    const token = this._lexer.token;
    if (token.kind === kind) {
      this._lexer.advance();
      return true;
    }
    return false;
  }
  expectKeyword(value) {
    const token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this._lexer.advance();
    } else {
      throw syntaxError(this._lexer.source, token.start, `Expected "${value}", found ${getTokenDesc(token)}.`);
    }
  }
  expectOptionalKeyword(value) {
    const token = this._lexer.token;
    if (token.kind === TokenKind.NAME && token.value === value) {
      this._lexer.advance();
      return true;
    }
    return false;
  }
  unexpected(atToken) {
    const token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
    return syntaxError(this._lexer.source, token.start, `Unexpected ${getTokenDesc(token)}.`);
  }
  any(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];
    while (!this.expectOptionalToken(closeKind)) {
      nodes.push(parseFn.call(this));
    }
    return nodes;
  }
  optionalMany(openKind, parseFn, closeKind) {
    if (this.expectOptionalToken(openKind)) {
      const nodes = [];
      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));
      return nodes;
    }
    return [];
  }
  many(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    const nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (!this.expectOptionalToken(closeKind));
    return nodes;
  }
  delimitedMany(delimiterKind, parseFn) {
    this.expectOptionalToken(delimiterKind);
    const nodes = [];
    do {
      nodes.push(parseFn.call(this));
    } while (this.expectOptionalToken(delimiterKind));
    return nodes;
  }
}
function getTokenDesc(token) {
  const value = token.value;
  return getTokenKindDesc(token.kind) + (value != null ? ` "${value}"` : "");
}
function getTokenKindDesc(kind) {
  return isPunctuatorTokenKind(kind) ? `"${kind}"` : kind;
}
function l$1(a2, b) {
  b.tag = a2;
  return b;
}
function m() {
}
function p(a2) {
  return function(b) {
    var c2 = a2.length;
    let d = false, e = false, f2 = false, g2 = 0;
    b(l$1(0, [
      function(h2) {
        if (h2) {
          d = true;
        } else if (e) {
          f2 = true;
        } else {
          for (e = f2 = true; f2 && !d; ) {
            g2 < c2 ? (h2 = a2[g2], g2 = g2 + 1 | 0, f2 = false, b(l$1(1, [h2]))) : (d = true, b(0));
          }
          e = false;
        }
      }
    ]));
  };
}
function r() {
}
function t(a2) {
  a2(0);
}
function u$1(a2) {
  let b = false;
  a2(l$1(0, [
    function(c2) {
      c2 ? b = true : b || a2(0);
    }
  ]));
}
function x(a2) {
  if (a2 === null || a2[0] !== v) {
    return a2;
  }
  if ((a2 = a2[1]) !== 0) {
    return [v, a2 - 1 | 0];
  }
}
function z(a2) {
  return function(b) {
    return function(c2) {
      function d(b2) {
        typeof b2 == "number" ? k && (k = false, (b2 = e.shift()) !== void 0 ? (b2 = a2(x(b2)), k = true, b2(d)) : q ? c2(0) : g2 || (g2 = true, f2(0))) : b2.tag ? k && (c2(b2), n ? n = false : h2(0)) : (h2 = b2 = b2[0], n = false, b2(0));
      }
      let e = [], f2 = m, g2 = false, h2 = m, k = false, n = false, q = false;
      b(function(b2) {
        typeof b2 == "number" ? q || (q = true, k || e.length !== 0 || c2(0)) : b2.tag ? q || (b2 = b2[0], g2 = false, k ? e.push(b2) : (b2 = a2(b2), k = true, b2(d))) : f2 = b2[0];
      });
      c2(l$1(0, [
        function(c3) {
          if (c3) {
            if (q || (q = true, f2(1)), k) {
              return k = false, h2(1);
            }
          } else {
            q || g2 || (g2 = true, f2(0)), k && !n && (n = true, h2(0));
          }
        }
      ]));
    };
  };
}
function B(a2) {
  return a2;
}
function C(a2) {
  return a2(0);
}
function D(a2) {
  return function(b) {
    return function(c2) {
      let e = m, f2 = false, g2 = [], h2 = false;
      b(function(b2) {
        typeof b2 == "number" ? h2 || (h2 = true, g2.length === 0 && c2(0)) : b2.tag ? h2 || (f2 = false, function(a3) {
          function b3(a4) {
            typeof a4 == "number" ? g2.length !== 0 && (g2 = g2.filter(d), a4 = g2.length === 0, h2 && a4 ? c2(0) : !f2 && a4 && (f2 = true, e(0))) : a4.tag ? g2.length !== 0 && (c2(l$1(1, [a4[0]])), k(0)) : (k = a4 = a4[0], g2 = g2.concat(a4), a4(0));
          }
          function d(a4) {
            return a4 !== k;
          }
          let k = m;
          a3.length === 1 ? a3(b3) : a3.bind(null, b3);
        }(a2(b2[0])), f2 || (f2 = true, e(0))) : e = b2[0];
      });
      c2(l$1(0, [
        function(a3) {
          a3 ? (h2 || (h2 = true, e(a3)), g2.forEach(function(c3) {
            return c3(a3);
          }), g2 = []) : (f2 || h2 ? f2 = false : (f2 = true, e(0)), g2.forEach(C));
        }
      ]));
    };
  };
}
function E(a2) {
  return a2;
}
function H(a2) {
  return function(b) {
    return function(c2) {
      let d = false;
      return b(function(e) {
        if (typeof e == "number") {
          d || (d = true, c2(e));
        } else if (e.tag) {
          d || (a2(e[0]), c2(e));
        } else {
          var g2 = e[0];
          c2(l$1(0, [
            function(a3) {
              if (!d) {
                return a3 && (d = true), g2(a3);
              }
            }
          ]));
        }
      });
    };
  };
}
function J$1(a2) {
  a2(0);
}
function K(a2) {
  return function(b) {
    return function(c2) {
      function d(a3) {
        h2 && (typeof a3 == "number" ? (h2 = false, n ? c2(a3) : f2 || (f2 = true, e(0))) : a3.tag ? (c2(a3), k ? k = false : g2(0)) : (g2 = a3 = a3[0], k = false, a3(0)));
      }
      let e = m, f2 = false, g2 = m, h2 = false, k = false, n = false;
      b(function(b2) {
        typeof b2 == "number" ? n || (n = true, h2 || c2(0)) : b2.tag ? n || (h2 && (g2(1), g2 = m), f2 ? f2 = false : (f2 = true, e(0)), b2 = a2(b2[0]), h2 = true, b2(d)) : e = b2[0];
      });
      c2(l$1(0, [
        function(a3) {
          if (a3) {
            if (n || (n = true, e(1)), h2) {
              return h2 = false, g2(1);
            }
          } else {
            n || f2 || (f2 = true, e(0)), h2 && !k && (k = true, g2(0));
          }
        }
      ]));
    };
  };
}
function M(a2) {
  return function(b) {
    return function(c2) {
      let d = [], e = m;
      return b(function(b2) {
        typeof b2 == "number" ? p(d)(c2) : b2.tag ? (d.length >= a2 && 0 < a2 && d.shift(), d.push(b2[0]), e(0)) : (b2 = b2[0], 0 >= a2 ? (b2(1), u$1(c2)) : (e = b2, b2(0)));
      });
    };
  };
}
function N(a2) {
  return function(b) {
    let c2 = m, d = false;
    b(function(e) {
      typeof e == "number" ? d = true : e.tag ? d || (a2(e[0]), c2(0)) : (c2 = e = e[0], e(0));
    });
    return {
      unsubscribe: function() {
        if (!d) {
          return d = true, c2(1);
        }
      }
    };
  };
}
function O() {
}
function concat$1(a2) {
  return z(B)(p(a2));
}
function filter$1(a2) {
  return function(b) {
    return function(c2) {
      let d = m;
      return b(function(b2) {
        typeof b2 == "number" ? c2(b2) : b2.tag ? a2(b2[0]) ? c2(b2) : d(0) : (d = b2[0], c2(b2));
      });
    };
  };
}
function fromValue$1(a2) {
  return function(b) {
    let c2 = false;
    b(l$1(0, [
      function(d) {
        d ? c2 = true : c2 || (c2 = true, b(l$1(1, [a2])), b(0));
      }
    ]));
  };
}
function make$1(a2) {
  return function(b) {
    let c2 = r, d = false;
    c2 = a2({
      next: function(a3) {
        d || b(l$1(1, [a3]));
      },
      complete: function() {
        d || (d = true, b(0));
      }
    });
    b(l$1(0, [
      function(a3) {
        if (a3 && !d) {
          return d = true, c2();
        }
      }
    ]));
  };
}
function makeSubject$1() {
  let a2 = [], b = false;
  return {
    source: function(c2) {
      function b2(a3) {
        return a3 !== c2;
      }
      a2 = a2.concat(c2);
      c2(l$1(0, [
        function(c3) {
          c3 && (a2 = a2.filter(b2));
        }
      ]));
    },
    next: function(c2) {
      b || a2.forEach(function(a3) {
        a3(l$1(1, [c2]));
      });
    },
    complete: function() {
      b || (b = true, a2.forEach(t));
    }
  };
}
function map$1(a2) {
  return function(b) {
    return function(c2) {
      return b(function(b2) {
        b2 = typeof b2 == "number" ? 0 : b2.tag ? l$1(1, [a2(b2[0])]) : l$1(0, [b2[0]]);
        c2(b2);
      });
    };
  };
}
function merge$1(a2) {
  return D(E)(p(a2));
}
function onEnd$1(a2) {
  return function(b) {
    return function(c2) {
      let d = false;
      return b(function(b2) {
        if (typeof b2 == "number") {
          if (d) {
            return;
          }
          d = true;
          c2(b2);
          return a2();
        }
        if (b2.tag) {
          d || c2(b2);
        } else {
          var e = b2[0];
          c2(l$1(0, [
            function(c3) {
              if (!d) {
                return c3 ? (d = true, e(c3), a2()) : e(c3);
              }
            }
          ]));
        }
      });
    };
  };
}
function onStart$1(a2) {
  return function(b) {
    return function(c2) {
      return b(function(b2) {
        typeof b2 == "number" ? c2(b2) : b2.tag ? c2(b2) : (c2(b2), a2());
      });
    };
  };
}
function publish$1(a2) {
  return N(O)(a2);
}
function scan$1(a2, b) {
  return function(a3, b2) {
    return function(c2) {
      return function(d) {
        let e = b2;
        return c2(function(c3) {
          typeof c3 == "number" ? c3 = 0 : c3.tag ? (e = a3(e, c3[0]), c3 = l$1(1, [e])) : c3 = l$1(0, [c3[0]]);
          d(c3);
        });
      };
    };
  }(a2, b);
}
function share$1(a2) {
  function b(a3) {
    typeof a3 == "number" ? (c2.forEach(J$1), c2 = []) : a3.tag ? (e = false, c2.forEach(function(b2) {
      b2(a3);
    })) : d = a3[0];
  }
  let c2 = [], d = m, e = false;
  return function(f2) {
    function g2(a3) {
      return a3 !== f2;
    }
    c2 = c2.concat(f2);
    c2.length === 1 && a2(b);
    f2(l$1(0, [
      function(a3) {
        if (a3) {
          if (c2 = c2.filter(g2), c2.length === 0) {
            return d(1);
          }
        } else {
          e || (e = true, d(a3));
        }
      }
    ]));
  };
}
function take$1(a2) {
  return function(b) {
    return function(c2) {
      let d = false, e = 0, f2 = m;
      b(function(b2) {
        typeof b2 == "number" ? d || (d = true, c2(0)) : b2.tag ? e < a2 && !d && (e = e + 1 | 0, c2(b2), !d && e >= a2 && (d = true, c2(0), f2(1))) : (b2 = b2[0], 0 >= a2 ? (d = true, c2(0), b2(1)) : f2 = b2);
      });
      c2(l$1(0, [
        function(b2) {
          if (!d) {
            if (b2) {
              return d = true, f2(1);
            }
            if (e < a2) {
              return f2(0);
            }
          }
        }
      ]));
    };
  };
}
function takeUntil$1(a2) {
  return function(b) {
    return function(c2) {
      function d(a3) {
        typeof a3 != "number" && (a3.tag ? (e = true, f2(1), c2(0)) : (g2 = a3 = a3[0], a3(0)));
      }
      let e = false, f2 = m, g2 = m;
      b(function(b2) {
        typeof b2 == "number" ? e || (e = true, g2(1), c2(0)) : b2.tag ? e || c2(b2) : (f2 = b2[0], a2(d));
      });
      c2(l$1(0, [
        function(a3) {
          if (!e) {
            return a3 ? (e = true, f2(1), g2(1)) : f2(0);
          }
        }
      ]));
    };
  };
}
function toPromise$1(a2) {
  return new Promise(function(b) {
    M(1)(a2)(function(a3) {
      if (typeof a3 != "number") {
        if (a3.tag) {
          b(a3[0]);
        } else {
          a3[0](0);
        }
      }
    });
  });
}
var v = [];
typeof Symbol == "function" ? Symbol.observable || (Symbol.observable = Symbol("observable")) : "@@observable";
function rehydrateGraphQlError(r2) {
  if (typeof r2 == "string") {
    return new GraphQLError(r2);
  } else if (typeof r2 == "object" && r2.message) {
    return new GraphQLError(r2.message, r2.nodes, r2.source, r2.positions, r2.path, r2, r2.extensions || {});
  } else {
    return r2;
  }
}
var a = function(e) {
  function CombinedError(r2) {
    var t2 = r2.networkError;
    var n = r2.response;
    var o = (r2.graphQLErrors || []).map(rehydrateGraphQlError);
    var a2 = function generateErrorMessage(e2, r3) {
      var t3 = "";
      if (e2 !== void 0) {
        return t3 = "[Network] " + e2.message;
      }
      if (r3 !== void 0) {
        r3.forEach(function(e3) {
          t3 += "[GraphQL] " + e3.message + "\n";
        });
      }
      return t3.trim();
    }(t2, o);
    e.call(this, a2);
    this.name = "CombinedError";
    this.message = a2;
    this.graphQLErrors = o;
    this.networkError = t2;
    this.response = n;
  }
  if (e) {
    CombinedError.__proto__ = e;
  }
  (CombinedError.prototype = Object.create(e && e.prototype)).constructor = CombinedError;
  CombinedError.prototype.toString = function toString() {
    return this.message;
  };
  return CombinedError;
}(Error);
function phash(e, r2) {
  e |= 0;
  for (var t2 = 0, n = 0 | r2.length; t2 < n; t2++) {
    e = (e << 5) + e + r2.charCodeAt(t2);
  }
  return e;
}
function hash(e) {
  return phash(5381, e) >>> 0;
}
var i = new Set();
var s = new WeakMap();
function stringify(e) {
  if (e === null || i.has(e)) {
    return "null";
  } else if (typeof e != "object") {
    return JSON.stringify(e) || "";
  } else if (e.toJSON) {
    return stringify(e.toJSON());
  } else if (Array.isArray(e)) {
    var r2 = "[";
    for (var t2 = 0, n = e.length; t2 < n; t2++) {
      if (t2 > 0) {
        r2 += ",";
      }
      var o = stringify(e[t2]);
      r2 += o.length > 0 ? o : "null";
    }
    return r2 += "]";
  }
  var a2 = Object.keys(e).sort();
  if (!a2.length && e.constructor && e.constructor !== Object) {
    var u2 = s.get(e) || Math.random().toString(36).slice(2);
    s.set(e, u2);
    return '{"__key":"' + u2 + '"}';
  }
  i.add(e);
  var f2 = "{";
  for (var c2 = 0, l2 = a2.length; c2 < l2; c2++) {
    var h2 = a2[c2];
    var p2 = stringify(e[h2]);
    if (p2) {
      if (f2.length > 1) {
        f2 += ",";
      }
      f2 += stringify(h2) + ":" + p2;
    }
  }
  i.delete(e);
  return f2 += "}";
}
function stringifyVariables(e) {
  i.clear();
  return stringify(e);
}
function stringifyDocument(e) {
  var r2 = (typeof e != "string" ? e.loc && e.loc.source.body || print(e) : e).replace(/([\s,]|#[^\n\r]+)+/g, " ").trim();
  if (typeof e != "string") {
    var t2 = "definitions" in e && getOperationName(e);
    if (t2) {
      r2 = "# " + t2 + "\n" + r2;
    }
    if (!e.loc) {
      e.loc = {
        start: 0,
        end: r2.length,
        source: {
          body: r2,
          name: "gql",
          locationOffset: {
            line: 1,
            column: 1
          }
        }
      };
    }
  }
  return r2;
}
var u = new Map();
function keyDocument(e) {
  var r2;
  var n;
  if (typeof e == "string") {
    r2 = hash(stringifyDocument(e));
    n = u.get(r2) || parse(e, {
      noLocation: true
    });
  } else {
    r2 = e.__key || hash(stringifyDocument(e));
    n = u.get(r2) || e;
  }
  if (!n.loc) {
    stringifyDocument(n);
  }
  n.__key = r2;
  u.set(r2, n);
  return n;
}
function createRequest(e, r2) {
  if (!r2) {
    r2 = {};
  }
  var t2 = keyDocument(e);
  return {
    key: phash(t2.__key, stringifyVariables(r2)) >>> 0,
    query: t2,
    variables: r2
  };
}
function getOperationName(e) {
  for (var t2 = 0, n = e.definitions.length; t2 < n; t2++) {
    var o = e.definitions[t2];
    if (o.kind === Kind.OPERATION_DEFINITION && o.name) {
      return o.name.value;
    }
  }
}
function getOperationType(e) {
  for (var t2 = 0, n = e.definitions.length; t2 < n; t2++) {
    var o = e.definitions[t2];
    if (o.kind === Kind.OPERATION_DEFINITION) {
      return o.operation;
    }
  }
}
function _extends$1() {
  return (_extends$1 = Object.assign || function(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = arguments[r2];
      for (var n in t2) {
        if (Object.prototype.hasOwnProperty.call(t2, n)) {
          e[n] = t2[n];
        }
      }
    }
    return e;
  }).apply(this, arguments);
}
function makeResult(e, r2, t2) {
  if (!("data" in r2) && !("errors" in r2) || "path" in r2) {
    throw new Error("No Content");
  }
  return {
    operation: e,
    data: r2.data,
    error: Array.isArray(r2.errors) ? new a({
      graphQLErrors: r2.errors,
      response: t2
    }) : void 0,
    extensions: typeof r2.extensions == "object" && r2.extensions || void 0,
    hasNext: !!r2.hasNext
  };
}
function mergeResultPatch(e, r2, t2) {
  var n = _extends$1({}, e);
  n.hasNext = !!r2.hasNext;
  if (!("path" in r2)) {
    if ("data" in r2) {
      n.data = r2.data;
    }
    return n;
  }
  if (Array.isArray(r2.errors)) {
    n.error = new a({
      graphQLErrors: n.error ? n.error.graphQLErrors.concat(r2.errors) : r2.errors,
      response: t2
    });
  }
  var o = n.data = _extends$1({}, n.data);
  var i2 = 0;
  var s2;
  while (i2 < r2.path.length) {
    o = o[s2 = r2.path[i2++]] = Array.isArray(o[s2]) ? [].concat(o[s2]) : _extends$1({}, o[s2]);
  }
  _extends$1(o, r2.data);
  return n;
}
function makeErrorResult(e, r2, t2) {
  return {
    operation: e,
    data: void 0,
    error: new a({
      networkError: r2,
      response: t2
    }),
    extensions: void 0
  };
}
function shouldUseGet(e) {
  return e.kind === "query" && !!e.context.preferGetMethod;
}
function makeFetchBody(e) {
  return {
    query: print(e.query),
    operationName: getOperationName(e.query),
    variables: e.variables || void 0,
    extensions: void 0
  };
}
function makeFetchURL(e, r2) {
  var t2 = shouldUseGet(e);
  var n = e.context.url;
  if (!t2 || !r2) {
    return n;
  }
  var o = [];
  if (r2.operationName) {
    o.push("operationName=" + encodeURIComponent(r2.operationName));
  }
  if (r2.query) {
    o.push("query=" + encodeURIComponent(r2.query.replace(/#[^\n\r]+/g, " ").trim()));
  }
  if (r2.variables) {
    o.push("variables=" + encodeURIComponent(stringifyVariables(r2.variables)));
  }
  if (r2.extensions) {
    o.push("extensions=" + encodeURIComponent(stringifyVariables(r2.extensions)));
  }
  return n + "?" + o.join("&");
}
function makeFetchOptions(e, r2) {
  var t2 = shouldUseGet(e);
  var n = typeof e.context.fetchOptions == "function" ? e.context.fetchOptions() : e.context.fetchOptions || {};
  return _extends$1({}, n, {
    body: !t2 && r2 ? JSON.stringify(r2) : void 0,
    method: t2 ? "GET" : "POST",
    headers: t2 ? n.headers : _extends$1({}, {
      "content-type": "application/json"
    }, n.headers)
  });
}
var f = typeof Symbol != "undefined" ? Symbol.asyncIterator : null;
var c = typeof TextDecoder != "undefined" ? new TextDecoder() : null;
var l = /content-type:[^\r\n]*application\/json/i;
var h = /boundary="?([^=";]+)"?/i;
function executeIncrementalFetch(e, r2, t2) {
  var n = t2.headers && t2.headers.get("Content-Type") || "";
  if (!/multipart\/mixed/i.test(n)) {
    return t2.json().then(function(n2) {
      e(makeResult(r2, n2, t2));
    });
  }
  var o = "---";
  var a2 = n.match(h);
  if (a2) {
    o = "--" + a2[1];
  }
  var i2;
  var cancel = function() {
  };
  if (f && t2[f]) {
    var s2 = t2[f]();
    i2 = s2.next.bind(s2);
  } else if ("body" in t2 && t2.body) {
    var u2 = t2.body.getReader();
    cancel = u2.cancel.bind(u2);
    i2 = u2.read.bind(u2);
  } else {
    throw new TypeError("Streaming requests unsupported");
  }
  var p2 = "";
  var d = true;
  var m2 = null;
  var v2 = null;
  return i2().then(function next(n2) {
    if (!n2.done) {
      var a3 = function toString(e2) {
        return e2.constructor.name === "Buffer" ? e2.toString() : c.decode(e2);
      }(n2.value);
      var s3 = a3.indexOf(o);
      if (s3 > -1) {
        s3 += p2.length;
      } else {
        s3 = p2.indexOf(o);
      }
      p2 += a3;
      while (s3 > -1) {
        var u3 = p2.slice(0, s3);
        var f2 = p2.slice(s3 + o.length);
        if (d) {
          d = false;
        } else {
          var h2 = u3.indexOf("\r\n\r\n") + 4;
          var g2 = u3.slice(0, h2);
          var y = u3.slice(h2, u3.lastIndexOf("\r\n"));
          var x2 = void 0;
          if (l.test(g2)) {
            try {
              x2 = JSON.parse(y);
              m2 = v2 = v2 ? mergeResultPatch(v2, x2, t2) : makeResult(r2, x2, t2);
            } catch (e2) {
            }
          }
          if (f2.slice(0, 2) === "--" || x2 && !x2.hasNext) {
            if (!v2) {
              return e(makeResult(r2, {}, t2));
            }
            break;
          }
        }
        s3 = (p2 = f2).indexOf(o);
      }
    }
    if (m2) {
      e(m2);
      m2 = null;
    }
    if (!n2.done && (!v2 || v2.hasNext)) {
      return i2().then(next);
    }
  }).finally(cancel);
}
function makeFetchSource(e, r2, t2) {
  var n = t2.redirect === "manual" ? 400 : 300;
  var a2 = e.context.fetch;
  return make$1(function(o) {
    var i2 = o.next;
    var s2 = o.complete;
    var u2 = typeof AbortController != "undefined" ? new AbortController() : null;
    if (u2) {
      t2.signal = u2.signal;
    }
    var f2 = false;
    var c2 = false;
    var l2;
    Promise.resolve().then(function() {
      if (f2) {
        return;
      }
      return (a2 || fetch)(r2, t2);
    }).then(function(r3) {
      if (!r3) {
        return;
      }
      c2 = (l2 = r3).status < 200 || l2.status >= n;
      return executeIncrementalFetch(i2, e, l2);
    }).then(s2).catch(function(r3) {
      if (r3.name !== "AbortError") {
        var t3 = makeErrorResult(e, c2 ? new Error(l2.statusText) : r3, l2);
        i2(t3);
        s2();
      }
    });
    return function() {
      f2 = true;
      if (u2) {
        u2.abort();
      }
    };
  });
}
function collectTypes(e, r2) {
  if (Array.isArray(e)) {
    for (var n = 0; n < e.length; n++) {
      collectTypes(e[n], r2);
    }
  } else if (typeof e == "object" && e !== null) {
    for (var t2 in e) {
      if (t2 === "__typename" && typeof e[t2] == "string") {
        r2[e[t2]] = 0;
      } else {
        collectTypes(e[t2], r2);
      }
    }
  }
  return r2;
}
function collectTypesFromResponse(e) {
  return Object.keys(collectTypes(e, {}));
}
var formatNode = function(e) {
  if (e.selectionSet && !e.selectionSet.selections.some(function(e2) {
    return e2.kind === Kind.FIELD && e2.name.value === "__typename" && !e2.alias;
  })) {
    return _extends$1({}, e, {
      selectionSet: _extends$1({}, e.selectionSet, {
        selections: e.selectionSet.selections.concat([{
          kind: Kind.FIELD,
          name: {
            kind: Kind.NAME,
            value: "__typename"
          }
        }])
      })
    });
  }
};
var Q = new Map();
function formatDocument(r2) {
  var n = keyDocument(r2);
  var a2 = Q.get(n.__key);
  if (!a2) {
    a2 = visit(n, {
      Field: formatNode,
      InlineFragment: formatNode
    });
    Object.defineProperty(a2, "__key", {
      value: n.__key,
      enumerable: false
    });
    Q.set(n.__key, a2);
  }
  return a2;
}
function maskTypename(e) {
  if (!e || typeof e != "object") {
    return e;
  }
  return Object.keys(e).reduce(function(r2, n) {
    var t2 = e[n];
    if (n === "__typename") {
      Object.defineProperty(r2, "__typename", {
        enumerable: false,
        value: t2
      });
    } else if (Array.isArray(t2)) {
      r2[n] = t2.map(maskTypename);
    } else if (t2 && typeof t2 == "object" && "__typename" in t2) {
      r2[n] = maskTypename(t2);
    } else {
      r2[n] = t2;
    }
    return r2;
  }, Array.isArray(e) ? [] : {});
}
function withPromise(e) {
  e.toPromise = function() {
    return toPromise$1(take$1(1)(filter$1(function(e2) {
      return !e2.stale && !e2.hasNext;
    })(e)));
  };
  return e;
}
function makeOperation(e, r2, n) {
  if (!n) {
    n = r2.context;
  }
  return {
    key: r2.key,
    query: r2.query,
    variables: r2.variables,
    kind: e,
    context: n
  };
}
function addMetadata(e, r2) {
  return makeOperation(e.kind, e, _extends$1({}, e.context, {
    meta: _extends$1({}, e.context.meta, r2)
  }));
}
function noop() {
}
function applyDefinitions(e, n, t2) {
  for (var a2 = 0; a2 < t2.length; a2++) {
    if (t2[a2].kind === Kind.FRAGMENT_DEFINITION) {
      var o = t2[a2].name.value;
      var i2 = stringifyDocument(t2[a2]);
      if (!e.has(o)) {
        e.set(o, i2);
        n.push(t2[a2]);
      }
    } else {
      n.push(t2[a2]);
    }
  }
}
function gql() {
  var e = arguments;
  var n = new Map();
  var a2 = [];
  var o = [];
  var i2 = Array.isArray(arguments[0]) ? arguments[0][0] : arguments[0] || "";
  for (var u2 = 1; u2 < arguments.length; u2++) {
    var c2 = e[u2];
    if (c2 && c2.definitions) {
      o.push.apply(o, c2.definitions);
    } else {
      i2 += c2;
    }
    i2 += e[0][u2];
  }
  applyDefinitions(n, a2, keyDocument(i2).definitions);
  applyDefinitions(n, a2, o);
  return keyDocument({
    kind: Kind.DOCUMENT,
    definitions: a2
  });
}
function shouldSkip(e) {
  var r2 = e.kind;
  return r2 !== "mutation" && r2 !== "query";
}
function cacheExchange(e) {
  var r2 = e.forward;
  var n = e.client;
  e.dispatchDebug;
  var a2 = new Map();
  var i2 = Object.create(null);
  function mapTypeNames(e2) {
    var r3 = makeOperation(e2.kind, e2);
    r3.query = formatDocument(e2.query);
    return r3;
  }
  function isOperationCached(e2) {
    var r3 = e2.context.requestPolicy;
    return e2.kind === "query" && r3 !== "network-only" && (r3 === "cache-only" || a2.has(e2.key));
  }
  return function(e2) {
    var u2 = share$1(e2);
    var c2 = map$1(function(e3) {
      var r3 = a2.get(e3.key);
      var i3 = _extends$1({}, r3, {
        operation: addMetadata(e3, {
          cacheOutcome: r3 ? "hit" : "miss"
        })
      });
      if (e3.context.requestPolicy === "cache-and-network") {
        i3.stale = true;
        reexecuteOperation(n, e3);
      }
      return i3;
    })(filter$1(function(e3) {
      return !shouldSkip(e3) && isOperationCached(e3);
    })(u2));
    var s2 = H(function(e3) {
      var r3 = e3.operation;
      if (!r3) {
        return;
      }
      var o = collectTypesFromResponse(e3.data).concat(r3.context.additionalTypenames || []);
      if (e3.operation.kind === "mutation") {
        var u3 = new Set();
        for (var c3 = 0; c3 < o.length; c3++) {
          var s3 = o[c3];
          var f2 = i2[s3] || (i2[s3] = new Set());
          f2.forEach(function(e4) {
            u3.add(e4);
          });
          f2.clear();
        }
        u3.forEach(function(e4) {
          if (a2.has(e4)) {
            r3 = a2.get(e4).operation;
            a2.delete(e4);
            reexecuteOperation(n, r3);
          }
        });
      } else if (r3.kind === "query" && e3.data) {
        a2.set(r3.key, e3);
        for (var p2 = 0; p2 < o.length; p2++) {
          var l2 = o[p2];
          (i2[l2] || (i2[l2] = new Set())).add(r3.key);
        }
      }
    })(r2(filter$1(function(e3) {
      return e3.kind !== "query" || e3.context.requestPolicy !== "cache-only";
    })(map$1(function(e3) {
      return addMetadata(e3, {
        cacheOutcome: "miss"
      });
    })(merge$1([map$1(mapTypeNames)(filter$1(function(e3) {
      return !shouldSkip(e3) && !isOperationCached(e3);
    })(u2)), filter$1(function(e3) {
      return shouldSkip(e3);
    })(u2)])))));
    return merge$1([c2, s2]);
  };
}
function reexecuteOperation(e, r2) {
  return e.reexecuteOperation(makeOperation(r2.kind, r2, _extends$1({}, r2.context, {
    requestPolicy: "network-only"
  })));
}
function dedupExchange(e) {
  var r2 = e.forward;
  e.dispatchDebug;
  var t2 = new Set();
  function filterIncomingOperation(e2) {
    var r3 = e2.key;
    var a2 = e2.kind;
    if (a2 === "teardown") {
      t2.delete(r3);
      return true;
    }
    if (a2 !== "query" && a2 !== "subscription") {
      return true;
    }
    var o = t2.has(r3);
    t2.add(r3);
    return !o;
  }
  function afterOperationResult(e2) {
    if (!e2.hasNext) {
      t2.delete(e2.operation.key);
    }
  }
  return function(e2) {
    var n = filter$1(filterIncomingOperation)(e2);
    return H(afterOperationResult)(r2(n));
  };
}
function fetchExchange(e) {
  var r2 = e.forward;
  e.dispatchDebug;
  return function(e2) {
    var t2 = share$1(e2);
    var a2 = D(function(e3) {
      var r3 = e3.key;
      var a3 = filter$1(function(e4) {
        return e4.kind === "teardown" && e4.key === r3;
      })(t2);
      var o2 = makeFetchBody(e3);
      var i2 = makeFetchURL(e3, o2);
      var u2 = makeFetchOptions(e3, o2);
      return H(function(r4) {
        !r4.data ? r4.error : void 0;
      })(takeUntil$1(a3)(makeFetchSource(e3, i2, u2)));
    })(filter$1(function(e3) {
      return e3.kind === "query" || e3.kind === "mutation";
    })(t2));
    var o = r2(filter$1(function(e3) {
      return e3.kind !== "query" && e3.kind !== "mutation";
    })(t2));
    return merge$1([a2, o]);
  };
}
function fallbackExchange(e) {
  e.dispatchDebug;
  return function(e2) {
    return filter$1(function() {
      return false;
    })(H(function(e3) {
      if (e3.kind !== "teardown" && false) {
        var n = 'No exchange has handled operations of kind "' + e3.kind + `". Check whether you've added an exchange responsible for these operations.`;
        console.warn(n);
      }
    })(e2));
  };
}
fallbackExchange({
  dispatchDebug: noop
});
function composeExchanges(e) {
  return function(r2) {
    var n = r2.client;
    r2.dispatchDebug;
    return e.reduceRight(function(e2, r3) {
      return r3({
        client: n,
        forward: e2,
        dispatchDebug: function dispatchDebug$1(e3) {
        }
      });
    }, r2.forward);
  };
}
var J = [dedupExchange, cacheExchange, fetchExchange];
var W = function Client(e) {
  var r2 = new Map();
  var n = new Map();
  var t2 = [];
  var a2 = makeSubject$1();
  var i2 = a2.source;
  var u2 = a2.next;
  var c2 = false;
  function dispatchOperation(e2) {
    c2 = true;
    if (e2) {
      u2(e2);
    }
    while (e2 = t2.shift()) {
      u2(e2);
    }
    c2 = false;
  }
  function makeResultSource(e2) {
    var a3 = filter$1(function(r3) {
      return r3.operation.kind === e2.kind && r3.operation.key === e2.key;
    })(y);
    if (f2.maskTypename) {
      a3 = map$1(function(e3) {
        return _extends$1({}, e3, {
          data: maskTypename(e3.data)
        });
      })(a3);
    }
    if (e2.kind === "mutation") {
      return take$1(1)(onStart$1(function() {
        return dispatchOperation(e2);
      })(a3));
    }
    return share$1(onEnd$1(function() {
      r2.delete(e2.key);
      n.delete(e2.key);
      for (var a4 = t2.length - 1; a4 >= 0; a4--) {
        if (t2[a4].key === e2.key) {
          t2.splice(a4, 1);
        }
      }
      dispatchOperation(makeOperation("teardown", e2, e2.context));
    })(H(function(n2) {
      r2.set(e2.key, n2);
    })(K(function(r3) {
      if (e2.kind !== "query" || r3.stale) {
        return fromValue$1(r3);
      }
      return merge$1([fromValue$1(r3), map$1(function() {
        return _extends$1({}, r3, {
          stale: true
        });
      })(take$1(1)(filter$1(function(r4) {
        return r4.kind === "query" && r4.key === e2.key && r4.context.requestPolicy !== "cache-only";
      })(i2)))]);
    })(takeUntil$1(filter$1(function(r3) {
      return r3.kind === "teardown" && r3.key === e2.key;
    })(i2))(a3)))));
  }
  var s2 = this instanceof Client ? this : Object.create(Client.prototype);
  var f2 = _extends$1(s2, {
    url: e.url,
    fetchOptions: e.fetchOptions,
    fetch: e.fetch,
    suspense: !!e.suspense,
    requestPolicy: e.requestPolicy || "cache-first",
    preferGetMethod: !!e.preferGetMethod,
    maskTypename: !!e.maskTypename,
    operations$: i2,
    reexecuteOperation: function reexecuteOperation2(e2) {
      if (e2.kind === "mutation" || n.has(e2.key)) {
        t2.push(e2);
        if (!c2) {
          Promise.resolve().then(dispatchOperation);
        }
      }
    },
    createOperationContext: function createOperationContext(e2) {
      if (!e2) {
        e2 = {};
      }
      return _extends$1({}, {
        url: f2.url,
        fetchOptions: f2.fetchOptions,
        fetch: f2.fetch,
        preferGetMethod: f2.preferGetMethod
      }, e2, {
        suspense: e2.suspense || e2.suspense !== false && f2.suspense,
        requestPolicy: e2.requestPolicy || f2.requestPolicy
      });
    },
    createRequestOperation: function createRequestOperation(e2, r3, n2) {
      getOperationType(r3.query);
      return makeOperation(e2, r3, f2.createOperationContext(n2));
    },
    executeRequestOperation: function executeRequestOperation(e2) {
      if (e2.kind === "mutation") {
        return makeResultSource(e2);
      }
      return make$1(function(t3) {
        var a3 = n.get(e2.key);
        if (!a3) {
          n.set(e2.key, a3 = makeResultSource(e2));
        }
        var i3 = e2.context.requestPolicy === "cache-and-network" || e2.context.requestPolicy === "network-only";
        return N(t3.next)(onEnd$1(t3.complete)(onStart$1(function() {
          var n2 = r2.get(e2.key);
          if (e2.kind === "subscription") {
            return dispatchOperation(e2);
          } else if (i3) {
            dispatchOperation(e2);
          }
          if (n2 != null && n2 === r2.get(e2.key)) {
            t3.next(i3 ? _extends$1({}, n2, {
              stale: true
            }) : n2);
          } else if (!i3) {
            dispatchOperation(e2);
          }
        })(a3))).unsubscribe;
      });
    },
    executeQuery: function executeQuery(e2, r3) {
      var n2 = f2.createRequestOperation("query", e2, r3);
      return f2.executeRequestOperation(n2);
    },
    executeSubscription: function executeSubscription(e2, r3) {
      var n2 = f2.createRequestOperation("subscription", e2, r3);
      return f2.executeRequestOperation(n2);
    },
    executeMutation: function executeMutation(e2, r3) {
      var n2 = f2.createRequestOperation("mutation", e2, r3);
      return f2.executeRequestOperation(n2);
    },
    query: function query2(e2, r3, n2) {
      if (!n2 || typeof n2.suspense != "boolean") {
        n2 = _extends$1({}, n2, {
          suspense: false
        });
      }
      return withPromise(f2.executeQuery(createRequest(e2, r3), n2));
    },
    readQuery: function readQuery(e2, r3, n2) {
      var t3 = null;
      N(function(e3) {
        t3 = e3;
      })(f2.query(e2, r3, n2)).unsubscribe();
      return t3;
    },
    subscription: function subscription(e2, r3, n2) {
      return f2.executeSubscription(createRequest(e2, r3), n2);
    },
    mutation: function mutation(e2, r3, n2) {
      return withPromise(f2.executeMutation(createRequest(e2, r3), n2));
    }
  });
  var p2 = noop;
  var v2 = composeExchanges(e.exchanges !== void 0 ? e.exchanges : J);
  var y = share$1(v2({
    client: f2,
    dispatchDebug: p2,
    forward: fallbackExchange({
      dispatchDebug: p2
    })
  })(i2));
  publish$1(y);
  return f2;
};
const subscriber_queue = [];
function writable(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run, invalidate = noop$1) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function _extends() {
  return (_extends = Object.assign || function(e) {
    for (var t2 = 1; t2 < arguments.length; t2++) {
      var n = arguments[t2];
      for (var r2 in n) {
        if (Object.prototype.hasOwnProperty.call(n, r2)) {
          e[r2] = n[r2];
        }
      }
    }
    return e;
  }).apply(this, arguments);
}
function operationStore(n, i2, o) {
  var u2 = {
    query: n,
    variables: i2 || null,
    context: o
  };
  var a2 = {
    stale: false,
    fetching: false,
    data: void 0,
    error: void 0,
    extensions: void 0
  };
  var c2 = writable(a2);
  var s2 = false;
  a2.set = function set(n2) {
    if (!n2 || n2 === a2) {
      return;
    }
    s2 = true;
    var i3 = false;
    if ("query" in n2 || "variables" in n2) {
      var o2 = createRequest(u2.query, u2.variables);
      var f2 = createRequest(n2.query || u2.query, n2.variables || u2.variables);
      if (o2.key !== f2.key) {
        i3 = true;
        u2.query = n2.query || u2.query;
        u2.variables = n2.variables || u2.variables || null;
      }
    }
    if ("context" in n2) {
      if (stringifyVariables(u2.context) !== stringifyVariables(n2.context)) {
        i3 = true;
        u2.context = n2.context;
      }
    }
    for (var l2 in n2) {
      if (l2 === "query" || l2 === "variables" || l2 === "context") {
        continue;
      } else if (l2 === "fetching") {
        a2[l2] = !!n2[l2];
      } else if (l2 in a2) {
        a2[l2] = n2[l2];
      }
      i3 = true;
    }
    a2.stale = !!n2.stale;
    s2 = false;
    if (i3) {
      c2.set(a2);
    }
  };
  a2.update = function update(e) {
    a2.set(e(a2));
  };
  a2.subscribe = function subscribe(e, t2) {
    return c2.subscribe(e, t2);
  };
  a2.reexecute = function(e) {
    u2.context = _extends({}, e || u2.context);
    c2.set(a2);
  };
  Object.keys(u2).forEach(function(e) {
    Object.defineProperty(a2, e, {
      configurable: false,
      get: function() {
        return u2[e];
      },
      set: function set(t2) {
        u2[e] = t2;
        if (!s2) {
          c2.set(a2);
        }
      }
    });
  });
  return a2;
}
function getClient() {
  return getContext("$$_urql");
}
function setClient(e) {
  setContext("$$_urql", e);
}
function initClient(e) {
  var t2 = new W(e);
  setClient(t2);
  return t2;
}
var g = {
  fetching: false,
  stale: false,
  error: void 0,
  data: void 0,
  extensions: void 0
};
function toSource(t2) {
  return make$1(function(n) {
    var r2;
    var i2 = {};
    return t2.subscribe(function(t3) {
      var o = createRequest(t3.query, t3.variables);
      if ((o.context = t3.context) !== i2 || o.key !== r2) {
        r2 = o.key;
        i2 = t3.context;
        n.next(o);
      }
    });
  });
}
function query(e) {
  var t2 = getClient();
  var n = N(function(t3) {
    e.set(t3);
  })(scan$1(function(e2, t3) {
    return _extends({}, e2, t3);
  }, g)(K(function(e2) {
    if (e2.context && e2.context.pause) {
      return fromValue$1({
        fetching: false,
        stale: false
      });
    }
    return concat$1([fromValue$1({
      fetching: true,
      stale: false
    }), map$1(function(e3) {
      return _extends({}, {
        fetching: false
      }, e3, {
        stale: !!e3.stale
      });
    })(t2.executeQuery(e2, e2.context)), fromValue$1({
      fetching: false,
      stale: false
    })]);
  })(toSource(e))));
  onDestroy(n.unsubscribe);
  return e;
}
export { gql as g, initClient as i, operationStore as o, query as q };
