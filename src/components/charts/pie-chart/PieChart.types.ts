export type PieChartProps = {
  datasets: {
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
  labels: string[];
  width?: string;
  maxWidth?: string;
  loading?: boolean;
  showLegend?: boolean;
  height?: string;
  total?: number;
  asDonut?: boolean;
  devicePixelRatio?: number;
  disabledAnimation?: boolean;
};
