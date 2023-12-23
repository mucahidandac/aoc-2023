import { getInput, getLines } from "../utils/io";

const START = "in";
const REJECT = "R";
const ACCEPT = "A";
type INTERMEDIATE = string;
type WorkFlowId = typeof START | typeof REJECT | typeof ACCEPT | INTERMEDIATE;

type Field = "x" | "m" | "a" | "s";

type Rule =
  | {
      field: Field;
      operation: "<" | ">";
      constraint: number;
      nextOperation: WorkFlowId;
    }
  | {
      nextOperation: WorkFlowId;
    };
type Workflow = {
  id: WorkFlowId;
  rules: Rule[];
};

type Rating = Record<Field, number>;
type Range = { min: number; max: number };
type RatingRange = Record<Field, Range>;

type ParsedInput = {
  workflows: Workflow[];
  ratings: Rating[];
};

function parseInput(input: string): ParsedInput {
  const [workflowsPart, ratingsPart] = input.split("\n\n");
  const workflows: Workflow[] = getLines(workflowsPart).map((line) => {
    // px{a<2006:qkq,m>2090:A,rfg}
    const [id, workflow] = line.split("{");
    const rulesRaw = workflow.slice(0, -1).split(",");
    const lastStop: WorkFlowId = rulesRaw.pop()! as WorkFlowId;
    const rules = rulesRaw.map((rule) => {
      const [key, nextOperation] = rule.split(":");
      const operation = key.includes("<") ? "<" : ">";
      const [field, constraint] = key.split(operation);
      return {
        field,
        operation,
        constraint: Number(constraint),
        nextOperation,
      } as Rule;
    });
    rules.push({ nextOperation: lastStop as WorkFlowId });
    return { id, rules };
  });

  const ratings = getLines(ratingsPart).map((line) => {
    // {x=787,m=2655,a=1222,s=2876}
    const parts = line
      .slice(1, -1)
      .split(",")
      .map((part) => part.split("="))
      .reduce((acc, [key, value]) => {
        acc[key as Field] = Number(value);
        return acc;
      }, {} as Rating);
    return parts;
  });
  return { workflows, ratings };
}

function check(
  workflows: Workflow[],
  currentId: WorkFlowId,
  rating: Rating
): boolean {
  if (currentId === ACCEPT) {
    return true;
  }
  if (currentId === REJECT) {
    return false;
  }
  const workflow = workflows.find((workflow) => workflow.id === currentId)!;
  const rules = workflow.rules;
  for (const rule of rules) {
    if ("operation" in rule) {
      const value = rating[rule.field];
      if (rule.operation === "<") {
        if (value < rule.constraint) {
          return check(workflows, rule.nextOperation, rating);
        }
      } else {
        if (value > rule.constraint) {
          return check(workflows, rule.nextOperation, rating);
        }
      }
    } else {
      return check(workflows, rule.nextOperation, rating);
    }
  }

  return false;
}
function countRanges(ranges?: RatingRange) {
  if (!ranges) {
    return 0;
  }
  return (
    (ranges.x.max - ranges.x.min + 1) *
    (ranges.m.max - ranges.m.min + 1) *
    (ranges.a.max - ranges.a.min + 1) *
    (ranges.s.max - ranges.s.min + 1)
  );
}

function checkRange(
  workflows: Workflow[],
  currentId: WorkFlowId,
  rating: RatingRange
): number {
  if (currentId === ACCEPT) {
    return countRanges(rating);
  }
  if (currentId === REJECT) {
    return 0;
  }
  const workflow = workflows.find((workflow) => workflow.id === currentId)!;
  const rules = workflow.rules;
  let total = 0;
  for (const rule of rules) {
    if ("operation" in rule) {
      const value = rating[rule.field];
      let valid: Range = { min: 0, max: 0 };
      let invalid: Range = { min: 0, max: 0 };
      if (rule.operation === "<") {
        valid = { min: value.min, max: rule.constraint - 1 };
        invalid = { min: rule.constraint, max: value.max };
      } else {
        valid = { min: rule.constraint + 1, max: value.max };
        invalid = { min: value.min, max: rule.constraint };
      }
      if (valid.min <= valid.max) {
        const nextRating = { ...rating, [rule.field]: valid };
        total += checkRange(workflows, rule.nextOperation, nextRating);
      }
      if (invalid.min <= invalid.max) {
        rating[rule.field] = invalid;
      }
    } else {
      total += checkRange(workflows, rule.nextOperation, rating);
    }
  }

  return total;
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const { workflows, ratings } = parseInput(input);
  let total = 0;
  for (const rating of ratings) {
    const isAccepted = check(workflows, START, rating);
    if (isAccepted) {
      total += Object.values(rating).reduce((acc, value) => acc + value, 0);
    }
  }
  return total;
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const { workflows } = parseInput(input);
  let range: RatingRange = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  };
  workflows.push({
    id: ACCEPT,
    rules: [{ nextOperation: ACCEPT }],
  });
  workflows.push({
    id: REJECT,
    rules: [{ nextOperation: REJECT }],
  });
  const total = checkRange(workflows, START, range);
  return total;
}
