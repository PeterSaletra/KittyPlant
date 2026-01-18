import kittymain from '../assets/kittymain.png';
import kiityplantlogo from '../assets/kittyplant-logo.png';

const Hero = () => {
  return (
    <div className="px-4 py-6 sm:py-8 md:py-12">
      {/* Logo */}
      <div className='w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto mb-6 sm:mb-8'>
        <img src={kiityplantlogo} alt="Logo" className='w-full h-auto' />
      </div>
      
      {/* Content Grid */}
      <div className='flex flex-col md:grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto items-center'>
        {/* Image */}
        <div className='flex justify-center w-full md:justify-end'>
          <img src={kittymain} alt="Logo" className='h-auto w-[60%] sm:w-[50%] md:w-[80%] max-w-[300px]' />
        </div>
        
        {/* Text */}
        <div className='flex items-center justify-center text-center md:text-left'>
          <span className='text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] leading-tight'>The Purrfect Way to Keep Your Plants Happy!</span>
        </div>
      </div>
    </div>
  )
}

export default Hero