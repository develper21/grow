"use client";

import {
  Card,
  CardActionArea,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  TrendingUp as GrowthIcon,
  AccountBalance as FundIcon,
  Code as CodeIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import Link from "next/link";

const getCategoryColor = (category: string, theme: any) => {
  const map: Record<string, string> = {
    equity: theme.palette.success.main,
    debt: theme.palette.info.main,
    hybrid: theme.palette.warning.main,
    elss: theme.palette.primary.main,
  };
  return map[category?.toLowerCase()] || theme.palette.grey[600];
};

export default function FundCard({ fund }: { fund: any }) {
  const theme = useTheme();

  const schemeCategory = "Debt";
  const currentNav = "45.7891";
  const oneYearReturn = "7.35";

  const categoryColor = getCategoryColor(schemeCategory, theme);
  const returnColor = oneYearReturn.includes("-")
    ? theme.palette.error.main
    : theme.palette.success.main;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        transition:
          "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.1)}`,
          borderColor: theme.palette.primary.main,
        },
        overflow: "visible",
      }}
    >
      <Link href={`/scheme/${fund.schemeCode}`} passHref legacyBehavior>
        <CardActionArea
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            height: "100%",
            textAlign: "left",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              width: "100%",
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                bgcolor: alpha(theme.palette.info.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FundIcon sx={{ color: "info.main", fontSize: 26 }} />
            </Box>

            <Chip
              label={schemeCategory}
              size="small"
              icon={<CategoryIcon sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: alpha(categoryColor, 0.1),
                color: categoryColor,
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 24,
                "& .MuiChip-icon": {
                  color: categoryColor,
                },
              }}
            />
          </Box>

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              lineHeight: 1.3,
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              minHeight: 70,
              color: "text.primary",
            }}
          >
            {fund.schemeName}
          </Typography>

          <Box
            sx={{
              mt: "auto",
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                Latest NAV (₹)
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="text.primary"
              >
                {currentNav}
              </Typography>
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                1Y Return
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 0.5,
                }}
              >
                <GrowthIcon sx={{ fontSize: 18, color: returnColor }} />
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  color={returnColor}
                >
                  {oneYearReturn}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardActionArea>
      </Link>
    </Card>
  );
}
