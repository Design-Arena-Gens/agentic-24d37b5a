'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaRandom, FaClipboardList, FaCheckCircle } from 'react-icons/fa';

type ProblemType = 'arithmetic' | 'algebra' | 'geometry' | 'calculus' | 'statistics';
type Difficulty = 'easy' | 'medium' | 'hard';

interface GeneratedProblem {
  id: string;
  question: string;
  answer: string;
  steps: string[];
  type: ProblemType;
  difficulty: Difficulty;
}

export default function AIMathTool() {
  const [activeTab, setActiveTab] = useState<'solve' | 'generate' | 'quiz'>('solve');
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState<{ answer: string; steps: string[] } | null>(null);
  const [generatedProblems, setGeneratedProblems] = useState<GeneratedProblem[]>([]);
  const [quizSettings, setQuizSettings] = useState({
    type: 'arithmetic' as ProblemType,
    difficulty: 'medium' as Difficulty,
    count: 5,
  });

  // Solve equation
  const handleSolveEquation = () => {
    if (!equation.trim()) {
      alert('Please enter an equation');
      return;
    }

    // Simulated AI solution (in production, this would call an actual API)
    const mockSolution = generateMockSolution(equation);
    setSolution(mockSolution);
  };

  // Generate practice problems
  const handleGenerateProblems = () => {
    const problems: GeneratedProblem[] = [];
    for (let i = 0; i < 3; i++) {
      problems.push(generateMockProblem(quizSettings.type, quizSettings.difficulty));
    }
    setGeneratedProblems(problems);
  };

  // Generate quiz
  const handleGenerateQuiz = () => {
    const problems: GeneratedProblem[] = [];
    for (let i = 0; i < quizSettings.count; i++) {
      problems.push(generateMockProblem(quizSettings.type, quizSettings.difficulty));
    }
    setGeneratedProblems(problems);
  };

  // Mock solution generator
  function generateMockSolution(eq: string): { answer: string; steps: string[] } {
    const steps: string[] = [];
    let answer = '';

    if (eq.includes('+')) {
      const parts = eq.split('+').map(p => parseFloat(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        steps.push(`Given: ${eq}`);
        steps.push(`Add the numbers: ${parts[0]} + ${parts[1]}`);
        answer = `${parts[0] + parts[1]}`;
        steps.push(`Result: ${answer}`);
      }
    } else if (eq.includes('-')) {
      const parts = eq.split('-').map(p => parseFloat(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        steps.push(`Given: ${eq}`);
        steps.push(`Subtract the numbers: ${parts[0]} - ${parts[1]}`);
        answer = `${parts[0] - parts[1]}`;
        steps.push(`Result: ${answer}`);
      }
    } else if (eq.includes('*') || eq.includes('×')) {
      const parts = eq.split(/[*×]/).map(p => parseFloat(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        steps.push(`Given: ${eq}`);
        steps.push(`Multiply the numbers: ${parts[0]} × ${parts[1]}`);
        answer = `${parts[0] * parts[1]}`;
        steps.push(`Result: ${answer}`);
      }
    } else if (eq.includes('/') || eq.includes('÷')) {
      const parts = eq.split(/[\/÷]/).map(p => parseFloat(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        steps.push(`Given: ${eq}`);
        steps.push(`Divide the numbers: ${parts[0]} ÷ ${parts[1]}`);
        answer = `${parts[0] / parts[1]}`;
        steps.push(`Result: ${answer}`);
      }
    } else if (eq.includes('x') || eq.includes('=')) {
      // Simple linear equation
      steps.push(`Given equation: ${eq}`);
      steps.push('Isolate the variable on one side');
      steps.push('Perform inverse operations to solve');
      answer = 'x = 5 (example solution)';
      steps.push(answer);
    } else {
      // Try to evaluate as expression
      try {
        const result = eval(eq.replace(/[^0-9+\-*/().]/g, ''));
        steps.push(`Given expression: ${eq}`);
        steps.push('Evaluate the expression');
        answer = `${result}`;
        steps.push(`Result: ${answer}`);
      } catch {
        steps.push('Could not parse equation');
        answer = 'Invalid equation format';
      }
    }

    return { answer, steps };
  }

  // Mock problem generator
  function generateMockProblem(type: ProblemType, difficulty: Difficulty): GeneratedProblem {
    const id = Date.now().toString() + Math.random();
    let question = '';
    let answer = '';
    let steps: string[] = [];

    const maxNum = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 100 : 1000;

    switch (type) {
      case 'arithmetic':
        const num1 = Math.floor(Math.random() * maxNum) + 1;
        const num2 = Math.floor(Math.random() * maxNum) + 1;
        const ops = ['+', '-', '×', '÷'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        question = `What is ${num1} ${op} ${num2}?`;

        switch (op) {
          case '+':
            answer = `${num1 + num2}`;
            steps = [`Add ${num1} + ${num2}`, `Result: ${answer}`];
            break;
          case '-':
            answer = `${num1 - num2}`;
            steps = [`Subtract ${num1} - ${num2}`, `Result: ${answer}`];
            break;
          case '×':
            answer = `${num1 * num2}`;
            steps = [`Multiply ${num1} × ${num2}`, `Result: ${answer}`];
            break;
          case '÷':
            answer = `${(num1 / num2).toFixed(2)}`;
            steps = [`Divide ${num1} ÷ ${num2}`, `Result: ${answer}`];
            break;
        }
        break;

      case 'algebra':
        const coef = Math.floor(Math.random() * 10) + 1;
        const constant = Math.floor(Math.random() * 20) + 1;
        const result = Math.floor(Math.random() * 20) + 1;
        question = `Solve for x: ${coef}x + ${constant} = ${result}`;
        answer = `x = ${((result - constant) / coef).toFixed(2)}`;
        steps = [
          `Given: ${coef}x + ${constant} = ${result}`,
          `Subtract ${constant} from both sides: ${coef}x = ${result - constant}`,
          `Divide by ${coef}: x = ${answer}`,
        ];
        break;

      case 'geometry':
        const side = Math.floor(Math.random() * 20) + 1;
        question = `What is the area of a square with side length ${side}?`;
        answer = `${side * side} square units`;
        steps = [`Formula: Area = side²`, `Area = ${side}²`, `Area = ${answer}`];
        break;

      case 'calculus':
        const power = Math.floor(Math.random() * 5) + 2;
        question = `Find the derivative of f(x) = x^${power}`;
        answer = `f'(x) = ${power}x^${power - 1}`;
        steps = [
          `Given: f(x) = x^${power}`,
          `Apply power rule: d/dx[x^n] = nx^(n-1)`,
          `Result: ${answer}`,
        ];
        break;

      case 'statistics':
        const data = Array.from({ length: 5 }, () => Math.floor(Math.random() * 50) + 1);
        question = `Find the mean of: ${data.join(', ')}`;
        const mean = data.reduce((a, b) => a + b, 0) / data.length;
        answer = `${mean.toFixed(2)}`;
        steps = [
          `Data: ${data.join(', ')}`,
          `Sum = ${data.reduce((a, b) => a + b, 0)}`,
          `Count = ${data.length}`,
          `Mean = Sum / Count = ${answer}`,
        ];
        break;
    }

    return { id, question, answer, steps, type, difficulty };
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('solve')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              activeTab === 'solve'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaCalculator className="inline mr-2" />
            Equation Solver
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              activeTab === 'generate'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaRandom className="inline mr-2" />
            Practice Problems
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaClipboardList className="inline mr-2" />
            Quiz Generator
          </button>
        </div>
      </div>

      {/* Equation Solver Tab */}
      {activeTab === 'solve' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Equation Solver</h2>
          <p className="text-gray-600 mb-6">
            Enter a mathematical equation or expression to get step-by-step solutions
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Equation
              </label>
              <input
                type="text"
                value={equation}
                onChange={e => setEquation(e.target.value)}
                placeholder="e.g., 2x + 5 = 15 or 25 + 37 or 5 * 12"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-mono"
                onKeyDown={e => e.key === 'Enter' && handleSolveEquation()}
              />
            </div>

            <button
              onClick={handleSolveEquation}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Solve Equation
            </button>
          </div>

          {solution && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg"
            >
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                <FaCheckCircle className="mr-2" />
                Solution
              </h3>
              <div className="space-y-3">
                {solution.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 flex-1">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-xl font-bold text-green-800">
                  Final Answer: <span className="font-mono">{solution.answer}</span>
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Practice Problems Tab */}
      {activeTab === 'generate' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Practice Problem Generator</h2>
            <p className="text-gray-600 mb-6">
              Generate custom practice problems based on topic and difficulty
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  value={quizSettings.type}
                  onChange={e => setQuizSettings({ ...quizSettings, type: e.target.value as ProblemType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="arithmetic">Arithmetic</option>
                  <option value="algebra">Algebra</option>
                  <option value="geometry">Geometry</option>
                  <option value="calculus">Calculus</option>
                  <option value="statistics">Statistics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={quizSettings.difficulty}
                  onChange={e => setQuizSettings({ ...quizSettings, difficulty: e.target.value as Difficulty })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateProblems}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Generate Problems
            </button>
          </div>

          {generatedProblems.length > 0 && (
            <div className="space-y-4">
              {generatedProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Problem {index + 1}</h3>
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {problem.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>

                  <p className="text-xl text-gray-700 mb-4 font-medium">{problem.question}</p>

                  <details className="group">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium list-none flex items-center">
                      <span className="mr-2">Show Solution</span>
                      <span className="transform group-open:rotate-90 transition-transform">▶</span>
                    </summary>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="space-y-2 mb-4">
                        {problem.steps.map((step, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <p className="text-gray-700">{step}</p>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-blue-200">
                        <p className="text-lg font-bold text-blue-800">
                          Answer: <span className="font-mono">{problem.answer}</span>
                        </p>
                      </div>
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Quiz Generator Tab */}
      {activeTab === 'quiz' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Generator</h2>
            <p className="text-gray-600 mb-6">
              Create custom quizzes with multiple problems for your students
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  value={quizSettings.type}
                  onChange={e => setQuizSettings({ ...quizSettings, type: e.target.value as ProblemType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="arithmetic">Arithmetic</option>
                  <option value="algebra">Algebra</option>
                  <option value="geometry">Geometry</option>
                  <option value="calculus">Calculus</option>
                  <option value="statistics">Statistics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={quizSettings.difficulty}
                  onChange={e => setQuizSettings({ ...quizSettings, difficulty: e.target.value as Difficulty })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Problems
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={quizSettings.count}
                  onChange={e => setQuizSettings({ ...quizSettings, count: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateQuiz}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Generate Quiz
            </button>
          </div>

          {generatedProblems.length > 0 && (
            <>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {quizSettings.type.charAt(0).toUpperCase() + quizSettings.type.slice(1)} Quiz
                </h3>
                <p className="text-gray-600">
                  Difficulty: {quizSettings.difficulty} • {generatedProblems.length} problems
                </p>
              </div>

              <div className="space-y-4">
                {generatedProblems.map((problem, index) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md p-6"
                  >
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      Question {index + 1}
                    </h4>
                    <p className="text-xl text-gray-700 mb-4">{problem.question}</p>

                    <details className="group">
                      <summary className="cursor-pointer text-green-600 hover:text-green-700 font-medium list-none flex items-center">
                        <span className="mr-2">Show Answer Key</span>
                        <span className="transform group-open:rotate-90 transition-transform">▶</span>
                      </summary>
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-800">
                          Answer: <span className="font-mono">{problem.answer}</span>
                        </p>
                        <div className="mt-3 space-y-2">
                          <p className="text-sm font-semibold text-gray-700">Steps:</p>
                          {problem.steps.map((step, i) => (
                            <p key={i} className="text-sm text-gray-600 ml-4">
                              {i + 1}. {step}
                            </p>
                          ))}
                        </div>
                      </div>
                    </details>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
