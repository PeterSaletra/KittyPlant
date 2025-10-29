import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import ProductInfo from '../components/ProductInfo'
import Footer from '../components/Footer'
import leaftoplfet from '../assets/leaftopleft.png'
import leaftopright from '../assets/leaftopright.png'

function HomePage() {
  return (
    <div className="m-auto overflow-hidden relative">
      
      <Header />
      <Hero />
      <Features />
      <ProductInfo />
      <Footer />
      <img src={leaftoplfet} alt="Leaf Top Left" className="absolute -z-1 h-auto w-1/3 top-0 left-0"/>
      <img src={leaftopright} alt="Leaf Top Right" className="absolute -z-1 h-auto w-1/3 top-0 right-0"/>
    </div>
  )
}

export default HomePage;