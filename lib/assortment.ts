export type AssortmentDivision = "ЖЕНСКОЕ" | "МУЖСКОЕ" | "ДЕТСКОЕ" | "КОРПОРАТИВНОЕ";

export type AssortmentCategory = {
  slug: string;
  name: string;
  items: string[];
  orderText: string;
};

export type AssortmentSection = {
  id: string;
  title: AssortmentDivision;
  description: string;
  categories: AssortmentCategory[];
};

export const assortmentSections: AssortmentSection[] = [
  {
    id: "women",
    title: "ЖЕНСКОЕ",
    description: "Ключевые женские категории сезона с плотным хлопком, чистой посадкой и вариациями под разные силуэты.",
    categories: [
      { slug: "women-suits", name: "Костюмы", items: ["Классика", "Оверсайз", "Велюр"], orderText: "Женские костюмы" },
      { slug: "women-hoodies", name: "Худи", items: ["Zip", "Оверсайз"], orderText: "Женские худи" },
      { slug: "women-pants", name: "Брюки", items: ["Палаццо", "Джоггеры", "Батал"], orderText: "Женские брюки" },
      { slug: "women-tops", name: "Топы", items: ["Базовые", "Акцентные"], orderText: "Женские топы" },
      { slug: "women-shoppers", name: "Шоперы", items: ["Базовые", "Принт"], orderText: "Женские шоперы" },
    ],
  },
  {
    id: "men",
    title: "МУЖСКОЕ",
    description: "Базовые мужские формы для повседневной носки, капсульных комплектов и уличных образов.",
    categories: [
      { slug: "men-suits", name: "Костюмы", items: ["Базовые"], orderText: "Мужские костюмы" },
      { slug: "men-hoodies", name: "Худи", items: ["Базовые", "Оверсайз"], orderText: "Мужские худи" },
      { slug: "men-sweatshirts", name: "Свитшоты", items: ["Базовые", "Плотные"], orderText: "Мужские свитшоты" },
      { slug: "men-pants", name: "Брюки", items: ["Карго", "Ровные"], orderText: "Мужские брюки" },
      { slug: "men-vests", name: "Жилетки", items: ["Утепленные", "Городские"], orderText: "Мужские жилетки" },
      { slug: "men-jackets", name: "Куртки", items: ["Ветровки"], orderText: "Мужские куртки" },
      { slug: "men-tshirts", name: "Футболки", items: ["Реглан", "Поло"], orderText: "Мужские футболки" },
      { slug: "men-caps", name: "Кепки", items: ["Базовые", "С лого"], orderText: "Мужские кепки" },
    ],
  },
  {
    id: "kids",
    title: "ДЕТСКОЕ",
    description: "Минималистичные детские позиции, собранные вокруг базовой черно-белой футболки.",
    categories: [{ slug: "kids-tshirts", name: "Футболки", items: ["Черные", "Белые"], orderText: "Детские футболки" }],
  },
  {
    id: "corporate",
    title: "КОРПОРАТИВНОЕ",
    description: "Спец-раздел для брендов, команд и корпоративных партий с нанесением логотипов и принтов.",
    categories: [
      { slug: "b2b-hoodies", name: "Худи", items: ["Логотип", "Принт"], orderText: "Корпоративные худи" },
      { slug: "b2b-sweatshirts", name: "Свитшоты", items: ["Логотип", "Принт"], orderText: "Корпоративные свитшоты" },
      { slug: "b2b-polo", name: "Поло", items: ["Логотип", "Вышивка"], orderText: "Корпоративное поло" },
      { slug: "b2b-caps", name: "Кепки", items: ["Логотип", "Вышивка"], orderText: "Корпоративные кепки" },
      { slug: "b2b-shoppers", name: "Шоперы", items: ["Логотип", "Принт"], orderText: "Корпоративные шоперы" },
      { slug: "b2b-suits", name: "Костюмы", items: ["Логотип", "Тираж"], orderText: "Корпоративные костюмы" },
    ],
  },
];

export function buildWhatsAppLink(text: string) {
  return `https://wa.me/79900266357?text=${encodeURIComponent(text)}`;
}

export function findCategoryBySlug(slug: string) {
  for (const section of assortmentSections) {
    const category = section.categories.find((item) => item.slug === slug);
    if (category) {
      return { section, category };
    }
  }
  return null;
}
