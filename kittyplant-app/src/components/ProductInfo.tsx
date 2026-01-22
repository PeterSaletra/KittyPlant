import kittyplant from '../assets/kittyandplant.png';

const ProductInfo = () => {
  return (
    <section className="w-full bg-(--kitty-dark-pink) text-white py-8 sm:py-10 px-4 mt-6 sm:mt-8">
      <div className="flex flex-col gap-6 sm:gap-8 max-w-[1000px] mx-auto md:flex-row md:items-center">
        <div className="md:flex-1 order-2 md:order-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[3.2rem] font-normal leading-[1.4] text-center md:text-right px-2">
            KittyPlant detects the moisture levels in the soil and displays them in its tummy. If you see the red light it's time to water your plant!
          </h2>
        </div>
        <div className="flex justify-center relative md:flex-1 order-1 md:order-2">
          <div className="w-[16rem] h-[16rem] sm:w-[20rem] sm:h-[20rem] md:w-[25rem] md:h-[25rem] lg:w-[30rem] lg:h-[30rem] bg-kitty-light-green rounded-lg relative">
            <img src={kittyplant} alt="" className='absolute w-full h-full'/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductInfo