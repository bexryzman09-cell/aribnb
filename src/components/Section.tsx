import { useEffect, useRef, useState } from 'react'
import type { Listing, SectionData } from '../data/data'

function Card({ it }: { it: Listing }) {
    const [liked, setLiked] = useState(false)

    return (
        <article className="snap-start flex-none w-[44%] sm:w-[30%] md:w-[23%] lg:w-[calc((100%-120px)/6)]">

            <div className="relative aspect-square overflow-hidden rounded-2xl bg-soft">

                <img
                    src={it.img}
                    alt={it.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 hover:scale-105"
                />

                {it.top && (
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow">
                        Выбор гостей
                    </span>
                )}

                <button
                    type="button"
                    aria-label="В избранное"
                    onClick={() => setLiked(v => !v)}
                    className="absolute right-3 top-3 transition-transform active:scale-90"
                >

                    <svg
                        viewBox="0 0 32 32"
                        width="24"
                        height="24"
                        strokeWidth="2"
                        stroke="#fff"
                        fill={
                            liked
                                ? '#ff385c'
                                : 'rgba(0,0,0,.5)'
                        }
                        className="overflow-visible"
                    >

                        <path d="M16 28c7-4.7 14-10 14-17 0-4.400-3.200-7.500-7-7.500-2.800 0-5.300 1.600-7 4.200C14.300 5.100 11.800 3.500 9 3.500 5.200 3.500 2 6.600 2 11c0 7 7 12.300 14 17z" />

                    </svg>

                </button>

            </div>

            <h3 className="mt-3 truncate text-[15px] font-medium">
                {it.title}
            </h3>

            <p className="truncate text-sm text-muted">
                {it.sub}
            </p>

            <p className="mt-0.5 text-sm text-muted">
                <span className="font-medium text-ink">
                    {it.price * 2} $
                </span>{' '}
                за 2 ночи · ★ {it.rating}
            </p>

        </article>
    )
}

export default function Section({
    title,
    note,
    items
}: SectionData) {

    const ref = useRef<HTMLDivElement>(null)

    const [edge, setEdge] = useState({
        l: false,
        r: true
    })

    const update = () => {
        const el = ref.current

        if (!el) return

        setEdge({
            l: el.scrollLeft > 4,
            r:
                el.scrollLeft + el.clientWidth <
                el.scrollWidth - 4
        })
    }

    useEffect(() => {
        update()

        window.addEventListener(
            'resize',
            update
        )

        return () => {
            window.removeEventListener(
                'resize',
                update
            )
        }
    }, [items.length])

    const go = (dir: number) => {
        ref.current?.scrollBy({
            left:
                dir *
                ref.current.clientWidth *
                0.8,
            behavior: 'smooth'
        })
    }

    const arrow = (
        dir: number,
        on: boolean
    ) => (
        <button
            type="button"
            aria-label={
                dir < 0
                    ? 'Назад'
                    : 'Дальше'
            }
            disabled={!on}
            onClick={() => go(dir)}
            className="grid  size-10  place-items-center rounded-full border border-line bg-white transition hover:scale-105 hover:shadow disabled:cursor-default disabled:opacity-30"
        >

            <svg
                viewBox="0 0 32 32"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                style={{
                    transform:
                        dir < 0
                            ? 'rotate(180deg)'
                            : undefined
                }}
            >

                <path d="M28 16H2M17 4l11.300 11.300a1 1 0 0 1 0 1.400L17 28" />

            </svg>

        </button>
    )

    return (
        <section className="mx-auto max-w-[1760px] px-6 pt-8 sm:px-10">

            <div className="flex items-center justify-between">

                <h2 className="text-[22px] font-semibold">
                    {title}
                </h2>
                <div className="flex justify-center items-center   gap-2">
                    {arrow(-1, edge.l)}
                    {arrow(1, edge.r)}
                </div>


            </div>

            {note && (
                <p className="mt-1 text-sm text-muted">
                    {note}
                </p>
            )}


            <div
                ref={ref}
                onScroll={update}
                className="no-scrollbar mt-4 flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            >



                {items.map(it => (
                    <Card
                        key={it.id}
                        it={it}
                    />
                ))}


            </div>


        </section>
    )
}