import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <h2 className="contact-title">CONTACT US</h2>
      <div className="contact-info">
        <div className="contact-item">
          <span className="contact-label">PHONE:</span> 123-456-789
        </div>
        <div className="contact-item">
          <span className="contact-label">EMAIL:</span> info@kittyplant.io
        </div>
      </div>
      <div className="decorative-elements">
        <div className="decoration green"></div>
        <div className="decoration pink"></div>
      </div>
    </footer>
  )
}

export default Footer