import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problems from '../components/Problems';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="landing">
      <Navbar />
      <Hero />
      <Problems />
      <HowItWorks />
      <Features />
      <Pricing />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  );
}
