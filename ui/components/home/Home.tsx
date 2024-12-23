import Link from 'next/link';

const Home = () => {
  return (
    <section id="accueil" className="pl-[8vw] min-h-screen flex flex-col items-start justify-center" style={{background:"radial-gradient(circle at 5% 90.8%, rgb(49, 54, 71) 0%, rgb(0, 0, 0) 99.4%)"}}>

      <div className="text-left">
        <h1 className="text-4xl md:text-6xl font-semibold mb-[3rem] ml-[-6px]">Bienvenue !</h1>
        <h2 className="text-3xl md:text-5xl font-medium mb-3">Je suis Alexis Joncour</h2>
        <h3 className="text-2xl md:text-5xl text-tertiary font-normal ml-[-6px] mb-[2rem]">Étudiant en Développement d'Application</h3>
      </div>
      <Link href="#about" className="bg-tertiary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg text-2xl transition duration-300">
          À propos de moi
        </Link>
    </section>
  );
};

export default Home;

