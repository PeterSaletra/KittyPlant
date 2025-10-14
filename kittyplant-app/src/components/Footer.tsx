import leafbottomleft from '../assets/leafbottomleft.png'
import leafbottomright from '../assets/leafbottomright.png'

const Footer = () => {
  return (
    <footer className="text-center flex justify-center px-1 pt-2 pb-4">
      <div className='px-1 pt-2 pb-4 text-center justify-center m-auto items-center'>
      <h2 className='mb-1 font-light text-5xl text-black'>CONTACT US</h2>
      <div className="bg-[#ffd4d4] max-w-[600px] m-auto p-1 rounded-4xl flex flex-col">
        <div className='my-2 mx-0.25'>
          <span className="font-bold">PHONE:</span> 123-456-789
        </div>
        <div className='my-2 mt-0.25'>
          <span className="font-bold">EMAIL:</span> info@kittyplant.io
        </div>
      </div>
      </div>
      <img src={leafbottomleft} alt="Leaf Bottom Left" className="absolute -z-1 h-auto w-1/4 bottom-0 left-0"/>
      <img src={leafbottomright} alt="Leaf Bottom Right" className="absolute -z-1 h-auto w-1/4 bottom-0 right-0"/>
    </footer>
  )
}

export default Footer