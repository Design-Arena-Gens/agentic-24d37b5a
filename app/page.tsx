'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaBook, FaRobot, FaGamepad } from 'react-icons/fa';
import SchedulePlanner from '@/components/SchedulePlanner';
import BookLibrary from '@/components/BookLibrary';
import AIMathTool from '@/components/AIMathTool';
import MathGames from '@/components/MathGames';

type Module = 'schedule' | 'library' | 'ai' | 'games' | null;

export default function Home() {
  const [activeModule, setActiveModule] = useState<Module>(null);

  const modules = [
    {
      id: 'schedule' as Module,
      title: 'Schedule Planner',
      description: 'Organize classes, appointments, and meetings with an intuitive calendar',
      icon: FaCalendarAlt,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      id: 'library' as Module,
      title: 'Book Library',
      description: 'Manage your collection of math textbooks and educational resources',
      icon: FaBook,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
    },
    {
      id: 'ai' as Module,
      title: 'AI Math Tool',
      description: 'Generate problems, solve equations, and create custom quizzes',
      icon: FaRobot,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
    },
    {
      id: 'games' as Module,
      title: 'Math Games',
      description: 'Engaging games to help students practice mathematical concepts',
      icon: FaGamepad,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
    },
  ];

  if (activeModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Math Teacher Assistant
              </h1>
              <button
                onClick={() => setActiveModule(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Back to main menu"
              >
                ← Back
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeModule === 'schedule' && <SchedulePlanner />}
            {activeModule === 'library' && <BookLibrary />}
            {activeModule === 'ai' && <AIMathTool />}
            {activeModule === 'games' && <MathGames />}
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Math Teacher Assistant
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Your comprehensive toolkit for teaching excellence
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {modules.map((module, index) => (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveModule(module.id)}
              className={`bg-gradient-to-br ${module.color} ${module.hoverColor} p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-400`}
              aria-label={`Open ${module.title}`}
            >
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                  <module.icon className="text-4xl text-white" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {module.title}
                  </h2>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            Designed for educators • Built with care • Powered by modern technology
          </p>
        </div>
      </main>
    </div>
  );
}
