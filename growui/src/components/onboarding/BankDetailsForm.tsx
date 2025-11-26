import React from 'react';
import { Grid, TextField, InputAdornment } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { BankDetails } from '@/types/onboarding';

interface BankDetailsFormProps {
  value: BankDetails;
  onChange: (value: BankDetails) => void;
}

export const BankDetailsForm = ({ value, onChange }: BankDetailsFormProps) => {
  const handleChange = (field: keyof BankDetails) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, [field]: event.target.value });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          label="Account Holder Name"
          value={value.accountHolderName}
          onChange={handleChange('accountHolderName')}
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountBalanceIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Account Number"
          value={value.accountNumber}
          onChange={handleChange('accountNumber')}
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CreditCardIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Confirm Account Number"
          value={value.accountNumber}
          onChange={handleChange('accountNumber')}
          fullWidth
          required
          helperText="Ensure this matches your bank records"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField label="IFSC Code" value={value.ifsc} onChange={handleChange('ifsc')} fullWidth required />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField label="Bank Name" value={value.bankName} onChange={handleChange('bankName')} fullWidth required />
      </Grid>
    </Grid>
  );
};
