import React, { useRef } from 'react';
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, TextField, Button, Typography, Chip, Divider, Stack } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DocumentInfo } from '@/types/onboarding';

interface DocumentsFormProps {
  value: DocumentInfo;
  onChange: (value: DocumentInfo) => void;
}

const DOCUMENT_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving_license', label: 'Driving License' },
];

export const DocumentsForm = ({ value, onChange }: DocumentsFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFieldChange = (field: keyof DocumentInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, [field]: event.target.value });
  };

  const handleTypeChange = (event: SelectChangeEvent<DocumentInfo['documentType']>) => {
    onChange({ ...value, documentType: event.target.value as DocumentInfo['documentType'] });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({
          ...value,
          fileName: file.name,
          verificationStatus: 'pending',
          previewDataUrl: typeof reader.result === 'string' ? reader.result : undefined,
          extractedName: undefined,
          extractedDob: undefined,
          ocrConfidence: undefined,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <FormControl fullWidth required>
        <InputLabel id="document-type-label">Document Type</InputLabel>
        <Select
          labelId="document-type-label"
          value={value.documentType}
          label="Document Type"
          onChange={handleTypeChange}
        >
          {DOCUMENT_TYPES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select the identity proof you want to upload</FormHelperText>
      </FormControl>

      <TextField
        label="Document Number"
        value={value.documentNumber}
        onChange={handleFieldChange('documentNumber')}
        fullWidth
        required
      />

      <Box>
        <input type="file" hidden ref={fileInputRef} onChange={handleFileSelect} accept="image/*,application/pdf" />
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Document
        </Button>
        {value.fileName && (
          <Box mt={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="body2" fontWeight={600}>
                {value.fileName}
              </Typography>
              <Chip
                size="small"
                label={value.verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'}
                color={value.verificationStatus === 'verified' ? 'success' : 'warning'}
                variant="outlined"
              />
            </Box>
            {value.previewDataUrl && (
              <Box mt={2}>
                {value.previewDataUrl.startsWith('data:image') ? (
                  <Box
                    component="img"
                    src={value.previewDataUrl}
                    alt="Document preview"
                    sx={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                  />
                ) : (
                  <Box
                    component="iframe"
                    src={value.previewDataUrl}
                    title="Document preview"
                    sx={{ width: '100%', height: 240, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                  />
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {value.extractedName && (
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            OCR results
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {value.extractedName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Date of birth
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {value.extractedDob}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Confidence
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {Math.round((value.ocrConfidence ?? 0) * 100)}%
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
