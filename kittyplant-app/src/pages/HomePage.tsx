import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import ProductInfo from '../components/ProductInfo'
import Footer from '../components/Footer'
import leaftoplfet from '../assets/leaftopleft.png'
import leaftopright from '../assets/leaftopright.png'

function HomePage() {
  return (
    <div className="app-container">
      
      <Header />
      <Hero />
      <Features />
      <ProductInfo />
      <Footer />
      <img src={leaftoplfet} alt="Leaf Top Left" className="leaf-decoration top-left"/>
      <img src={leaftopright} alt="Leaf Top Right" className="leaf-decoration top-right"/>
    </div>
  )
}

export default HomePage;