import Section from '../components/Section'
import { sections } from '../data/data'

export default function Homes() {
    return (
        <main className="pb-12">
            {sections.map(s => (
                <Section key={s.id} {...s} />
            ))}
        </main>
    )
}