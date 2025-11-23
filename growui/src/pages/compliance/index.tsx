import { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import FactCheckIcon from '@mui/icons-material/FactCheck'; 
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShieldIcon from '@mui/icons-material/Shield';
import { formatDistanceToNow } from 'date-fns';
import { useRetentionPolicies, useConsents, useAuditArtifacts, useDrTasks } from '@/lib/complianceApi';
import { AuditArtifact, ConsentRecord, DisasterRecoveryTask, Regulator, RetentionPolicy } from '@/types/compliance';
import { useNotification } from '@/context/NotificationContext';

interface PolicyFormState {
  regulator: Regulator;
  dataCategory: string;
  retentionPeriodMonths: number;
  legalReference: string;
}

const dataCategories = ['kyc', 'transactions', 'communications', 'analytics'];
const regulators: Regulator[] = ['SEBI', 'AMFI', 'RBI', 'IRDAI'];

export default function ComplianceToolkitPage() {
  const { notify } = useNotification();
  const { policies, loading: policyLoading, updating: policyUpdating, creating: policyCreating, updatePolicy, createPolicy } =
    useRetentionPolicies();
  const { consents, loading: consentLoading, updating: consentUpdating, updateConsent } = useConsents();
  const { artifacts, loading: auditLoading, regenerating, regenerate } = useAuditArtifacts();
  const { tasks, loading: drLoading, updating: drUpdating, updateTask } = useDrTasks();

  const [editPolicyId, setEditPolicyId] = useState<string | null>(null);
  const [editMonths, setEditMonths] = useState(0);
  const [editRegulator, setEditRegulator] = useState<Regulator>('SEBI');
  const [openCreate, setOpenCreate] = useState(false);
  const [newPolicy, setNewPolicy] = useState<PolicyFormState>({ regulator: 'SEBI', dataCategory: 'kyc', retentionPeriodMonths: 12, legalReference: '' });

  const handlePolicyEdit = (policyId: string, period: number, regulatorValue: Regulator) => {
    setEditPolicyId(policyId);
    setEditMonths(period);
    setEditRegulator(regulatorValue);
  };

  const handlePolicySave = async () => {
    if (!editPolicyId) return;
    try {
      await updatePolicy(editPolicyId, editMonths, editRegulator);
      notify('Retention policy updated', 'success');
      setEditPolicyId(null);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Failed to update policy', 'error');
    }
  };

  const handlePolicyCreate = async () => {
    if (!newPolicy.legalReference) {
      notify('Legal reference is required', 'warning');
      return;
    }
    try {
      await createPolicy(newPolicy as any);
      notify('Retention policy created', 'success');
      setOpenCreate(false);
      setNewPolicy({ regulator: 'SEBI', dataCategory: 'kyc', retentionPeriodMonths: 12, legalReference: '' });
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Failed to create policy', 'error');
    }
  };

  const handleConsentChange = async (consent: ConsentRecord, status: ConsentRecord['status']) => {
    try {
      await updateConsent(consent.id, status);
      notify('Consent status updated', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Failed to update consent', 'error');
    }
  };

  const handleArtifactRegenerate = async (artifactId: string) => {
    try {
      await regenerate(artifactId);
      notify('Audit artifact regenerated', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Failed to regenerate artifact', 'error');
    }
  };

  const handleDrStatusChange = async (task: DisasterRecoveryTask, status: DisasterRecoveryTask['status']) => {
    try {
      await updateTask(task.id, status);
      notify('Task status updated', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Failed to update task', 'error');
    }
  };

  return (
    <>
      <Head>
        <title>Compliance & Audit Toolkit | Grow</title>
      </Head>
      <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at 10% 15%, rgba(124,93,250,0.15), transparent 50%)' }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems="center">
            <Box sx={{ maxWidth: 620 }}>
              <Typography variant="overline" sx={{ letterSpacing: '0.4em', color: alpha('#f8fafc', 0.75) }}>
                COMPLIANCE & AUDIT
              </Typography>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                Govern data policies, consents, exports, and DR drills in one command center.
              </Typography>
              <Typography variant="body1" sx={{ color: alpha('#f8fafc', 0.85) }}>
                Update retention periods, refresh audit artifacts, and track regulator-ready workflows without leaving the dashboard shell.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Chip
                label={`🛡️ ${policies?.length ?? 0} policies`}
                color="secondary"
                sx={{ fontWeight: 600, borderRadius: 5, backgroundColor: alpha('#0b1120', 0.35) }}
              />
              <Chip
                label={`📑 ${consents?.length ?? 0} consents`}
                color="secondary"
                sx={{ fontWeight: 600, borderRadius: 5, backgroundColor: alpha('#0b1120', 0.35) }}
              />
            </Stack>
          </Stack>
        </Container>

        <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 5,
                border: '1px solid rgba(148,163,184,0.25)',
                background: 'linear-gradient(135deg, rgba(14,20,37,0.95), rgba(11,17,30,0.92))',
                boxShadow: '0 30px 70px rgba(3,7,18,0.55)',
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ShieldIcon sx={{ color: '#7c5dfa' }} />
                    <Typography variant="h6">Retention Policies</Typography>
                  </Stack>
                  <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={() => setOpenCreate(true)}>
                    New Policy
                  </Button>
                </Stack>
                {(policyLoading || policyUpdating || policyCreating) && <LinearProgress />}
                <Stack spacing={2}>
                  {policies?.map((policy: RetentionPolicy) => (
                    <Box
                      key={policy.id}
                      sx={{
                        border: '1px solid rgba(148,163,184,0.25)',
                        borderRadius: 3,
                        p: 2,
                        backgroundColor: alpha('#0f172a', 0.6),
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={2} alignItems="center">
                        <Box>
                          <Typography fontWeight={600}>{policy.regulator} • {policy.dataCategory.toUpperCase()}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Retain for {policy.retentionPeriodMonths} months • Updated{' '}
                            {formatDistanceToNow(new Date(policy.updatedAt), { addSuffix: true })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {policy.legalReference}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handlePolicyEdit(policy.id, policy.retentionPeriodMonths, policy.regulator)}
                        >
                          Edit
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 5,
                border: '1px solid rgba(148,163,184,0.25)',
                background: 'linear-gradient(135deg, rgba(14,20,37,0.95), rgba(11,17,30,0.92))',
                boxShadow: '0 30px 70px rgba(3,7,18,0.55)',
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <AssignmentTurnedInIcon sx={{ color: '#38bdf8' }} />
                  <Typography variant="h6">Audit-ready Exports</Typography>
                </Stack>
                {(auditLoading || regenerating) && <LinearProgress />}
                <Stack spacing={2}>
                  {artifacts?.map((artifact: AuditArtifact) => (
                    <Box
                      key={artifact.id}
                      sx={{
                        border: '1px solid rgba(148,163,184,0.25)',
                        borderRadius: 3,
                        p: 2.5,
                        backgroundColor: alpha('#0f172a', 0.6),
                      }}
                    >
                      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
                        <Box>
                          <Typography fontWeight={600}>{artifact.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {artifact.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Type: {artifact.type.toUpperCase()} • Format: {artifact.format.toUpperCase()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last generated {formatDistanceToNow(new Date(artifact.lastGeneratedAt), { addSuffix: true })}
                          </Typography>
                        </Box>
                        <IconButton color="primary" onClick={() => handleArtifactRegenerate(artifact.id)}>
                          <RefreshIcon />
                        </IconButton>
                      </Stack>
                    </Box>
                  ))}
                  {!artifacts?.length && !auditLoading && <Typography color="text.secondary">No audit artifacts yet.</Typography>}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 5,
                border: '1px solid rgba(148,163,184,0.25)',
                background: 'linear-gradient(135deg, rgba(14,20,37,0.95), rgba(11,17,30,0.92))',
                boxShadow: '0 30px 70px rgba(3,7,18,0.55)',
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <AssignmentTurnedInIcon sx={{ color: '#f59e0b' }} />
                  <Typography variant="h6">Disaster Recovery Checklist</Typography>
                </Stack>
                {(drLoading || drUpdating) && <LinearProgress />}
                <Stack spacing={2}>
                  {tasks?.map((task: DisasterRecoveryTask) => (
                    <Box
                      key={task.id}
                      sx={{
                        border: '1px dashed rgba(148,163,184,0.35)',
                        borderRadius: 3,
                        p: 2,
                        backgroundColor: alpha('#0f172a', 0.55),
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" gap={2}>
                        <Box>
                          <Typography fontWeight={600}>{task.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Owner: {task.owner} • Cadence: {task.cadence}
                          </Typography>
                          {task.notes && (
                            <Typography variant="caption" color="text.secondary">
                              Notes: {task.notes}
                            </Typography>
                          )}
                        </Box>
                        <Stack direction="row" spacing={1}>
                          {(['pending', 'completed', 'blocked'] as DisasterRecoveryTask['status'][]).map((status) => (
                            <Chip
                              key={status}
                              label={status}
                              color={task.status === status ? 'primary' : 'default'}
                              variant={task.status === status ? 'filled' : 'outlined'}
                              onClick={() => handleDrStatusChange(task, status)}
                              size="small"
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                  {!tasks?.length && !drLoading && <Typography color="text.secondary">No DR tasks tracked.</Typography>}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      </Box>

      <Dialog open={Boolean(editPolicyId)} onClose={() => setEditPolicyId(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Retention Policy</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Select value={editRegulator} onChange={(event) => setEditRegulator(event.target.value as Regulator)}>
              {regulators.map((reg) => (
                <MenuItem key={reg} value={reg}>
                  {reg}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Retention period (months)"
              type="number"
              value={editMonths}
              onChange={(event) => setEditMonths(Number(event.target.value))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditPolicyId(null)}>Cancel</Button>
          <Button variant="contained" onClick={handlePolicySave} disabled={policyUpdating}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Retention Policy</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Select
              value={newPolicy.regulator}
              onChange={(event) => setNewPolicy((prev) => ({ ...prev, regulator: event.target.value as Regulator }))}
            >
              {regulators.map((reg) => (
                <MenuItem key={reg} value={reg}>
                  {reg}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={newPolicy.dataCategory}
              onChange={(event) => setNewPolicy((prev) => ({ ...prev, dataCategory: event.target.value }))}
            >
              {dataCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Retention period (months)"
              type="number"
              value={newPolicy.retentionPeriodMonths}
              onChange={(event) =>
                setNewPolicy((prev) => ({ ...prev, retentionPeriodMonths: Number(event.target.value) }))
              }
            />
            <TextField
              label="Legal reference"
              value={newPolicy.legalReference}
              onChange={(event) => setNewPolicy((prev) => ({ ...prev, legalReference: event.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePolicyCreate} disabled={policyCreating}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
