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
      <img src={leafbottomleft} alt="Leaf Bottom Left" className="absolute -z-1 h-auto w-1/4 bottom-0 left-0"/>
      <img src={leafbottomright} alt="Leaf Bottom Right" className="absolute -z-1 h-auto w-1/4 bottom-0 right-0"/>
    </footer>
  )
}

export default Footer