import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { destinations, tabs } from '../data/data'
import SettingsModal, { Avatar, type Profile } from './Settingsmodal'

type Seg = 'where' | 'when' | 'who' | null
type GKey = 'adults' | 'children' | 'infants' | 'pets'
type AuthMode = 'login' | 'register'

const ORDER: Exclude<Seg, null>[] = ['where', 'when', 'who']

const MONTHS = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
]

const plural = (n: number, a: string, b: string, c: string) =>
    n % 10 === 1 && n % 100 !== 11
        ? a
        : n % 10 >= 2 &&
            n % 10 <= 4 &&
            (n % 100 < 10 || n % 100 >= 20)
            ? b
            : c

const fmt = (v: string) =>
    new Date(v).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
    })

const today = new Date().toISOString().slice(0, 10)

const DROPDOWN =
    'absolute z-[60] rounded-[32px] bg-white shadow-[0_8px_28px_rgba(0,0,0,.2)] animate-pop'

const CHIP =
    'rounded-full border border-line text-sm transition duration-150 hover:border-ink'

const CHIP_ON =
    'border-ink bg-[#f7f7f7] shadow-[0_0_0_1px_#222]'

const HINT = 'mt-0.5 block text-sm text-muted'

// из записи пользователя убираем пароль и id — в сессии они не нужны
const toProfile = (u: any): Profile => {
    const p = { ...u }

    delete p.password
    delete p.id

    return p as Profile
}

const readUsers = (): any[] =>
    JSON.parse(localStorage.getItem('airbnb_users') || '[]')

const writeUsers = (users: any[]) =>
    localStorage.setItem('airbnb_users', JSON.stringify(users))

const startSession = (profile: Profile) => {
    localStorage.setItem('airbnb_user', JSON.stringify(profile))
    localStorage.setItem('airbnb_logged_in', 'true')
}


function Tab({ t }: { t: (typeof tabs)[number] }) {
    const { pathname } = useLocation()
    const active = pathname === t.to
    const v = useRef<HTMLVideoElement>(null)

    const play = () => {
        const el = v.current

        if (el) {
            el.currentTime = 0
            el.play().catch(() => { })
        }
    }

    useEffect(() => {
        if (!active) return

        const id = setTimeout(play, 200)

        return () => clearTimeout(id)
    }, [active])

    return (
        <Link
            to={t.to}
            role="tab"
            aria-selected={active}
            onMouseEnter={play}
            onClick={play}
            className={`group relative flex items-center px-3.5 pb-2 text-base transition-colors duration-200 hover:text-ink
                max-[900px]:px-1.5 max-[900px]:pb-1.5 max-[900px]:text-sm
                ${active ? 'font-semibold text-ink' : 'text-muted'}`}
        >
            <span className="my-4 ml-3 mr-4 block h-8 w-8 flex-none scale-[2] max-[900px]:my-2.5 max-[900px]:ml-1.5 max-[900px]:mr-2">
                <video
                    ref={v}
                    muted
                    playsInline
                    preload="auto"
                    poster={t.poster}
                    className="block h-full w-full object-contain"
                >
                    <source
                        src={t.mov}
                        type='video/mp4; codecs="hvc1"'
                    />
                    <source
                        src={t.webm}
                        type="video/webm"
                    />
                </video>
            </span>

            <span>{t.label}</span>

            <span
                className={`absolute inset-x-3.5 bottom-0 h-0.5 transition-transform duration-300 ease-smooth
                    ${active
                        ? 'scale-x-100 bg-ink'
                        : 'scale-x-0 bg-[#b0b0b0] group-hover:scale-x-100'
                    }`}
            />
        </Link>
    )
}


export default function Header() {

    // ================= SEARCH =================

    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState<Seg>(null)
    const [hov, setHov] = useState<Seg>(null)

    // ================= MENU =================

    const [menuOpen, setMenuOpen] = useState(false)

    // ================= AUTH =================

    const [authOpen, setAuthOpen] = useState(false)
    const [authMode, setAuthMode] =
        useState<AuthMode>('register')

    const [authName, setAuthName] = useState('')
    const [authEmail, setAuthEmail] = useState('')
    const [authPassword, setAuthPassword] = useState('')
    const [authError, setAuthError] = useState('')

    const [isLoggedIn, setIsLoggedIn] = useState(
        () =>
            localStorage.getItem('airbnb_logged_in') ===
            'true'
    )

    const [user, setUser] = useState<Profile | null>(() => {
        const saved = localStorage.getItem('airbnb_user')

        return saved ? JSON.parse(saved) : null
    })

    // ================= SETTINGS =================

    const [settingsOpen, setSettingsOpen] = useState(false)

    // ================= SEARCH STATE =================

    const [where, setWhere] = useState('')
    const [sel, setSel] = useState(-1)
    const [mode, setMode] =
        useState<'dates' | 'flex'>('flex')

    const [duration, setDuration] = useState('')
    const [months, setMonths] = useState<string[]>([])
    const [checkin, setCheckin] = useState('')
    const [checkout, setCheckout] = useState('')

    const [guests, setGuests] = useState<
        Record<GKey, number>
    >({
        adults: 0,
        children: 0,
        infants: 0,
        pets: 0
    })

    const [summary, setSummary] = useState({
        where: '',
        when: '',
        who: ''
    })

    const [toast, setToast] = useState('')
    const [toastOn, setToastOn] = useState(false)

    const whereRef = useRef<HTMLInputElement>(null)
    const monthsRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLFormElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const toastTimer = useRef<number | undefined>(undefined)


    // ================= SEARCH FUNCTIONS =================

    const closeSearch = useCallback(() => {
        setOpen(false)
        setActive(null)
        setMenuOpen(false)
    }, [])

    const activate = (n: Seg) => {
        setMenuOpen(false)
        setActive(n)
    }


    useEffect(() => {
        const onScroll = () => {
            const s = scrollY > 10

            setScrolled(s)

            if (s) {
                closeSearch()
            }
        }

        const onClick = (e: MouseEvent) => {
            const t = e.target as Node

            if (
                !searchRef.current?.contains(t) &&
                !menuRef.current?.contains(t)
            ) {
                closeSearch()
            }
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeSearch()
                setAuthOpen(false)
                setSettingsOpen(false)
            }
        }

        onScroll()

        addEventListener('scroll', onScroll, {
            passive: true
        })

        document.addEventListener('click', onClick)
        document.addEventListener('keydown', onKey)

        return () => {
            removeEventListener('scroll', onScroll)
            document.removeEventListener('click', onClick)
            document.removeEventListener('keydown', onKey)
        }
    }, [closeSearch])


    // ================= AUTH =================

    const openAuth = (mode: AuthMode) => {
        setMenuOpen(false)
        setAuthMode(mode)

        setAuthName('')
        setAuthEmail('')
        setAuthPassword('')
        setAuthError('')

        setAuthOpen(true)
    }

    const closeAuth = () => {
        setAuthOpen(false)
        setAuthError('')
    }


    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault()

        setAuthError('')

        if (!authEmail.trim()) {
            setAuthError(
                'Введите email или номер телефона'
            )
            return
        }

        if (authPassword.length < 6) {
            setAuthError(
                'Пароль должен содержать минимум 6 символов'
            )
            return
        }

        if (
            authMode === 'register' &&
            !authName.trim()
        ) {
            setAuthError('Введите ваше имя')
            return
        }

        const users = readUsers()


        // ================= REGISTER =================

        if (authMode === 'register') {

            const exists = users.find(
                (u: any) =>
                    u.email === authEmail.trim()
            )

            if (exists) {
                setAuthError(
                    'Такой аккаунт уже существует'
                )
                return
            }

            const newUser = {
                id: Date.now(),
                name: authName.trim(),
                email: authEmail.trim(),
                password: authPassword
            }

            users.push(newUser)
            writeUsers(users)

            const profile = toProfile(newUser)

            startSession(profile)
            setUser(profile)
            setIsLoggedIn(true)
            setAuthOpen(false)

            return
        }


        // ================= LOGIN =================

        const foundUser = users.find(
            (u: any) =>
                u.email === authEmail.trim() &&
                u.password === authPassword
        )

        if (!foundUser) {
            setAuthError(
                'Неверный email или пароль'
            )
            return
        }

        const profile = toProfile(foundUser)

        startSession(profile)
        setUser(profile)
        setIsLoggedIn(true)
        setAuthOpen(false)
    }


    const logout = () => {
        localStorage.removeItem('airbnb_user')
        localStorage.removeItem('airbnb_logged_in')
        setUser(null)
        setIsLoggedIn(false)
        setMenuOpen(false)
        setAuthOpen(false)
        setSettingsOpen(false)
        closeSearch()
        window.location.reload()
    }


    // ================= SETTINGS FUNCTIONS =================

    const saveProfile = (p: Profile) => {
        setUser(p)
        localStorage.setItem('airbnb_user', JSON.stringify(p))

        writeUsers(
            readUsers().map((u: any) =>
                u.email === p.email ? { ...u, ...p } : u
            )
        )
    }

    const changePassword = (oldPass: string, newPass: string) => {
        const users = readUsers()
        const me = users.find((u: any) => u.email === user?.email)

        if (!me || me.password !== oldPass) {
            return 'Неверный текущий пароль'
        }

        me.password = newPass
        writeUsers(users)

        return null
    }

    const deleteAccount = () => {
        writeUsers(
            readUsers().filter((u: any) => u.email !== user?.email)
        )

        logout()
    }


    const socialLogin = (
        provider: 'google' | ''
    ) => {

        const email =
            provider === 'google'
                ? 'google@example.com'
                : 'apple@example.com'

        const users = readUsers()

        let found = users.find((u: any) => u.email === email)

        if (!found) {
            found = {
                id: Date.now(),
                name:
                    provider === 'google'
                        ? 'Google пользователь'
                        : 'Apple пользователь',
                email
            }

            users.push(found)
            writeUsers(users)
        }

        const profile = toProfile(found)

        startSession(profile)
        setUser(profile)
        setIsLoggedIn(true)
        setAuthOpen(false)
    }


    // ================= SEARCH HELPERS =================

    const q = where.trim().toLowerCase()

    const isVisible = (
        d: (typeof destinations)[number]
    ) =>
        !q ||
        (!d.near &&
            d.name.toLowerCase().includes(q))

    const visible = destinations.filter(isVisible)

    const cap = q
        ? visible.length
            ? 'Направления'
            : 'Ничего не найдено'
        : 'Рекомендуемые направления'


    const pick = (
        d: (typeof destinations)[number]
    ) => {
        setWhere(d.name)
        setSel(-1)
        activate('when')
    }


    const onWhereKey = (
        e: React.KeyboardEvent
    ) => {

        if (!visible.length) return

        if (
            e.key === 'ArrowDown' ||
            e.key === 'ArrowUp'
        ) {

            e.preventDefault()

            setSel(
                i =>
                    (
                        i +
                        (e.key === 'ArrowDown'
                            ? 1
                            : -1) +
                        visible.length
                    ) %
                    visible.length
            )

        } else if (
            e.key === 'Enter' &&
            sel > -1
        ) {

            e.preventDefault()

            pick(visible[sel])
        }
    }


    const monthList = useMemo(() => {

        const now = new Date()

        return Array.from(
            { length: 12 },
            (_, i) => {

                const d = new Date(
                    now.getFullYear(),
                    now.getMonth() + i,
                    1
                )

                return {
                    key: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
                    name: MONTHS[d.getMonth()],
                    year: d.getFullYear()
                }
            }
        )

    }, [])


    const whenText = () => {

        if (mode === 'dates') {

            return checkin
                ? fmt(checkin) +
                (checkout
                    ? ' – ' + fmt(checkout)
                    : '')
                : ''
        }


        const m = months
            .map(k =>
                k
                    .split(' ')[0]
                    .slice(0, 3)
                    .toLowerCase()
            )
            .join(', ')


        return [duration, m]
            .filter(Boolean)
            .join(' · ')
    }


    const changeGuest = (
        k: GKey,
        d: number
    ) => {

        setGuests(g => {

            const n = {
                ...g,
                [k]: Math.max(0, g[k] + d)
            }

            if (
                k !== 'adults' &&
                k !== 'pets' &&
                n[k] &&
                !n.adults
            ) {
                n.adults = 1
            }

            if (
                k === 'adults' &&
                !n.adults &&
                (n.children || n.infants)
            ) {
                n.adults = 1
            }

            return n
        })
    }


    const guestText = () => {

        const n =
            guests.adults +
            guests.children

        const p: string[] = []

        if (n) {
            p.push(
                `${n} ${plural(
                    n,
                    'гость',
                    'гостя',
                    'гостей'
                )}`
            )
        }

        if (guests.infants) {
            p.push(
                `${guests.infants} ${plural(
                    guests.infants,
                    'младенец',
                    'младенца',
                    'младенцев'
                )}`
            )
        }

        if (guests.pets) {
            p.push(
                `${guests.pets} ${plural(
                    guests.pets,
                    'питомец',
                    'питомца',
                    'питомцев'
                )}`
            )
        }

        return p.join(', ')
    }


    const lockAdults =
        guests.adults === 1 &&
        (
            guests.children > 0 ||
            guests.infants > 0
        )


    const onSubmit = (
        e: React.FormEvent
    ) => {

        e.preventDefault()

        const w = where.trim()
        const when = whenText()
        const g = guestText()

        setSummary({
            where: w,
            when,
            who: g
        })

        closeSearch()

        document.dispatchEvent(
            new CustomEvent('airbnb:search', {
                detail: {
                    where: w,
                    when,
                    mode,
                    checkin,
                    checkout,
                    months,
                    duration,
                    ...guests
                }
            })
        )

        setToast(
            `Ищем: ${w || 'везде'}${when ? ', ' + when : ''
            }${g ? ', ' + g : ''}`
        )

        setToastOn(true)

        clearTimeout(toastTimer.current)

        toastTimer.current =
            window.setTimeout(
                () => setToastOn(false),
                3000
            )
    }


    const whenT = whenText()
    const whoT = guestText()

    const collapsed =
        scrolled && !open

    const hasActive =
        active !== null


    const segClick =
        (n: Exclude<Seg, null>) =>
            (e: React.MouseEvent) => {

                if (
                    (e.target as HTMLElement)
                        .closest('.dropdown')
                ) {
                    return
                }

                activate(n)

                if (n === 'where') {
                    whereRef.current?.focus()
                }
            }


    const segCls = (
        n: Exclude<Seg, null>
    ) => {

        const isActive =
            active === n

        return `relative flex flex-col justify-center rounded-full px-8 transition-colors duration-150
            max-[900px]:px-6 max-[900px]:py-3.5
            ${n === 'where' ? 'flex-[1.25]' : 'flex-1'}
            ${n === 'who'
                ? 'pr-[150px] max-[900px]:pb-[76px] max-[900px]:pr-6'
                : ''
            }
            ${isActive
                ? 'z-[2] bg-white shadow-[0_6px_20px_rgba(0,0,0,.2)]'
                : hasActive
                    ? 'hover:bg-[#dedede]'
                    : 'hover:bg-soft'
            }`
    }


    const divider = (
        n: Exclude<Seg, null>
    ) => {

        const i = ORDER.indexOf(n)

        if (i === 0) return null

        const hide = [
            hov,
            active
        ].some(
            s =>
                s === n ||
                s === ORDER[i - 1]
        )

        return (
            <span
                aria-hidden
                className={`pointer-events-none absolute bottom-4 left-0 top-4 w-px bg-line transition-opacity duration-150 max-[900px]:hidden ${hide ? 'opacity-0' : ''
                    }`}
            />
        )
    }


    const segProps = (
        n: Exclude<Seg, null>
    ) => ({
        onClick: segClick(n),
        onMouseEnter: () => setHov(n),
        onMouseLeave: () => setHov(null)
    })


    const counter = (
        k: GKey,
        title: string,
        hint: React.ReactNode
    ) => (
        <div className="flex items-center justify-between border-t border-line py-5">

            <div>
                <b className="text-base font-medium">
                    {title}
                </b>

                {hint}
            </div>

            <div className="flex items-center gap-3.5">

                <button
                    type="button"
                    className="h-8 w-8 rounded-full bg-soft text-xl leading-none transition-colors duration-150 enabled:hover:bg-[#e4e4e4] disabled:cursor-default disabled:text-[#c8c8c8]"
                    disabled={
                        !guests[k] ||
                        (
                            k === 'adults' &&
                            lockAdults
                        )
                    }
                    onClick={() =>
                        changeGuest(k, -1)
                    }
                >
                    −
                </button>

                <span className="min-w-5 text-center">
                    {guests[k]}
                </span>

                <button
                    type="button"
                    className="h-8 w-8 rounded-full bg-soft text-xl leading-none transition-colors duration-150 hover:bg-[#e4e4e4]"
                    onClick={() =>
                        changeGuest(k, 1)
                    }
                >
                    +
                </button>

            </div>
        </div>
    )


    const searchIcon = (size: number) => (
        <svg
            viewBox="0 0 32 32"
            width={size}
            height={size}
            fill="none"
            stroke="#fff"
            strokeWidth="4"
        >
            <path d="m20.7 20.7 10 10" />
            <circle
                cx="12.7"
                cy="12.7"
                r="11.3"
            />
        </svg>
    )


    // ================= HEADER =================

    return (
        <>
            <header
                id="header"
                className={`sticky top-0 z-50 border-b bg-white ${scrolled
                    ? 'border-line'
                    : 'border-transparent'
                    }`}
            >

                <div
                    className={`relative grid grid-cols-[1fr_auto_1fr] items-center px-10 max-[900px]:px-4 ${collapsed
                        ? 'h-20'
                        : 'h-24 max-[900px]:h-21'
                        }`}
                >

                    {/* LOGO */}

                    <Link
                        to="/"
                        aria-label="Airbnb"
                        className="flex items-center gap-1.5 text-[22px] font-extrabold tracking-[-0.5px] text-brand"
                    >
                        <svg
                            viewBox="0 0 32 32"
                            width="32"
                            height="32"
                            fill="currentColor"
                        >
                            <path d="M16 1c-2 0-3.700 1.100-4.800 3.200L3.300 19.900c-.5 1.100-.9 2.200-.9 3.400C2.400 26.600 4.900 29 8 29c2.100 0 4.300-1.300 6.700-3.800.5-.5.900-1 1.300-1.500.4.500.8 1 1.300 1.500C19.700 27.700 21.900 29 24 29c3.100 0 5.600-2.400 5.600-5.700 0-1.200-.4-2.300-.9-3.400L20.800 4.200C19.700 2.100 18 1 16 1zm0 2.200c1.100 0 2 .6 2.700 2l7.900 15.700c.4.800.7 1.600.7 2.400 0 2-1.500 3.500-3.400 3.500-1.500 0-3.200-1-5.300-3.200-.8-.8-1.600-1.800-2.200-2.800 1.500-2.500 2.300-4.500 2.300-5.900 0-2.200-1.300-3.700-3.200-3.700s-3.200 1.500-3.200 3.700c0 1.400.8 3.400 2.300 5.900-.6 1-1.400 2-2.200 2.800C11.200 26 9.500 27 8 27c-1.900 0-3.400-1.500-3.400-3.500 0-.8.300-1.600.7-2.400l7.900-15.700c.7-1.400 1.600-2 2.700-2z" />
                        </svg>

                        <span className="max-[900px]:hidden">
                            airbnb
                        </span> 
                    </Link>


                    {/* TABS */}

                    <nav
                        role="tablist"
                        aria-label="Категории"
                        className={`flex gap-1 transition-[opacity,transform] duration-300 ease-smooth ${collapsed
                            ? 'pointer-events-none -translate-y-5 scale-[.85] opacity-0'
                            : ''
                            }`}
                    >
                        {tabs.map(t => (
                            <Tab
                                key={t.to}
                                t={t}
                            />
                        ))}
                    </nav>


                    {/* COLLAPSED SEARCH */}

                    <button
                        type="button"
                        aria-label="Открыть поиск"
                        onClick={() => {
                            setOpen(true)
                            activate('where')
                            whereRef.current?.focus()
                        }}
                        className={`absolute left-1/2 top-1/2 flex h-12 -translate-x-1/2 -translate-y-1/2 items-center rounded-full border border-line bg-white pr-2 text-sm font-semibold shadow-[0_2px_10px_rgba(0,0,0,.12)] transition-[opacity,transform] duration-300 ease-smooth ${collapsed
                            ? 'opacity-100'
                            : 'pointer-events-none scale-[.6] opacity-0'
                            }`}
                    >

                        <span className="whitespace-nowrap border-r border-line px-4">
                            {summary.where ||
                                'Любое место'}
                        </span>

                        <span className="whitespace-nowrap border-r border-line px-4">
                            {summary.when ||
                                'Любая неделя'}
                        </span>

                        <span
                            className={`whitespace-nowrap px-4 ${summary.who
                                ? ''
                                : 'font-normal text-muted'
                                }`}
                        >
                            {summary.who ||
                                'Гости'}
                        </span>

                        <b className="grid h-8 w-8 place-items-center rounded-full bg-brand">
                            {searchIcon(12)}
                        </b>

                    </button>


                    {/* USER MENU */}

                    <div className="flex items-center justify-end gap-1.5">

                        <div
                            className="relative"
                            ref={menuRef}
                        >

                            <button
                                type="button"
                                aria-haspopup="true"
                                aria-expanded={menuOpen}
                                onClick={() => {
                                    setActive(null)
                                    setMenuOpen(v => !v)
                                }}
                                className="flex h-10.5 items-center gap-3 rounded-full border border-line pl-3.5 pr-2 text-muted hover:shadow-[0_2px_6px_rgba(0,0,0,.18)]"
                            >

                                <svg
                                    viewBox="0 0 32 32"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                >
                                    <path d="M2 8h28M2 16h28M2 24h28" />
                                </svg>

                                {isLoggedIn && user ? (
                                    <Avatar user={user} size={30} />
                                ) : (
                                    <svg
                                        viewBox="0 0 32 32"
                                        width="30"
                                        height="30"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle
                                            cx="16"
                                            cy="16"
                                            r="14"
                                        />

                                        <path d="M26.5 25.6c-1.600-2.800-4.300-4.900-7.500-5.700v-.7c1.800-1 3-3 3-5.200 0-3.300-2.700-6-6-6s-6 2.700-6 6c0 2.200 1.200 4.100 3 5.200v.7c-3.200.8-5.800 2.900-7.400 5.600" />
                                    </svg>
                                )}

                            </button>


                            <div
                                hidden={!menuOpen}
                                className={`dropdown ${DROPDOWN} right-0 top-13 w-60 py-2`}
                            >

                                {isLoggedIn ? (
                                    <>

                                        <div className="flex items-center gap-3 px-4 py-3">
                                            <Avatar user={user} size={40} />

                                            <div className="min-w-0">
                                                <div className="truncate font-semibold">
                                                    {user?.name}
                                                </div>

                                                <div className="mt-0.5 truncate text-xs text-muted">
                                                    {user?.email}
                                                </div>
                                            </div>
                                        </div>

                                        <hr className="my-2 border-t border-line" />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMenuOpen(false)
                                                setSettingsOpen(true)
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-soft"
                                        >
                                            ⚙ Настройки аккаунта
                                        </button>

                                        <Link
                                            to="/help"
                                            onClick={() =>
                                                setMenuOpen(false)
                                            }
                                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-soft"
                                        >
                                            ?
                                            Центр помощи
                                        </Link>


                                        <hr className="my-2 border-t border-line" />


                                        <Link
                                            to="/host"
                                            onClick={() =>
                                                setMenuOpen(false)
                                            }
                                            className="block px-4 py-3 text-sm font-semibold hover:bg-soft"
                                        >
                                            Поставить объявление
                                        </Link>

                                        <Link
                                            to="/invite"
                                            onClick={() =>
                                                setMenuOpen(false)
                                            }
                                            className="block px-4 py-3 text-sm hover:bg-soft"
                                        >
                                            Пригласить хозяина
                                        </Link>

                                        <Link
                                            to="/invite"
                                            onClick={() =>
                                                setMenuOpen(false)
                                            }
                                            className="block px-4 py-3 text-sm hover:bg-soft"
                                        >
                                            Найти второго хозяина
                                        </Link>


                                        <hr className="my-2 border-t border-line" />


                                        <button
                                            type="button"
                                            onClick={logout}
                                            className="block w-full rounded-b-2xl px-4 py-3 text-left text-sm hover:bg-soft"
                                        >
                                            Выйти
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openAuth(
                                                    'register'
                                                )
                                            }
                                            className="block w-full px-4 py-3 text-left text-sm hover:bg-soft"
                                        >
                                            <b>
                                                Зарегистрироваться
                                            </b>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openAuth(
                                                    'login'
                                                )
                                            }
                                            className="block w-full px-4 py-3 text-left text-sm hover:bg-soft"
                                        >
                                            Войти
                                        </button>
                                    </>
                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* SEARCH FORM */}

                <form
                    ref={searchRef}
                    autoComplete="off"
                    onSubmit={onSubmit}
                    className={`relative mx-auto flex w-[min(850px,calc(100%-32px))] origin-top items-stretch rounded-full border transition-[transform,opacity,height,margin,background-color] duration-300 ease-smooth max-[900px]:flex-col max-[900px]:rounded-3xl ${collapsed
                        ? 'pointer-events-none mb-0 h-0 -translate-y-20 scale-[.4] overflow-hidden opacity-0'
                        : 'mb-4 h-16.5 max-[900px]:h-auto'
                        } ${hasActive
                            ? 'border-transparent bg-grey'
                            : 'border-line bg-white shadow-[0_3px_12px_rgba(0,0,0,.1)]'
                        }`}
                >

                    {/* WHERE */}

                    <div
                        className={segCls('where')}
                        {...segProps('where')}
                    >

                        <label
                            htmlFor="where"
                            className="cursor-pointer text-xs font-semibold"
                        >
                            Где
                        </label>

                        <input
                            id="where"
                            ref={whereRef}
                            placeholder="Поиск направлений"
                            aria-autocomplete="list"
                            className="w-full border-0 bg-transparent py-0.5 text-left text-sm text-muted outline-none"
                            value={where}
                            onChange={e => {
                                setWhere(e.target.value)
                                setSel(-1)
                            }}
                            onKeyDown={onWhereKey}
                        />

                        <div
                            hidden={
                                active !== 'where'
                            }
                            className={`dropdown ${DROPDOWN} left-0 top-19 max-h-105 w-105 overflow-auto py-6 max-[900px]:top-full max-[900px]:w-full`}
                        >

                            <p className="px-8 pb-2 text-xs font-semibold text-muted">
                                {cap}
                            </p>

                            <div>

                                {destinations.map(d => {

                                    const idx =
                                        visible.indexOf(d)

                                    return (
                                        <button
                                            key={d.name}
                                            type="button"
                                            onClick={() =>
                                                pick(d)
                                            }
                                            className={`${isVisible(d)
                                                ? 'flex'
                                                : 'hidden'
                                                } w-full items-center gap-4 px-8 py-2 text-left text-sm hover:bg-soft ${idx === sel
                                                    ? 'bg-soft'
                                                    : ''
                                                }`}
                                        >

                                            <i
                                                className="grid h-14 w-14 flex-none place-items-center rounded-xl not-italic"
                                                style={{
                                                    background:
                                                        d.bg,
                                                    color: '#2f6f8f'
                                                }}
                                            >
                                                {d.near ? (
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                        height="24"
                                                        fill="none"
                                                        stroke="#4a78b5"
                                                        strokeWidth="1.6"
                                                    >
                                                        <path d="M20 4 4 11l6.500 2.500L13 20z" />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        width="26"
                                                        height="26"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path d="M3 21h18M6 21V9l5-4 5 4v12M9 21v-5h4v5M9 12h2" />
                                                    </svg>
                                                )}
                                            </i>

                                            <span>
                                                <b>
                                                    {d.name}
                                                </b>

                                                <small className="mt-0.5 block text-[13px] text-muted">
                                                    {d.hint}
                                                </small>
                                            </span>

                                        </button>
                                    )
                                })}

                            </div>

                        </div>

                    </div>


                    {/* WHEN */}

                    <div
                        className={segCls('when')}
                        tabIndex={0}
                        {...segProps('when')}
                    >

                        {divider('when')}

                        <label className="cursor-pointer text-xs font-semibold">
                            Когда
                        </label>

                        <button
                            type="button"
                            className={`w-full border-0 bg-transparent py-0.5 text-left text-sm outline-none ${whenT
                                ? 'text-ink'
                                : 'text-muted'
                                }`}
                        >
                            {whenT || 'Любые даты'}
                        </button>

                    </div>


                    {/* WHO */}

                    <div
                        className={segCls('who')}
                        {...segProps('who')}
                    >

                        {divider('who')}

                        <label className="cursor-pointer text-xs font-semibold">
                            Кто
                        </label>

                        <button
                            type="button"
                            className={`w-full border-0 bg-transparent py-0.5 text-left text-sm outline-none ${whoT
                                ? 'text-ink'
                                : 'text-muted'
                                }`}
                        >
                            {whoT || 'Кто едет?'}
                        </button>


                        <div
                            hidden={
                                active !== 'who'
                            }
                            className={`dropdown ${DROPDOWN} right-0 top-19 w-105 px-8 py-4 max-[900px]:top-full max-[900px]:w-full`}
                        >

                            {counter(
                                'adults',
                                'Взрослые',
                                <small
                                    className={HINT}
                                >
                                    От 13 лет
                                </small>
                            )}

                            {counter(
                                'children',
                                'Дети',
                                <small
                                    className={HINT}
                                >
                                    Возраст от 2 до 12
                                </small>
                            )}

                            {counter(
                                'infants',
                                'Младенцы',
                                <small
                                    className={HINT}
                                >
                                    Младше 2
                                </small>
                            )}

                            {counter(
                                'pets',
                                'Домашние животные',
                                <a
                                    className="mt-0.5 block text-sm font-semibold text-[#b0b0b0] underline"
                                    href="/help"
                                >
                                    Путешествуете с животным-помощником?
                                </a>
                            )}

                        </div>

                    </div>


                    {/* SEARCH BUTTON */}

                    <button
                        type="submit"
                        className="absolute right-2.5 top-2.25 z-3 flex h-12 items-center gap-2 rounded-full bg-[linear-gradient(90deg,#e61e4d,#e31c5f_50%,#d70466)] px-5 text-base font-semibold text-white transition-transform duration-150 active:scale-95 max-[900px]:bottom-2.5 max-[900px]:top-auto"
                    >
                        {searchIcon(16)}

                       
                    </button>


                    {/* WHEN DROPDOWN */}

                    <div
                        hidden={
                            active !== 'when'
                        }
                        className={`dropdown ${DROPDOWN} inset-x-0 top-19 max-h-[calc(100vh-200px)] overflow-auto px-8 pb-8 pt-6 text-center max-[900px]:top-full max-[900px]:px-4 max-[900px]:py-5`}
                    >

                        <div className="relative mb-10 inline-flex rounded-full bg-grey p-1">

                            {(
                                ['dates', 'flex'] as const
                            ).map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() =>
                                        setMode(m)
                                    }
                                    className={`z-1 w-37.5 rounded-full py-3 text-sm ${mode === m
                                        ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,.2)]'
                                        : ''
                                        }`}
                                >
                                    {m === 'dates'
                                        ? 'Даты'
                                        : 'Гибко'}
                                </button>
                            ))}

                        </div>


                        <div hidden={mode !== 'dates'}>

                            <div className="mx-auto mb-4 flex max-w-130 gap-3">

                                <label className="flex-1 rounded-2xl border border-line px-4 py-3.5 text-left text-xs font-semibold">

                                    Прибытие

                                    <input
                                        type="date"
                                        min={today}
                                        value={checkin}
                                        className="mt-1 block w-full border-0 text-sm outline-none"
                                        onChange={e => {
                                            setCheckin(
                                                e.target.value
                                            )

                                            if (
                                                checkout &&
                                                checkout <
                                                e.target
                                                    .value
                                            ) {
                                                setCheckout('')
                                            }
                                        }}
                                    />

                                </label>


                                <label className="flex-1 rounded-2xl border border-line px-4 py-3.5 text-left text-xs font-semibold">

                                    Выезд

                                    <input
                                        type="date"
                                        min={
                                            checkin ||
                                            today
                                        }
                                        value={checkout}
                                        className="mt-1 block w-full border-0 text-sm outline-none"
                                        onChange={e => {
                                            setCheckout(
                                                e.target.value
                                            )

                                            if (
                                                e.target
                                                    .value
                                            ) {
                                                activate(
                                                    'who'
                                                )
                                            }
                                        }}
                                    />

                                </label>

                            </div>

                        </div>


                        <div hidden={mode !== 'flex'}>

                            <h3 className="mb-5 text-lg font-medium">
                                На какой срок вы ищете жильё?
                            </h3>

                            <div className="mb-12 flex justify-center gap-2">

                                {[
                                    'Выходные',
                                    'Неделя',
                                    'Месяц'
                                ].map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() =>
                                            setDuration(
                                                d =>
                                                    d === c
                                                        ? ''
                                                        : c
                                            )
                                        }
                                        className={`${CHIP} px-5 py-3 ${duration === c
                                            ? CHIP_ON
                                            : ''
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}

                            </div>


                            <h3 className="mb-5 text-lg font-medium">
                                Когда вы едете?
                            </h3>


                            <div className="relative">

                                <div
                                    ref={monthsRef}
                                    className="flex gap-2 overflow-x-auto scroll-smooth p-0.5 scrollbar-none"
                                >

                                    {monthList.map(m => (
                                        <button
                                            key={m.key}
                                            type="button"
                                            onClick={() =>
                                                setMonths(
                                                    a =>
                                                        a.includes(
                                                            m.key
                                                        )
                                                            ? a.filter(
                                                                x =>
                                                                    x !==
                                                                    m.key
                                                            )
                                                            : [
                                                                ...a,
                                                                m.key
                                                            ]
                                                )
                                            }
                                            className={`${CHIP} flex h-34 w-30.5 flex-none flex-col items-center justify-center gap-1 rounded-2xl font-medium ${months.includes(
                                                m.key
                                            )
                                                ? CHIP_ON
                                                : ''
                                                }`}
                                        >

                                            <svg
                                                width="32"
                                                height="32"
                                                viewBox="0 0 32 32"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="mb-3 text-[#666]"
                                            >
                                                <rect
                                                    x="4"
                                                    y="7"
                                                    width="24"
                                                    height="21"
                                                    rx="3"
                                                />

                                                <path d="M4 14h24M10 3v6M22 3v6" />
                                            </svg>

                                            {m.name}

                                            <small className="text-xs font-normal text-muted">
                                                {m.year}
                                            </small>

                                        </button>
                                    ))}

                                </div>


                                <button
                                    type="button"
                                    aria-label="Дальше"
                                    onClick={() =>
                                        monthsRef.current?.scrollBy(
                                            {
                                                left: 400
                                            }
                                        )
                                    }
                                    className="absolute -right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white text-xl shadow-[0_0_0_1px_#ddd,0_2px_6px_rgba(0,0,0,.15)]"
                                >
                                    ›
                                </button>

                            </div>

                        </div>

                    </div>

                </form>

            </header>


            {/* SEARCH OVERLAY */}

            <div
                onClick={closeSearch}
                className={`fixed inset-0 z-40 bg-black/25 transition-opacity duration-250 ${open
                    ? 'opacity-100'
                    : 'pointer-events-none opacity-0'
                    }`}
            />


            {/* TOAST */}

            <div
                role="status"
                className={`pointer-events-none fixed bottom-8 left-1/2 z-80 -translate-x-1/2 rounded-xl bg-ink px-5.5 py-3.5 text-sm text-white transition duration-300 ease-smooth ${toastOn
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-5 opacity-0'
                    }`}
            >
                {toast}
            </div>


            {/* ================= AUTH MODAL ================= */}

            <div
                className={`fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4 transition ${authOpen
                    ? 'visible opacity-100'
                    : 'pointer-events-none invisible opacity-0'
                    }`}
                onMouseDown={e => {
                    if (
                        e.target === e.currentTarget
                    ) {
                        closeAuth()
                    }
                }}
            >

                <div className="relative w-full max-w-120 rounded-[28px] bg-white p-8 shadow-2xl">

                    <button
                        type="button"
                        onClick={closeAuth}
                        className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-2xl hover:bg-soft"
                    >
                        ×
                    </button>


                    <div className="mb-5 flex justify-center">

                        <svg
                            viewBox="0 0 32 32"
                            width="42"
                            height="42"
                            fill="#ff385c"
                        >
                            <path d="M16 1c-2 0-3.7 1.1-4.8 3.2L3.3 19.9c-.5 1.1-.9 2.2-.9 3.4C2.4 26.6 4.9 29 8 29c2.1 0 4.3-1.3 6.7-3.8.5-.5.9-1 1.3-1.5.4.5.8 1 1.3 1.5C19.7 27.700 21.9 29 24 29c3.1 0 5.6-2.4 5.6-5.7 0-1.2-.4-2.3-.9-3.4L20.8 4.2C19.7 2.1 18 1 16 1z" />
                        </svg>

                    </div>


                    <h2 className="mb-6 text-center text-2xl font-semibold">
                        {authMode === 'register'
                            ? 'Войдите или зарегистрируйтесь'
                            : 'Войти в аккаунт'}
                    </h2>


                    <form
                        onSubmit={handleAuth}
                        className="space-y-3"
                    >

                        {authMode === 'register' && (
                            <input
                                type="text"
                                placeholder="Ваше имя"
                                value={authName}
                                onChange={e =>
                                    setAuthName(
                                        e.target.value
                                    )
                                }
                                className="h-15 w-full rounded-xl border border-[#999] px-4 outline-none"
                            />
                        )}


                        <input
                            type="text"
                            placeholder="Номер телефона или эл. почта"
                            value={authEmail}
                            onChange={e =>
                                setAuthEmail(
                                    e.target.value
                                )
                            }
                            className="h-15 w-full rounded-xl border border-[#999] px-4 outline-none"
                        />


                        <input
                            type="password"
                            placeholder="Пароль"
                            value={authPassword}
                            onChange={e =>
                                setAuthPassword(
                                    e.target.value
                                )
                            }
                            className="h-15 w-full rounded-xl border border-[#999] px-4 outline-none"
                        />


                        {authError && (
                            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                                {authError}
                            </div>
                        )}


                        <button
                            type="submit"
                            className="h-12 w-full rounded-xl bg-[#e51d5f] font-semibold text-white hover:bg-[#d91452]"
                        >
                            {authMode === 'register'
                                ? 'Зарегистрироваться'
                                : 'Войти'}
                        </button>

                    </form>


                    <div className="my-5 flex items-center gap-3">

                        <div className="h-px flex-1 bg-line" />

                        <span className="text-sm text-muted">
                            или
                        </span>

                        <div className="h-px flex-1 bg-line" />

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            socialLogin('google')
                        }
                        className="mb-3 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#999] hover:bg-soft"
                    >
                        <b className="text-lg">
                            G
                        </b>

                        Продолжить с Google
                    </button>


                    <div className="mt-6 text-center text-sm">

                        {authMode === 'register' ? (
                            <>
                                Уже есть аккаунт?{' '}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setAuthMode(
                                            'login'
                                        )
                                        setAuthError('')
                                    }}
                                    className="font-semibold underline"
                                >
                                    Войти
                                </button>
                            </>
                        ) : (
                            <>
                                Нет аккаунта?{' '}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setAuthMode(
                                            'register'
                                        )
                                        setAuthError('')
                                    }}
                                    className="font-semibold underline"
                                >
                                    Зарегистрироваться
                                </button>
                            </>
                        )}

                    </div>

                </div>

            </div>


            {/* ================= SETTINGS MODAL ================= */}

            <SettingsModal
                open={settingsOpen}
                user={user}
                onClose={() => setSettingsOpen(false)}
                onSave={saveProfile}
                onChangePassword={changePassword}
                onDelete={deleteAccount}
            />

        </>
    )
}