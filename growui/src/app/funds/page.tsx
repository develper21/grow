// src/app/funds/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  TextField,
  Pagination,
  Paper,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
// We import the component which now acts as a table row
import FundListItem from "@/components/FundListItem";
import { Scheme } from "@/types/scheme";

export default function FundsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [allFunds, setAllFunds] = useState<Scheme[]>([]);

  // Fetch all funds once and store them for client-side operations
  useEffect(() => {
    async function fetchAllFunds() {
      setLoading(true);
      try {
        const res = await fetch(`https://api.mfapi.in/mf`);
        const data: Scheme[] = await res.json();
        setAllFunds(data || []);
      } catch (error) {
        console.error("Error fetching funds:", error);
        setAllFunds([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAllFunds();
  }, []);

  const limit = 50; // Items per page

  const filteredFunds = allFunds.filter((fund) =>
    fund.schemeName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFunds.length / limit);
  const paginatedFunds = filteredFunds.slice(
    (page - 1) * limit,
    page * limit
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Reset page to 1 whenever the search query changes
  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [search]);


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Mutual Fund Explorer
      </Typography>

      <TextField
        label="Search Funds by Name..."
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4, maxWidth: { sm: 400, md: 600 } }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: '40%' }}>Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>NAV</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>1Y</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>3Y</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>CAGR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedFunds.length > 0 ? (
                  paginatedFunds.map((fund) => (
                    // Our FundListItem now works perfectly as a TableRow
                    <FundListItem fund={fund} key={fund.schemeCode} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary" sx={{ p: 6 }}>
                        No funds match your search.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
}