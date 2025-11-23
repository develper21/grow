import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from '@mui/material';
import { useNotification } from '@/context/NotificationContext';
import { placeOrder } from '@/lib/ordersApi';
import { useOrders } from '@/context/OrdersContext';
import { initiatePaymentIntent, PaymentMethod } from '@/lib/paymentIntegrations';

export type OrderType = 'lumpsum' | 'sip' | 'redeem' | 'swp' | 'stp';

interface TransactionWizardProps {
  open: boolean;
  onClose: () => void;
  scheme: {
    code: number;
    name: string;
    nav: string;
    fundHouse: string;
  };
  defaultOrderType: OrderType;
}

const steps = ['Order details', 'Review & Confirm', 'OTP Verification'];

const paymentMethods: PaymentMethod[] = ['Netbanking', 'UPI', 'Auto-debit mandate'];
const scheduleFrequencies = ['monthly', 'weekly', 'quarterly'];

type CutoffMeta = {
  label: string;
  message: string;
  hour: number;
  minute: number;
};

const cutoffConfig: Record<OrderType, CutoffMeta> = {
  lumpsum: {
    label: '3:00 PM for same-day NAV',
    message: 'Orders confirmed before 3:00 PM get today\'s NAV allotment.',
    hour: 15,
    minute: 0,
  },
  sip: {
    label: '5:00 PM for next debit cycle',
    message: 'SIP instructions locked for the next cycle if confirmed before 5:00 PM.',
    hour: 17,
    minute: 0,
  },
  redeem: {
    label: '3:00 PM for redemption NAV',
    message: 'Redemption proceeds follow same-day NAV if submitted before 3:00 PM.',
    hour: 15,
    minute: 0,
  },
  swp: {
    label: '5:00 PM for next withdrawal',
    message: 'SWP payouts scheduled for the next business day if set before 5:00 PM.',
    hour: 17,
    minute: 0,
  },
  stp: {
    label: '4:00 PM for transfer NAV',
    message: 'STP transfers execute with same-day NAV when set before 4:00 PM.',
    hour: 16,
    minute: 0,
  },
};

const formatCountdown = (ms: number) => {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
};

const computeCutoffWindow = (type: OrderType) => {
  const meta = cutoffConfig[type] ?? cutoffConfig.lumpsum;
  const now = new Date();
  const deadline = new Date(now);
  deadline.setHours(meta.hour, meta.minute, 0, 0);
  let isToday = true;
  if (deadline.getTime() <= now.getTime()) {
    deadline.setDate(deadline.getDate() + 1);
    isToday = false;
  }
  return { ...meta, deadline, isToday };
};

export const TransactionWizard = ({ open, onClose, scheme, defaultOrderType }: TransactionWizardProps) => {
  const { notify } = useNotification();
  const { registerOrder, refreshOrders, mandates } = useOrders();
  const [activeStep, setActiveStep] = useState(0);
  const [orderType, setOrderType] = useState<OrderType>(defaultOrderType);
  const [amount, setAmount] = useState<number>(defaultOrderType === 'sip' ? 5000 : 10000);
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'quarterly'>('monthly');
  const [scheduleStartDate, setScheduleStartDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(paymentMethods[0]);
  const [payoutAccount, setPayoutAccount] = useState('');
  const [targetScheme, setTargetScheme] = useState('');
  const [upiHandle, setUpiHandle] = useState('');
  const [selectedMandateId, setSelectedMandateId] = useState('');
  const [cutoffInfo, setCutoffInfo] = useState({ label: '', message: '', countdown: '', isToday: true });
  const [submitting, setSubmitting] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    if (open) {
      setOrderType(defaultOrderType);
      setAmount(defaultOrderType === 'sip' ? 5000 : 10000);
      setFrequency('monthly');
      setScheduleStartDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod(paymentMethods[0]);
      setActiveStep(0);
      setPayoutAccount('');
      setTargetScheme('');
      setUpiHandle('');
      setSelectedMandateId('');
      setSubmitting(false);
      setOtpCode('');
      setGeneratedOtp('');
      setOtpError('');
    }
  }, [open, defaultOrderType]);

  useEffect(() => {
    const updateCutoff = () => {
      const { label, message, deadline, isToday } = computeCutoffWindow(orderType);
      const countdown = formatCountdown(deadline.getTime() - Date.now());
      setCutoffInfo({ label, message, countdown, isToday });
    };
    updateCutoff();
    const interval = setInterval(updateCutoff, 60000);
    return () => clearInterval(interval);
  }, [orderType]);

  const actionLabel = useMemo(() => {
    switch (orderType) {
      case 'sip':
        return 'Start SIP';
      case 'redeem':
        return 'Redeem';
      case 'swp':
        return 'Start SWP';
      case 'stp':
        return 'Start STP';
      default:
        return 'Buy Lumpsum';
    }
  }, [orderType]);

  const amountLabel = useMemo(() => {
    switch (orderType) {
      case 'redeem':
        return 'Redeem amount';
      case 'swp':
        return 'Withdrawal amount';
      case 'stp':
        return 'Transfer amount';
      default:
        return 'Investment amount';
    }
  }, [orderType]);

  const amountHelper = useMemo(() => {
    switch (orderType) {
      case 'sip':
        return 'Minimum ₹500 per installment';
      case 'redeem':
        return 'Minimum ₹1,000 for redemptions';
      case 'swp':
        return 'Minimum ₹1,000 per withdrawal';
      case 'stp':
        return 'Minimum ₹1,000 per transfer';
      default:
        return 'Minimum ₹500 for investments';
    }
  }, [orderType]);

  const formattedAmount = useMemo(() => `₹${amount.toLocaleString('en-IN')}`, [amount]);

  const isRecurring = orderType === 'sip' || orderType === 'swp' || orderType === 'stp';
  const requiresPayoutAccount = orderType === 'swp';
  const requiresTargetScheme = orderType === 'stp';
  const minAmount = orderType === 'redeem' || orderType === 'swp' || orderType === 'stp' ? 1000 : 500;
  const requiresUpiHandle = paymentMethod === 'UPI';
  const requiresMandate = paymentMethod === 'Auto-debit mandate';
  const activeMandates = mandates.filter((mandate) => mandate.status === 'active');

  const canProceed = useMemo(() => {
    const hasAmount = amount >= minAmount;
    const hasSchedule = !isRecurring || Boolean(scheduleStartDate);
    const hasPayout = !requiresPayoutAccount || payoutAccount.trim().length >= 4;
    const hasTarget = !requiresTargetScheme || targetScheme.trim().length >= 3;
    const hasUpi = !requiresUpiHandle || upiHandle.trim().length >= 4;
    const hasMandate = !requiresMandate || (!!selectedMandateId && activeMandates.some((m) => m.id === selectedMandateId));
    return hasAmount && hasSchedule && hasPayout && hasTarget && hasUpi && hasMandate;
  }, [amount, minAmount, isRecurring, scheduleStartDate, requiresPayoutAccount, payoutAccount, requiresTargetScheme, targetScheme, requiresUpiHandle, upiHandle, requiresMandate, selectedMandateId, activeMandates]);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        setSubmitting(true);
        const paymentIntent = await initiatePaymentIntent({
          method: paymentMethod,
          amount,
          upiHandle: requiresUpiHandle ? upiHandle : undefined,
          mandateId: requiresMandate ? selectedMandateId : undefined,
        });
        const orderPayload = {
          schemeCode: scheme.code,
          schemeName: scheme.name,
          fundHouse: scheme.fundHouse,
          nav: scheme.nav,
          orderType,
          amount,
          frequency: isRecurring ? frequency : undefined,
          sipStartDate: isRecurring ? scheduleStartDate : undefined,
          paymentMethod,
          payoutAccount: orderType === 'swp' ? payoutAccount : undefined,
          targetScheme: orderType === 'stp' ? targetScheme : undefined,
          transferStartDate: orderType === 'stp' ? scheduleStartDate : undefined,
          paymentGateway: paymentIntent.gateway,
          paymentReference: paymentIntent.reference,
        };
        const order = await placeOrder(orderPayload);
        registerOrder(order);
        notify(`${actionLabel} placed (Ref: ${order.id}). ${paymentIntent.narrative}`, 'success');
        onClose();
        refreshOrders();
      } catch (error) {
        console.error(error);
        notify('Failed to place order. Please try again.', 'error');
      } finally {
        setSubmitting(false);
      }
      return;
    }
    if (activeStep === steps.length - 2) {
      await sendOtp();
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const sendOtp = async () => {
    setOtpSending(true);
    setOtpError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpCode('');
    await new Promise((resolve) => setTimeout(resolve, 500));
    notify(`Enter OTP ${code} sent to your registered mobile & email`, 'info');
    setOtpSending(false);
  };

  const detailsStep = (
    <Stack spacing={3} mt={2}>
      <ToggleButtonGroup
        value={orderType}
        exclusive
        onChange={(_, value) => value && setOrderType(value)}
        color="primary"
        size="small"
      >
        <ToggleButton value="lumpsum">Lumpsum</ToggleButton>
        <ToggleButton value="sip">SIP</ToggleButton>
        <ToggleButton value="redeem">Redeem</ToggleButton>
        <ToggleButton value="swp">SWP</ToggleButton>
        <ToggleButton value="stp">STP</ToggleButton>
      </ToggleButtonGroup>

      <TextField
        type="number"
        label={amountLabel}
        value={amount}
        onChange={(event) => setAmount(Number(event.target.value))}
        helperText={amountHelper}
        inputProps={{ min: 0 }}
        fullWidth
      />

      {isRecurring && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="frequency-label">Frequency</InputLabel>
            <Select
              labelId="frequency-label"
              label="Frequency"
              value={frequency}
              onChange={(event) => setFrequency(event.target.value as typeof frequency)}
            >
              {scheduleFrequencies.map((item) => (
                <MenuItem key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="date"
            label={orderType === 'stp' ? 'Transfer start date' : 'Start date'}
            value={scheduleStartDate}
            onChange={(event) => setScheduleStartDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>
      )}

      {orderType === 'swp' && (
        <TextField
          label="Payout account (bank nickname)"
          value={payoutAccount}
          onChange={(event) => setPayoutAccount(event.target.value)}
          helperText="Specify the bank account to credit withdrawals"
          fullWidth
        />
      )}

      {orderType === 'stp' && (
        <TextField
          label="Target scheme"
          value={targetScheme}
          onChange={(event) => setTargetScheme(event.target.value)}
          helperText="Enter the destination scheme for transfers"
          fullWidth
        />
      )}

      <FormControl fullWidth>
        <InputLabel id="payment-label">Payment method</InputLabel>
        <Select
          labelId="payment-label"
          label="Payment method"
          value={paymentMethod}
          onChange={(event) => {
            const nextMethod = event.target.value as PaymentMethod;
            setPaymentMethod(nextMethod);
            if (nextMethod !== 'UPI') {
              setUpiHandle('');
            }
            if (nextMethod !== 'Auto-debit mandate') {
              setSelectedMandateId('');
            } else if (!selectedMandateId && activeMandates.length > 0) {
              setSelectedMandateId(activeMandates[0].id);
            }
          }}
        >
          {paymentMethods.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {requiresUpiHandle && (
        <TextField
          label="UPI ID"
          value={upiHandle}
          onChange={(event) => setUpiHandle(event.target.value)}
          helperText="Enter the VPA where we should send the collect request"
          fullWidth
        />
      )}

      {requiresMandate && (
        activeMandates.length > 0 ? (
          <FormControl fullWidth>
            <InputLabel id="mandate-label">Select mandate</InputLabel>
            <Select
              labelId="mandate-label"
              label="Select mandate"
              value={selectedMandateId}
              onChange={(event) => setSelectedMandateId(event.target.value)}
            >
              {activeMandates.map((mandate) => (
                <MenuItem key={mandate.id} value={mandate.id}>
                  {mandate.nickname} • Limit ₹{mandate.limit.toLocaleString('en-IN')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Alert severity="warning">
            No active mandates found. Please create one under the Mandates page before using auto-debit.
          </Alert>
        )
      )}

      <Alert severity={cutoffInfo.isToday ? 'info' : 'warning'} sx={{ mt: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          NAV cut-off: {cutoffInfo.label}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {cutoffInfo.isToday
            ? `Time remaining: ${cutoffInfo.countdown}`
            : `Today's window closed. Next cut-off in ${cutoffInfo.countdown}.`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {cutoffInfo.message}
        </Typography>
      </Alert>
    </Stack>
  );

  const reviewStep = (
    <Box mt={2}>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        Order summary
      </Typography>
      <Stack spacing={1.5}>
        <SummaryRow label="Fund" value={scheme.name} />
        <SummaryRow label="Order type" value={actionLabel} />
        <SummaryRow label="Amount" value={formattedAmount} />
        {isRecurring && (
          <>
            <SummaryRow label="Frequency" value={frequency.toUpperCase()} />
            <SummaryRow
              label={orderType === 'stp' ? 'Transfer start date' : 'Start date'}
              value={new Date(scheduleStartDate).toLocaleDateString()}
            />
          </>
        )}
        {orderType === 'swp' && <SummaryRow label="Payout account" value={payoutAccount} />}
        {orderType === 'stp' && <SummaryRow label="Target scheme" value={targetScheme} />}
        <SummaryRow label="Payment method" value={paymentMethod} />
        {requiresUpiHandle && <SummaryRow label="UPI ID" value={upiHandle} />}
        {requiresMandate && selectedMandateId && (
          <SummaryRow
            label="Mandate"
            value={activeMandates.find((mandate) => mandate.id === selectedMandateId)?.nickname ?? selectedMandateId}
          />
        )}
        <SummaryRow label="NAV (latest)" value={`₹${Number(scheme.nav).toFixed(2)}`} />
      </Stack>
    </Box>
  );

  const otpStep = (
    <Stack spacing={2} mt={2}>
      <Typography variant="body1" fontWeight={600}>
        Confirm your transaction
      </Typography>
      <Typography variant="body2" color="text.secondary">
        We sent a 6-digit OTP to your registered email and phone. Enter it below to authorize this order.
      </Typography>
      <TextField
        label="Enter OTP"
        value={otpCode}
        onChange={(event) => {
          setOtpCode(event.target.value);
          setOtpError('');
        }}
        inputProps={{ maxLength: 6 }}
        error={Boolean(otpError)}
        helperText={otpError || 'OTP is valid for 5 minutes'}
        fullWidth
      />
      <Stack direction="row" spacing={2}>
        <Button onClick={sendOtp} variant="outlined" size="small" disabled={otpSending}>
          Resend OTP
        </Button>
        {generatedOtp && (
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
            Reference: ****{generatedOtp.slice(-2)}
          </Typography>
        )}
      </Stack>
    </Stack>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {actionLabel} – {scheme.name}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary">
          {scheme.fundHouse} • Scheme Code {scheme.code}
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 ? detailsStep : activeStep === 1 ? reviewStep : otpStep}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} color="inherit">
            Back
          </Button>
        )}
        <Button
          onClick={() => {
            if (activeStep === steps.length - 1 && generatedOtp && otpCode !== generatedOtp) {
              setOtpError('Invalid OTP, please try again.');
              return;
            }
            void handleNext();
          }}
          variant="contained"
          disabled={
            submitting ||
            (activeStep === 0 && !canProceed) ||
            (activeStep === 2 && (!otpCode || otpCode.length < 6 || otpCode !== generatedOtp))
          }
        >
          {activeStep === steps.length - 1 ? 'Confirm order' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {value}
    </Typography>
  </Box>
);
