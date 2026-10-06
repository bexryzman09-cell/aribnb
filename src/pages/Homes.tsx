import Section from '../components/Section'
import { sections } from '../data/data'
import MyListings from '../components/MyListings'
export default function Homes() {
    return (
        <main className="pb-12">
            <MyListings />
            {sections.map(s => (
                <Section key={s.id} {...s} />
            ))}
        </main>
    )
}