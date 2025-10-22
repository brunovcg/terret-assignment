import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
  Legend,
  type Plugin,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import type { PieChartProps } from "./PieChart.types";
import { useMemo } from "react";

const scaleColor = getComputedStyle(document.documentElement).getPropertyValue(
  "--secondary-color",
);

ChartJS.register(CategoryScale, ArcElement, Title, Tooltip, Legend);

const makePercent = (number: number, total: number) =>
  ((number / total) * 100).toFixed(2) + "%";

const buildTotalPlugin = (total: number): Plugin<"pie"> => ({
  id: "totalPlugin",
  beforeDraw: (chart) => {
    const { ctx } = chart;

    const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
    const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

    ctx.save();

    ctx.font = "bold 0.8rem Arial";
    ctx.fillStyle = scaleColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total.toString(), centerX, centerY - 10);

    ctx.font = "normal 12px Arial";
    ctx.fillStyle = scaleColor;
    ctx.fillText("Total", centerX, centerY + 12);

    ctx.restore();
  },
});

export function PieChart({
  datasets,
  labels,
  width: chartWidth = "100%",
  height: chartHeight = "100%",
  maxWidth = "100%",
  loading,
  showLegend = true,
  asDonut,
  devicePixelRatio,
  disabledAnimation,
}: Readonly<PieChartProps>) {
  const total = useMemo(
    () => datasets[0]?.data?.reduce((acc, current) => acc + current, 0) ?? 0,
    [datasets],
  );

  const chartData: ChartData<"pie"> = useMemo(
    () => ({
      labels,
      datasets: datasets.map((item) => ({
        data: item.data,
        backgroundColor: item?.backgroundColor,
      })),
    }),
    [datasets, labels],
  );

  const legends = useMemo(
    () =>
      labels.map((lb, index) => {
        const dataset = datasets[0];

        return (
          <div
            key={lb}
            style={{
              display: "flex",
              gap: "4px",
              alignItems: "center",
              paddingLeft: "10px",
            }}
          >
            <div
              style={{
                background: dataset?.backgroundColor?.[index],
                width: "10px",
                height: "10px",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                fontSize: "14px",
                color: scaleColor,
                fontWeight: "bold",
              }}
            >
              {lb}{" "}
              <span style={{ fontWeight: "normal" }}>
                {dataset?.data?.[index]} (
                {makePercent(dataset?.data?.[index], total)})
              </span>{" "}
            </div>
          </div>
        );
      }),
    [datasets, labels, total],
  );

  const options: ChartOptions<"pie"> = useMemo(
    () => ({
      responsive: true,
      cutout: asDonut ? "50%" : undefined,
      devicePixelRatio: devicePixelRatio ?? 1,
      animation: disabledAnimation ? false : undefined,
      plugins: {
        legend: {
          display: false,
          family: "Helvetica",
        },

        tooltip: {
          displayColors: false,
          callbacks: {
            title: () => "",
            label: (tooltipItem) => `${tooltipItem.label}`,
          },
        },
      },
      maintainAspectRatio: false,
    }),
    [asDonut, devicePixelRatio, disabledAnimation],
  );

  return (
    <div
      style={{
        overflow: "auto",
        display: "flex",
        width: chartWidth,
        maxWidth,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Helvetica",
      }}
      className="im-pie-chart"
    >
      {loading && "...loading"}
      {!loading && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            width: chartWidth,
          }}
        >
          {showLegend && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexDirection: "column",
                width: "50%",
              }}
            >
              {legends}
            </div>
          )}
          <div
            style={{
              position: "relative",
              display: "flex",
              height: chartHeight,
            }}
          >
            <Pie
              key={total}
              data={chartData}
              options={options}
              width="100%"
              height="100%"
              plugins={[buildTotalPlugin(total)]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
