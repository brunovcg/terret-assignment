import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import type { BarChartProps } from "./BarChart.types";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export function BarChart({
  data,
  label,
  width = "100%",
  height = "100%",
  maxWidth = "100%",
  loading,
  disabledAnimation,
}: Readonly<BarChartProps>) {
  const backgroundColor = getComputedStyle(
    document.documentElement,
  ).getPropertyValue("--primary-color");

  const scaleColor = getComputedStyle(
    document.documentElement,
  ).getPropertyValue("--secondary-color");

  const chartData = {
    labels: data?.map((item) => item.xAxis),
    datasets: [
      {
        label,
        data: data?.map((item) => item.yAxis),
        backgroundColor,
      },
    ],
  };

  const options: ChartOptions<"bar"> & { maxBarThickness: number } = {
    animation: disabledAnimation ? false : undefined,
    responsive: true,
    maintainAspectRatio: false,
    color: scaleColor,
    maxBarThickness: 30,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: scaleColor,
        },
      },
      x: {
        ticks: {
          color: scaleColor,
        },
      },
    },
  };

  return (
    <div
      style={{
        overflow: "auto",
        flex: "1",
        alignItems: "center",
        justifyContent: "center",
        width,
        maxWidth,
        display: "flex",
      }}
    >
      {loading && "...loading"}
      {!loading && (
        <div style={{ position: "relative", display: "flex", width, height }}>
          <Bar data={chartData} options={options} width="100%" height="100%" />
        </div>
      )}
    </div>
  );
}
