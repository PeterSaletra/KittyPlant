import '../styles/Features.css';
import Icon1 from '../assets/1.png';
import K1Icon from '../assets/K1.png';
import plant from '../assets/plant.png';

const Features = () => {
  return (
    <section className="features">
      <div className="features-container">
        <div className="feature-card">
          <div className="feature-icon">
            
            <div className="icon-placeholder">
              <img src={plant} alt="icon" className='icon' />
            </div>
          </div>
          <h3 className="feature-title">CHOOSE OR ADD ANY PLANT</h3>
        </div>
        
        <div className="feature-card">
            <div className="feature-icon">
              <div className="icon-placeholder">
                <img src={K1Icon} alt="Icon" className='icon'/>
              </div>
            </div>
          <h3 className="feature-title">WATER AS NEEDED</h3>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <div className="icon-placeholder">
              <img src={Icon1} alt="icon" className='icon' />
            </div>
          </div>
          <h3 className="feature-title">KEEPS TRACK OF YOUR PLANTS</h3>
        </div>
      </div>
    </section>
  )
}

export default Features
