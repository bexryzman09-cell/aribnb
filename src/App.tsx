import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Homes from './pages/Homes'
import Aboute from './pages/Aboute'
import Host from './pages/Host'
import ListingPage from './pages/ListingPage'

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Homes />} />
        <Route path="/homes" element={<Homes />} />
        <Route path="/experiences" element={<Aboute title="Впечатления" />} />
        <Route path="/services" element={<Aboute title="Услуги" />} />
        <Route path="/host" element={<Host />} />
        <Route path="*" element={<Aboute title="Страница не найдена" />} />
        <Route path="/listing/:id"element={<ListingPage />} />
      </Routes>

      <Footer />
    </>
  )
}