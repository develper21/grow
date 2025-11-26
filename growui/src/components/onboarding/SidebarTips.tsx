import React from 'react';
import { Box, Card, CardContent, Typography, Stack, Chip } from '@mui/material';

const DEFAULT_TIPS = [
  'Keep your PAN and bank details handy to speed up onboarding.',
  'You can save progress any time and return later from the dashboard.',
  'All documents are stored securely and used only for KYC compliance.',
];

export const SidebarTips = ({ tips = DEFAULT_TIPS }: { tips?: string[] }) => (
  <Card variant="outlined" sx={{ borderRadius: 3 }}>
    <CardContent>
      <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
        Helpful Tips
      </Typography>
      <Stack spacing={2}>
        {tips.map((tip, index) => (
          <Box key={tip} display="flex" gap={1}>
            <Chip label={`Tip ${index + 1}`} size="small" color="primary" variant="outlined" />
            <Typography variant="body2" color="text.secondary">
              {tip}
            </Typography>
          </Box>
        ))}
      </Stack>
    </CardContent>
  </Card>
);
