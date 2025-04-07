import '../styles/Footer.css';
import leafbottomleft from '../assets/leafbottomleft.png'
import leafbottomright from '../assets/leafbottomright.png'

const Footer = () => {
  return (
    <footer className="footer">
      <div className='footer-content'>
      <h2 className="contact-title">CONTACT US</h2>
      <div className="contact-info">
        <div className="contact-item">
          <span className="contact-label">PHONE:</span> 123-456-789
        </div>
        <div className="contact-item">
          <span className="contact-label">EMAIL:</span> info@kittyplant.io
        </div>
      </div>
      </div>
      <img src={leafbottomleft} alt="Leaf Bottom Left" className="leaf-decoration bottom-left"/>
      <img src={leafbottomright} alt="Leaf Bottom Right" className="leaf-decoration bottom-right"/>
    </footer>
  )
}

export default Footer