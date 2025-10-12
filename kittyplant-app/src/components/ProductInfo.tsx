import kittyplant from '../assets/kittyandplant.png';

const ProductInfo = () => {
  return (
    <section className="w-full bg-kitty-dark-pink text-white py-10 px-4 mt-8">
      <div className="flex flex-col gap-8 max-w-[1000px] mx-auto md:flex-row md:items-center">
        <div className="md:flex-1">
          <h2 className="text-[3.2rem] font-normal leading-[1.4] text-right">
            KittyPlant detects the moisture levels in the soil and displays them in its tummy. If you see the red light it's time to water your plant!
          </h2>
        </div>
        <div className="flex justify-center relative md:flex-1">
          <div className="w-[30rem] h-[30rem] bg-kitty-light-green rounded-lg relative">
            <img src={kittyplant} alt="" className='absolute w-full h-full'/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductInfo