export default function Aboute({ title = 'О нас' }: { title?: string }) {
    return (
        <main className="max-w-[1760px] mx-auto px-10 py-24 min-h-[50vh]">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="mt-3 text-[#6a6a6a]">Скоро здесь будет контент.</p>
        </main>
    )
}