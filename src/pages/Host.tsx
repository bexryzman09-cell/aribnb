import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Host() {
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [address, setAddress] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState('')

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) return

        const reader = new FileReader()

        reader.onload = () => {
            setImage(reader.result as string)
        }

        reader.readAsDataURL(file)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!title || !location || !address || !price || !image) {
            alert('Заполните все поля')
            return
        }

        const oldListings = JSON.parse(
            localStorage.getItem('listings') || '[]'
        )

        const newListing = {
            id: Date.now(),
            title,
            sub: location,
            address,
            price: Number(price),
            rating: 5,
            img: image,
            top: false,
        }

        localStorage.setItem(
            'listings',
            JSON.stringify([...oldListings, newListing])
        )

        window.dispatchEvent(new Event('listingsUpdated'))

        navigate('/homes')
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-3xl">

                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Сдайте своё жильё
                    </h1>

                    <p className="mt-2 text-sm text-gray-500 sm:text-base">
                        Добавьте информацию о жилье и опубликуйте объявление.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6"
                >

                    <div>
                        <label className="mb-2 block text-sm font-medium sm:text-base">
                            Фотография
                        </label>

                        <label className="flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:bg-gray-100 sm:h-60">

                            {image ? (
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <div className="text-3xl sm:text-4xl">
                                        +
                                    </div>

                                    <p className="text-sm sm:text-base">
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
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Название
                            </label>

                            <input
                                type="text"
                                placeholder="Уютная квартира"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Местоположение
                            </label>

                            <input
                                type="text"
                                placeholder="Ташкент"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Адрес
                            </label>

                            <input
                                type="text"
                                placeholder="ул. Навои, 15"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition sm:text-base"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Цена за ночь ($)
                            </label>

                            <input
                                type="number"
                                min="0"
                                placeholder="50"
                                value={price}
                                onChange={(e) => {
                                    const value = e.target.value

                                    if (
                                        value === '' ||
                                        Number(value) >= 0
                                    ) {
                                        setPrice(value)
                                    }
                                }}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition sm:text-base"
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="mt-5 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99] sm:text-base"
                    >
                        Опубликовать
                    </button>

                </form>
            </div>
        </main>
    )
}