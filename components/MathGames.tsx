'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaClock, FaRedo, FaStar } from 'react-icons/fa';

type GameType = 'arithmetic' | 'fractions' | 'decimals' | 'multiplication';

interface GameState {
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  timeElapsed: number;
  isPlaying: boolean;
}

interface Question {
  question: string;
  answer: number;
  options: number[];
}

export default function MathGames() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    timeElapsed: 0,
    isPlaying: false,
  });
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [highScores, setHighScores] = useState<Record<GameType, number>>({
    arithmetic: 0,
    fractions: 0,
    decimals: 0,
    multiplication: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem('mathGamesHighScores');
    if (saved) {
      setHighScores(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.isPlaying) {
      timer = setInterval(() => {
        setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying]);

  const games = [
    {
      type: 'arithmetic' as GameType,
      title: 'Quick Math',
      description: 'Practice addition, subtraction, multiplication, and division',
      color: 'from-blue-500 to-blue-600',
      icon: '➕',
    },
    {
      type: 'fractions' as GameType,
      title: 'Fraction Master',
      description: 'Learn to add, subtract, and simplify fractions',
      color: 'from-green-500 to-green-600',
      icon: '½',
    },
    {
      type: 'decimals' as GameType,
      title: 'Decimal Challenge',
      description: 'Master decimal operations and conversions',
      color: 'from-purple-500 to-purple-600',
      icon: '0.5',
    },
    {
      type: 'multiplication' as GameType,
      title: 'Times Table Race',
      description: 'Speed up your multiplication table knowledge',
      color: 'from-orange-500 to-orange-600',
      icon: '×',
    },
  ];

  const generateQuestion = (type: GameType): Question => {
    let question = '';
    let answer = 0;
    let options: number[] = [];

    switch (type) {
      case 'arithmetic': {
        const num1 = Math.floor(Math.random() * 50) + 1;
        const num2 = Math.floor(Math.random() * 50) + 1;
        const ops = ['+', '-', '×'];
        const op = ops[Math.floor(Math.random() * ops.length)];

        question = `${num1} ${op} ${num2}`;
        switch (op) {
          case '+':
            answer = num1 + num2;
            break;
          case '-':
            answer = num1 - num2;
            break;
          case '×':
            answer = num1 * num2;
            break;
        }
        break;
      }

      case 'fractions': {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const den1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const den2 = den1; // Same denominator for simplicity

        question = `${num1}/${den1} + ${num2}/${den2}`;
        const resultNum = num1 + num2;
        answer = parseFloat((resultNum / den1).toFixed(2));
        break;
      }

      case 'decimals': {
        const dec1 = (Math.random() * 10).toFixed(1);
        const dec2 = (Math.random() * 10).toFixed(1);
        const ops = ['+', '-'];
        const op = ops[Math.floor(Math.random() * ops.length)];

        question = `${dec1} ${op} ${dec2}`;
        answer = parseFloat(
          op === '+'
            ? (parseFloat(dec1) + parseFloat(dec2)).toFixed(2)
            : (parseFloat(dec1) - parseFloat(dec2)).toFixed(2)
        );
        break;
      }

      case 'multiplication': {
        const num1 = Math.floor(Math.random() * 12) + 1;
        const num2 = Math.floor(Math.random() * 12) + 1;
        question = `${num1} × ${num2}`;
        answer = num1 * num2;
        break;
      }
    }

    // Generate wrong options
    options = [answer];
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const wrongAnswer = type === 'decimals'
        ? parseFloat((answer + offset * 0.1).toFixed(2))
        : Math.round(answer + offset);

      if (!options.includes(wrongAnswer) && wrongAnswer !== answer) {
        options.push(wrongAnswer);
      }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    return { question, answer, options };
  };

  const startGame = (type: GameType) => {
    setSelectedGame(type);
    setGameState({
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      timeElapsed: 0,
      isPlaying: true,
    });
    setCurrentQuestion(generateQuestion(type));
    setFeedback(null);
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (!currentQuestion || feedback !== null) return;

    const isCorrect = Math.abs(selectedAnswer - currentQuestion.answer) < 0.01;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setGameState(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      score: prev.score + (isCorrect ? 10 : 0),
    }));

    setTimeout(() => {
      setFeedback(null);
      if (gameState.questionsAnswered < 9) {
        setCurrentQuestion(generateQuestion(selectedGame!));
      } else {
        endGame();
      }
    }, 1000);
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));

    if (selectedGame && gameState.score > highScores[selectedGame]) {
      const newHighScores = { ...highScores, [selectedGame]: gameState.score };
      setHighScores(newHighScores);
      localStorage.setItem('mathGamesHighScores', JSON.stringify(newHighScores));
    }
  };

  const resetGame = () => {
    setSelectedGame(null);
    setCurrentQuestion(null);
    setFeedback(null);
  };

  if (!selectedGame) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Math Games</h2>
          <p className="text-gray-600">
            Choose a game to help students practice math skills in a fun and engaging way!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game, index) => (
            <motion.button
              key={game.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => startGame(game.type)}
              className={`bg-gradient-to-br ${game.color} p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-400`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-6xl">{game.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                  <p className="text-white/90 text-sm mb-4">{game.description}</p>
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <FaTrophy />
                    <span>High Score: {highScores[game.type]}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const game = games.find(g => g.type === selectedGame)!;
  const accuracy = gameState.questionsAnswered > 0
    ? Math.round((gameState.correctAnswers / gameState.questionsAnswered) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="text-4xl mr-3">{game.icon}</span>
              {game.title}
            </h2>
            <p className="text-gray-600 mt-1">{game.description}</p>
          </div>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            ← Back
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{gameState.score}</div>
            <div className="text-sm text-gray-600 mt-1">Score</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-sm text-gray-600 mt-1">Accuracy</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {gameState.questionsAnswered}/10
            </div>
            <div className="text-sm text-gray-600 mt-1">Progress</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 flex items-center justify-center">
              <FaClock className="mr-2 text-2xl" />
              {gameState.timeElapsed}s
            </div>
            <div className="text-sm text-gray-600 mt-1">Time</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      {gameState.isPlaying && currentQuestion ? (
        <motion.div
          key={currentQuestion.question}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-md p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              {currentQuestion.question}
            </h3>
            <p className="text-gray-600">Choose the correct answer:</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(option)}
                disabled={feedback !== null}
                className={`
                  p-6 rounded-xl font-bold text-2xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-400
                  ${feedback === null ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' : ''}
                  ${feedback === 'correct' && Math.abs(option - currentQuestion.answer) < 0.01
                    ? 'bg-green-500 text-white'
                    : ''}
                  ${feedback === 'incorrect' && Math.abs(option - currentQuestion.answer) < 0.01
                    ? 'bg-green-500 text-white'
                    : ''}
                  ${feedback === 'incorrect' && Math.abs(option - currentQuestion.answer) >= 0.01
                    ? 'bg-gray-200 text-gray-500'
                    : ''}
                `}
              >
                {option}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-8 p-6 rounded-xl text-center ${
                  feedback === 'correct'
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-red-100 border-2 border-red-500'
                }`}
              >
                <div className="text-4xl mb-2">
                  {feedback === 'correct' ? '🎉' : '💪'}
                </div>
                <p className={`text-2xl font-bold ${
                  feedback === 'correct' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {feedback === 'correct' ? 'Correct!' : 'Keep trying!'}
                </p>
                {feedback === 'incorrect' && (
                  <p className="text-gray-700 mt-2">
                    The answer was {currentQuestion.answer}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        // Game Over Screen
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-md p-8 text-center"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Game Complete!</h3>

          <div className="max-w-md mx-auto space-y-4 mb-8">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6">
              <div className="text-5xl font-bold text-orange-600 mb-2">
                {gameState.score}
              </div>
              <div className="text-gray-700 font-medium">Final Score</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-800">
                  {gameState.correctAnswers}/10
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-800">{accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-800">{gameState.timeElapsed}s</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
            </div>

            {gameState.score > highScores[selectedGame] && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 flex items-center justify-center space-x-2"
              >
                <FaStar className="text-yellow-600 text-2xl" />
                <span className="text-yellow-800 font-bold">New High Score!</span>
                <FaStar className="text-yellow-600 text-2xl" />
              </motion.div>
            )}
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => startGame(selectedGame)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaRedo />
              <span>Play Again</span>
            </button>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Choose Different Game
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
