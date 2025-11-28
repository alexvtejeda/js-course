'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AccountSelectionDialog } from '@/components/auth/AccountSelectionDialog';
import SpotlightCard from '@/components/ui/SpotlightCard';
import StarBorder from '@/components/ui/StarBorder';
const phases = [
  {
    number: 1,
    title: 'JavaScript Fundamentals',
    description: 'Review core JavaScript concepts including loops, arrays, and variable declaration',
    badgeColor: 'bg-primary',
  },
  {
    number: 2,
    title: 'Promises & Async',
    description: 'Master asynchronous JavaScript with promises and async/await',
    color: 'bg-card',
    borderColor: 'border-secondary',
    badgeColor: 'bg-chart-1',
  },
  {
    number: 3,
    title: 'React Basics & Chess Setup',
    description: 'Learn React fundamentals while setting up the chess board',
    badgeColor: 'bg-chart-2',
  },
  {
    number: 4,
    title: 'Chess Game Logic',
    description: 'Implement piece movement, check, and checkmate detection',
    badgeColor: 'bg-chart-3',
  },
  {
    number: 5,
    title: 'AI Integration',
    description: 'Integrate Ollama and Chess-Llama for AI-powered gameplay',
    badgeColor: 'bg-chart-4',
  },
];



interface Account {
  id: string;
  name: string;
}

export default function LandingPage() {
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartJourney = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/accounts');
      const data = await response.json();

      if (data.accounts && data.accounts.length > 0) {
        setAccounts(data.accounts);
        setShowAccountDialog(true);
      } else {
        router.push('/auth/setup');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      router.push('/auth/setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAccount = () => {
    router.push('/auth/setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted-background relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-chart-2/20 animate-gradient-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="mx-auto px-4 text-4xl text-center text-primary mb-16 font-bold animate-fade-in">
            JavaScript Chess Learning Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A progressive learning platform where you master JavaScript concepts by building a complete chess game from scratch
          </p>
         <StarBorder as="button" color="red" className="duration-300 ease-in-out hover:scale-[1.1] text-lg px-8 py-8" speed="5s"  onClick={handleStartJourney} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Start Your Journey'}
          </StarBorder>
        </div>

        {/* Learning Path */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Your Learning Path</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phases.map((phase) => (
              <Card
                key={phase.number}
                className={`bg-card border-secondary border-2 transition-all hover:-translate-y-1`}
              >
                <SpotlightCard className="p-4 custom-spotlight-card" spotlightColor="rgba(153, 246, 228, 0.5)">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${phase.badgeColor} text-white`}>
                        Phase {phase.number}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{phase.title}</CardTitle>
                    <CardDescription className="text-gray-700">
                      {phase.description}
                    </CardDescription>
                  </CardHeader>              
                </SpotlightCard>
              </Card>

            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-chart-4 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Progressive Learning</h3>
            <p className="text-gray-600">
              Each phase unlocks only after completing the previous one, ensuring solid foundations
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-chart-1 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💻</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Hands-On Practice</h3>
            <p className="text-gray-600">
              Write real code, build actual features, and see your chess game come to life
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold mb-2">AI Opponent</h3>
            <p className="text-gray-600">
              Train a local AI using Ollama to play chess against your own creation
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 p-8 bg-background border border-secondary rounded-lg shadow-lg shadow-muted">
          <h2 className="text-2xl font-bold text-center mb-6">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold mb-3 text-lg">JavaScript Concepts</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Arrays, loops, and control flow
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Promises and async/await
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Event handling and DOM manipulation
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Modern ES6+ features
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-lg">React & Next.js</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Component architecture
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> State management with useState
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Server vs Client Components
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Next.js App Router
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-lg">AI/LLM</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> API Infraestructure
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Fine-tuning
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background mt-16 py-8 border-t border-secondary rounded-lg shadow-lg shadow-muted ">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Built with Next.js, React, and PostgreSQL</p>
          <p>Thank you Claude, you made this possible</p>
        </div>
      </footer>

      {/* Account Selection Dialog */}
      <AccountSelectionDialog
        open={showAccountDialog}
        onOpenChange={setShowAccountDialog}
        accounts={accounts}
        onNewAccount={handleNewAccount}
      />
    </div>
  );
}
