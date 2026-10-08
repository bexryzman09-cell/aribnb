import { useEffect, useRef, useState } from 'react'

export type Profile = {
    name: string
    email: string
    phone?: string
    city?: string
    bio?: string
    avatar?: string
    color?: string
    language?: string
    currency?: string
    notify?: {
        messages: boolean
        email: boolean
        promo: boolean
    }
}

type Props = {
    open: boolean
    user: Profile | null
    onClose: () => void
    onSave: (p: Profile) => void
    onChangePassword: (oldPass: string, newPass: string) => string | null
    onDelete: () => void
}

type TabKey = 'profile' | 'security' | 'notify'     

const TABS: { key: TabKey; label: string }[] = [
    { key: 'profile', label: 'Профиль' },
    { key: 'security', label: 'Безопасность' },
    { key: 'notify', label: 'Уведомления' },
   
]

const COLORS = [
    '#ff385c',
    '#222222',
    '#0e7c86',
    '#5b5bd6',
    '#e07a1f',
    '#2f9e44',
    '#c2255c'
]


const CURRENCIES = ['UZS — сум', 'USD — доллар', 'EUR — евро', 'RUB — рубль']

const INPUT =
    'h-14 w-full rounded-xl border border-[#b0b0b0] bg-white px-4 text-base outline-none transition-colors focus:border-ink focus:shadow-[0_0_0_1px_#222] max-[640px]:h-12'

const LABEL = 'mb-1.5 block text-sm font-medium'



const readAvatar = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader()

        reader.onerror = () => reject(new Error('read'))

        reader.onload = () => {
            const img = new Image()

            img.onerror = () => reject(new Error('img'))

            img.onload = () => {
                const size = 256
                const side = Math.min(img.width, img.height)
                const sx = (img.width - side) / 2
                const sy = (img.height - side) / 2

                const canvas = document.createElement('canvas')
                canvas.width = size
                canvas.height = size

                canvas
                    .getContext('2d')!
                    .drawImage(img, sx, sy, side, side, 0, 0, size, size)

                resolve(canvas.toDataURL('image/jpeg', 0.85))
            }

            img.src = reader.result as string
        }

        reader.readAsDataURL(file)
    })

export function Avatar({
    user,
    size,
    className = ''
}: {
    user: Pick<Profile, 'name' | 'avatar' | 'color'> | null
    size: number
    className?: string
}) {
    const style = { width: size, height: size }

    if (user?.avatar) {
        return (
            <img
                src={user.avatar}
                alt=""
                style={style}
                className={`flex-none rounded-full object-cover ${className}`}
            />
        )
    }

    return (
        <span
            style={{
                ...style,
                background: user?.color || '#222',
                fontSize: size * 0.42
            }}
            className={`grid flex-none place-items-center rounded-full font-semibold text-white ${className}`}
        >
            {(user?.name || '?').trim().charAt(0).toUpperCase()}
        </span>
    )
}

function Switch({
    on,
    onChange
}: {
    on: boolean
    onChange: (v: boolean) => void
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => onChange(!on)}
            className={`relative h-8 w-12 flex-none rounded-full transition-colors duration-200 ${on ? 'bg-ink' : 'bg-[#b0b0b0]'
                }`}
        >
            <span
                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-200 ${on ? 'translate-x-4' : ''
                    }`}
            />
        </button>
    )
}

export default function SettingsModal({
    open,
    user,
    onClose,
    onSave,
    onChangePassword,
    onDelete
}: Props) {
    const [tab, setTab] = useState<TabKey>('profile')
    const [form, setForm] = useState<Profile>({ name: '', email: '' })

    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [passMsg, setPassMsg] = useState<{
        ok: boolean
        text: string
    } | null>(null)

    const [confirmDelete, setConfirmDelete] = useState(false)
    const [saved, setSaved] = useState(false)
    const [photoError, setPhotoError] = useState('')

    const fileRef = useRef<HTMLInputElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open || !user) return

        setForm({
            language: 'Русский',
            currency: CURRENCIES[0],
            ...user,
            notify: user.notify ?? {
                messages: true,
                email: true,
                promo: false
            }
        })

        setTab('profile')
        setOldPass('')
        setNewPass('')
        setPassMsg(null)
        setConfirmDelete(false)
        setSaved(false)
        setPhotoError('')
    }, [open, user])

    useEffect(() => {
        bodyRef.current?.scrollTo({ top: 0 })
    }, [tab])

    useEffect(() => {
        if (!open) return

        const prev = document.body.style.overflow

        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = prev
        }
    }, [open])

    const set = <K extends keyof Profile>(k: K, v: Profile[K]) => {
        setSaved(false)
        setForm(f => ({ ...f, [k]: v }))
    }

    const notify = form.notify ?? {
        messages: true,
        email: true,
        promo: false
    }

    const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        e.target.value = ''

        if (!file) return

        if (!file.type.startsWith('image/')) {
            setPhotoError('Выберите файл изображения')
            return
        }

        if (file.size > 8 * 1024 * 1024) {
            setPhotoError('Файл больше 8 МБ')
            return
        }

        try {
            set('avatar', await readAvatar(file))
            setPhotoError('')
        } catch {
            setPhotoError('Не удалось загрузить фото')
        }
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.name.trim()) {
            setTab('profile')
            return
        }

        onSave({ ...form, name: form.name.trim() })
        setSaved(true)
    }

    const submitPassword = () => {
        if (newPass.length < 6) {
            setPassMsg({
                ok: false,
                text: 'Новый пароль должен содержать минимум 6 символов'
            })
            return
        }

        const err = onChangePassword(oldPass, newPass)

        if (err) {
            setPassMsg({ ok: false, text: err })
            return
        }

        setOldPass('')
        setNewPass('')
        setPassMsg({ ok: true, text: 'Пароль изменён' })
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Настройки аккаунта"
            className={`fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4 transition max-[640px]:items-end max-[640px]:px-0 ${open
                ? 'visible opacity-100'
                : 'pointer-events-none invisible opacity-0'
                }`}
            onMouseDown={e => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <form
                onSubmit={submit}
                className="relative flex h-[min(780px,calc(100dvh-32px))] w-full max-w-160 flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl max-[640px]:h-[calc(100dvh-24px)] max-[640px]:max-w-none max-[640px]:rounded-b-none"
            >
                <div className="flex flex-none items-center justify-between border-b border-line px-8 py-5 max-[640px]:px-4 max-[640px]:py-4">
                    <h2 className="text-xl font-semibold max-[640px]:text-lg">
                        Настройки аккаунта
                    </h2>

                    <button
                        type="button"
                        aria-label="Закрыть"
                        onClick={onClose}
                        className="grid h-9 w-9 place-items-center rounded-full text-2xl hover:bg-soft"
                    >
                        ×
                    </button>
                </div>

                <div
                    role="tablist"
                    className="flex flex-none gap-1 overflow-x-auto border-b border-line px-6 scrollbar-none max-[640px]:px-2"
                >
                    {TABS.map(t => (
                        <button
                            key={t.key}
                            type="button"
                            role="tab"
                            aria-selected={tab === t.key}
                            onClick={() => setTab(t.key)}
                            className={`relative flex-none whitespace-nowrap px-3 py-4 text-sm leading-5 transition-colors hover:text-ink ${tab === t.key
                                ? 'font-semibold text-ink'
                                : 'text-muted'
                                }`}
                        >
                            {t.label}

                            <span
                                className={`absolute inset-x-3 bottom-0 h-0.5 bg-ink transition-transform duration-200 ${tab === t.key
                                    ? 'scale-x-100'
                                    : 'scale-x-0'
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                <div
                    ref={bodyRef}
                    className="min-h-0 flex-1 overflow-y-auto px-8 py-6 max-[640px]:px-4 max-[640px]:py-5"
                >
                    {tab === 'profile' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-5 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-4">
                                <Avatar user={form} size={96} />

                                <div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileRef.current?.click()
                                            }
                                            className="rounded-lg border border-ink px-4 py-2 text-sm font-semibold hover:bg-soft"
                                        >
                                            {form.avatar
                                                ? 'Заменить фото'
                                                : 'Загрузить фото'}
                                        </button>

                                        {form.avatar && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    set(
                                                        'avatar',
                                                        undefined
                                                    )
                                                }
                                                className="rounded-lg px-4 py-2 text-sm font-semibold underline hover:bg-soft"
                                            >
                                                Удалить
                                            </button>
                                        )}
                                    </div>

                                    <p className="mt-2 text-xs text-muted">
                                        JPG, PNG или WebP, до 8 МБ. Фото
                                        обрежется до квадрата.
                                    </p>

                                    {photoError && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {photoError}
                                        </p>
                                    )}
                                </div>

                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={onPhoto}
                                />
                            </div>

                            {!form.avatar && (
                                <div>
                                    <span className={LABEL}>
                                        Цвет аватарки
                                    </span>

                                    <div className="flex flex-wrap gap-2.5">
                                        {COLORS.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                aria-label={`Цвет ${c}`}
                                                aria-pressed={
                                                    (form.color ||
                                                        COLORS[1]) === c
                                                }
                                                onClick={() =>
                                                    set('color', c)
                                                }
                                                style={{ background: c }}
                                                className={`h-8 w-8 rounded-full transition-shadow ${(form.color ||
                                                    COLORS[1]) === c
                                                    ? 'shadow-[0_0_0_2px_#fff,0_0_0_4px_#222]'
                                                    : ''
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className={LABEL} htmlFor="s-name">
                                    Имя
                                </label>

                                <input
                                    id="s-name"
                                    value={form.name}
                                    onChange={e =>
                                        set('name', e.target.value)
                                    }
                                    className={INPUT}
                                />
                            </div>

                            <div>
                                <label className={LABEL} htmlFor="s-email">
                                    Эл. почта
                                </label>

                                <input
                                    id="s-email"
                                    value={form.email}
                                    disabled
                                    className={`${INPUT} cursor-not-allowed bg-soft text-muted`}
                                />

                                <p className="mt-1 text-xs text-muted">
                                    Почту нельзя изменить — она нужна для
                                    входа.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
                                <div>
                                    <label
                                        className={LABEL}
                                        htmlFor="s-phone"
                                    >
                                        Телефон
                                    </label>

                                    <input
                                        id="s-phone"
                                        type="tel"
                                        placeholder="+998 90 123 45 67"
                                        value={form.phone || ''}
                                        onChange={e =>
                                            set('phone', e.target.value)
                                        }
                                        className={INPUT}
                                    />
                                </div>

                                <div>
                                    <label
                                        className={LABEL}
                                        htmlFor="s-city"
                                    >
                                        Город
                                    </label>

                                    <input
                                        id="s-city"
                                        placeholder="Ташкент"
                                        value={form.city || ''}
                                        onChange={e =>
                                            set('city', e.target.value)
                                        }
                                        className={INPUT}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={LABEL} htmlFor="s-bio">
                                    О себе
                                </label>

                                <textarea
                                    id="s-bio"
                                    rows={4}
                                    maxLength={300}
                                    placeholder="Расскажите хозяевам, чем вы занимаетесь и почему путешествуете"
                                    value={form.bio || ''}
                                    onChange={e =>
                                        set('bio', e.target.value)
                                    }
                                    className="w-full resize-none rounded-xl border border-[#b0b0b0] px-4 py-3 text-base outline-none transition-colors focus:shadow-[0_0_0_1px_#222]"
                                />

                                <p className="mt-1 text-right text-xs text-muted">
                                    {(form.bio || '').length}/300
                                </p>
                            </div>
                        </div>
                    )}

                    {tab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    Смена пароля
                                </h3>

                                <div className="space-y-3">
                                    <input
                                        type="password"
                                        placeholder="Текущий пароль"
                                        value={oldPass}
                                        onChange={e => {
                                            setOldPass(e.target.value)
                                            setPassMsg(null)
                                        }}
                                        className={INPUT}
                                    />

                                    <input
                                        type="password"
                                        placeholder="Новый пароль (от 6 символов)"
                                        value={newPass}
                                        onChange={e => {
                                            setNewPass(e.target.value)
                                            setPassMsg(null)
                                        }}
                                        className={INPUT}
                                    />

                                    {passMsg && (
                                        <div
                                            className={`rounded-xl px-4 py-3 text-sm ${passMsg.ok
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-red-50 text-red-600'
                                                }`}
                                        >
                                            {passMsg.text}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={submitPassword}
                                        disabled={!oldPass || !newPass}
                                        className="rounded-lg border border-ink px-5 py-3 text-sm font-semibold enabled:hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40 max-[640px]:w-full"
                                    >
                                        Обновить пароль
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-line pt-6">
                                <h3 className="mb-1 text-lg font-semibold">
                                    Удаление аккаунта
                                </h3>

                                <p className="mb-4 text-sm text-muted">
                                    Аккаунт и все данные профиля будут
                                    удалены без возможности восстановления.
                                </p>

                                {confirmDelete ? (
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-sm font-medium">
                                            Точно удалить?
                                        </span>

                                        <button
                                            type="button"
                                            onClick={onDelete}
                                            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                                        >
                                            Да, удалить аккаунт
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setConfirmDelete(false)
                                            }
                                            className="rounded-lg px-4 py-2.5 text-sm font-semibold underline"
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setConfirmDelete(true)
                                        }
                                        className="text-sm font-semibold text-red-600 underline"
                                    >
                                        Удалить аккаунт
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {tab === 'notify' && (
                        <div>
                            {(
                                [
                                    [
                                        'messages',
                                        'Сообщения от хозяев',
                                        'Ответы на ваши вопросы и брони'
                                    ],
                                    [
                                        'email',
                                        'Письма на почту',
                                        'Подтверждения, чеки и напоминания о поездках'
                                    ],
                                    [
                                        'promo',
                                        'Акции и подборки',
                                        'Скидки и идеи для новых поездок'
                                    ]
                                ] as const
                            ).map(([k, title, hint], i) => (
                                <div
                                    key={k}
                                    className={`flex items-center justify-between gap-6 py-5 max-[640px]:gap-4 ${i ? 'border-t border-line' : ''
                                        }`}
                                >
                                    <div>
                                        <b className="text-base font-medium">
                                            {title}
                                        </b>

                                        <small className="mt-0.5 block text-sm text-muted">
                                            {hint}
                                        </small>
                                    </div>

                                    <Switch
                                        on={notify[k]}
                                        onChange={v =>
                                            set('notify', {
                                                ...notify,
                                                [k]: v
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    
                </div>

                <div className="flex flex-none items-center justify-between gap-4 border-t border-line px-8 py-4 max-[640px]:flex-col-reverse max-[640px]:items-stretch max-[640px]:gap-2 max-[640px]:px-4 max-[640px]:py-3">
                    <span
                        role="status"
                        className={`text-sm text-green-700 transition-opacity max-[640px]:text-center ${saved ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        Изменения сохранены
                    </span>

                    <div className="flex gap-2 max-[640px]:flex-col-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-5 py-3 text-sm font-semibold underline hover:bg-soft"
                        >
                            Закрыть
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-[#e51d5f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d91452]"
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}