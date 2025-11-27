'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AccountSelectionDialog } from '@/components/auth/AccountSelectionDialog';

const phases = [
  {
    number: 1,
    title: 'JavaScript Fundamentals',
    description: 'Review core JavaScript concepts including loops, arrays, and variable declaration',
    color: 'bg-card',
    borderColor: 'border-secondary',
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
    color: 'bg-card',
    borderColor: 'border-secondary',
    badgeColor: 'bg-chart-2',
  },
  {
    number: 4,
    title: 'Chess Game Logic',
    description: 'Implement piece movement, check, and checkmate detection',
    color: 'bg-card',
    borderColor: 'border-secondary',
    badgeColor: 'bg-chart-3',
  },
  {
    number: 5,
    title: 'AI Integration',
    description: 'Integrate Ollama and Chess-Llama for AI-powered gameplay',
    color: 'bg-card',
    borderColor: 'border-secondary',
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Learn JavaScript by Building Chess
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A progressive learning platform where you master JavaScript concepts by building a complete chess game from scratch
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={handleStartJourney}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Start Your Journey'}
          </Button>
        </div>

        {/* Learning Path */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Your Learning Path</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phases.map((phase) => (
              <Card
                key={phase.number}
                className={`${phase.color} ${phase.borderColor} border-2 transition-all hover:shadow-lg hover:-translate-y-1`}
              >
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
        <div className="mt-16 p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 gap-6">
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t mt-16 py-8">
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
