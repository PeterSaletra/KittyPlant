import '../styles/ProductInfo.css';
import kittyplant from '../assets/kittyandplant.png';

const ProductInfo = () => {
  return (
    <section className="product-info">
      <div className="product-info-container">
        <div className="product-text">
          <h2 className="product-description">
            KittyPlant detects the moisture levels in the soil and displays them in its tummy. If you see the red light it's time to water your plant!
          </h2>
        </div>
        <div className="product-illustration">
          <div className="plant-pot">
            <img src={kittyplant} alt="" className='icon-kittyplant'/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductInfo