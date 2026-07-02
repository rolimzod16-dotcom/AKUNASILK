import type { CmsPartner, CmsStory, CmsTour } from "./types";
import { cmsNow } from "./storage";
import { syncTourCountries } from "@/lib/countries";

const now = cmsNow();

const rawSeedTours = [
  {
    id: "tour-1",
    slug: "golden-caravan",
    published: true,
    image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&q=80",
    duration: 12,
    price: 2890,
    originalPrice: 3290,
    countries: ["Uzbekistan"],
    difficulty: "easy",
    travelStyle: "culture",
    featured: true,
    bestseller: true,
    spotsLeft: 4,
    nextDeparture: "2026-09-15",
    rating: 4.9,
    reviews: 312,
    content: {
      en: {
        title: "Golden Caravan",
        desc: "Samarkand's blue domes, Bukhara's bazaars, and Khiva's walled city — the crown jewels of Central Asia.",
        highlights: ["Registan at dawn", "Silk weaving workshop", "Desert yurt dinner"],
      },
      ru: {
        title: "Золотой караван",
        desc: "Голубые купола Самарканда, базары Бухары и город-крепость Хива — жемчужины Центральной Азии.",
        highlights: ["Регистан на рассвете", "Мастерская шёлка", "Ужин в юрте"],
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tour-2",
    slug: "desert-echoes",
    published: true,
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80",
    duration: 10,
    price: 2450,
    countries: ["Turkmenistan", "Uzbekistan"],
    difficulty: "moderate",
    travelStyle: "overland",
    featured: true,
    spotsLeft: 6,
    nextDeparture: "2026-10-02",
    rating: 4.8,
    reviews: 187,
    content: {
      en: {
        title: "Desert Echoes",
        desc: "Darvaza's flaming crater, ancient Merv ruins, and the endless Karakum sands under starlit skies.",
        highlights: ["Door to Hell at night", "UNESCO Merv", "Camel caravan trek"],
      },
      ru: {
        title: "Эхо пустыни",
        desc: "Пылающий кратер Дарваза, древний Мерв и бескрайние пески Каракумов под звёздным небом.",
        highlights: ["Врата ада ночью", "Мерв (ЮНЕСКО)", "Верблюжий караван"],
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tour-3",
    slug: "heavenly-mountains",
    published: true,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    duration: 8,
    price: 1980,
    originalPrice: 2190,
    countries: ["Kyrgyzstan", "Kazakhstan"],
    difficulty: "moderate",
    travelStyle: "horseRiding",
    featured: true,
    spotsLeft: 8,
    nextDeparture: "2026-08-20",
    rating: 4.9,
    reviews: 245,
    content: {
      en: {
        title: "Heavenly Mountains",
        desc: "Alpine lakes, eagle hunters, and felt-making traditions in the Tian Shan and Almaty highlands.",
        highlights: ["Issyk-Kul lake", "Eagle hunting demo", "Nomadic horse trek"],
      },
      ru: {
        title: "Небесные горы",
        desc: "Альпийские озёра, беркутчики и традиции войлока в горах Тянь-Шаня и Алматы.",
        highlights: ["Озеро Иссык-Куль", "Демонстрация беркутничества", "Конный поход"],
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tour-4",
    slug: "jade-gate",
    published: true,
    image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&q=80",
    duration: 14,
    price: 3490,
    countries: ["China"],
    difficulty: "easy",
    travelStyle: "culture",
    featured: false,
    spotsLeft: 3,
    nextDeparture: "2026-11-10",
    rating: 4.7,
    reviews: 156,
    content: {
      en: {
        title: "Jade Gate Expedition",
        desc: "From Xi'an's Terracotta Warriors to Dunhuang's Mogao Caves — trace China's Silk Road origins.",
        highlights: ["Terracotta Army", "Mogao Caves", "Camel market in Kashgar"],
      },
      ru: {
        title: "Нефритовые врата",
        desc: "От терракотовой армии Сианя до пещер Могао в Дуньхуане — истоки Шёлкового пути в Китае.",
        highlights: ["Терракотовая армия", "Пещеры Могао", "Верблюжий рынок в Кашгаре"],
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tour-5",
    slug: "spice-and-silk",
    published: true,
    image: "https://images.unsplash.com/photo-1565007996395-3ab4ddc7a9b0?w=1200&q=80",
    duration: 11,
    price: 2650,
    countries: ["Georgia", "Azerbaijan"],
    difficulty: "easy",
    travelStyle: "culture",
    featured: false,
    spotsLeft: 5,
    nextDeparture: "2026-09-28",
    rating: 4.8,
    reviews: 198,
    content: {
      en: {
        title: "Spice & Silk",
        desc: "Georgian wine cellars, Baku's flame towers, and Caucasus mountain villages where East meets West.",
        highlights: ["Wine tasting in Kakheti", "Old Baku walk", "Sheki Khan Palace"],
      },
      ru: {
        title: "Специи и шёлк",
        desc: "Грузинские винные погреба, пламенные башни Баку и горные сёла Кавказа, где Восток встречает Запад.",
        highlights: ["Дегустация в Кахетии", "Прогулка по старому Баку", "Дворец хана в Шеки"],
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tour-6",
    slug: "pamir-odyssey",
    published: true,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    duration: 9,
    price: 2280,
    countries: ["Tajikistan"],
    difficulty: "adventurous",
    travelStyle: "overland",
    featured: false,
    spotsLeft: 2,
    nextDeparture: "2026-08-05",
    rating: 5.0,
    reviews: 89,
    content: {
      en: {
        title: "Pamir Odyssey",
        desc: "The legendary Pamir Highway — Wakhan Valley views, remote villages, and the roof of the world.",
        highlights: ["Pamir Highway drive", "Wakhan Corridor", "Homestay with Pamiri families"],
      },
      ru: {
        title: "Памирская одиссея",
        desc: "Легендарный Памирский тракт — виды Ваханской долины, отдалённые сёла и крыша мира.",
        highlights: ["Памирский тракт", "Ваханский коридор", "Дом у памирской семьи"],
      },
    },
    createdAt: now,
    updatedAt: now,
  },
] satisfies Omit<CmsTour, "countrySlugs">[];

export const seedTours: CmsTour[] = rawSeedTours.map((tour) =>
  syncTourCountries(tour as CmsTour)
);

export const seedStories: CmsStory[] = [
  {
    id: "story-1",
    slug: "samarkand-blue-domes",
    published: true,
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
    date: "2026-03-15",
    readTime: 6,
    content: {
      en: {
        title: "Why Samarkand's Blue Domes Will Change You",
        excerpt: "A dawn visit to Registan reveals colors that photographs can never capture.",
        body: [
          "Stand in Registan Square before the city wakes and you understand why merchants called Samarkand the jewel of the Silk Road.",
          "Our Golden Caravan tour includes a private dawn visit with a local historian who reads the tilework like a manuscript.",
          "By the time tour buses arrive at nine, you have already walked the same stones as Ibn Battuta.",
        ],
      },
      ru: {
        title: "Почему голубые купола Самарканда меняют вас",
        excerpt: "Рассвет на Регистане открывает цвета, которые фото никогда не передаст.",
        body: [
          "Встаньте на площади Регистан до пробуждения города — и поймёте, почему купцы называли Самарканд жемчужиной Шёлкового пути.",
          "Тур «Золотой караван» включает приватный рассветный визит с местным историком.",
          "К девяти утра, когда приезжают автобусы, вы уже прошли по тем же камням, что и Ибн Баттута.",
        ],
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "story-2",
    slug: "caravan-life-desert",
    published: true,
    image: "https://images.unsplash.com/photo-1451337516015-6b6e9a7a0478?w=800&q=80",
    date: "2026-02-28",
    readTime: 8,
    content: {
      en: {
        title: "A Night in the Karakum Desert",
        excerpt: "Sleeping under a billion stars, listening to the silence of the sands.",
        body: [
          "The Karakum does not reward hurry. On our Desert Echoes itinerary we leave the highway behind and set camp where caravans once rested.",
          "Dinner is cooked in a sand pit: lamb, onions, and rice sealed under embers the way nomads have done for centuries.",
          "Sleep comes easily in a felt yurt. You wake to tea brewed on a dung fire and a horizon that has not changed in a thousand years.",
        ],
      },
      ru: {
        title: "Ночь в пустыне Каракумы",
        excerpt: "Сон под миллиардом звёзд, слушая тишину песков.",
        body: [
          "Каракумы не любят спешку. В маршруте «Эхо пустыни» мы уходим с шоссе и разбиваем лагерь там, где караваны отдыхали.",
          "Ужин готовят в песчаной яме: баранина, лук и рис под углями, как делали кочевники веками.",
          "В юрте из войлока сон приходит легко. Просыпаетесь к чаю на кизяке и горизонту, не менявшемуся тысячу лет.",
        ],
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "story-3",
    slug: "pamir-highway-guide",
    published: true,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    date: "2026-02-10",
    readTime: 10,
    content: {
      en: {
        title: "The Ultimate Pamir Highway Guide",
        excerpt: "Everything you need to know before tackling the world's most scenic road.",
        body: [
          "The Pamir Highway is not a road you conquer — it is one you respect. At 4,000+ metres, altitude affects everyone differently.",
          "Border crossings between Tajikistan and Kyrgyzstan require paperwork we handle in advance.",
          "The payoff is Afghanistan visible across the river, glaciers at arm's length, and homestays where Pamiri families serve apricot jam with every meal.",
        ],
      },
      ru: {
        title: "Полный гид по Памирскому тракту",
        excerpt: "Всё, что нужно знать перед самой живописной дорогой мира.",
        body: [
          "Памирский тракт не покоряют — его уважают. На высоте 4000+ метров горная болезнь касается каждого по-разному.",
          "Погранпереходы между Таджикистаном и Кыргызстаном требуют документов — мы оформляем заранее.",
          "Награда — Афганистан через реку, ледники в шаге и домашние ночёвки с абрикосовым вареньем к каждому приёму пищи.",
        ],
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "story-4",
    slug: "silk-road-cuisine",
    published: true,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    date: "2026-01-22",
    readTime: 5,
    content: {
      en: {
        title: "Tasting the Silk Road: 10 Dishes You Must Try",
        excerpt: "From plov in Tashkent to khinkali in Tbilisi — a culinary caravan.",
        body: [
          "Every GREATSILKTRAILS package treats food as culture, not fuel. In Uzbekistan that means plov cooked in massive kazans.",
          "Do not skip lagman in Kashgar, manti steamed in Bishkek, or khachapuri on the Georgian extension.",
          "Vegetarians and halal diets are accommodated with 48 hours' notice. Bring an appetite; portion sizes on the Silk Road are generous by design.",
        ],
      },
      ru: {
        title: "Вкусы Шёлкового пути: 10 блюд, которые стоит попробовать",
        excerpt: "От плова в Ташкенте до хинкали в Тбилиси — кулинарный караван.",
        body: [
          "В каждом пакете GREATSILKTRAILS еда — культура, а не топливо. В Узбекистане это плов в огромных казанах.",
          "Не пропустите лагман в Кашгаре, манты в Бишкеке и хачапури на грузинском расширении.",
          "Вегетарианцев и халяль питаем по запросу за 48 часов. Приходите голодными — порции щедрые по традиции.",
        ],
      },
    },
    createdAt: now,
    updatedAt: now,
  },
];

export const seedPartners: CmsPartner[] = [
  {
    id: "partner-1",
    slug: "registan-palace",
    published: true,
    category: "hotel",
    country: "Uzbekistan",
    initials: "RP",
    featured: true,
    content: {
      en: {
        name: "Registan Palace Hotel",
        desc: "Steps from Samarkand's Registan Square — our signature base for Golden Caravan departures.",
      },
      ru: {
        name: "Registan Palace Hotel",
        desc: "В шаге от площади Регистан в Самарканде — база для «Золотого каравана».",
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "partner-2",
    slug: "asia-adventures",
    published: true,
    category: "dmc",
    country: "Uzbekistan",
    initials: "AA",
    featured: true,
    content: {
      en: {
        name: "Asia Adventures DMC",
        desc: "Tashkent-based ground operator managing visas, permits, and private transport.",
      },
      ru: {
        name: "Asia Adventures DMC",
        desc: "Оператор в Ташкенте: визы, разрешения и частный транспорт.",
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "partner-3",
    slug: "pamiri-homestays",
    published: true,
    category: "hospitality",
    country: "Tajikistan",
    initials: "PH",
    featured: true,
    content: {
      en: {
        name: "Pamiri Homestay Network",
        desc: "Community-owned lodges along the Wakhan Valley on the Pamir Highway.",
      },
      ru: {
        name: "Pamiri Homestay Network",
        desc: "Общинные лоджи в Ваханской долине на Памирском тракте.",
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "partner-4",
    slug: "turkish-airlines",
    published: true,
    category: "transport",
    country: "Turkey",
    initials: "TK",
    featured: true,
    website: "https://www.turkishairlines.com",
    content: {
      en: {
        name: "Turkish Airlines",
        desc: "Preferred carrier for Istanbul connections to Central Asia.",
      },
      ru: {
        name: "Turkish Airlines",
        desc: "Предпочтительный перевозчик для стыковок через Стамбул.",
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "partner-5",
    slug: "caravan-serai",
    published: true,
    category: "hotel",
    country: "Uzbekistan",
    initials: "CS",
    featured: true,
    content: {
      en: {
        name: "Caravan Serai Group",
        desc: "Restored caravanserai properties in Bukhara and Khiva.",
      },
      ru: {
        name: "Caravan Serai Group",
        desc: "Восстановленные караван-сараи в Бухаре и Хиве.",
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "partner-6",
    slug: "nomad-trails",
    published: true,
    category: "dmc",
    country: "Kyrgyzstan",
    initials: "NT",
    featured: true,
    content: {
      en: {
        name: "Nomad Trails Kyrgyzstan",
        desc: "Horse trekking and jailoo camps for our Heavenly Mountains itinerary.",
      },
      ru: {
        name: "Nomad Trails Kyrgyzstan",
        desc: "Конные походы и джайлоо для тура «Небесные горы».",
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "partner-7",
    slug: "uzbekistan-tourism",
    published: true,
    category: "cultural",
    country: "Uzbekistan",
    initials: "UT",
    featured: false,
    content: {
      en: {
        name: "Uzbekistan Tourism Board",
        desc: "Official partner for heritage site access and festival calendars.",
      },
      ru: {
        name: "Uzbekistan Tourism Board",
        desc: "Официальный партнёр для доступа к памятникам и фестивалям.",
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "partner-8",
    slug: "silk-road-xian",
    published: true,
    category: "dmc",
    country: "China",
    initials: "SX",
    featured: false,
    content: {
      en: {
        name: "Silk Road Expeditions",
        desc: "Xi'an-based specialists for Jade Gate departures and China border formalities.",
      },
      ru: {
        name: "Silk Road Expeditions",
        desc: "Специалисты в Сиане для «Нефритовых врат» и формальностей на границе.",
      },
    },
    createdAt: now,
    updatedAt: now,
  },
];