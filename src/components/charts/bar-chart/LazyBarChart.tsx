import { type ComponentProps, lazy, Suspense } from "react";

const LazyChart = lazy(() =>
  import("./BarChart").then((module) => ({ default: module.BarChart })),
);

export function LazyBarChart(props: ComponentProps<typeof LazyChart>) {
  return (
    <Suspense
      fallback={<div style={{ width: "100%", flex: "1" }}>...Loading</div>}
    >
      <LazyChart {...props} />
    </Suspense>
  );
}
