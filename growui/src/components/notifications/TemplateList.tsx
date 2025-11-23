import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { NotificationTemplate } from '@/types/notification';

interface TemplateListProps {
  templates?: NotificationTemplate[];
  loading?: boolean;
  onChangeStatus?: (templateId: string, status: NotificationTemplate['status']) => void;
}

export const TemplateList = ({ templates, loading, onChangeStatus }: TemplateListProps) => (
  <Stack spacing={2}>
    {templates?.map((template) => (
      <Card key={template.id} variant="outlined">
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6">{template.name}</Typography>
                <Chip label={template.channel.toUpperCase()} size="small" />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Tags: {template.tags.join(', ')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Updated {new Date(template.updatedAt).toLocaleString('en-IN')}
              </Typography>
            </Box>
            <Stack alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1}>
              <Chip label={template.status} color={template.status === 'active' ? 'success' : 'default'} size="small" />
              <Button
                size="small"
                variant="outlined"
                startIcon={template.status === 'active' ? <ToggleOffIcon /> : <ToggleOnIcon />}
                onClick={() =>
                  onChangeStatus?.(template.id, template.status === 'active' ? 'archived' : 'active')
                }
                disabled={loading}
              >
                {template.status === 'active' ? 'Archive' : 'Activate'}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    ))}
    {!templates?.length && !loading && (
      <Typography color="text.secondary">No templates yet.</Typography>
    )}
  </Stack>
);
