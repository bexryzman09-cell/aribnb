import { useMemo, useState } from "react";

type CategoryKey = "booking" | "payment" | "account" | "checkin" | "safety" | "host";
type FAQ = { id: number; category: CategoryKey; question: string; answer: string };
type Category = { key: CategoryKey; title: string; description: string };



const ICONS: Record<string, string> = {
    booking: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
    payment: "M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM2 10h20M6 15h4",
    account: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
    checkin: "M8 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 13l9-9M17 7l3 3M15 9l2 2",
    safety: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4",
    host: "M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5",
    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
    plus: "M12 5v14M5 12h14",
    close: "M6 6l12 12M18 6 6 18",
    back: "M15 5l-7 7 7 7",
    next: "M9 5l7 7-7 7",
    check: "M5 12.5 10 17.5 19 7",
    help: "M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8M12 17h.01",
    empty: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4M8.5 8.5l5 5M13.5 8.5l-5 5",
};

function Icon({ name, className = "h-5 w-5", stroke = 1.8 }: { name: string; className?: string; stroke?: number }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke}
            strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
            <path d={ICONS[name]} />
        </svg>
    );
}


const categories: Category[] = [
    { key: "booking", title: "Бронирования", description: "Изменение, отмена и управление бронированиями" },
    { key: "payment", title: "Оплата и возвраты", description: "Платежи, возвраты и способы оплаты" },
    { key: "account", title: "Аккаунт", description: "Профиль, пароль и настройки аккаунта" },
    { key: "checkin", title: "Заселение", description: "Информация о заселении и выезде" },
    { key: "safety", title: "Безопасность", description: "Советы по безопасности гостей и хозяев" },
    { key: "host", title: "Для хозяев", description: "Объявления, гости, календарь и выплаты" },
];

const faqs: FAQ[] = [
    { id: 1, category: "booking", question: "Как изменить бронирование?", answer: "Откройте раздел «Поездки» и выберите нужное бронирование. После этого нажмите «Изменить бронирование». Вы сможете изменить даты или другие доступные параметры, если условия объявления это позволяют." },
    { id: 2, category: "booking", question: "Как отменить бронирование?", answer: "Откройте нужное бронирование в разделе «Поездки» и нажмите «Отменить бронирование». Перед подтверждением отмены вы увидите размер возможного возврата денежных средств." },
    { id: 3, category: "booking", question: "Где посмотреть мои бронирования?", answer: "Все ваши текущие и прошлые бронирования находятся в разделе «Поездки». Откройте нужную поездку, чтобы увидеть адрес, даты, стоимость и другую информацию." },
    { id: 4, category: "booking", question: "Как связаться с хозяином?", answer: "Откройте страницу своего бронирования и перейдите в сообщения. Там вы сможете отправить сообщение хозяину и посмотреть предыдущую переписку." },
    { id: 5, category: "payment", question: "Какие способы оплаты доступны?", answer: "Доступные способы оплаты зависят от вашего региона и конкретного бронирования. Во время оформления заказа система покажет доступные варианты." },
    { id: 6, category: "payment", question: "Когда я получу возврат?", answer: "После подтверждения возврата средства обычно возвращаются на исходный способ оплаты. Скорость зачисления зависит от вашего банка или платёжной системы." },
    { id: 7, category: "payment", question: "Почему с меня списали деньги?", answer: "Проверьте детали бронирования и сумму платежа в разделе «Поездки». Там указана стоимость проживания, дополнительные сборы и итоговая сумма." },
    { id: 8, category: "account", question: "Как изменить данные профиля?", answer: "Откройте настройки профиля и выберите нужное поле. Вы сможете изменить имя, фотографию, номер телефона и другие доступные данные." },
    { id: 9, category: "account", question: "Как изменить пароль?", answer: "Откройте настройки аккаунта и перейдите в раздел безопасности. Нажмите «Изменить пароль» и следуйте инструкциям на экране." },
    { id: 10, category: "account", question: "Что делать, если я забыл пароль?", answer: "На странице входа выберите «Забыли пароль?». После этого введите данные своего аккаунта и следуйте инструкции для восстановления доступа." },
    { id: 11, category: "checkin", question: "Как узнать время заселения?", answer: "Время заселения указано в информации вашего бронирования. Если вы не нашли нужную информацию, свяжитесь с хозяином через сообщения." },
    { id: 12, category: "checkin", question: "Что делать, если я не могу попасть в жильё?", answer: "Сначала проверьте инструкции по заселению в вашем бронировании. Если проблема сохраняется, свяжитесь с хозяином. Если связаться с хозяином невозможно, обратитесь в поддержку." },
    { id: 13, category: "checkin", question: "Где найти адрес жилья?", answer: "После подтверждения бронирования адрес и инструкции по заселению доступны в информации о вашей поездке." },
    { id: 14, category: "safety", question: "Как сообщить о проблеме с безопасностью?", answer: "Если вы столкнулись с проблемой безопасности, обратитесь в службу поддержки через форму связи. При непосредственной угрозе жизни или здоровью обратитесь в местные экстренные службы." },
    { id: 15, category: "safety", question: "Как проверить объявление перед бронированием?", answer: "Изучите фотографии, отзывы, рейтинг хозяина, описание жилья, правила проживания и условия отмены. Если информация кажется подозрительной, лучше связаться с хозяином до бронирования." },
    { id: 16, category: "safety", question: "Что делать, если хозяин просит оплатить вне сайта?", answer: "Не отправляйте деньги напрямую, если платёж не предусмотрен системой бронирования. При подозрительной просьбе сообщите об этом в поддержку." },
    { id: 17, category: "host", question: "Как создать объявление?", answer: "Перейдите в раздел для хозяев и выберите создание нового объявления. Добавьте фотографии, описание, адрес, правила, доступные даты и стоимость проживания." },
    { id: 18, category: "host", question: "Как изменить цену объявления?", answer: "Откройте управление своим объявлением и перейдите в календарь или настройки цены. Вы сможете установить стоимость для нужных дат." },
    { id: 19, category: "host", question: "Как изменить фотографии объявления?", answer: "Откройте редактирование объявления и перейдите в раздел фотографий. Там можно удалить старые фотографии, добавить новые и изменить их порядок." },
    { id: 20, category: "host", question: "Как управлять календарём?", answer: "В разделе управления объявлением откройте календарь. Там можно отмечать доступные и недоступные даты, а также изменять стоимость." },
];

const POPULAR_IDS = [1, 2, 6, 9, 12, 17];
const catTitle = (key: CategoryKey) => categories.find((c) => c.key === key)?.title ?? "";
const normalize = (s: string) => s.toLowerCase().replace(/ё/g, "е");



function Accordion({ items, open, onToggle, showCategory }: {
    items: FAQ[]; open: number[]; onToggle: (id: number) => void; showCategory?: boolean;
}) {
    return (
        <div className="divide-y divide-gray-200 overflow-hidden rounded-2xl border bg-white">
            {items.map((faq) => {
                const isOpen = open.includes(faq.id);
                return (
                    <div key={faq.id}>
                        <button type="button" aria-expanded={isOpen} onClick={() => onToggle(faq.id)}
                            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black sm:px-6 sm:py-5">
                            <span>
                                {showCategory && <span className="mb-1 block text-xs text-gray-500">{catTitle(faq.category)}</span>}
                                <span className="text-[15px] font-medium leading-snug sm:text-base">{faq.question}</span>
                            </span>
                            <Icon name="plus" className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} />
                        </button>
                        <div className={`grid transition-[grid-template-rows] duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                            <div className="overflow-hidden">
                                <p className="px-4 pb-5 text-[15px] leading-7 text-gray-600 sm:px-6">{faq.answer}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}



export default function Help() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
    const [openQuestions, setOpenQuestions] = useState<number[]>([]);

    const [showSupport, setShowSupport] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [website, setWebsite] = useState(""); // honeypot от ботов
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const toggleQuestion = (id: number) =>
        setOpenQuestions((cur) => (cur.includes(id) ? cur.filter((i) => i !== id) : [...cur, id]));

    const query = normalize(search.trim());

    // Поиск: каждое слово запроса должно встретиться в вопросе или ответе
    const searchResults = useMemo(() => {
        if (!query) return [];
        const words = query.split(/\s+/);
        return faqs.filter((f) => {
            const text = normalize(`${f.question} ${f.answer}`);
            return words.every((w) => text.includes(w));
        });
    }, [query]);

    const categoryQuestions = useMemo(
        () => (selectedCategory ? faqs.filter((f) => f.category === selectedCategory) : []),
        [selectedCategory],
    );
    const popular = POPULAR_IDS.map((id) => faqs.find((f) => f.id === id)!);
    const activeCategory = categories.find((c) => c.key === selectedCategory);

    const clearSearch = () => { setSearch(""); setSelectedCategory(null); setOpenQuestions([]); };
    const selectCategory = (key: CategoryKey) => {
        setSelectedCategory(key); setSearch(""); setOpenQuestions([]);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const openSupport = () => {
        setShowSupport(true);
        setTimeout(() => document.getElementById("support")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    };

    const submitSupport = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim() || status === "sending") return;
        setStatus("sending");
        try {
            if (website) { setStatus("sent"); return; } // бот

            const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
            const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

            const text = `📩 Новое обращение в поддержку\n\nИмя: ${name.trim()}\nEmail: ${email.trim()}\n\nСообщение:\n${message.trim()}`;

            const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: chatId, text }),
            });
            if (!res.ok) throw new Error("request failed");
            setStatus("sent");
        } catch {
            setStatus("error");
        }
    };

    const resetSupport = () => {
        setShowSupport(false); setStatus("idle"); setName(""); setEmail(""); setMessage("");
    };

    const inputCls =
        "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-black focus:ring-1 focus:ring-black";
    const btnCls =
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#222] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-60";

    return (
        <div className="min-h-screen bg-white text-ink">
            {/* HERO */}
            <section className="border-b border-gray-200 bg-[#f7f7f7] px-4 py-12 sm:px-6 sm:py-16 md:py-20">
                <div className="mx-auto max-w-212.5 text-center">
                    <h1 className="text-[32px] font-bold leading-tight tracking-tight sm:text-[44px] md:text-[54px]">
                        Чем мы можем помочь?
                    </h1>
                    <p className="mx-auto mt-4 max-w-150 text-[15px] leading-7 text-gray-600 sm:text-[17px]">
                        Найдите ответы на вопросы о бронированиях, поездках, аккаунте и многом другом.
                    </p>

                    <div role="search"
                        className="mx-auto mt-7 flex h-14 max-w-190 items-center rounded-2xl border border-gray-300 bg-white px-4 shadow-[0_2px_12px_rgba(0,0,0,0.07)] transition sm:h-16 sm:px-5">
                        <Icon name="search" className="mr-3 h-5 w-5 text-gray-500 sm:h-6 sm:w-6" stroke={2} />
                        <input type="text" value={search} aria-label="Поиск по вопросам и ответам"
                            onChange={(e) => { setSearch(e.target.value); setSelectedCategory(null); }}
                            placeholder="Поиск по вопросам и ответам"
                            className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-500 sm:text-base" />
                        {search && (
                            <button type="button" onClick={clearSearch} aria-label="Очистить поиск"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
                                <Icon name="close" className="h-4 w-4" stroke={2.2} />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <main className="mx-auto w-full max-w-275 px-4 sm:px-6">
                {query && (
                    <section className="border-b border-gray-200 py-10 sm:py-12">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold sm:text-[27px]">Результаты поиска</h2>
                                <p className="mt-1.5 text-sm text-gray-500">
                                    {searchResults.length > 0 ? `Найдено ответов: ${searchResults.length}` : "Ничего не найдено"}
                                </p>
                            </div>
                            <button type="button" onClick={clearSearch} className="text-sm font-semibold underline">Очистить</button>
                        </div>

                        {searchResults.length > 0 ? (
                            <Accordion items={searchResults} open={openQuestions} onToggle={toggleQuestion} showCategory />
                        ) : (
                            <div className="rounded-2xl border border-gray-200 p-8 text-center">
                                <Icon name="empty" className="mx-auto h-10 w-10 text-gray-400" stroke={1.5} />
                                <h3 className="mt-4 text-lg font-semibold">Мы не нашли ответ</h3>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                    Попробуйте изменить запрос или свяжитесь с нашей службой поддержки.
                                </p>
                                <button type="button" onClick={openSupport} className={`${btnCls} mt-5`}>Связаться с поддержкой</button>
                            </div>
                        )}
                    </section>
                )}

                {/* КАТЕГОРИИ */}
                {!query && !selectedCategory && (
                    <section className="border-b border-gray-200 py-12 sm:py-14 md:py-16">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold sm:text-[27px]">Выберите тему</h2>
                            <p className="mt-1.5 text-sm text-gray-500">Так проще найти нужную информацию</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                            {categories.map((c) => (
                                <button key={c.key} type="button" onClick={() => selectCategory(c.key)}
                                    className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-gray-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:p-6">
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition group-hover:bg-ink group-hover:text-white">
                                        <Icon name={c.key} className="h-6 w-6" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-semibold">{c.title}</span>
                                        <span className="mt-1 block text-[13px] leading-5 text-gray-500">{c.description}</span>
                                    </span>
                                    <Icon name="next" className="mt-1 h-5 w-5 text-gray-400 transition group-hover:translate-x-1" />
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* ВОПРОСЫ КАТЕГОРИИ */}
                {!query && activeCategory && (
                    <section className="border-b border-gray-200 py-10 sm:py-14 md:py-16">
                        <button type="button" onClick={() => setSelectedCategory(null)}
                            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
                            <Icon name="back" className="h-4 w-4" stroke={2.2} /> Все категории
                        </button>
                        <div className="mb-7 flex items-center gap-4">
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                <Icon name={activeCategory.key} className="h-7 w-7" />
                            </span>
                            <div>
                                <h2 className="text-2xl font-bold sm:text-[27px]">{activeCategory.title}</h2>
                                <p className="mt-1 text-sm text-gray-500">{activeCategory.description}</p>
                            </div>
                        </div>
                        <Accordion items={categoryQuestions} open={openQuestions} onToggle={toggleQuestion} />
                    </section>
                )}

                {/* ПОПУЛЯРНЫЕ */}
                {!query && !selectedCategory && (
                    <section className="border-b border-gray-200 py-12 sm:py-14 md:py-16">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold sm:text-[27px]">Популярные вопросы</h2>
                            <p className="mt-1.5 text-sm text-gray-500">Ответы на вопросы, которые задают чаще всего</p>
                        </div>
                        <Accordion items={popular} open={openQuestions} onToggle={toggleQuestion} />
                    </section>
                )}

                {/* ДЛЯ ХОЗЯЕВ */}
                {!query && !selectedCategory && (
                    <section className="my-12 flex flex-col justify-between gap-8 rounded-3xl bg-[#f7f7f7] p-6 sm:p-8 md:my-16 md:flex-row md:items-center md:p-11">
                        <div>
                            <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[30px]">
                                Помощь в управлении <br className="hidden md:block" />вашим жильём
                            </h2>
                            <p className="mt-4 max-w-137.5 text-sm leading-6 text-gray-600">
                                Узнайте, как создать объявление, принимать гостей, управлять календарём и получать выплаты.
                            </p>
                            <button type="button" onClick={() => selectCategory("host")} className={`${btnCls} mt-5`}>
                                Помощь хозяевам
                            </button>
                        </div>
                        <div className="flex h-28 w-28 shrink-0 items-center justify-center self-center rounded-full bg-white shadow-sm md:h-45 md:w-45">
                            <Icon name="host" className="h-12 w-12 md:h-18 md:w-18" stroke={1.3} />
                        </div>
                    </section>
                )}

                {/* ПОДДЕРЖКА */}
                <div id="support" className="py-10 sm:pb-16">
                    {!showSupport ? (
                        <section className="flex flex-col gap-5 rounded-2xl border border-gray-200 p-6 md:flex-row md:items-center md:p-7">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                                <Icon name="help" className="h-6 w-6" stroke={2} />
                            </span>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">Не нашли ответ?</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-500">Свяжитесь с нашей службой поддержки.</p>
                            </div>
                            <button type="button" onClick={openSupport} className={btnCls}>Связаться с поддержкой</button>
                        </section>
                    ) : (
                        <section className="rounded-2xl border border-gray-200 p-5 sm:p-8">
                            {status !== "sent" ? (
                                <>
                                    <button type="button" onClick={() => setShowSupport(false)}
                                        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
                                        <Icon name="back" className="h-4 w-4" stroke={2.2} /> Назад
                                    </button>
                                    <h2 className="text-2xl font-bold">Связаться с поддержкой</h2>
                                    <p className="mt-2 text-sm leading-6 text-gray-500">Опишите проблему, и мы постараемся помочь.</p>

                                    <form onSubmit={submitSupport} className="mt-7 max-w-175 space-y-5">
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="s-name" className="mb-2 block text-sm font-semibold">Ваше имя</label>
                                                <input id="s-name" type="text" required maxLength={100} value={name}
                                                    onChange={(e) => setName(e.target.value)} placeholder="Введите имя" className={inputCls} />
                                            </div>
                                            <div>
                                                <label htmlFor="s-email" className="mb-2 block text-sm font-semibold">Email</label>
                                                <input id="s-email" type="email" required maxLength={150} value={email}
                                                    onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" className={inputCls} />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="s-msg" className="mb-2 block text-sm font-semibold">Сообщение</label>
                                            <textarea id="s-msg" required rows={5} maxLength={2000} value={message}
                                                onChange={(e) => setMessage(e.target.value)} placeholder="Опишите вашу проблему..."
                                                className={`${inputCls} resize-none`} />
                                        </div>

                                        {/* honeypot: скрытое поле, людям не видно */}
                                        <input type="text" tabIndex={-1} autoComplete="off" value={website}
                                            onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden="true" />

                                        {status === "error" && (
                                            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                                                Не удалось отправить сообщение. Проверьте соединение и попробуйте ещё раз.
                                            </p>
                                        )}

                                        <button type="submit" disabled={status === "sending"} className={`${btnCls} w-full sm:w-auto`}>
                                            {status === "sending" ? "Отправляем…" : "Отправить сообщение"}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="py-8 text-center">
                                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                                        <Icon name="check" className="h-8 w-8" stroke={2.4} />
                                    </span>
                                    <h2 className="mt-5 text-2xl font-bold">Сообщение отправлено</h2>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                        Спасибо! Мы получили ваше сообщение и постараемся ответить как можно скорее.
                                    </p>
                                    <button type="button" onClick={resetSupport}
                                        className="mt-6 rounded-xl border border-gray-800 px-5 py-3 text-sm font-semibold transition hover:bg-gray-100">
                                        Вернуться к помощи
                                    </button>
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}