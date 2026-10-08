/**
 * Adds published sample journeys tagged with seasons and months.
 * Merges into Supabase cms_documents/tours.json when configured,
 * otherwise into data/cms/tours.json. Does not print secrets.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(path.join(process.cwd(), ".env.local"));

const now = new Date().toISOString();

function tour(spec) {
  return {
    id: spec.id,
    slug: spec.slug,
    status: "published",
    published: true,
    image: spec.image,
    duration: spec.duration,
    price: 2190,
    showPrice: false,
    countrySlugs: spec.countries,
    countries: spec.countryNames,
    difficulty: spec.difficulty,
    travelStyle: spec.travelStyle,
    featured: false,
    bestseller: false,
    spotsLeft: 8,
    maxGroupSize: 12,
    departureMonths: spec.months,
    nextDeparture: spec.nextDeparture,
    rating: 4.8,
    reviews: 0,
    seoTitle: "",
    seoDescription: "",
    startLocation: spec.start,
    finishLocation: spec.finish,
    content: {
      en: {
        title: spec.enTitle,
        desc: spec.enDesc,
        overview: spec.enDesc,
        highlights: spec.enHighlights,
        itinerary: [],
        included: [],
        excluded: [],
        gallery: [],
        faq: [],
      },
      ru: {
        title: spec.ruTitle,
        desc: spec.ruDesc,
        overview: spec.ruDesc,
        highlights: spec.ruHighlights,
        itinerary: [],
        included: [],
        excluded: [],
        gallery: [],
        faq: [],
      },
    },
    createdAt: now,
    updatedAt: now,
  };
}

const samples = [
  tour({
    id: "tour-sample-winter-almaty",
    slug: "sample-winter-almaty",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    duration: 6,
    countries: ["kazakhstan"],
    countryNames: ["Kazakhstan"],
    difficulty: "easy",
    travelStyle: "culture",
    months: [12, 1, 2],
    nextDeparture: "2026-12-10",
    start: "Almaty",
    finish: "Almaty",
    enTitle: "Winter Almaty",
    enDesc: "A short winter city stay in Almaty, with the mountains above the city and a quiet steppe day outside it.",
    enHighlights: ["Almaty winter markets", "Medeu and Shymbulak", "Steppe day trip"],
    ruTitle: "Зимний Алматы",
    ruDesc: "Короткая зимняя поездка по Алматы: город, горы над ним и один спокойный день в степи.",
    ruHighlights: ["Зимние рынки Алматы", "Медеу и Шымбулак", "День в степи"],
  }),
  tour({
    id: "tour-sample-spring-samarkand",
    slug: "sample-spring-samarkand",
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
    duration: 9,
    countries: ["uzbekistan"],
    countryNames: ["Uzbekistan"],
    difficulty: "easy",
    travelStyle: "culture",
    months: [3, 4, 5],
    nextDeparture: "2027-04-08",
    start: "Tashkent",
    finish: "Bukhara",
    enTitle: "Spring in Samarkand",
    enDesc: "Spring gardens and tiled courtyards from Tashkent through Samarkand to Bukhara.",
    enHighlights: ["Registan in spring light", "Samarkand gardens", "Bukhara old city"],
    ruTitle: "Весенний Самарканд",
    ruDesc: "Весенние сады и плиточные дворы: Ташкент, Самарканд и Бухара.",
    ruHighlights: ["Регистан в весеннем свете", "Сады Самарканда", "Старый город Бухары"],
  }),
  tour({
    id: "tour-sample-may-pamir",
    slug: "sample-may-pamir",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
    duration: 11,
    countries: ["tajikistan"],
    countryNames: ["Tajikistan"],
    difficulty: "moderate",
    travelStyle: "overland",
    months: [5],
    nextDeparture: "2027-05-12",
    start: "Dushanbe",
    finish: "Khorog",
    enTitle: "May in the Pamir foothills",
    enDesc: "An eleven-day May overland from Dushanbe into the Pamir foothills, before the high passes open fully.",
    enHighlights: ["Dushanbe start", "Foothill villages", "Road toward Khorog"],
    ruTitle: "Май в предгорьях Памира",
    ruDesc: "Одиннадцать дней в мае: из Душанбе в предгорья Памира, пока высокие перевалы ещё закрыты.",
    ruHighlights: ["Старт в Душанбе", "Кишлаки предгорий", "Дорога к Хорогу"],
  }),
  tour({
    id: "tour-sample-summer-issyk-kul",
    slug: "sample-summer-issyk-kul",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    duration: 14,
    countries: ["kyrgyzstan"],
    countryNames: ["Kyrgyzstan"],
    difficulty: "moderate",
    travelStyle: "horseRiding",
    months: [6, 7, 8],
    nextDeparture: "2027-07-06",
    start: "Bishkek",
    finish: "Karakol",
    enTitle: "Summer on Issyk-Kul",
    enDesc: "Two weeks of summer jailoo, the lake shore, and horse days between Bishkek and Karakol.",
    enHighlights: ["Issyk-Kul shore", "Summer jailoo", "Horse days toward Karakol"],
    ruTitle: "Лето на Иссык-Куле",
    ruDesc: "Две летние недели: джайлоо, берег Иссык-Куля и конные дни между Бишкеком и Караколом.",
    ruHighlights: ["Берег Иссык-Куля", "Летнее джайлоо", "Конные дни к Караколу"],
  }),
  tour({
    id: "tour-sample-autumn-steppe",
    slug: "sample-autumn-steppe",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80",
    duration: 15,
    countries: ["kazakhstan"],
    countryNames: ["Kazakhstan"],
    difficulty: "moderate",
    travelStyle: "overland",
    months: [9, 10, 11],
    nextDeparture: "2026-10-20",
    start: "Almaty",
    finish: "Turkestan",
    enTitle: "Autumn on the Kazakh steppe",
    enDesc: "A long autumn crossing of the steppe from Almaty toward Turkestan, while the days are still clear.",
    enHighlights: ["Autumn steppe camps", "Long overland days", "Turkestan finish"],
    ruTitle: "Осенняя степь Казахстана",
    ruDesc: "Длинный осенний переход по степи из Алматы к Туркестану, пока дни ещё ясные.",
    ruHighlights: ["Осенние стоянки в степи", "Длинные переезды", "Финиш в Туркестане"],
  }),
  tour({
    id: "tour-sample-november-bishkek",
    slug: "sample-november-bishkek",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
    duration: 8,
    countries: ["kyrgyzstan"],
    countryNames: ["Kyrgyzstan"],
    difficulty: "easy",
    travelStyle: "culture",
    months: [11],
    nextDeparture: "2026-11-08",
    start: "Bishkek",
    finish: "Bishkek",
    enTitle: "November in Bishkek",
    enDesc: "Eight quiet November days in and around Bishkek, after the summer pastures have closed.",
    enHighlights: ["Bishkek city days", "Nearby valleys", "Late-autumn markets"],
    ruTitle: "Ноябрь в Бишкеке",
    ruDesc: "Восемь спокойных ноябрьских дней в Бишкеке и рядом, когда летние пастбища уже закрыты.",
    ruHighlights: ["Городские дни в Бишкеке", "Ближние долины", "Поздние осенние рынки"],
  }),
  tour({
    id: "tour-sample-winter-tashkent",
    slug: "sample-winter-tashkent",
    image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&q=80",
    duration: 5,
    countries: ["uzbekistan"],
    countryNames: ["Uzbekistan"],
    difficulty: "easy",
    travelStyle: "culture",
    months: [1, 2],
    nextDeparture: "2027-02-10",
    start: "Tashkent",
    finish: "Samarkand",
    enTitle: "Winter Tashkent",
    enDesc: "A short winter city route from Tashkent to Samarkand, built around museums, bazaars, and the train.",
    enHighlights: ["Tashkent metro and bazaars", "Afrosiyob to Samarkand", "Winter courtyards"],
    ruTitle: "Зимний Ташкент",
    ruDesc: "Короткий зимний городской маршрут из Ташкента в Самарканд: базары, музеи и поезд.",
    ruHighlights: ["Метро и базары Ташкента", "Афросиёб до Самарканда", "Зимние дворы"],
  }),
  tour({
    id: "tour-sample-april-valleys",
    slug: "sample-april-valleys",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    duration: 7,
    countries: ["tajikistan"],
    countryNames: ["Tajikistan"],
    difficulty: "easy",
    travelStyle: "culture",
    months: [4, 5],
    nextDeparture: "2027-04-18",
    start: "Dushanbe",
    finish: "Dushanbe",
    enTitle: "April valleys of Tajikistan",
    enDesc: "One week in April through the lower valleys around Dushanbe, while the high Pamir is still closed.",
    enHighlights: ["Dushanbe", "Spring valleys", "Village lunches"],
    ruTitle: "Апрель в долинах Таджикистана",
    ruDesc: "Неделя в апреле по нижним долинам вокруг Душанбе, пока высокий Памир ещё закрыт.",
    ruHighlights: ["Душанбе", "Весенние долины", "Обеды в кишлаках"],
  }),
];

const SEASONS = {
  spring: [3, 4, 5],
  summer: [6, 7, 8],
  autumn: [9, 10, 11],
  winter: [12, 1, 2],
};

function tourMonths(item) {
  if (Array.isArray(item.departureMonths) && item.departureMonths.length > 0) {
    return item.departureMonths.map(Number);
  }
  const month = Number(String(item.nextDeparture || "").slice(5, 7));
  return month >= 1 && month <= 12 ? [month] : [];
}

function matchesDuration(days, filter) {
  if (!filter || filter === "all") return true;
  if (filter === "short") return days <= 7;
  if (filter === "medium") return days >= 8 && days <= 12;
  return days >= 13;
}

function matches(item, query) {
  if (query.country && !(item.countrySlugs || []).includes(query.country)) return false;
  if (!matchesDuration(item.duration, query.duration || "all")) return false;
  const months = tourMonths(item);
  if (query.month && query.month !== "all") {
    return months.includes(Number(query.month));
  }
  if (query.season) {
    const seasonMonths = SEASONS[query.season] || [];
    return months.some((month) => seasonMonths.includes(month));
  }
  return true;
}

function expectHit(tours, query, slug) {
  const hits = tours.filter((item) => matches(item, query)).map((item) => item.slug);
  if (!hits.includes(slug)) {
    throw new Error(`Expected ${slug} for ${JSON.stringify(query)}. Got ${hits.join(", ") || "none"}`);
  }
}

function expectMiss(tours, query, slug) {
  const hits = tours.filter((item) => matches(item, query)).map((item) => item.slug);
  if (hits.includes(slug)) {
    throw new Error(`Did not expect ${slug} for ${JSON.stringify(query)}`);
  }
}

function check(tours) {
  expectHit(tours, { month: "12", country: "kazakhstan", duration: "short" }, "sample-winter-almaty");
  expectHit(tours, { month: "4", country: "uzbekistan", duration: "medium" }, "sample-spring-samarkand");
  expectHit(tours, { month: "5", country: "tajikistan", duration: "medium" }, "sample-may-pamir");
  expectHit(tours, { season: "summer", country: "kyrgyzstan", duration: "long" }, "sample-summer-issyk-kul");
  expectHit(tours, { month: "10", country: "kazakhstan", duration: "long" }, "sample-autumn-steppe");
  expectHit(tours, { month: "11", country: "kyrgyzstan", duration: "medium" }, "sample-november-bishkek");
  expectHit(tours, { month: "2", country: "uzbekistan", duration: "short" }, "sample-winter-tashkent");
  expectHit(tours, { month: "4", country: "tajikistan", duration: "short" }, "sample-april-valleys");
  expectHit(tours, { season: "winter" }, "sample-winter-almaty");
  expectHit(tours, { season: "winter" }, "sample-winter-tashkent");
  expectMiss(tours, { month: "6", country: "uzbekistan" }, "sample-spring-samarkand");
  expectMiss(tours, { month: "1", country: "kazakhstan", duration: "long" }, "sample-winter-almaty");
}

const sampleSlugs = new Set(samples.map((item) => item.slug));

function mergeTours(existing) {
  const kept = (Array.isArray(existing) ? existing : []).filter(
    (item) => item && !sampleSlugs.has(item.slug),
  );
  return [...kept, ...samples];
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const localFile = path.join(process.cwd(), "data", "cms", "tours.json");

let store = "local";
let merged;

if (url && key) {
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("cms_documents")
    .select("payload")
    .eq("id", "tours.json")
    .maybeSingle();
  if (error) throw new Error(`Supabase read failed: ${error.message}`);
  merged = mergeTours(data?.payload);
  check(merged);
  const { error: writeError } = await supabase.from("cms_documents").upsert({
    id: "tours.json",
    payload: merged,
    updated_at: new Date().toISOString(),
  });
  if (writeError) throw new Error(`Supabase save failed: ${writeError.message}`);
  store = "supabase";
} else {
  const existing = existsSync(localFile) ? JSON.parse(readFileSync(localFile, "utf8")) : [];
  merged = mergeTours(existing);
  check(merged);
  writeFileSync(localFile, JSON.stringify(merged, null, 2) + "\n", "utf8");
}

console.log(
  `PASS store=${store} total=${merged.length} samples=${samples.length} slugs=${samples
    .map((item) => item.slug)
    .join(",")}`,
);
