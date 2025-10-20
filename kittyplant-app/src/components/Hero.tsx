import kittymain from '../assets/kittymain.png';
import kiityplantlogo from '../assets/kittyplant-logo.png';
import plant2 from '../assets/plant2.png';

const Hero = () => {
  return (
    <div className="h-[30%] gap-0 grid grid-cols-2 grid-rows-3 w-2/5 max-w-[900px] self-center justify-items-center mx-auto mt-6">
      {/* <div className='col-span-1 row-span-3 text-right justify-self-end self-center'>
        <img src={plant2} alt="" className='text-right h-auto w-[65%]'/>
      </div> */}
      <div className='col-span-2 row-span-1 text-center justify-self-center self-end'>
        <img src={kiityplantlogo} alt="Logo" className='justify-self-center h-auto w-[100%] mx-auto' />
      </div>
      
      <div className='col-span-1 row-span-2  justify-self-center self-center flex'>
        <img src={kittymain} alt="Logo" className='h-auto w-[80%]' />
      </div>
      <div className='col-span-1 row-span-2 justify-self-center self-center'>
        <span className='text-[3rem]'>The Purrfect Way to Keep Your Plants Happy!</span>
      </div>
    </div>
  )
}

export default Hero