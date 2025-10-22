export type BarChartData = Array<{
  yAxis: string | number;
  xAxis: string | number;
}>;

export type BarChartProps = {
  label: string;
  maxWidth?: string;
  width?: string;
  height?: string;
  data?: BarChartData;
  loading?: boolean;
  disabledAnimation?: boolean;
};
