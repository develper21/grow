export interface RiskQuestion {
  id: string;
  question: string;
  options: { label: string; score: number }[];
}

export const riskQuestions: RiskQuestion[] = [
  {
    id: 'investment_horizon',
    question: 'What is your typical investment horizon?',
    options: [
      { label: 'Less than 1 year', score: 1 },
      { label: '1 to 3 years', score: 2 },
      { label: 'More than 3 years', score: 3 },
    ],
  },
  {
    id: 'market_reaction',
    question: 'How do you react to a 10% market drop?',
    options: [
      { label: 'Sell immediately to avoid further loss', score: 1 },
      { label: 'Hold and wait for recovery', score: 2 },
      { label: 'Buy more at lower prices', score: 3 },
    ],
  },
  {
    id: 'experience',
    question: 'How experienced are you with investing?',
    options: [
      { label: 'Beginner', score: 1 },
      { label: 'Intermediate', score: 2 },
      { label: 'Expert', score: 3 },
    ],
  },
];
