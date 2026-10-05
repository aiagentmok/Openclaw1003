/**
 * 餐廳資料。由 Telegram 提供後更新此檔即可。
 * 註：標示「示意」者為暫用範例，待 Philip 提供正式資料後替換。
 */

export const RESTAURANT = {
  name: "Johnny Japan",
  nameJp: "ジョニー・ジャパン",
  latin: "JAPANESE RESTAURANT",
  tagline: "MODERN CUSINE • TOKYO EST. 2024",
  currency: "¥",
  intro:
    "Johnny Japan 於 2024 年創立於東京，以現代視角重新詮釋日本料理。我們嚴選當造食材，揉合傳統技法與當代美學，在簡約靜謐的空間中，呈現一席屬於這個時代的日式餐桌。",
  philosophy: [
    { title: "旬 · 順應季節", body: "依循四時更迭選材，把當造食材最飽滿的鮮味留在餐桌上。" },
    { title: "匠 · 職人技藝", body: "由刀工到火候，每一道工序皆由職人親手完成，追求精準而克制。" },
    { title: "簡 · 減法美學", body: "以最少的調味帶出原味，讓食材本身成為主角。" },
  ],
  hours: [
    { days: "星期一至星期四", time: "11:30 – 15:00 ／ 17:30 – 22:00" },
    { days: "星期五至星期六", time: "11:30 – 15:00 ／ 17:30 – 23:00" },
    { days: "星期日及公眾假期", time: "11:30 – 21:00" },
    { days: "星期二", time: "公休" },
  ],
  address: "東京都渋谷区神宮前 1-2-3（示意）",
  phone: "+81 3-1234-5678（示意）",
  email: "hello@johnnyjapan.example",
  mapUrl: "https://maps.google.com/?q=Tokyo+Shibuya+Jingumae",
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
} as const;

export type DishCategory = {
  id: string;
  name: string;
  nameJp: string;
  desc: string;
  price: string;
  /** 相片路徑；未提供時前台顯示樣式化佔位。 */
  image?: string;
};

/** 招牌菜式類別卡片。image 為示意，待補正式相片。 */
export const CATEGORIES: DishCategory[] = [
  { id: "sushi", name: "壽司", nameJp: "すし", desc: "職人即席握製，醋飯溫潤，配以當日直送海鮮。", price: "由 ¥3,800 起", image: "/images/restaurant/photo-3.jpg" },
  { id: "sashimi", name: "刺身", nameJp: "さしみ", desc: "厚切時令魚鮮，佐以本釀造醬油與現磨山葵。", price: "由 ¥2,600 起", image: "/images/restaurant/photo-1.jpg" },
  { id: "yakitori", name: "串燒", nameJp: "やきとり", desc: "備長炭直火慢烤，鎖住肉汁，配自家調製醬汁。", price: "由 ¥180 起" },
  { id: "tempura", name: "天婦羅", nameJp: "てんぷら", desc: "薄衣輕炸，外脆內嫩，佐天汁或海鹽享用。", price: "由 ¥1,800 起" },
  { id: "ramen", name: "拉麵", nameJp: "らーめん", desc: "自家製麵配濃郁豚骨或清爽醬油湯底。", price: "由 ¥1,200 起" },
  { id: "dessert", name: "甜點", nameJp: "甘味", desc: "抹茶與和菓子，為一餐畫上優雅句點。", price: "由 ¥680 起", image: "/images/restaurant/photo-2.jpg" },
];

export type MenuItem = {
  id: string;
  name: string;
  nameJp?: string;
  desc: string;
  /** 顯示用價錢字串 */
  price: string;
  /** 數值價錢（購物車計算用） */
  priceValue: number;
};

export type MenuSection = {
  id: string;
  title: string;
  titleJp: string;
  items: MenuItem[];
};

const item = (id: string, name: string, priceValue: number, desc: string, nameJp?: string): MenuItem => ({
  id,
  name,
  nameJp,
  desc,
  priceValue,
  price: `¥${priceValue.toLocaleString("en-US")}`,
});

/** 菜單資料（示意，可於線上點餐使用）。 */
export const MENU: MenuSection[] = [
  {
    id: "appetizer",
    title: "前菜",
    titleJp: "先付",
    items: [
      item("app-1", "胡麻豆腐", 880, "自家製芝麻豆腐，配山葵與柚子皮。", "ごまどうふ"),
      item("app-2", "醋漬海蘊", 780, "沖繩水雲配三杯醋，清爽開胃。", "もずく酢"),
      item("app-3", "茶碗蒸", 980, "滑嫩蒸蛋，加入銀杏、蝦與香菇。", "ちゃわんむし"),
    ],
  },
  {
    id: "sushi",
    title: "壽司・刺身",
    titleJp: "すし・さしみ",
    items: [
      item("sus-1", "特上握壽司十二貫", 5800, "由職人依當日漁獲配搭。", "おまかせ握り"),
      item("sus-2", "本鮪三味", 3200, "赤身、中拖羅、大拖羅。", "本まぐろ"),
      item("sus-3", "五點刺身拼盤", 3600, "當日時令魚鮮五款。"),
    ],
  },
  {
    id: "grill",
    title: "燒物",
    titleJp: "焼き物",
    items: [
      item("grl-1", "備長炭串燒拼盤", 2400, "雞腿、雞軟骨、雞皮、蔥段、冬菇。", "串焼き盛り合わせ"),
      item("grl-2", "鹽燒喉黑魚", 3800, "炭火鹽燒，皮脆肉嫩。", "のどぐろ塩焼き"),
    ],
  },
  {
    id: "fried",
    title: "揚物",
    titleJp: "揚げ物",
    items: [
      item("fry-1", "天婦羅拼盤", 2200, "海老、茄子、南瓜、獅子唐。", "天ぷら盛り合わせ"),
      item("fry-2", "唐揚炸雞", 980, "外脆內嫩，配檸檬與七味。", "鶏の唐揚げ"),
    ],
  },
  {
    id: "noodle",
    title: "麵類",
    titleJp: "麺類",
    items: [
      item("nod-1", "豚骨拉麵", 1200, "濃郁豚骨湯，自家製細麵。", "豚骨らーめん"),
      item("nod-2", "冷蕎麥麵", 1100, "十割蕎麥，配特調麵汁。", "ざるそば"),
    ],
  },
  {
    id: "sweet",
    title: "甜點",
    titleJp: "甘味",
    items: [
      item("swt-1", "抹茶蕨餅", 780, "宇治抹茶配黃豆粉。", "わらび餅"),
      item("swt-2", "黑芝麻雪糕", 680, "濃郁芝麻香，口感細滑。", "黒ごまアイス"),
    ],
  },
];

/** 依 id 取得菜式。 */
export function findMenuItem(id: string): MenuItem | undefined {
  for (const s of MENU) {
    const found = s.items.find((i) => i.id === id);
    if (found) return found;
  }
  return undefined;
}

/** 環境相片（示意，待補正式相片）。 */
export const GALLERY = [
  { src: "/images/restaurant/photo-1.jpg", alt: "刺身拼盤（附味噌湯與毛豆）" },
  { src: "/images/restaurant/photo-3.jpg", alt: "握壽司（附山葵與薑）" },
  { src: "/images/restaurant/photo-2.jpg", alt: "抹茶甜點" },
];
