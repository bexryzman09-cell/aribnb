import { useEffect } from 'react'
import { currencies, languages, recommended, useI18n } from '../data/translete'

export default function LocaleModal() {
    const { t, locale, setLocale, currency, setCurrency, currencyName, localeOpen, localeTab, setLocaleTab, closeLocale } = useI18n()

    useEffect(() => {
        if (!localeOpen) return
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLocale() }
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', onKey)
        return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey) }
    }, [localeOpen, closeLocale])

    if (!localeOpen) return null

    const cell = (on: boolean) =>
        `rounded-xl border px-3 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-soft
         ${on ? 'border-2 border-ink px-[11px] py-[9px]' : 'border-transparent'}`
    const grid = 'mt-6 grid grid-cols-2 gap-x-2 gap-y-2 sm:grid-cols-3 lg:grid-cols-5'
    const h2 = 'text-[22px] font-medium'

    return (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4" onClick={closeLocale}>
            <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}
                className="animate-pop relative max-h-[calc(100vh_-_32px)] w-full max-w-[1032px] overflow-y-auto rounded-[32px] bg-white px-6 pb-12 pt-6 sm:px-6">
                <button type="button" aria-label={t('close')} onClick={closeLocale}
                    className="grid h-8 w-8 place-items-center rounded-full hover:bg-soft">
                    <svg viewBox="0 0 32 32" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3"><path d="m4 4 24 24M28 4 4 28" /></svg>
                </button>

                <div role="tablist" className="mt-6 flex gap-8 border-b border-line">
                    {([['lang', t('lang_region')], ['currency', t('currency')]] as const).map(([k, label]) => (
                        <button key={k} type="button" role="tab" aria-selected={localeTab === k} onClick={() => setLocaleTab(k)}
                            className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors
                                ${localeTab === k ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
                            {label}
                        </button>
                    ))}
                </div>

                {localeTab === 'lang' ? (
                    <div className="px-2 pt-10">
                        <h2 className={h2}>{t('rec_langs')}</h2>
                        <div className={grid}>
                            {recommended.map(id => {
                                const l = languages.find(x => x.id === id)!
                                return (
                                    <button key={id} type="button" className={cell(locale === id)}
                                        onClick={() => { setLocale(id); closeLocale() }}>
                                        <div>{l.name}</div><div className="text-muted">{l.region}</div>
                                    </button>
                                )
                            })}
                        </div>

                        <h2 className={`${h2} mt-14`}>{t('choose_lang')}</h2>
                        <p className="mt-1 text-sm">{t('note_1')}<a href="#" className="font-semibold underline">{t('account_settings')}</a>{t('note_2')}</p>
                        <div className={grid}>
                            {languages.map(l => (
                                <button key={l.id} type="button" className={cell(locale === l.id)}
                                    onClick={() => { setLocale(l.id); closeLocale() }}>
                                    <div>{l.name}</div><div className="text-muted">{l.region}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="px-2 pt-10">
                        <h2 className={h2}>{t('choose_currency')}</h2>
                        <div className={grid}>
                            {currencies.map(c => (
                                <button key={c.code} type="button" className={cell(currency === c.code)}
                                    onClick={() => { setCurrency(c.code); closeLocale() }}>
                                    <div>{currencyName(c.code)}</div><div className="text-muted">{c.code}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}