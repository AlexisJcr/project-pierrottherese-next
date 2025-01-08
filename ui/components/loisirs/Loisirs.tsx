'use client'

import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

type Hobby = {
  name: string
  icon: React.ReactNode
  description: string
}

const hobbies: Hobby[] = [
  {
    name: 'Guitare',
    icon: "",
    description: "Passionné de guitare depuis plusieurs années, j'ai débuté un apprentissage en autodidacte depuis maintenant 3 ans."
  },
  {
    name: 'Voyages',
    icon: "",
    description: "J'ai eu l'occasion de voyager à plusieurs reprises en Italie, ce qui m'a permis de découvrir un nouveau pays et les paysages de la Toscane. En 2024, j'ai également eu la chance de voyager au Vietnam, où j'ai rencontré une culture bien différente de la nôtre."
  },
  {
    name: 'Humanitaire',
    icon: "",
    description: "Mon voyage au Vietnam était dans un premier temps une expérience humanitaire réalisée grâce à un partenariat avec l'association FFSC à Hô Chi Minh. J'y retourne en juin 2025 pour une seconde session humanitaire."
  }
]

const HobbyCard = ({ hobby }: { hobby: Hobby }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div 
      id="loisirs" className="bg-gray-200 shadow-lg rounded-lg p-6 cursor-pointer transition-all duration-250 ease-in-out hover:shadow-xl"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center mb-4">
        {hobby.icon}
        <h2 className="text-2xl font-bold  text-primary">{hobby.name}</h2>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '9rem' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-medium text-base text-justify text-gray-900">{hobby.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Loisirs() {
  return (
    <div className="min-h-screen bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[90rem] mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Mes Loisirs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hobbies.map((hobby) => (
            <HobbyCard key={hobby.name} hobby={hobby} />
          ))}
        </div>
      </div>
    </div>
  )
}

