import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type Listing = {
    id: number
    title: string
    sub: string
    address: string
    price: number
    rating: number
    img: string
    top: boolean
}

export default function ListingPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    // Получаем объявления из localStorage
    const getListings = (): Listing[] => {
        try {
            return JSON.parse(
                localStorage.getItem('listings') || '[]'
            )
        } catch {
            return []
        }
    }

    const listings = getListings()

    // Находим нужное объявление
    const listing = listings.find(
        item => String(item.id) === String(id)
    )

    // Если объявления нет
    if (!listing) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Объявление не найдено
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Возможно, это объявление было удалено.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate('/homes')}
                        className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                        Вернуться на главную
                    </button>
                </div>
            </main>
        )
    }

    // Данные для редактирования
    const [title, setTitle] = useState(listing.title)
    const [location, setLocation] = useState(listing.sub)
    const [address, setAddress] = useState(listing.address)
    const [price, setPrice] = useState(
        listing.price.toString()
    )

    const [image, setImage] = useState(listing.img)

    // Загрузка нового фото
    const handleImage = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]

        if (!file) return

        const reader = new FileReader()

        reader.onload = () => {
            setImage(reader.result as string)
        }

        reader.readAsDataURL(file)
    }

    // Сохранение изменений
    const saveChanges = () => {
        if (
            !title.trim() ||
            !location.trim() ||
            !address.trim() ||
            !price ||
            !image
        ) {
            alert('Заполните все поля')
            return
        }

        const numericPrice = Number(price)

        if (numericPrice < 0) {
            alert('Цена не может быть отрицательной')
            return
        }

        const newListings = listings.map(item => {
            if (String(item.id) === String(id)) {
                return {
                    ...item,

                    // Можно изменять
                    title: title.trim(),
                    sub: location.trim(),
                    address: address.trim(),
                    price: numericPrice,
                    img: image,

                    // Рейтинг НЕ изменяется
                    rating: item.rating
                }
            }

            return item
        })

        localStorage.setItem(
            'listings',
            JSON.stringify(newListings)
        )

        // Сообщаем другим компонентам,
        // что localStorage изменился
        window.dispatchEvent(
            new Event('listingsUpdated')
        )

        alert('Изменения сохранены')

        navigate('/homes')
    }

    // Удаление объявления
    const deleteListing = () => {
        const answer = window.confirm(
            'Вы точно хотите удалить это объявление?'
        )

        if (!answer) return

        const newListings = listings.filter(
            item => String(item.id) !== String(id)
        )

        localStorage.setItem(
            'listings',
            JSON.stringify(newListings)
        )

        window.dispatchEvent(
            new Event('listingsUpdated')
        )

        navigate('/homes')
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-5xl">

                {/* Кнопка назад */}
                <button
                    type="button"
                    onClick={() => navigate('/homes')}
                    className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-black"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>

                    Назад
                </button>


                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

                   
                    <div className="relative aspect-video w-full bg-gray-100 sm:aspect-2/1">
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold shadow sm:left-6 sm:top-6">
                            Моё объявление
                        </div>
                    </div>

                    {/* Контент */}
                    <div className="p-5 sm:p-8">

                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            {title}
                        </h1>

                        {/* Рейтинг */}
                        <div className="mt-4 flex items-center gap-2">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#ffef5e"
                                    stroke="#191919"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.757 1.221a.253.253 0 0 1 .49 0l.76 3.121h3.195a.252.252 0 0 1 .14.461l-2.329 1.482l1.22 3.254a.252.252 0 0 1-.382.293L12 7.796L9.148 9.832a.252.252 0 0 1-.383-.293l1.221-3.254l-2.33-1.482a.252.252 0 0 1 .14-.46h3.197zm6.545 13.197a.252.252 0 0 1 .49 0l.762 3.009h3.195a.252.252 0 0 1 .14.46l-2.33 1.487l1.22 3.254a.252.252 0 0 1-.383.293l-2.851-2.037l-2.853 2.037a.252.252 0 0 1-.382-.293l1.221-3.254l-2.33-1.482a.252.252 0 0 1 .14-.461h3.197zM5.213 14.31a.251.251 0 0 1 .49 0l.761 3.12H9.66a.252.252 0 0 1 .139.462l-2.33 1.482l1.22 3.254a.252.252 0 0 1-.382.293l-2.852-2.037l-2.852 2.037a.252.252 0 0 1-.382-.293l1.22-3.254a.252.252 0 0 1 .139-.461h3.198z"
                                />
                            </svg>

                            <span className="font-semibold text-gray-900">
                                {listing.rating}
                            </span>

                            <span className="text-sm text-gray-500">
                                Рейтинг изменить нельзя
                            </span>
                        </div>

                        {/* Редактирование */}
                        <div className="mt-8 border-t border-gray-200 pt-8">

                            <h2 className="text-xl font-semibold text-gray-900">
                                Редактировать объявление
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Измените информацию о вашем жилье.
                            </p>

                            <div className="mt-6 space-y-5">

                                {/* Фото */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Фотография
                                    </label>

                                    <label className="relative flex h-64 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:bg-gray-100">

                                        {image ? (
                                            <img
                                                src={image}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center text-gray-500">
                                                <div className="text-4xl">
                                                    +
                                                </div>

                                                <p className="mt-2 text-sm">
                                                    Загрузить изображение
                                                </p>
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImage}
                                            className="hidden"
                                        />
                                    </label>

                                    <p className="mt-2 text-xs text-gray-400">
                                        Нажмите на фотографию, чтобы выбрать новую.
                                    </p>
                                </div>

                                {/* Поля */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    {/* Название */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-900">
                                            Название
                                        </label>

                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="Уютная квартира"
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:ring-1 focus:ring-black"
                                        />
                                    </div>

                                  
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-900">
                                            Местоположение
                                        </label>

                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) =>
                                                setLocation(e.target.value)
                                            }
                                            placeholder="Ташкент"
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:ring-1 focus:ring-black"
                                        />
                                    </div>

                                    
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-900">
                                            Адрес
                                        </label>

                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                            placeholder="ул. Навои, 15"
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:ring-1 focus:ring-black"
                                        />
                                    </div>

                                  
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-900">
                                            Цена за ночь ($)
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={price}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value

                                                if (
                                                    value === '' ||
                                                    Number(value) >= 0
                                                ) {
                                                    setPrice(value)
                                                }
                                            }}
                                            placeholder="50"
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:ring-1 focus:ring-black"
                                        />
                                    </div>

                                </div>

                            
                                <div className="rounded-xl bg-gray-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Рейтинг
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Рейтинг изменить нельзя.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="#ffef5e"
                                                    stroke="#191919"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M11.757 1.221a.253.253 0 0 1 .49 0l.76 3.121h3.195a.252.252 0 0 1 .14.461l-2.329 1.482l1.22 3.254a.252.252 0 0 1-.382.293L12 7.796L9.148 9.832a.252.252 0 0 1-.383-.293l1.221-3.254l-2.33-1.482a.252.252 0 0 1 .14-.46h3.197z"
                                                />
                                            </svg>

                                            <span className="font-semibold">
                                                {listing.rating}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Кнопки */}
                                <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                                    <button
                                        type="button"
                                        onClick={saveChanges}
                                        className="w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
                                    >
                                        Сохранить изменения
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate('/homes')
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                                    >
                                        Отмена
                                    </button>

                                </div>

                                {/* Удаление */}
                                <div className="border-t border-gray-200 pt-6">

                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Опасная зона
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        После удаления объявление нельзя будет восстановить.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={deleteListing}
                                        className="mt-4 rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        Удалить объявление
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}