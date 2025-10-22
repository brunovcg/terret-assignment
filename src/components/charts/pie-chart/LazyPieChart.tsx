import { type ComponentProps, lazy, Suspense } from "react";

const LazyChart = lazy(() =>
  import("./PieChart").then((module) => ({ default: module.PieChart })),
);

export function LazyPieChart(props: ComponentProps<typeof LazyChart>) {
  return (
    <Suspense
      fallback={<div style={{ width: "100%", flex: "1" }}>...Loading</div>}
    >
      <LazyChart {...props} />
    </Suspense>
  );
}
