import leafbottomleft from '../assets/leafbottomleft.png'
import leafbottomright from '../assets/leafbottomright.png'

const Footer = () => {
  return (
    <div className="text-center flex justify-center px-4 pt-6 pb-4 mt-5">
      <div className='px-2 sm:px-1 pt-2 pb-4 text-center justify-center m-auto items-center w-full'>
      <h2 className='mb-4 sm:mb-5 font-light text-3xl sm:text-4xl md:text-5xl text-black'>CONTACT US</h2>
      <div className="bg-[#ffd4d4] max-w-[600px] m-auto p-4 sm:p-6 md:p-1 rounded-4xl flex flex-col">
        <div className='my-2 mx-0.25 text-sm sm:text-base'>
          <span className="font-bold">PHONE:</span> 123-456-789
        </div>
        <div className='my-2 mt-0.25 text-sm sm:text-base'>
          <span className="font-bold">EMAIL:</span> info@kittyplant.io
        </div>
      </div>
      </div>
      <img src={leafbottomleft} alt="Leaf Bottom Left" className="hidden sm:block absolute -z-1 h-auto w-1/4 md:w-1/4 bottom-0 left-0"/>
      <img src={leafbottomright} alt="Leaf Bottom Right" className="hidden sm:block absolute -z-1 h-auto w-1/4 md:w-1/4 bottom-0 right-0"/>
    </div>
  )
}

export default Footer