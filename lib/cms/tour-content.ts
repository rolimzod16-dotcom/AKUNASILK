import type { CmsLocale, CmsTour, TourContent, TourFaqItem, TourItineraryDay } from "./types";

const DEFAULT_INCLUDED_EN = [
  "Licensed local guide & driver",
  "4x4 vehicle with fuel (where applicable)",
  "Boutique hotels & guesthouses",
  "Breakfast daily + most dinners",
  "Entrance fees on the itinerary",
  "Airport transfers on tour dates",
  "24/7 trip support in English",
];

const DEFAULT_INCLUDED_RU = [
  "Лицензированный гид и водитель",
  "Автомобиль 4x4 с топливом (где применимо)",
  "Бутик-отели и гостевые дома",
  "Завтраки ежедневно + большинство ужинов",
  "Входные билеты по маршруту",
  "Трансферы в дни тура",
  "Поддержка 24/7 на английском",
];

const DEFAULT_EXCLUDED_EN = [
  "International flights",
  "Travel insurance",
  "Visa fees & GBAO permit (we assist)",
  "Personal expenses & tips",
  "Alcoholic beverages",
];

const DEFAULT_EXCLUDED_RU = [
  "Международные авиабилеты",
  "Страховка",
  "Визы и разрешение ГБАО (помогаем оформить)",
  "Личные расходы и чаевые",
  "Алкогольные напитки",
];

const DEFAULT_FAQ_EN: TourFaqItem[] = [
  {
    question: "Is this tour suitable for beginners?",
    answer:
      "Most of our packages are designed for curious travelers with average fitness. Adventurous routes (Pamir, trekking) require comfort at altitude and long driving days.",
  },
  {
    question: "Do you help with visas and permits?",
    answer:
      "Yes. We provide invitation letters, GBAO permit support for Tajikistan, and step-by-step guidance for every country on your route.",
  },
  {
    question: "What is the group size?",
    answer:
      "Small groups up to 12 guests on scheduled departures. Private departures available on request.",
  },
  {
    question: "Can I customize the itinerary?",
    answer:
      "Absolutely. Contact us before booking — we can adjust hotels, add rest days, or combine countries.",
  },
];

const DEFAULT_FAQ_RU: TourFaqItem[] = [
  {
    question: "Подходит ли тур новичкам?",
    answer:
      "Большинство маршрутов рассчитаны на обычную физическую форму. Экстремальные направления (Памир, треккинг) требуют переносимости высоты и длинных переездов.",
  },
  {
    question: "Помогаете с визами и разрешениями?",
    answer:
      "Да. Оформляем приглашения, разрешение ГБАО для Таджикистана и консультируем по визам всех стран маршрута.",
  },
  {
    question: "Какой размер группы?",
    answer:
      "Небольшие группы до 12 человек на групповых датах. Частные выезды — по запросу.",
  },
  {
    question: "Можно изменить маршрут?",
    answer:
      "Да. Напишите до бронирования — подстроим отели, добавим дни отдыха или объединим страны.",
  },
];

function capitalForCountry(country: string, locale: CmsLocale): string {
  const map: Record<string, { en: string; ru: string }> = {
    China: { en: "Xi'an", ru: "Сиань" },
    Kyrgyzstan: { en: "Bishkek", ru: "Бишкек" },
    Uzbekistan: { en: "Tashkent", ru: "Ташкент" },
    Tajikistan: { en: "Dushanbe", ru: "Душанбе" },
    Kazakhstan: { en: "Almaty", ru: "Алматы" },
    Turkmenistan: { en: "Ashgabat", ru: "Ашхабад" },
    Pakistan: { en: "Islamabad", ru: "Исламабад" },
    Iran: { en: "Tehran", ru: "Техран" },
    Turkey: { en: "Istanbul", ru: "Стамбул" },
    Georgia: { en: "Tbilisi", ru: "Тбилиси" },
    Armenia: { en: "Yerevan", ru: "Ереван" },
  };
  const entry = map[country];
  return entry ? entry[locale] : country;
}

function buildGenericItinerary(tour: CmsTour, locale: CmsLocale): TourItineraryDay[] {
  const capital = capitalForCountry(tour.countries[0] ?? "Central Asia", locale);
  const days: TourItineraryDay[] = [];

  for (let d = 1; d <= tour.duration; d++) {
    if (d === 1) {
      days.push({
        day: d,
        title: locale === "ru" ? `День ${d}: Прибытие в ${capital}` : `Day ${d}: Arrival in ${capital}`,
        description:
          locale === "ru"
            ? `Встреча в аэропорту, трансфер в отель. Брифинг с гидом и ужин приветствия.`
            : `Airport meet-and-greet, transfer to your hotel. Welcome briefing with your guide and dinner.`,
      });
    } else if (d === tour.duration) {
      days.push({
        day: d,
        title: locale === "ru" ? `День ${d}: Отъезд из ${capital}` : `Day ${d}: Departure from ${capital}`,
        description:
          locale === "ru"
            ? `Завтрак, трансфер в аэропорт. До встречи на следующем маршруте Шёлкового пути.`
            : `Breakfast and airport transfer. Until we meet again on the Silk Road.`,
      });
    } else if (d === 2) {
      days.push({
        day: d,
        title:
          locale === "ru"
            ? `День ${d}: Выезд на маршрут`
            : `Day ${d}: Journey begins`,
        description:
          locale === "ru"
            ? `Ранний выезд вглубь маршрута. Остановки для фото, рынков и ключевых точек из программы. Ночёвка в отеле или гостевом доме.`
            : `Early departure into the heart of the route. Photo stops, bazaars, and signature sights en route. Overnight in a hotel or guesthouse.`,
      });
    } else {
      days.push({
        day: d,
        title:
          locale === "ru"
            ? `День ${d}: Основной маршрут`
            : `Day ${d}: On the trail`,
        description:
          locale === "ru"
            ? `Продолжение путешествия по коридору Шёлкового пути — культурные остановки, природа и встречи с местными жителями.`
            : `Continue along the Silk Road corridor — cultural stops, landscapes, and local encounters.`,
      });
    }
  }
  return days;
}

const PAMIR_ITINERARY_EN: TourItineraryDay[] = [
  { day: 1, title: "Day 1: Arrival in Dushanbe", description: "Arrival in Dushanbe, Tajikistan's capital. Transfer to hotel, welcome briefing and dinner." },
  { day: 2, title: "Day 2: Dushanbe to Kalai-Khumb", description: "Scenic drive toward the Pamir foothills. Stops at mountain viewpoints and riverside villages." },
  { day: 3, title: "Day 3: Kalai-Khumb to Khorog", description: "Follow the Panj River into Gorno-Badakhshan. Arrive in Khorog — gateway to the Pamir Highway." },
  { day: 4, title: "Day 4: Khorog & Wakhan excursion", description: "Explore Khorog bazaar and botanical garden. Optional side trip toward the Wakhan Corridor viewpoints." },
  { day: 5, title: "Day 5: Khorog to Murghab", description: "4x4 ascent on the Pamir Highway. Cross high passes with dramatic Hindu Kush panoramas." },
  { day: 6, title: "Day 6: Murghab & Karakul Lake", description: "Visit Murghab's high-altitude market. Continue to turquoise Karakul Lake at 3,900 m." },
  { day: 7, title: "Day 7: Karakul to Alichur", description: "Drive the lunar landscapes of the Eastern Pamir. Overnight in a homestay with Pamiri families." },
  { day: 8, title: "Day 8: Alichur to Langar (Wakhan)", description: "Descend toward the Wakhan Valley. Views of Afghanistan's Hindu Kush across the Panj River." },
  { day: 9, title: "Day 9: Wakhan Valley exploration", description: "Fortresses, petroglyphs, and village walks along one of the Silk Road's most remote corridors." },
  { day: 10, title: "Day 10: Return toward Khorog", description: "Leisurely return through the Pamir Highway with flexible photo and tea-house stops." },
  { day: 11, title: "Day 11: Khorog to Dushanbe", description: "Long scenic descent from the Pamirs back to the capital. Farewell dinner." },
  { day: 12, title: "Day 12: Departure", description: "Breakfast and airport transfer. End of the flagship Pamir Silk Trail." },
];

const PAMIR_ITINERARY_RU: TourItineraryDay[] = [
  { day: 1, title: "День 1: Прибытие в Душанбе", description: "Прибытие в столицу Таджикистана. Трансфер в отель, брифинг и приветственный ужин." },
  { day: 2, title: "День 2: Душанбе — Калай-Хумб", description: "Живописный выезд к предгорьям Памира. Остановки на смотровых и в прибрежных сёлах." },
  { day: 3, title: "День 3: Калай-Хумб — Хорог", description: "Вдоль реки Пяндж в ГБАО. Прибытие в Хорог — ворота Памирского тракта." },
  { day: 4, title: "День 4: Хорог и Вахан", description: "Базар и ботанический сад Хорога. Опциональный выезд к смотровым Ваханского коридора." },
  { day: 5, title: "День 5: Хорог — Мургаб", description: "Подъём на 4x4 по Памирскому тракту. Высокие перевалы и панорамы Гиндукуша." },
  { day: 6, title: "День 6: Мургаб и озеро Каракуль", description: "Рынок Мургаба на высоте. Далее к бирюзовому Каракулю (3 900 м)." },
  { day: 7, title: "День 7: Каракуль — Аличур", description: "Лунные пейзажи Восточного Памира. Ночёвка у памирской семьи." },
  { day: 8, title: "День 8: Аличур — Лангара (Вахан)", description: "Спуск в Ваханскую долину. Виды на Гиндукуш в Афганистане через Пяндж." },
  { day: 9, title: "День 9: Ваханский коридор", description: "Крепости, петроглифы и прогулки по одному из самых отдалённых участков Шёлкового пути." },
  { day: 10, title: "День 10: Возвращение к Хорогу", description: "Неспешный возврат по тракту с гибкими остановками для фото и чая." },
  { day: 11, title: "День 11: Хорог — Душанбе", description: "Спуск из Памира в столицу. Прощальный ужин." },
  { day: 12, title: "День 12: Отъезд", description: "Завтрак и трансфер в аэропорт. Конец флагманского Pamir Silk Trail." },
];

function galleryForTour(tour: CmsTour): string[] {
  const base = tour.image;
  const extras: Record<string, string[]> = {
    "pamir-silk-trail-tajikistan-flagship": [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
    ],
    "golden-cities-silk-trail-uzbekistan": [
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
      "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=1200&q=80",
    ],
  };
  return [base, ...(extras[tour.slug] ?? ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80"])];
}

export function resolveTourContent(tour: CmsTour, locale: string): Required<TourContent> {
  const loc = (locale === "ru" ? "ru" : "en") as CmsLocale;
  const raw = tour.content[loc] ?? tour.content.en;

  const itinerary =
    raw.itinerary && raw.itinerary.length > 0
      ? raw.itinerary
      : tour.slug === "pamir-silk-trail-tajikistan-flagship"
        ? loc === "ru"
          ? PAMIR_ITINERARY_RU
          : PAMIR_ITINERARY_EN
        : buildGenericItinerary(tour, loc);

  return {
    title: raw.title,
    desc: raw.desc,
    overview:
      raw.overview ??
      (loc === "ru"
        ? `${raw.desc} Маршрут проходит по ${tour.countries.join(", ")} и рассчитан на ${tour.duration} дней. Группы до ${tour.maxGroupSize ?? 12} человек, сопровождение англоязычного гида и проверенная логистика GREATSILKTRAILS.`
        : `${raw.desc} This ${tour.duration}-day route covers ${tour.countries.join(", ")} with groups up to ${tour.maxGroupSize ?? 12} guests, English-speaking guides, and GREATSILKTRAILS ground logistics.`),
    highlights: raw.highlights,
    itinerary,
    included: raw.included ?? (loc === "ru" ? DEFAULT_INCLUDED_RU : DEFAULT_INCLUDED_EN),
    excluded: raw.excluded ?? (loc === "ru" ? DEFAULT_EXCLUDED_RU : DEFAULT_EXCLUDED_EN),
    gallery: raw.gallery && raw.gallery.length > 0 ? raw.gallery : galleryForTour(tour),
    faq: raw.faq && raw.faq.length > 0 ? raw.faq : loc === "ru" ? DEFAULT_FAQ_RU : DEFAULT_FAQ_EN,
  };
}