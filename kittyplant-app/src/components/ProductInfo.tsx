import '../styles/ProductInfo.css';

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
          <div className="plant-pot"></div>
          <div className="cat-silhouette-dark"></div>
        </div>
      </div>
    </section>
  )
}

export default ProductInfo