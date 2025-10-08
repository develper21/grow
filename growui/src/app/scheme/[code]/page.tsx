// src/app/scheme/[code]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Skeleton,
  useTheme,
} from "@mui/material";

// Import all the custom components
import InteractiveNavChart from "@/components/InteractiveNavChart";
import ReturnsTable from "@/components/ReturnsTable";
import SIPCalculator from "@/components/SIPCalculator";
import HistoricalReturnsGrid from "@/components/HistoricalReturnsGrid";
import SchemeHeader from "@/components/SchemeHeader";
import LumpSumCalculator from "@/components/LumpSumCalculator";
import RollingReturnCalculator from "@/components/RollingReturnCalculator";
import SWPCalculator from "@/components/SWPCalculator";
import StepUpSipCalculator from "@/components/StepUpSipCalculator";
import StepUpSwpCalculator from "@/components/StepUpSwpCalculator"; // 1. Import the new component

export default function SchemeDetailPage() {
  const { code } = useParams();
  const [scheme, setScheme] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (code) {
      setLoading(true);
      fetch(`/api/scheme/${code}`)
        .then((res) => res.json())
        .then((data) => {
          setScheme(data);
          setLoading(false);
        })
        .catch(() => {
            console.error("Failed to fetch scheme details");
            setLoading(false)
        });
    }
  }, [code]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 4 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 3 }} />
          <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 3 }} />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
        </Box>
      </Container>
    );
  }

  if (!scheme) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="error"> Fund not found or failed to load. </Typography>
      </Container>
    );
  }

  const { meta, navHistory } = scheme;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      
      <Box sx={{ mb: 4 }}>
        <SchemeHeader meta={meta} navHistory={navHistory} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: { xs: 3, md: 4 } }}>
        <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}`, height: "100%" }}>
          <CardContent sx={{ pb: '32px !important' }}>
            <InteractiveNavChart data={navHistory} schemeName={meta.schemeName} />
          </CardContent>
        </Card>

        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom> Point-to-Point Returns </Typography>
          <ReturnsTable code={String(meta.schemeCode)} />
        </Box>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 2 }}> Historical Monthly Returns </Typography>
        <HistoricalReturnsGrid code={String(meta.schemeCode)} />
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <RollingReturnCalculator code={String(meta.schemeCode)} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4, mt: 2 }}>
        <Box>
          <SIPCalculator code={String(meta.schemeCode)} />
        </Box>
        <Box>
          <LumpSumCalculator code={String(meta.schemeCode)} />
        </Box>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <StepUpSipCalculator code={String(meta.schemeCode)} />
      </Box>

      <Box sx={{ mt: 2 }}>
        <SWPCalculator code={String(meta.schemeCode)} />
      </Box>
      
      {/* 2. Add the new Step-up SWP Calculator */}
      <Box sx={{ mt: 2 }}>
        <StepUpSwpCalculator code={String(meta.schemeCode)} />
      </Box>
      
    </Container>
  );
}