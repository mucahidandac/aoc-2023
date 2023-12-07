import { getInput, getLines } from "../utils/io";

function cardToNumber(c: string): number {
  if (!c) {
    return 0;
  }
  switch (c) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      return 11;
    case "T":
      return 10;
    default:
      return Number.isNaN(Number(c)) ? 0 : Number(c);
  }
}

class CardHand {
  bid: number;
  public hand: number[];
  counterMap: Map<number, number>;
  constructor(line: string) {
    const [numbers, bid] = line.split(/\s+/g);
    this.bid = Number(bid);
    this.hand = numbers.split("").map(cardToNumber);
    this.counterMap = this.hand.reduce((map, card) => {
      map.set(card, (map.get(card) ?? 0) + 1);
      return map;
    }, new Map<number, number>());
  }

  applyRules(counts: [number, number][]): number {
    let highest = counts[0][1];
    let second = counts[1]?.[1] || 0;
    if (highest >= 5) {
      // Five of a kind, where all five cards have the same label: AAAAA
      return 7;
    }
    if (highest === 4) {
      // Four of a kind, where four cards have the same label and one card has a different label: AA8AA
      return 6;
    }
    if (highest === 3 && second === 2) {
      // Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
      return 5;
    }
    if (highest === 3) {
      // Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
      return 4;
    }
    if (highest === 2 && second === 2) {
      // Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
      return 3;
    }
    if (highest === 2) {
      // One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
      return 2;
    }

    // High card, where all cards' labels are distinct: 23456
    return 1;
  }
  calculateStrength() {
    let counts: Array<[number, number]> = [...this.counterMap.entries()].sort(
      (a, b) => b[1] - a[1]
    );
    return this.applyRules(counts);
  }
}

class CamelCards {
  private cardHands: CardHand[];
  constructor(lines: string[]) {
    this.cardHands = lines.map((cardLine) => new CardHand(cardLine.trim()));
  }

  calculateViaStrength() {
    // ascending order, losers first.
    const sortedCards = this.cardHands.toSorted((card1, card2) => {
      const str1 = card1.calculateStrength();
      const str2 = card2.calculateStrength();
      if (str1 != str2) {
        return str1 - str2;
      }
      for (let i = 0; i < 5; i++) {
        if (card1.hand[i] != card2.hand[i]) {
          return card1.hand[i] - card2.hand[i];
        }
      }
      return 0;
    });
    // multiply by their rank (index+1)
    return sortedCards.reduce(
      (acc, card, index) => acc + card.bid * (index + 1),
      0
    );
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const game = new CamelCards(getLines(input));
  return game.calculateViaStrength();
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const jokerIdx = "0";
  const cards = [
    "J",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "Q",
    "K",
    "A",
  ];

  const lines = getLines(input).map((line) => {
    const [_hand, _bid] = line.split(" ");
    const camelHand = _hand
      .split("")
      .map((card) => cards.indexOf(card).toString(16));
    const bid = +_bid;

    const nJokers = camelHand.filter((card) => card === jokerIdx).length;

    const countMap: Record<string, number> = {};
    for (const card of camelHand) {
      countMap[card] = (countMap[card] ?? 0) + 1;
    }
    countMap[jokerIdx] = 0;
    const counts = Object.values(countMap).sort((a, b) => b - a);
    counts[jokerIdx] += nJokers;
    return [[counts[0], counts[1] ?? 0, ...camelHand].join(), bid] as const;
  });

  return lines
    .toSorted(([a], [b]) => a.localeCompare(b))
    .reduce((acc, curr, index) => acc + curr[1] * (index + 1), 0);
}
