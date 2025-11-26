import React from 'react';
import { Grid, TextField } from '@mui/material';
import { PersonalInfo } from '@/types/onboarding';

interface PersonalInfoFormProps {
  value: PersonalInfo;
  onChange: (value: PersonalInfo) => void;
}

export const PersonalInfoForm = ({ value, onChange }: PersonalInfoFormProps) => {
  const handleChange = (field: keyof PersonalInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, [field]: event.target.value });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField label="Full Name" value={value.fullName} onChange={handleChange('fullName')} fullWidth required />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField label="PAN" value={value.pan} onChange={handleChange('pan')} fullWidth required helperText="As per your official documents" />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Date of Birth"
          type="date"
          value={value.dateOfBirth}
          onChange={handleChange('dateOfBirth')}
          fullWidth
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField label="Email" value={value.email} onChange={handleChange('email')} fullWidth required type="email" />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField label="Phone" value={value.phone} onChange={handleChange('phone')} fullWidth required />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Address Line 1" value={value.addressLine1} onChange={handleChange('addressLine1')} fullWidth required />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Address Line 2" value={value.addressLine2} onChange={handleChange('addressLine2')} fullWidth />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField label="City" value={value.city} onChange={handleChange('city')} fullWidth required />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField label="State" value={value.state} onChange={handleChange('state')} fullWidth required />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField label="Postal Code" value={value.postalCode} onChange={handleChange('postalCode')} fullWidth required />
      </Grid>
    </Grid>
  );
};
