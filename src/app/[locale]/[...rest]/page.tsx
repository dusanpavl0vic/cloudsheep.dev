import { notFound } from 'next/navigation'

/** Svaka nepoznata putanja pod jezikom → lokalizovana 404 sa kodom 404 (docs/05-routing.md §4). */
const CatchAllPage = () => notFound()

export default CatchAllPage
