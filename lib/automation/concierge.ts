export type ConciergeTopic =
  | "visa"
  | "price"
  | "cancel"
  | "group"
  | "solo"
  | "when"
  | "included"
  | "payment"
  | "safety";

const TOPIC_KEYWORDS: Record<ConciergeTopic, string[]> = {
  visa: ["visa", "виза", "passport", "паспорт", "invitation", "приглаш"],
  price: ["price", "cost", "how much", "цена", "стоим", "сколько", "usd", "доллар"],
  cancel: ["cancel", "refund", "отмен", "возврат", "вернуть"],
  group: ["group", "size", "people", "групп", "сколько человек", "участник"],
  solo: ["solo", "alone", "single", "один", "соло", "одиноч"],
  when: ["when", "depart", "date", "когда", "выезд", "дата", "сезон"],
  included: ["include", "meal", "hotel", "transfer", "включ", "отель", "питан", "трансфер"],
  payment: ["pay", "deposit", "installment", "оплат", "депозит", "рассроч"],
  safety: ["safe", "security", "insurance", "безопас", "страхов"],
};

export function matchConciergeTopic(input: string): ConciergeTopic | null {
  const lower = input.toLowerCase();
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS) as [
    ConciergeTopic,
    string[],
  ][]) {
    if (keywords.some((kw) => lower.includes(kw))) return topic;
  }
  return null;
}

export type PublicTour = {
  slug: string;
  title: string;
  price: number;
  duration: number;
  spotsLeft?: number;
  maxGroupSize?: number;
  nextDeparture: string;
  difficulty: string;
  countries: string[];
};

export function tourAnswerForTopic(tour: PublicTour, topic: ConciergeTopic): string | null {
  switch (topic) {
    case "price":
      return `tourPrice:${tour.price}`;
    case "when":
      return `tourWhen:${tour.nextDeparture}`;
    case "group":
      return `tourSpots:${tour.maxGroupSize ?? 12}`;
    default:
      return null;
  }
}