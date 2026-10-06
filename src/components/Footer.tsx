import { useState } from 'react'

// ====== данные (можно перенести в ../data/data) ======
const inspiration: Record<string, [string, string][]> = {
    'Популярные': [
        ['Нашвилл', 'Помесячная аренда'], ['Мадрид', 'Помесячная аренда'], ['Портленд', 'Помесячная аренда'],
        ['Миннеаполис', 'Помесячная аренда'], ['Оушн-Сити', 'Дома в аренду'], ['Шарлотт', 'Помесячная аренда'],
        ['Дестин', 'Отпускное жилье'], ['Дублин', 'Кондоминиумы в аренду'], ['Сан-Хосе', 'Дома в аренду'],
        ['Даллас', 'Аренда квартир'], ['Цинциннати', 'Аренда домиков'], ['Cleveland', 'Аренда вилл'],
        ['Корпус-Кристи', 'Аренда квартир'], ['Сент-Петербург', 'Аренда квартир'], ['Филадельфия', 'Отпускное жилье'],
        ['Пляж Орандж-Бич', 'Аренда квартир'], ['Кауаи', 'Аренда квартир'],
        ['Остин', 'Дома в аренду'], ['Денвер', 'Аренда квартир'], ['Бостон', 'Помесячная аренда'],
        ['Чикаго', 'Аренда квартир'], ['Сан-Диего', 'Отпускное жилье'], ['Нью-Йорк', 'Аренда квартир'],
    ],
    'Искусство и культура': [
        ['Париж', 'Аренда квартир'], ['Флоренция', 'Аренда апартаментов'], ['Прага', 'Аренда квартир'],
        ['Вена', 'Аренда квартир'], ['Рим', 'Аренда апартаментов'], ['Амстердам', 'Аренда лодок'],
        ['Стамбул', 'Аренда квартир'], ['Тбилиси', 'Аренда квартир'], ['Лиссабон', 'Аренда квартир'],
    ],
    'Пляжи': [
        ['Дубай', 'Аренда вилл'], ['Паттайя', 'Аренда квартир'], ['Батуми', 'Аренда квартир'],
        ['Анталья', 'Отпускное жилье'], ['Бали', 'Аренда вилл'], ['Пхукет', 'Аренда вилл'],
        ['Майами', 'Аренда квартир'], ['Канкун', 'Отпускное жилье'], ['Ницца', 'Аренда квартир'],
    ],
    'Горы': [
        ['Алма-Ата', 'Аренда квартир'], ['Чимган', 'Аренда домиков'], ['Бакуриани', 'Аренда шале'],
        ['Гудаури', 'Аренда квартир'], ['Шамони', 'Аренда шале'], ['Банф', 'Аренда домиков'],
        ['Аспен', 'Аренда шале'], ['Интерлакен', 'Аренда квартир'], ['Закопане', 'Аренда домиков'],
    ],
    'Природа': [
        ['Иссык-Куль', 'Аренда домов'], ['Боровое', 'Аренда домиков'], ['Байкал', 'Аренда домов'],
        ['Йосемити', 'Аренда домиков'], ['Лофотенские острова', 'Аренда рорбу'], ['Исландия', 'Аренда домов'],
        ['Тоскана', 'Аренда вилл'], ['Новая Зеландия', 'Аренда домов'], ['Норвегия', 'Аренда домиков'],
    ],
    'Чем заняться': [
        ['Ташкент', 'Впечатления'], ['Самарканд', 'Экскурсии'], ['Бухара', 'Экскурсии'],
        ['Дубай', 'Впечатления'], ['Стамбул', 'Кулинарные туры'], ['Сеул', 'Впечатления'],
        ['Бангкок', 'Кулинарные туры'], ['Токио', 'Впечатления'], ['Барселона', 'Экскурсии'],
    ],
}

const footerColumns = [
    { title: 'Поддержка', links: ['Центр помощи', 'Помощь: проблема с безопасностью', 'AirCover', 'Борьба с дискриминацией', 'Помощь людям с инвалидностью', 'Отмена в период пандемии', 'Сообщить о проблеме в районе'] },
    { title: 'Прием гостей', links: ['Сдайте жилье на Airbnb', 'AirCover для хозяев', 'Материалы для хозяев', 'Форум сообщества', 'Ответственный прием гостей', 'Бесплатный урок для хозяев', 'Найти второго хозяина', 'Порекомендовать хозяина'] },
    { title: 'Airbnb', links: ['Пресс-центр', 'Карьера в Airbnb', 'Для инвесторов', 'Прием гостей на Airbnb.org'] },
]

const LIMIT = 17 // 17 ссылок + кнопка «Показать больше» = 3 ряда по 6

// ====== иконки ======
const ico = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true } as const
const socials = [
    {
        label: 'Facebook', href: '#',
        icon: <svg {...ico}><path d="M12 1.5a10.5 10.5 0 0 0-1.640 20.880v-7.360H7.700V12h2.660V9.700c0-2.630 1.570-4.090 3.970-4.090 1.150 0 2.350.2 2.350.2v2.590h-1.320c-1.300 0-1.710.81-1.710 1.640V12h2.910l-.47 3.020h-2.440v7.360A10.500 10.500 0 0 0 12 1.500z" /></svg>,
    },
    {
        label: 'VK', href: '#',
        icon: <svg {...ico}><path d="M3 3h18v18H3z" opacity="0" /><path d="M2 3.5h20v17H2z" opacity="0" /><path d="M12.600 17.400C6.700 17.400 3.300 13.400 3.200 6.700h3c.1 4.900 2.300 7 4 7.400V6.700h2.800v4.200c1.700-.2 3.500-2.100 4.100-4.200h2.800c-.5 2.600-2.400 4.500-3.700 5.300 1.300.6 3.500 2.300 4.300 5.400h-3.100c-.7-2.100-2.300-3.700-4.400-3.900v3.900h-.3z" /></svg>,
    },
    {
        label: 'X', href: '#',
        icon: <svg {...ico}><path d="M17.750 3h3.060l-6.680 7.640L22 21h-6.160l-4.830-6.310L5.480 21H2.420l7.150-8.170L2 3h6.320l4.370 5.770L17.750 3zm-1.080 16.170h1.700L7.400 4.740H5.580l11.090 14.430z" /></svg>,
    },
    {
        label: 'Instagram', href: '#',
        icon: <svg {...ico}><path d="M12 2.200c3.200 0 3.600 0 4.800.1 3.300.1 4.800 1.700 4.900 4.900.1 1.300.1 1.600.1 4.800s0 3.600-.1 4.800c-.1 3.200-1.700 4.800-4.900 4.900-1.300.1-1.600.1-4.800.1s-3.600 0-4.800-.1c-3.300-.1-4.800-1.700-4.900-4.900-.1-1.300-.1-1.600-.1-4.800s0-3.600.1-4.800C2.400 4 4 2.400 7.200 2.300c1.200-.1 1.600-.1 4.800-.1zM12 0C8.700 0 8.300 0 7.100.1 2.700.3.300 2.700.1 7.100 0 8.300 0 8.700 0 12s0 3.700.1 4.900c.2 4.400 2.600 6.800 7 7C8.300 24 8.700 24 12 24s3.700 0 4.900-.1c4.400-.2 6.800-2.600 7-7 .1-1.200.1-1.600.1-4.900s0-3.700-.1-4.900c-.2-4.400-2.600-6.800-7-7C15.700 0 15.300 0 12 0zm0 5.800a6.200 6.200 0 1 0 0 12.400 6.200 6.200 0 0 0 0-12.400zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.400-11.800a1.400 1.400 0 1 0 0 2.900 1.400 1.400 0 0 0 0-2.900z" /></svg>,
    },
]

export default function Footer() {
    const tabNames = Object.keys(inspiration)
    const [tab, setTab] = useState(tabNames[0])
    const [expanded, setExpanded] = useState(false)

    const all = inspiration[tab]
    const canExpand = all.length > LIMIT
    const shown = expanded || !canExpand ? all : all.slice(0, LIMIT)

    return (
        <footer className="mt-12 bg-[#f7f7f7] text-ink">
            {/* Вдохновение для будущих поездок */}
            <section className="max-w-[1760px] mx-auto px-6 sm:px-10 pt-12">
                <h2 className="text-[22px] font-semibold">Вдохновение для будущих поездок</h2>

                <div role="tablist" className="no-scrollbar mt-6 flex gap-8 overflow-x-auto border-b border-line">
                    {tabNames.map(n => (
                        <button
                            key={n}
                            type="button"
                            role="tab"
                            aria-selected={tab === n}
                            onClick={() => { setTab(n); setExpanded(false) }}
                            className={`-mb-px flex-none whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors duration-150
                                ${tab === n ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
                        >
                            {n}
                        </button>
                    ))}
                </div>

                <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
                    {shown.map(([name, kind]) => (
                        <li key={name}>
                            <a href="#" className="block">
                                <span className="block text-sm font-medium text-ink">{name}</span>
                                <span className="block text-sm text-muted">{kind}</span>
                            </a>
                        </li>
                    ))}
                    {canExpand && (
                        <li>
                            <button
                                type="button"
                                onClick={() => setExpanded(v => !v)}
                                className="flex items-center gap-1.5 text-sm font-medium text-ink hover:underline"
                            >
                                {expanded ? 'Показать меньше' : 'Показать больше'}
                                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"
                                    className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                                    <path d="m2 5 6 6 6-6" />
                                </svg>
                            </button>
                        </li>
                    )}
                </ul>
            </section>

            {/* Колонки ссылок */}
            <div className="max-w-[1760px] mx-auto px-6 sm:px-10 pt-16 pb-10 grid gap-10 sm:grid-cols-3">
                {footerColumns.map(c => (
                    <div key={c.title}>
                        <h4 className="mb-4 text-sm font-semibold">{c.title}</h4>
                        <ul className="space-y-3.5 text-sm">
                            {c.links.map(l => (
                                <li key={l}><a href="#" className="hover:underline">{l}</a></li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Нижняя строка */}
            <div className="max-w-[1760px] mx-auto px-6 sm:px-10">
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm">
                    <p className="flex flex-wrap items-center gap-x-2">
                        <span>© 2026 Airbnb, Inc.</span>
                        <span aria-hidden>·</span>
                        <a href="#" className="hover:underline">Конфиденциальность</a>
                        <span aria-hidden>·</span>
                        <a href="#" className="hover:underline">Условия</a>
                        <span aria-hidden>·</span>
                        <a href="#" className="hover:underline">Реквизиты компании</a>
                    </p>

                    <div className="flex flex-wrap items-center gap-5">
                        <button type="button" className="flex items-center gap-2 font-semibold hover:underline">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                                <circle cx="12" cy="12" r="9.5" />
                                <path d="M2.500 12h19M12 2.500c2.600 2.600 4 5.900 4 9.500s-1.400 6.900-4 9.500c-2.600-2.600-4-5.900-4-9.500s1.400-6.900 4-9.500z" />
                            </svg>
                            Русский (RU)
                        </button>
                        <button type="button" className="flex items-center gap-2 font-semibold hover:underline">
                            <span aria-hidden>₽</span>RUB
                        </button>
                        <div className="flex items-center gap-5">
                            {socials.map(s => (
                                <a key={s.label} href={s.href} aria-label={s.label} className="transition-opacity hover:opacity-70">
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-10" />
        </footer>
    )
}