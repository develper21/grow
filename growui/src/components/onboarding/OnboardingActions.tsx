import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

interface OnboardingActionsProps {
  onNext?: () => void;
  onBack?: () => void;
  onSave?: () => void;
  disableNext?: boolean;
  loading?: boolean;
  showBack?: boolean;
  nextLabel?: string;
}

export const OnboardingActions = ({
  onNext,
  onBack,
  onSave,
  disableNext,
  loading,
  showBack = true,
  nextLabel = 'Continue',
}: OnboardingActionsProps) => {
  return (
    <Box mt={4} display="flex" flexWrap="wrap" gap={2} justifyContent="space-between">
      {showBack ? (
        <Button variant="text" onClick={onBack} color="inherit">
          Back
        </Button>
      ) : (
        <span />
      )}
      <Box display="flex" gap={1}>
        {onSave && (
          <Button variant="outlined" onClick={onSave} disabled={loading}>
            Save & Exit
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onNext}
          disabled={disableNext || loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          {nextLabel}
        </Button>
      </Box>
    </Box>
  );
};
