import React from 'react';
import { Box, Card, CardContent, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { RiskProfile } from '@/types/onboarding';
import { riskQuestions } from '@/data/riskQuestions';

interface RiskProfileFormProps {
  value: RiskProfile;
  onChange: (value: RiskProfile) => void;
}

const deriveProfile = (score: number): RiskProfile['profile'] => {
  if (score <= 4) return 'conservative';
  if (score <= 7) return 'balanced';
  return 'aggressive';
};

export const RiskProfileForm = ({ value, onChange }: RiskProfileFormProps) => {
  const handleAnswer = (questionId: string, score: number) => {
    const updated = value.responses.filter((resp) => resp.questionId !== questionId).concat({ questionId, score });
    const totalScore = updated.reduce((sum, resp) => sum + resp.score, 0);
    const profile = deriveProfile(totalScore);
    onChange({ responses: updated, overallScore: totalScore, profile });
  };

  const getSelectedScore = (questionId: string) => value.responses.find((resp) => resp.questionId === questionId)?.score ?? 0;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {riskQuestions.map((question) => (
        <Card key={question.id} variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {question.question}
            </Typography>
            <RadioGroup
              value={String(getSelectedScore(question.id))}
              onChange={(event, value) => handleAnswer(question.id, Number(value))}
            >
              {question.options.map((option) => (
                <FormControlLabel
                  key={option.label}
                  value={String(option.score)}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
      <Card sx={{ borderRadius: 3, background: 'linear-gradient(120deg, rgba(37,99,235,0.08), rgba(14,165,233,0.08))' }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">Overall Score</Typography>
          <Typography variant="h4" fontWeight={700}>{value.overallScore}</Typography>
          <Typography variant="body1" color="text.secondary">
            Current profile: {value.profile.charAt(0).toUpperCase() + value.profile.slice(1)}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
