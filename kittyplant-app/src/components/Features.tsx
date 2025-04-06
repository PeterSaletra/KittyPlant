import '../styles/Features.css';

const Features = () => {
  return (
    <section className="features">
      <div className="features-container">
        <div className="feature-card">
          <div className="feature-icon">
            {/* Ikona rośliny */}
            <div className="icon-placeholder"></div>
          </div>
          <h3 className="feature-title">NOTIFY IF SOIL IS TOO DRY</h3>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            {/* Ikona konewki */}
            <div className="icon-placeholder"></div>
          </div>
          <h3 className="feature-title">SMART WATERING</h3>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            {/* Ikona wykresu */}
            <div className="icon-placeholder"></div>
          </div>
          <h3 className="feature-title">KEEPS TRACK OF YOUR PLANTS</h3>
        </div>
      </div>
    </section>
  )
}

export default Features
