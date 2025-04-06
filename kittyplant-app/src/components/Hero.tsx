import '../styles/Hero.css';
import kittymain from '../assets/kittymain.png';
import kiityplantlogo from '../assets/kittyplant-logo.png';
import plant2 from '../assets/plant2.png';

const Hero = () => {
  return (
    <div className="hero">
      <div className='hero-logo'>
        <img src={kiityplantlogo} alt="Logo" className='hero-logo-img' />
      </div>
      <div className='hero-plant'>
        <img src={plant2} alt="" className='hero-plant-img'/>
      </div>
      <div className='hero-cat'>
        <img src={kittymain} alt="Logo" className='hero-cat-img' />
      </div>
      <div className='hero-text'>
        <span className='hero-text-ctx'>The Purrfect Way to Keep Your Plants Happy!</span>
      </div>
    </div>
  )
}

export default Hero