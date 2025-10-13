import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
} from '@mui/material';
import { formatPercentage } from '@/utils/calculations';

interface ReturnsData {
  period: string;
  returns: number | null;
  loading: boolean;
}

interface ReturnsTableProps {
  returns: ReturnsData[];
}

export default function ReturnsTable({ returns }: ReturnsTableProps) {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Returns
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {returns.map((row) => (
            <TableRow key={row.period}>
              <TableCell>{row.period}</TableCell>
              <TableCell align="right">
                {row.loading ? (
                  <Skeleton width={80} />
                ) : row.returns !== null ? (
                  <Chip
                    label={formatPercentage(row.returns)}
                    color={row.returns >= 0 ? 'success' : 'error'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                ) : (
                  <Chip label="N/A" size="small" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
