import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

// ====== языки и регионы (id = BCP-47 локаль) ======
export const languages = [
    { id: 'ru-RU', name: 'Русский', region: 'Россия' },
    { id: 'az-AZ', name: 'Azərbaycan dili', region: 'Azərbaycan' },
    { id: 'id-ID', name: 'Bahasa Indonesia', region: 'Indonesia' },
    { id: 'bs-BA', name: 'Bosanski', region: 'Bosna i Hercegovina' },
    { id: 'ca-ES', name: 'Català', region: 'Espanya' },
    { id: 'cs-CZ', name: 'Čeština', region: 'Česká republika' },
    { id: 'sr-ME', name: 'Crnogorski', region: 'Crna Gora' },
    { id: 'da-DK', name: 'Dansk', region: 'Danmark' },
    { id: 'de-DE', name: 'Deutsch', region: 'Deutschland' },
    { id: 'de-AT', name: 'Deutsch', region: 'Österreich' },
    { id: 'de-CH', name: 'Deutsch', region: 'Schweiz' },
    { id: 'de-LU', name: 'Deutsch', region: 'Luxemburg' },
    { id: 'et-EE', name: 'Eesti', region: 'Eesti' },
    { id: 'en-AU', name: 'English', region: 'Australia' },
    { id: 'en-CA', name: 'English', region: 'Canada' },
    { id: 'en-GB', name: 'English', region: 'United Kingdom' },
    { id: 'en-US', name: 'English', region: 'United States' },
    { id: 'es-ES', name: 'Español', region: 'España' },
    { id: 'fr-FR', name: 'Français', region: 'France' },
    { id: 'it-IT', name: 'Italiano', region: 'Italia' },
    { id: 'ka-GE', name: 'ქართული', region: 'საქართველო' },
    { id: 'kk-KZ', name: 'Қазақша', region: 'Қазақстан' },
    { id: 'ko-KR', name: '한국어', region: '대한민국' },
    { id: 'ja-JP', name: '日本語', region: '日本' },
    { id: 'pl-PL', name: 'Polski', region: 'Polska' },
    { id: 'pt-PT', name: 'Português', region: 'Portugal' },
    { id: 'tr-TR', name: 'Türkçe', region: 'Türkiye' },
    { id: 'uz-UZ', name: 'Oʻzbekcha', region: 'Oʻzbekiston' },
    { id: 'zh-CN', name: '中文', region: '中国' },
]
export const recommended = ['en-US', 'en-GB']

// ====== валюты (rate = сколько единиц за 1 USD, ПРИМЕРНЫЕ значения — подставьте API) ======
export const currencies = [
    { code: 'USD', rate: 1 }, { code: 'EUR', rate: 0.92 }, { code: 'GBP', rate: 0.78 },
    { code: 'RUB', rate: 90 }, { code: 'UZS', rate: 12700 }, { code: 'KZT', rate: 480 },
    { code: 'TRY', rate: 40 }, { code: 'AED', rate: 3.67 }, { code: 'GEL', rate: 2.7 },
    { code: 'JPY', rate: 150 }, { code: 'KRW', rate: 1350 }, { code: 'CNY', rate: 7.2 },
    { code: 'THB', rate: 35 },
]

// ====== переводы интерфейса. Нет словаря для языка → английский ======
const ru = {
    'tab_/': 'Все', 'tab_/homes': 'Жилье', 'tab_/experiences': 'Впечатления', 'tab_/services': 'Услуги',
    categories: 'Категории', where: 'Где', where_ph: 'Поиск направлений', when: 'Когда', who: 'Кто',
    any_dates: 'Любые даты', who_ph: 'Кто едет?', search: 'Искать', open_search: 'Открыть поиск',
    any_place: 'Любое место', any_week: 'Любая неделя', guests: 'Гости',
    suggested: 'Рекомендуемые направления', dests: 'Направления', nothing: 'Ничего не найдено',
    everywhere: 'везде', searching: 'Ищем',
    dates: 'Даты', flex: 'Гибко', arrival: 'Прибытие', departure: 'Выезд',
    how_long: 'На какой срок вы ищете жильё?', weekend: 'Выходные', week: 'Неделя', month: 'Месяц',
    when_go: 'Когда вы едете?', next: 'Дальше', prev: 'Назад',
    adults: 'Взрослые', adults_h: 'От 13 лет', children: 'Дети', children_h: 'Возраст от 2 до 12',
    infants: 'Младенцы', infants_h: 'Младше 2', pets: 'Домашние животные', pets_h: 'Путешествуете с животным-помощником?',
    lang_currency: 'Язык и валюта', help: 'Центр помощи', invite_host: 'Пригласить хозяина',
    invite_cohost: 'Пригласить второго хозяина', signup: 'Зарегистрироваться', login: 'Войти',
    top_pick: 'Выбор гостей', fav: 'В избранное', for_nights: 'за 2 ночи',
    lang_region: 'Язык и регион', currency: 'Валюта', rec_langs: 'Рекомендуемые языки и регионы',
    choose_lang: 'Выбрать язык и регион', note_1: 'В ', account_settings: 'настройках аккаунта',
    note_2: ' можно задать дополнительные языковые предпочтения.', choose_currency: 'Выбрать валюту', close: 'Закрыть',
    privacy: 'Конфиденциальность', terms: 'Условия', company: 'Реквизиты компании',
}
type Key = keyof typeof ru
const en: Record<Key, string> = {
    'tab_/': 'All', 'tab_/homes': 'Homes', 'tab_/experiences': 'Experiences', 'tab_/services': 'Services',
    categories: 'Categories', where: 'Where', where_ph: 'Search destinations', when: 'When', who: 'Who',
    any_dates: 'Any dates', who_ph: "Who's coming?", search: 'Search', open_search: 'Open search',
    any_place: 'Anywhere', any_week: 'Any week', guests: 'Guests',
    suggested: 'Suggested destinations', dests: 'Destinations', nothing: 'Nothing found',
    everywhere: 'anywhere', searching: 'Searching',
    dates: 'Dates', flex: 'Flexible', arrival: 'Check-in', departure: 'Check-out',
    how_long: 'How long would you like to stay?', weekend: 'Weekend', week: 'Week', month: 'Month',
    when_go: 'When do you want to go?', next: 'Next', prev: 'Back',
    adults: 'Adults', adults_h: 'Ages 13 or above', children: 'Children', children_h: 'Ages 2–12',
    infants: 'Infants', infants_h: 'Under 2', pets: 'Pets', pets_h: 'Bringing a service animal?',
    lang_currency: 'Language & currency', help: 'Help Center', invite_host: 'Refer a Host',
    invite_cohost: 'Find a co-host', signup: 'Sign up', login: 'Log in',
    top_pick: 'Guest favorite', fav: 'Add to wishlist', for_nights: 'for 2 nights',
    lang_region: 'Language and region', currency: 'Currency', rec_langs: 'Suggested languages and regions',
    choose_lang: 'Choose a language and region', note_1: 'Set additional language preferences in your ',
    account_settings: 'account settings', note_2: '.', choose_currency: 'Choose a currency', close: 'Close',
    privacy: 'Privacy', terms: 'Terms', company: 'Company details',
}
const dicts: Record<string, Record<Key, string>> = { ru, en }

const PL: Record<string, Record<string, Record<string, string>>> = {
    ru: {
        guest: { one: 'гость', few: 'гостя', many: 'гостей', other: 'гостей' },
        infant: { one: 'младенец', few: 'младенца', many: 'младенцев', other: 'младенцев' },
        pet: { one: 'питомец', few: 'питомца', many: 'питомцев', other: 'питомцев' },
    },
    en: {
        guest: { one: 'guest', other: 'guests' },
        infant: { one: 'infant', other: 'infants' },
        pet: { one: 'pet', other: 'pets' },
    },
}

// ====== контекст ======
type Tab = 'lang' | 'currency'
type Ctx = {
    locale: string; setLocale: (l: string) => void
    currency: string; setCurrency: (c: string) => void
    t: (k: string) => string
    tp: (k: 'guest' | 'infant' | 'pet', n: number) => string
    money: (usd: number) => string
    currencyName: (code: string) => string
    currencySymbol: string
    langLabel: string
    localeOpen: boolean; localeTab: Tab
    setLocaleTab: (t: Tab) => void
    openLocale: (t?: Tab) => void; closeLocale: () => void
}
const I18nCtx = createContext<Ctx>(null!)
export const useI18n = () => useContext(I18nCtx)

const load = (k: string, d: string) => { try { return localStorage.getItem(k) || d } catch { return d } }
const save = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* noop */ } }

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLoc] = useState(() => load('locale', 'ru-RU'))
    const [currency, setCur] = useState(() => load('currency', 'USD'))
    const [localeOpen, setOpen] = useState(false)
    const [localeTab, setLocaleTab] = useState<Tab>('lang')

    const ui = locale.split('-')[0]
    const dict = dicts[ui] ?? en

    useEffect(() => { document.documentElement.lang = ui }, [ui])

    const setLocale = useCallback((l: string) => { setLoc(l); save('locale', l) }, [])
    const setCurrency = useCallback((c: string) => { setCur(c); save('currency', c) }, [])
    const openLocale = useCallback((t: Tab = 'lang') => { setLocaleTab(t); setOpen(true) }, [])
    const closeLocale = useCallback(() => setOpen(false), [])

    const value = useMemo<Ctx>(() => {
        const rate = currencies.find(c => c.code === currency)?.rate ?? 1
        const nf = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 })
        const dn = new Intl.DisplayNames(locale, { type: 'currency' })
        const pr = new Intl.PluralRules(locale)
        const lang = languages.find(l => l.id === locale)
        return {
            locale, setLocale, currency, setCurrency,
            t: k => (dict as Record<string, string>)[k] ?? k,
            tp: (k, n) => {
                const f = (PL[dicts[ui] ? ui : 'en'])[k]
                return `${n} ${f[pr.select(n)] ?? f.other}`
            },
            money: usd => nf.format(usd * rate),
            currencyName: code => dn.of(code) ?? code,
            currencySymbol: new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' })
                .formatToParts(0).find(p => p.type === 'currency')?.value ?? currency,
            langLabel: `${lang?.name ?? locale} (${locale.split('-')[1]})`,
            localeOpen, localeTab, setLocaleTab, openLocale, closeLocale,
        }
    }, [locale, currency, localeOpen, localeTab, dict, ui, setLocale, setCurrency, openLocale, closeLocale])

    return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}