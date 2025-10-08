"use client";

import { LineChart } from "@mui/x-charts/LineChart";

export default function NavChart({ data }: { data: { date: string; nav: number }[] }) {
  return (
    <LineChart
      xAxis={[{ data: data.map((d) => d.date), scaleType: "point" }]}
      series={[{ data: data.map((d) => d.nav), label: "NAV" }]}
      width={600}
      height={300}
    />
  );
}
