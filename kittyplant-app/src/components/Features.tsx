import Icon1 from '../assets/1.png';
import K1Icon from '../assets/K1.png';
import plant from '../assets/plant.png';

const Features = () => {
  return (
    <section className="px-4 py-6 sm:py-8">
      <div className="gap-6 sm:gap-4 md:gap-1.5 max-w-[1000px] m-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-1.5 rounded-lg text-center flex flex-col items-center">
          <div className="bg-(--kitty-pink) w-[12rem] h-[12rem] sm:w-[13rem] sm:h-[13rem] md:w-[15rem] md:h-[15rem] p-1 mb-1 flex justify-center items-center rounded-[3.2rem]">
            <div className="w-full h-full rounded-xl">
              <img src={plant} alt="icon" className='w-full'/>
            </div>
          </div>
          <h3 className="color-black text-lg sm:text-xl md:text-[1.3rem] font-semibold px-2">CHOOSE OR ADD ANY PLANT</h3>
        </div>
        
        <div className="p-1.5 rounded-lg text-center flex flex-col items-center">
            <div className="bg-(--kitty-pink) w-[12rem] h-[12rem] sm:w-[13rem] sm:h-[13rem] md:w-[15rem] md:h-[15rem] p-1 mb-1 flex justify-center items-center rounded-[3.2rem]">
              <div className="w-full h-full rounded-xl">
                <img src={K1Icon} alt="Icon" className='w-full'/>
              </div>
            </div>
          <h3 className="color-black text-lg sm:text-xl md:text-[1.3rem] font-semibold px-2">WATER AS NEEDED</h3>
        </div>
        
        <div className="p-1.5 rounded-lg text-center flex flex-col items-center">
          <div className="bg-(--kitty-pink) w-[12rem] h-[12rem] sm:w-[13rem] sm:h-[13rem] md:w-[15rem] md:h-[15rem] p-1 mb-1 flex justify-center items-center rounded-[3.2rem]">
            <div className="w-full h-full rounded-xl">
              <img src={Icon1} alt="icon" className='w-full' />
            </div>
          </div>
          <h3 className="color-black text-lg sm:text-xl md:text-[1.3rem] font-semibold px-2">KEEPS TRACK OF YOUR PLANTS</h3>
        </div>
      </div>
    </section>
  )
}

export default Features
