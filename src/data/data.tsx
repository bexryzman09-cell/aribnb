// ====== "База данных" ======  (потом можно заменить на fetch к API)
export type Listing = {
    id: string; title: string; sub: string; price: number
    rating: string; img: string; top: boolean
}
export type SectionData = { id: string; title: string; note?: string; items: Listing[] }

const B = 'https://a0.muscache.com/'
export const tabs = [
    {
        to: '/', label: 'Все',
        poster: B + 'im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-search-bar-icons/original/a811de29-114f-43a0-b8c5-698d4564bd04.png?im_w=240',
        mov: B + 'videos/search-bar-icons/unified/hevc/Globe_Selected_180px_01.mov#t=0.001',
        webm: B + 'videos/search-bar-icons/unified/webm/Globe_Selected_180px_01.webm'
    },
    {
        to: '/homes', label: 'Жилье',
        poster: B + 'im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/a32adab1-f9df-47e1-a411-bdff91b579c3.png?im_w=240',
        mov: B + 'videos/search-bar-icons/hevc/house-selected.mov#t=0.001',
        webm: B + 'videos/search-bar-icons/webm/house-selected.webm'
    },
    {
        to: '/experiences', label: 'Впечатления',
        poster: B + 'im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240',
        mov: B + 'videos/search-bar-icons/hevc/balloon-selected.mov#t=0.001',
        webm: B + 'videos/search-bar-icons/webm/balloon-selected.webm'
    },
    {
        to: '/services', label: 'Услуги',
        poster: B + 'im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240',
        mov: B + 'videos/search-bar-icons/hevc/consierge-selected.mov#t=0.001',
        webm: B + 'videos/search-bar-icons/webm/consierge-selected.webm'
    },
]

export const destinations = [
    { name: 'Поблизости', hint: 'Узнать, что есть поблизости', bg: '#eef3fa', near: true },
    { name: 'Ташкент', hint: 'Рядом с вами', bg: '#e8f6f6', near: false },
    { name: 'Дубай', hint: 'Популярное пляжное направление', bg: '#eef7ea', near: false },
    { name: 'Алма-Ата', hint: 'Известные достопримечательности (например, Медео)', bg: '#faf3ea', near: false },
    { name: 'Стамбул', hint: 'Бурная ночная жизнь', bg: '#eaeef6', near: false },
    { name: 'Тбилиси', hint: 'Для любителей истории', bg: '#f3ecf7', near: false },
]

const KINDS = ['Квартира', 'Апартаменты', 'Вилла', 'Студия', 'Лофт', 'Дом', 'Пентхаус', 'Таунхаус', 'Бунгало', 'Номер в отеле']

const make = (slug: string, city: string, seed: number): Listing[] =>
    Array.from({ length: 12 }, (_, i) => ({
        id: `${slug}-${i}`,
        title: `${KINDS[(i + seed) % KINDS.length]} · ${city}`,
        sub: `Спален: ${1 + (i % 3)} · Гостей: ${2 + (i % 4)}`,
        price: 45 + ((i * 37 + seed * 13) % 160),
        rating: (4.6 + ((i * 7 + seed) % 5) / 10).toFixed(2).replace('.', ','),
        img: `https://picsum.photos/seed/${slug}-${i}/600/600`,
        top: i % 4 === 0,
    }))

const list: [string, string, string, string?][] = [
    ['Направления для вас', 'Ташкент', 'for-you'],
    ['Дубай: популярное жилье', 'Дубай', 'dubai'],
    ['Отличные гостиницы для следующей поездки', 'Отель', 'hotels', 'Кроме того, получите бонус Airbnb за проживание в рекомендуемой гостинице.'],
    ['Алма-Ата: свободное жилье в следующем месяце', 'Алма-Ата', 'almaty'],
    ['Стамбул: проживание', 'Стамбул', 'istanbul'],
    ['Тбилиси: свободное жилье в следующем месяце', 'Тбилиси', 'tbilisi'],
    ['Абу-Даби: жилье', 'Абу-Даби', 'abudhabi'],
    ['Бангкок: свободное жилье в следующем месяце', 'Бангкок', 'bangkok'],
    ['Батуми: жилье', 'Батуми', 'batumi'],
    ['Сеул: посмотрите жилье рядом', 'Сеул', 'seoul'],
    ['Париж: популярное жилье', 'Париж', 'paris'],
    ['Паттайя: проживание', 'Паттайя', 'pattaya'],
]

export const sections: SectionData[] = list.map(([title, city, id, note], i) => ({
    id, title, note, items: make(id, city, i + 1),
}))

export const footerColumns = [
    { title: 'Поддержка', links: ['Центр помощи', 'AirCover', 'Борьба с дискриминацией', 'Поддержка людей с ограниченными возможностями', 'Варианты отмены'] },
    { title: 'Хозяевам', links: ['Сдайте жильё на Airbnb', 'AirCover для хозяев', 'Ресурсы для хозяев', 'Форум сообщества', 'Ответственное размещение'] },
    { title: 'Airbnb', links: ['Новости', 'Новые функции', 'Карьера', 'Инвесторам', 'Подарочные карты'] },
]