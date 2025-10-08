"use client";

import { TextField } from "@mui/material";

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <TextField
      label="Search funds..."
      variant="outlined"
      fullWidth
      onChange={(e) => onSearch(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
}
