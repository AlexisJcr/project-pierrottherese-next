import { motion} from "framer-motion";
import { Github, Linkedin, ChevronDown } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-primary text-white">
      <section className="h-screen flex flex-col justify-center items-center relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">Alexis Joncour</h1>
          <motion.h2
            className="text-2xl md:text-4xl text-blue-400 font-medium mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Étudiant en Développement d'Application
          </motion.h2>
          <div className="flex justify-center space-x-6">
            <motion.a
              href="https://www.linkedin.com/in/alexis-joncour-518819296/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-black p-3 rounded-full"
            >
              <Linkedin size={40} className="text-white"/>
            </motion.a>
            <motion.a
              href="https://github.com/AlexisJcr"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-black p-3 rounded-full"
            >
              <Github size={40} className="text-white"/>
            </motion.a>
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <ChevronDown size={45} className="animate-bounce" />
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
