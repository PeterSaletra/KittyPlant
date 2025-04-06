import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="title-kitty">KittyPlant</span>
          <span className="title-slogan">The Purrfect Way<br />to Keep Your Plants Happy!</span>
        </h1>
        <div className="cat-illustration">
          {/* Tutaj byłby obrazek kota */}
          <div className="cat-silhouette"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero