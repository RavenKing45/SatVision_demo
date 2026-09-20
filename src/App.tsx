import './App.css';
import LoadingReveal from './components/LoadingReveal';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';

const App: React.FC = () => {
  return (
    <>
      <LoadingReveal />
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
      </main>
    </>
  );
};

export default App;
