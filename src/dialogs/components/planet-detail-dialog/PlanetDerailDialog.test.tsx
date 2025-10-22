import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { PlanetDetailDialogAverages } from "./components/PlanetDetailDialogAverages";
import { PlanetDetailDialogCharts } from "./components/PlanetDetailDialogCharts";
import { PlanetDetailDialogResidents } from "./components/PlanetDetailDialogResidents";
import { PlanetDetailData } from "./components/PlanetDetailData";
import { getLocale } from "../../../locales/locales";
import type { StarWarsPlanetWithResidents } from "../../../services/star-wars/api/starWars.api.types";
import type { ReducedResidentData } from "../../../services/star-wars/hooks/use-star-wars-planet-details/useStarWarsPlanetDetails.utils";

vi.mock("../../../components/charts/pie-chart/LazyPieChart", () => ({
  LazyPieChart: ({
    datasets,
    labels,
  }: {
    datasets: unknown;
    labels: unknown;
  }) => (
    <div data-testid="mock-pie-chart">
      <div data-testid="pie-datasets">{JSON.stringify(datasets)}</div>
      <div data-testid="pie-labels">{JSON.stringify(labels)}</div>
    </div>
  ),
}));

vi.mock("../../../components/charts/bar-chart/LazyBarChart", () => ({
  LazyBarChart: ({
    label,
    data,
    height,
  }: {
    label: string;
    data: unknown;
    height?: string;
  }) => (
    <div data-testid="mock-bar-chart">
      <div data-testid="bar-label">{label}</div>
      <div data-testid="bar-data">{JSON.stringify(data)}</div>
      <div data-testid="bar-height">{height}</div>
    </div>
  ),
}));

vi.mock("./components/PlanetDetailDialogResident", () => ({
  PlanetDetailDialogResident: ({
    resident,
  }: {
    resident: { name: string };
  }) => (
    <div data-testid={`resident-card-${resident.name}`}>{resident.name}</div>
  ),
}));

const strings = getLocale().planetDetailDialog;

const mockReducedResidents = {
  averageMass: 75,
  averageHeight: 180,
  gender: { datasets: [{ data: [2, 1] }], labels: ["male", "female"] },
  height: [
    { bucket: "150-160", count: 1 },
    { bucket: "170-180", count: 2 },
  ],
} as const;

// --- Tests ---
describe("Planet detail dialog pieces", () => {
  it("renders averages with values", () => {
    render(
      <PlanetDetailDialogAverages
        reducedResidents={
          mockReducedResidents as unknown as ReducedResidentData
        }
      />,
    );

    expect(screen.getByText(strings.averages)).toBeInTheDocument();
    expect(screen.getByText(strings.averageMass)).toBeInTheDocument();
    expect(screen.getByText(strings.averageHeight)).toBeInTheDocument();

    expect(
      screen.getByText(String(mockReducedResidents.averageMass)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(String(mockReducedResidents.averageHeight)),
    ).toBeInTheDocument();
  });

  it("renders charts with provided datasets and labels (pie) and data (bar)", () => {
    render(
      <PlanetDetailDialogCharts
        reducedResidents={
          mockReducedResidents as unknown as ReducedResidentData
        }
      />,
    );

    expect(screen.getByText(strings.statistics)).toBeInTheDocument();
    expect(screen.getByText(strings.gender)).toBeInTheDocument();
    expect(screen.getByText(strings.height)).toBeInTheDocument();

    expect(screen.getByTestId("mock-pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie-datasets").textContent).toContain("[2,1]");
    expect(screen.getByTestId("pie-labels").textContent).toContain("male");
    expect(screen.getByTestId("pie-labels").textContent).toContain("female");

    expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("bar-label").textContent).toBe(
      strings.heightLabel,
    );
    expect(screen.getByTestId("bar-data").textContent).toContain("170-180");
    expect(screen.getByTestId("bar-height").textContent).toBe("200px");
  });

  it("renders charts safely when reducedResidents is undefined", () => {
    render(
      <PlanetDetailDialogCharts
        reducedResidents={undefined as unknown as ReducedResidentData}
      />,
    );

    expect(screen.getByText(strings.statistics)).toBeInTheDocument();
    expect(screen.getByText(strings.gender)).toBeInTheDocument();
    expect(screen.getByText(strings.height)).toBeInTheDocument();

    expect(screen.getByTestId("mock-pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie-datasets").textContent).toBe("[]");
    expect(screen.getByTestId("pie-labels").textContent).toBe("[]");

    expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("bar-data").textContent).toBe("");
  });

  it("renders residents list using resident child component", () => {
    const planetWithResidents = {
      name: "Tatooine",
      residents: [
        { name: "Luke Skywalker" },
        { name: "C-3PO" },
        { name: "Darth Vader" },
      ],
    } as StarWarsPlanetWithResidents;

    render(
      <PlanetDetailDialogResidents planetWithResidents={planetWithResidents} />,
    );

    expect(screen.getByText(strings.residents)).toBeInTheDocument();
    expect(
      screen.getByTestId("resident-card-Luke Skywalker"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("resident-card-C-3PO")).toBeInTheDocument();
    expect(screen.getByTestId("resident-card-Darth Vader")).toBeInTheDocument();
  });

  it("renders a simple heading:value row in PlanetDetailData", () => {
    render(<PlanetDetailData heading="Climate" value="arid" />);

    expect(screen.getByText("Climate:")).toBeInTheDocument();
    expect(screen.getByText("arid")).toBeInTheDocument();
  });
});
