/**
 * 餐廳資料。由 Telegram 提供後更新此檔即可。
 * 註：標示「示意」者為暫用範例，待 Philip 提供正式資料後替換。
 */

export const RESTAURANT = {
  name: "Johnny Japan",
  nameJp: "ジョニー・ジャパン",
  latin: "JAPANESE RESTAURANT",
  tagline: "MODERN CUSINE • TOKYO EST. 2024",
  intro:
    "Johnny Japan 於 2024 年創立於東京，以現代視角重新詮釋日本料理。我們嚴選當造食材，揉合傳統技法與當代美學，在簡約靜謐的空間中，呈現一席屬於這個時代的日式餐桌。",
  philosophy: [
    {
      title: "旬 · 順應季節",
      body: "依循四時更迭選材，把當造食材最飽滿的鮮味留在餐桌上。",
    },
    {
      title: "匠 · 職人技藝",
      body: "由刀工到火候，每一道工序皆由職人親手完成，追求精準而克制。",
    },
    {
      title: "簡 · 減法美學",
      body: "以最少的調味帶出原味，讓食材本身成為主角。",
    },
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
  image: string;
};

/** 招牌菜式類別卡片。image 為示意，待補正式相片。 */
export const CATEGORIES: DishCategory[] = [
  {
    id: "sushi",
    name: "壽司",
    nameJp: "すし",
    desc: "職人即席握製，醋飯溫潤，配以當日直送海鮮。",
    price: "由 ¥3,800 起",
    image: "/images/restaurant/photo-1.jpg",
  },
  {
    id: "sashimi",
    name: "刺身",
    nameJp: "さしみ",
    desc: "厚切時令魚鮮，佐以本釀造醬油與現磨山葵。",
    price: "由 ¥2,600 起",
    image: "/images/restaurant/photo-2.jpg",
  },
  {
    id: "yakitori",
    name: "串燒",
    nameJp: "やきとり",
    desc: "備長炭直火慢烤，鎖住肉汁，配自家調製醬汁。",
    price: "由 ¥180 起",
    image: "/images/restaurant/photo-3.jpg",
  },
  {
    id: "tempura",
    name: "天婦羅",
    nameJp: "てんぷら",
    desc: "薄衣輕炸，外脆內嫩，佐天汁或海鹽享用。",
    price: "由 ¥1,800 起",
    image: "/images/restaurant/photo-1.jpg",
  },
  {
    id: "ramen",
    name: "拉麵",
    nameJp: "らーめん",
    desc: "自家製麵配濃郁豚骨或清爽醬油湯底。",
    price: "由 ¥1,200 起",
    image: "/images/restaurant/photo-2.jpg",
  },
  {
    id: "donburi",
    name: "丼飯",
    nameJp: "どんぶり",
    desc: "嚴選米飯鋪上新鮮配料，一碗盡享層次。",
    price: "由 ¥1,500 起",
    image: "/images/restaurant/photo-3.jpg",
  },
];

export type MenuItem = {
  name: string;
  nameJp?: string;
  desc: string;
  price: string;
};

export type MenuSection = {
  id: string;
  title: string;
  titleJp: string;
  items: MenuItem[];
};

/** 菜單內頁資料（示意）。 */
export const MENU: MenuSection[] = [
  {
    id: "appetizer",
    title: "前菜",
    titleJp: "先付",
    items: [
      { name: "胡麻豆腐", nameJp: "ごまどうふ", desc: "自家製芝麻豆腐，配山葵與柚子皮。", price: "¥880" },
      { name: "醋漬海蘊", nameJp: "もずく酢", desc: "沖繩水雲配三杯醋，清爽開胃。", price: "¥780" },
      { name: "茶碗蒸", nameJp: "ちゃわんむし", desc: "滑嫩蒸蛋，加入銀杏、蝦與香菇。", price: "¥980" },
    ],
  },
  {
    id: "sushi",
    title: "壽司・刺身",
    titleJp: "すし・さしみ",
    items: [
      { name: "特上握壽司十二貫", nameJp: "おまかせ握り", desc: "由職人依當日漁獲配搭。", price: "¥5,800" },
      { name: "本鮪三味", nameJp: "本まぐろ", desc: "赤身、中拖羅、大拖羅。", price: "¥3,200" },
      { name: "五點刺身拼盤", desc: "當日時令魚鮮五款。", price: "¥3,600" },
    ],
  },
  {
    id: "grill",
    title: "燒物",
    titleJp: "焼き物",
    items: [
      { name: "備長炭串燒拼盤", nameJp: "串焼き盛り合わせ", desc: "雞腿、雞軟骨、雞皮、蔥段、冬菇。", price: "¥2,400" },
      { name: "鹽燒喉黑魚", nameJp: "のどぐろ塩焼き", desc: "炭火鹽燒，皮脆肉嫩。", price: "¥3,800" },
    ],
  },
  {
    id: "fried",
    title: "揚物",
    titleJp: "揚げ物",
    items: [
      { name: "天婦羅拼盤", nameJp: "天ぷら盛り合わせ", desc: "海老、茄子、南瓜、獅子唐。", price: "¥2,200" },
      { name: "唐揚炸雞", nameJp: "鶏の唐揚げ", desc: "外脆內嫩，配檸檬與七味。", price: "¥980" },
    ],
  },
  {
    id: "noodle",
    title: "麵類",
    titleJp: "麺類",
    items: [
      { name: "豚骨拉麵", nameJp: "豚骨らーめん", desc: "濃郁豚骨湯，自家製細麵。", price: "¥1,200" },
      { name: "冷蕎麥麵", nameJp: "ざるそば", desc: "十割蕎麥，配特調麵汁。", price: "¥1,100" },
    ],
  },
  {
    id: "sweet",
    title: "甜點",
    titleJp: "甘味",
    items: [
      { name: "抹茶蕨餅", nameJp: "わらび餅", desc: "宇治抹茶配黃豆粉。", price: "¥780" },
      { name: "黑芝麻雪糕", nameJp: "黒ごまアイス", desc: "濃郁芝麻香，口感細滑。", price: "¥680" },
    ],
  },
];

/** 環境相片（示意，待補正式相片）。 */
export const GALLERY = [
  { src: "/images/restaurant/photo-1.jpg", alt: "餐廳環境 1" },
  { src: "/images/restaurant/photo-2.jpg", alt: "餐廳環境 2" },
  { src: "/images/restaurant/photo-3.jpg", alt: "餐廳環境 3" },
];
