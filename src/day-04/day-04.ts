import { getInput, getLines } from "../utils/io";

class Card {
  constructor(public line: string, public index: number) {}

  getTotalMatch() {
    // Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
    const [leftSide, rightSide] = this.line.trim().split("|");
    // Card 1: 41 48 83 86 17
    const [_, winnerNumbers] = leftSide.trim().split(":");
    // 41 48 83 86 17
    const winners = winnerNumbers.trim().split(/\s+/g).map(Number);
    // 83 86  6 31 17  9 48 53
    const ourNumbers = rightSide.trim().split(/\s+/g).map(Number);

    return ourNumbers.filter((i) => winners.includes(i)).length;
  }

  getTotalPoint() {
    const total = this.getTotalMatch();
    return total && Math.pow(2, total - 1);
  }
}
class CardManager {
  private cards: Card[];

  constructor(lines: string[]) {
    this.cards = lines.map((line, i) => new Card(line, i));
  }

  getTotalPoint() {
    return this.cards.reduce((acc, card) => acc + card.getTotalPoint(), 0);
  }

  getTotalScratchcards() {
    const result = this.cards.reduce<Record<number, number>>((acc, card) => {
      const totalMatch = card.getTotalMatch() + 1;
      if (!acc[card.index]) {
        acc[card.index] = 1; // original card
      }
      for (let i = 1; i < totalMatch; i++) {
        if (!acc[card.index + i]) {
          acc[card.index + i] = 1; // original card
        }
        acc[card.index + i] += acc[card.index];
      }
      return acc;
    }, {});

    return Object.values(result).reduce((acc, curr) => acc + curr, 0);
  }
}

export function part1(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const cardManager = new CardManager(getLines(input));
  const total = cardManager.getTotalPoint();
  return total;
}
export function part2(inputFileName: string): number {
  const input = getInput(__dirname, inputFileName);
  const cardManager = new CardManager(getLines(input));
  const total = cardManager.getTotalScratchcards();
  return total;
}
