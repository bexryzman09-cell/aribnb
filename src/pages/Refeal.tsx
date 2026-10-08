import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react"; // npm i qrcode.react
import { tabs } from "../data/data"; // те же анимации, что и в Header (путь поправьте под свой проект)

type CardId = "stay" | "experience" | "service";

interface OfferCard {
    id: CardId;
    title: string;
    tabIndex: number; // индекс в tabs (с нуля): 1 = дом, 2 = воздушный шар, 3 = колокольчик
    available: boolean;
    text: string;
}

const CARDS: OfferCard[] = [
    { id: "stay", title: "Жильё", tabIndex: 1, available: false, text: "Недоступно в вашем регионе." },
    { id: "experience", title: "Впечатление", tabIndex: 2, available: true, text: "Вы заработаете 4 274 RUB" },
    { id: "service", title: "Услуга", tabIndex: 3, available: true, text: "Вы заработаете от 1 710 RUB до 8 548 RUB" },
];

/** Карточка с анимированной иконкой (то же видео, что и во вкладках Header) */
function Offer({ card, active, onSelect }: { card: OfferCard; active: boolean; onSelect: () => void }) {
    const tab = tabs[card.tabIndex];
    const v = useRef<HTMLVideoElement>(null);

    const play = () => {
        const el = v.current;
        if (el) {
            el.currentTime = 0;
            el.play().catch(() => { });
        }
    };

    // при выборе карточки — проигрываем анимацию
    useEffect(() => {
        if (!active) return;
        const id = setTimeout(play, 150);
        return () => clearTimeout(id);
    }, [active]);

    return (
        <button
            role="radio"
            aria-checked={active}
            aria-disabled={!card.available}
            onMouseEnter={play}
            onClick={() => {
                play();
                if (card.available) onSelect();
            }}
            className={[
                "flex min-h-27 items-center justify-between gap-4 rounded-2xl border p-6 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                !card.available
                    ? "cursor-not-allowed border-transparent bg-neutral-100 text-neutral-800"
                    : active
                        ? "border-2 border-neutral-900 bg-white"
                        : "border-neutral-200 bg-white hover:border-neutral-400",
            ].join(" ")}
        >
            <div>
                <div className="text-base font-semibold">{card.title}</div>
                <div className={`mt-1 text-sm ${card.available ? "text-neutral-500" : "text-neutral-800"}`}>{card.text}</div>
            </div>

            <span className={`block h-12 w-12 flex-none scale-[1.9] ${card.available ? "" : "opacity-70 grayscale"}`} aria-hidden>
                {tab && (
                    <video ref={v} muted playsInline preload="auto" poster={tab.poster} className="block h-full w-full object-contain">
                        <source src={tab.mov} type='video/mp4; codecs="hvc1"' />
                        <source src={tab.webm} type="video/webm" />
                    </video>
                )}
            </span>
        </button>
    );
}

const HOST = "airbnb.ru/rp/"; // показываем в списке
const MAX_LINKS = 3;

const CYR: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
    н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

const translit = (s: string) =>
    s
        .toLowerCase()
        .split("")
        .map((c) => CYR[c] ?? c)
        .join("")
        .replace(/[^a-z0-9]/g, "");

/** Ник и email из localStorage (их сохраняет Header в ключе airbnb_user) */
function readUser(): { nick: string; email: string } {
    try {
        const u = JSON.parse(localStorage.getItem("airbnb_user") || "null");
        const raw: string = u?.name || (u?.email ? String(u.email).split("@")[0] : "");
        return { nick: translit(raw).slice(0, 12) || "user", email: u?.email || "guest" };
    } catch {
        return { nick: "user", email: "guest" };
    }
}

const makeSlug = (nick: string, taken: string[]) => {
    let slug = "";
    do {
        slug = nick + Math.random().toString(36).slice(2, 5);
    } while (taken.includes(slug));
    return slug;
};

const storageKey = (email: string) => `airbnb_ref_links:${email}`;

const readLinks = (email: string): string[] => {
    try {
        const arr = JSON.parse(localStorage.getItem(storageKey(email)) || "[]");
        return Array.isArray(arr) ? arr.slice(0, MAX_LINKS) : [];
    } catch {
        return [];
    }
};

type ModalKind = "share" | "qr" | "links" | null;

function Modal({
    title,
    subtitle,
    onClose,
    children,
}: {
    title: string;
    subtitle?: string;
    onClose: () => void;
    children: ReactNode;
}) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div
                className="relative w-full max-w-md rounded-4xl bg-white px-6 pb-6 pt-16 shadow-2xl sm:px-8 sm:pb-8"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Закрыть"
                    className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-neutral-800 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                >
                    ×
                </button>
                <h2 className="text-center text-2xl font-semibold leading-tight text-neutral-900 sm:text-[28px]">{title}</h2>
                {subtitle && <p className="mx-auto mt-3 max-w-xs text-center text-base text-neutral-500">{subtitle}</p>}
                <div className="mt-6">{children}</div>
            </div>
        </div>
    );
}

const CopyIcon = ({ done }: { done: boolean }) =>
    done ? (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <rect x="8" y="8" width="12" height="12" rx="2.5" />
            <path d="M16 8V6.5A2.5 2.5 0 0013.5 4h-7A2.5 2.5 0 004 6.5v7A2.5 2.5 0 006.5 16H8" />
        </svg>
    );

export default function ReferralPage() {
    const [selected, setSelected] = useState<CardId>("experience");
    const [modal, setModal] = useState<ModalKind>(null);
    const [{ nick, email }] = useState(readUser);
    const [links, setLinks] = useState<string[]>(() => {
        const saved = readLinks(email);
        return saved.length ? saved : [makeSlug(nick, [])]; // первая ссылка создаётся автоматически
    });
    const [copied, setCopied] = useState<string | null>(null); // что именно скопировано

    // сохраняем ссылки в localStorage
    useEffect(() => {
        localStorage.setItem(storageKey(email), JSON.stringify(links));
    }, [links, email]);

    const fullUrl = (slug: string) => `https://${HOST}${slug}`;
    const link = useMemo(() => `${fullUrl(links[0])}?type=${selected}`, [links, selected]);

    const copy = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            window.prompt("Скопируйте ссылку:", text);
            return;
        }
        setCopied(id);
        setTimeout(() => setCopied((c) => (c === id ? null : c)), 2000);
    };

    const share = async () => {
        if (typeof navigator !== "undefined" && "share" in navigator) {
            try {
                await navigator.share({ title: "Приглашение", text: "Присоединяйтесь по моей ссылке", url: link });
                return;
            } catch {
                /* пользователь закрыл меню — открываем окно */
            }
        }
        setModal("share");
    };

    const createLink = () => {
        if (links.length >= MAX_LINKS) return;
        setLinks((l) => [...l, makeSlug(nick, l)]);
    };

    const pillBtn =
        "inline-flex h-10 items-center gap-2 rounded-full bg-neutral-100 px-4 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900";

    return (
        <div className="flex min-h-screen flex-col bg-white font-sans text-neutral-900 antialiased">
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-16 pt-8 sm:px-10">
                {/* Верхняя панель */}
                <div className="flex justify-end gap-2">
                    <button onClick={() => setModal("qr")} aria-label="QR-код" className={`${pillBtn} w-10 justify-center px-0`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
                            <g fill="currentColor">
                                <path d="M2 2h2v2H2z" />
                                <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z" />
                                <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z" />
                                <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z" />
                                <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z" />
                            </g>
                        </svg>
                    </button>
                    <button
                        onClick={() => setModal("links")}
                        className={pillBtn}
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        Создать ссылку
                    </button>
                </div>

                {/* Заголовок */}
                <section className="flex flex-1 flex-col items-center justify-center py-12 sm:py-16">
                    <h1 className="text-center text-4xl font-semibold leading-[1.12] tracking-tight sm:text-6xl">
                        Позовите друга
                        <br />и заработайте
                    </h1>

                    {/* Карточки */}
                    <div role="radiogroup" aria-label="Тип приглашения" className="mt-12 grid w-full gap-4 sm:mt-16 md:grid-cols-3">
                        {CARDS.map((c) => (
                            <Offer key={c.id} card={c} active={selected === c.id && c.available} onSelect={() => setSelected(c.id)} />
                        ))}
                    </div>

                    {/* CTA */}
                    <button
                        onClick={share}
                        className="mt-10 h-12 w-full max-w-xs rounded-xl bg-linear-to-r from-[#E61E4D] to-[#D70466] px-6 text-base font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E61E4D] focus-visible:ring-offset-2"
                    >
                        Поделиться реферальной ссылкой
                    </button>
                </section>
            </main>

            {/* Футер */}
            <footer className="border-t border-neutral-200 px-5 py-6 text-center text-xs leading-relaxed text-neutral-500 sm:text-sm">
                Только для регионов и типов жилья, отвечающих критериям. Суммы актуальны до 7 дек. 2026&nbsp;г.{" "}
                <a href="#terms" className="font-medium text-neutral-900 underline underline-offset-2">
                    Действуют условия
                </a>{" "}
                ·{" "}
                <a href="#how" className="font-medium text-neutral-900 underline underline-offset-2">
                    Как работает реферальная программа
                </a>
            </footer>

            {/* Модальные окна */}
            {modal === "share" && (
                <Modal title="Поделиться ссылкой" onClose={() => setModal(null)}>
                    <div className="flex items-center gap-2 rounded-xl border border-neutral-300 p-2 pl-3">
                        <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
                        <button onClick={() => copy(link, "share")} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700">
                            {copied === "share" ? "Скопировано" : "Копировать"}
                        </button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm font-medium">
                        <a
                            href={`https://t.me/share/url?url=${encodeURIComponent(link)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl bg-neutral-100 py-3 hover:bg-neutral-200"
                        >
                            Telegram
                        </a>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(link)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl bg-neutral-100 py-3 hover:bg-neutral-200"
                        >
                            WhatsApp
                        </a>
                    </div>
                </Modal>
            )}

            {modal === "qr" && (
                <Modal title="QR-код приглашения" onClose={() => setModal(null)}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="rounded-2xl border border-neutral-200 p-4">
                            <QRCodeSVG value={link} size={200} />
                        </div>
                        <p className="break-all text-center text-sm text-neutral-500">{link}</p>
                    </div>
                </Modal>
            )}

            {modal === "links" && (
                <Modal
                    title="Пользовательские ссылки"
                    subtitle={`Создайте ещё реферальные ссылки (максимум ${MAX_LINKS}).`}
                    onClose={() => setModal(null)}
                >
                    <ul className="space-y-3">
                        {links.map((slug) => (
                            <li key={slug} className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 px-6 py-5">
                                <div className="min-w-0">
                                    <div className="text-sm text-neutral-500">{HOST}</div>
                                    <div className="truncate text-base text-neutral-900">{slug}</div>
                                </div>
                                <button
                                    onClick={() => copy(fullUrl(slug), slug)}
                                    aria-label={copied === slug ? "Ссылка скопирована" : "Скопировать ссылку"}
                                    className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-neutral-900 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                                >
                                    <CopyIcon done={copied === slug} />
                                </button>
                            </li>
                        ))}

                        <li>
                            <button
                                onClick={createLink}
                                disabled={links.length >= MAX_LINKS}
                                className="flex w-full items-center justify-between rounded-2xl border border-neutral-200 px-6 py-6 text-left text-base text-neutral-900 transition hover:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-200"
                            >
                                {links.length >= MAX_LINKS ? "Достигнут максимум ссылок" : "Создать ссылку"}
                                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                    <path d="M12 4v16M4 12h16" />
                                </svg>
                            </button>
                        </li>
                    </ul>
                </Modal>
            )}
        </div>
    );
}