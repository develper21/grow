import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ShieldIcon from '@mui/icons-material/Shield';
import { useOnboarding } from '@/context/OnboardingContext';
import { onboardingSteps } from '@/constants/onboardingSteps';
import { useNotification } from '@/context/NotificationContext';

const MOCK_CODE = '123456';

export default function AccountCreationPage() {
  const router = useRouter();
  const { state, setPersonalInfo } = useOnboarding();
  const { notify } = useNotification();

  const [email, setEmail] = useState(state.personalInfo.email || '');
  const [phone, setPhone] = useState(state.personalInfo.phone || '');
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [phoneSending, setPhoneSending] = useState(false);

  const validateEmail = () => /\S+@\S+\.\S+/.test(email);
  const validatePhone = () => /^\d{10}$/.test(phone);

  const sendEmailCode = () => {
    if (!validateEmail()) {
      notify('Enter a valid email before requesting a code.', 'warning');
      return;
    }
    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false);
      setEmailCodeSent(true);
      notify('Verification code sent to your email (use 123456).', 'success');
    }, 800);
  };

  const sendPhoneCode = () => {
    if (!validatePhone()) {
      notify('Enter a valid 10-digit phone number before requesting a code.', 'warning');
      return;
    }
    setPhoneSending(true);
    setTimeout(() => {
      setPhoneSending(false);
      setPhoneCodeSent(true);
      notify('OTP sent to your phone (use 123456).', 'success');
    }, 800);
  };

  const verifyEmailCode = () => {
    if (emailCode === MOCK_CODE) {
      setEmailVerified(true);
      notify('Email verified successfully.', 'success');
    } else {
      notify('Incorrect email code. Please try again.', 'error');
    }
  };

  const verifyPhoneCode = () => {
    if (phoneCode === MOCK_CODE) {
      setPhoneVerified(true);
      notify('Phone verified successfully.', 'success');
    } else {
      notify('Incorrect phone OTP. Please try again.', 'error');
    }
  };

  const handleContinue = () => {
    setPersonalInfo({ ...state.personalInfo, email, phone });
    router.push(onboardingSteps[0].path);
  };

  const card = (props: {
    title: string;
    description: string;
    icon: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
    code: string;
    onCodeChange: (value: string) => void;
    codeSent: boolean;
    onSendCode: () => void;
    sending: boolean;
    verified: boolean;
    onVerify: () => void;
    placeholder: string;
    helperText: string;
    type?: string;
  }) => (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Box>{props.icon}</Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {props.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {props.description}
            </Typography>
          </Box>
          {props.verified && <Chip label="Verified" color="success" size="small" icon={<CheckCircleIcon />} />}
        </Stack>
        <Stack spacing={2}>
          <TextField
            label={props.title}
            value={props.value}
            onChange={(event) => props.onValueChange(event.target.value)}
            placeholder={props.placeholder}
            fullWidth
            type={props.type ?? 'text'}
            helperText={props.helperText}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="outlined" onClick={props.onSendCode} disabled={props.sending || props.verified}>
              {props.codeSent ? 'Resend code' : 'Send code'}
            </Button>
            <TextField
              label="Verification code"
              value={props.code}
              onChange={(event) => props.onCodeChange(event.target.value)}
              fullWidth
              placeholder="123456"
              disabled={!props.codeSent || props.verified}
            />
            <Button variant="contained" onClick={props.onVerify} disabled={!props.codeSent || props.verified}>
              Verify
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ backgroundColor: 'background.default', py: { xs: 6, md: 8 } }}>
      <Container maxWidth="md">
        <Stack spacing={2} mb={4} alignItems="center" textAlign="center">
          <Chip icon={<ShieldIcon />} label="Secure signup" color="primary" variant="outlined" />
          <Typography variant="h4" fontWeight={800}>
            Create your Grow account
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={560}>
            Verify your contact details so we can share onboarding updates and regulatory disclosures. Use the one-time codes sent to your email and phone to continue.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Demo mode: every code is <strong>{MOCK_CODE}</strong>.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {card({
              title: 'Email address',
              description: 'We will send account statements and regulatory alerts here.',
              icon: <EmailIcon color="primary" />,
              value: email,
              onValueChange: setEmail,
              code: emailCode,
              onCodeChange: setEmailCode,
              codeSent: emailCodeSent,
              onSendCode: sendEmailCode,
              sending: emailSending,
              verified: emailVerified,
              onVerify: verifyEmailCode,
              placeholder: 'you@example.com',
              helperText: 'Use an address you actively monitor.',
              type: 'email',
            })}
          </Grid>
          <Grid item xs={12}>
            {card({
              title: 'Phone number',
              description: 'We use SMS for OTPs and critical investment alerts.',
              icon: <PhoneIphoneIcon color="primary" />,
              value: phone,
              onValueChange: setPhone,
              code: phoneCode,
              onCodeChange: setPhoneCode,
              codeSent: phoneCodeSent,
              onSendCode: sendPhoneCode,
              sending: phoneSending,
              verified: phoneVerified,
              onVerify: verifyPhoneCode,
              placeholder: '9998887777',
              helperText: '10-digit Indian mobile number.',
              type: 'tel',
            })}
          </Grid>
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already verified? <Link href={onboardingSteps[0].path}>Skip to personal details</Link>
          </Typography>
          <Button
            size="large"
            variant="contained"
            onClick={handleContinue}
            disabled={!emailVerified || !phoneVerified}
          >
            Continue to onboarding
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
