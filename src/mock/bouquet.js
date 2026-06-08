const TITLES = [
  'Летнее настроение',
  'Белые облака',
  'Нежные ирисы',
  'Розовый рассвет',
  'Солнечный день',
  'Лавандовое поле',
];

const DESCRIPTIONS = [
  'Сочетание полевых и садовых цветов...',
  'Монобукет из трёх нежнейших гортензий',
  'Минималистичный букет для коллег',
  'Нежные пионы и розы в пастельных оттенках',
  'Яркий букет из подсолнухов и гербер',
  'Ароматная лаванда с декоративной зеленью',
];

const TYPES = [
  'birthdayboy',
  'bridge',
  'motherday',
  'forlove',
  'colleagues',
];

const COLORS = [
  'red',
  'white',
  'purple',
  'pink',
  'yellow',
];

const PRICES = [
  1500,
  3200,
  4200,
  4700,
  5800,
  6100,
];

const PREVIEW_IMAGES = [
  'img/content/items/item-summer-mood.png',
  'img/content/items/item-white-clouds.png',
  'img/content/items/item-delicate-irises.png',
];

const AUTHORS = [
  'Иван Иванов',
  'Мария Петрова',
  'Анна Сидорова',
  'Иван Петров',
  'Анна Ким',
];

const SLIDE_IMAGES = [
  'img/slides/slide-01.jpg',
  'img/slides/slide-02.jpg',
  'img/slides/slide-03.jpg',
];

const getRandomArrayElement = (items) =>
  items[Math.floor(Math.random() * items.length)];

const createIdGenerator = () => {
  let currentId = 1;

  return () => currentId++;
};

const createId = createIdGenerator();

export const generateBouquet = () => ({
  id: createId(),
  title: getRandomArrayElement(TITLES),
  description: getRandomArrayElement(DESCRIPTIONS),
  type: getRandomArrayElement(TYPES),
  color: getRandomArrayElement(COLORS),
  price: getRandomArrayElement(PRICES),
  previewImage: getRandomArrayElement(PREVIEW_IMAGES),
  authorPhoto: getRandomArrayElement(AUTHORS),
  images: [...SLIDE_IMAGES],
});
