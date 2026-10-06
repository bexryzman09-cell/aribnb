import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type MyListing = {
    id: number
    title: string
    sub: string
    address: string
    price: number
    rating: number
    img: string
    top: boolean
}

export default function MyListings() {
    const navigate = useNavigate()
    const ref = useRef<HTMLDivElement>(null)

    const [listings, setListings] = useState<MyListing[]>([])
    const [edge, setEdge] = useState({
        l: false,
        r: true
    })

    const loadListings = () => {
        const saved = localStorage.getItem('listings')

        if (!saved) {
            setListings([])
            return
        }

        try {
            setListings(JSON.parse(saved))
        } catch {
            setListings([])
        }
    }

    useEffect(() => {
        loadListings()

        window.addEventListener(
            'listingsUpdated',
            loadListings
        )

        return () => {
            window.removeEventListener(
                'listingsUpdated',
                loadListings
            )
        }
    }, [])

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

        window.addEventListener('resize', update)

        return () => {
            window.removeEventListener('resize', update)
        }
    }, [listings.length])

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
            className="grid size-8 place-items-center rounded-full border border-line bg-white transition hover:scale-105 hover:shadow disabled:cursor-default disabled:opacity-30"
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

    if (listings.length === 0) {
        return null
    }

    return (
        <section className="mx-auto max-w-[1760px] px-6 pt-8 sm:px-10">

            <div className="flex items-center justify-between">

                <div>
                    <h2 className="text-[22px] font-semibold">
                        Мои объявления
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Ваши опубликованные объявления
                    </p>
                </div>

                <div className="flex gap-2">
                    {arrow(-1, edge.l)}
                    {arrow(1, edge.r)}
                </div>

            </div>

            <div
                ref={ref}
                onScroll={update}
                className="no-scrollbar mt-4 flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            >

                {listings.map((item) => (
                    <article
                        key={item.id}
                        onClick={() =>
                            navigate(
                                `/listing/${item.id}`
                            )
                        }
                        className="w-[44%] flex-none cursor-pointer snap-start sm:w-[30%] md:w-[23%] lg:w-[calc((100%-120px)/6)]"
                    >

                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-soft">

                            <img
                                src={item.img}
                                alt={item.title}
                                loading="lazy"
                                className="size-full object-cover transition-transform duration-300 hover:scale-105"
                            />

                            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow">
                                Моё объявление
                            </span>

                        </div>

                        <h3 className="mt-3 truncate text-[15px] font-medium">
                            {item.title}
                        </h3>

                        <p className="truncate text-sm text-muted">
                            {item.sub}
                        </p>

                        <p className="mt-0.5 text-sm text-muted">
                            <span className="font-medium text-ink">
                                {item.price * 2} $
                            </span>{' '}
                            за 2 ночи · ★ {item.rating}
                        </p>

                    </article>
                ))}

            </div>

        </section>
    )
}