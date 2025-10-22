import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock(
  "../../services/star-wars/hooks/use-star-wars-planets/useStarWarsPlanets",
  () => ({ useStartWarsPlanets: vi.fn() }),
);

vi.mock("../../dialogs/controller", () => ({
  dialogController: { open: vi.fn() },
}));

import { useStartWarsPlanets } from "../../services/star-wars/hooks/use-star-wars-planets/useStarWarsPlanets";
import { dialogController } from "../../dialogs/controller";
import { translation as enUS } from "../../locales/enUS";
import { StarWarsDashboard } from "./StarWarsDashboard";

const usePlanetsMock = useStartWarsPlanets as unknown as Mock;

function buildHookReturn(
  overrides: Partial<ReturnType<typeof useStartWarsPlanets>> = {},
) {
  return {
    planets: [
      {
        name: "Tatooine",
        climate: "arid",
        terrain: "desert",
        population: "200000",
        diameter: "10465",
        residents: [],
        url: "https://swapi.dev/api/planets/1/",
      },
      {
        name: "Hoth",
        climate: "frozen",
        terrain: "tundra",
        population: "unknown",
        diameter: "7200",
        residents: [],
        url: "https://swapi.dev/api/planets/4/",
      },
    ],
    setFilter: vi.fn(),
    filters: { climate: "", terrain: "" },
    setSortBy: vi.fn(),
    favorites: [],
    toggleFavorite: vi.fn(),
    loading: false,
    onlyFavorites: false,
    toggleSetOnlyFavorites: vi.fn(),
    clearSort: vi.fn(),
    clearFilter: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useStartWarsPlanets>;
}

describe("StarWarsDashboard (page)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlanetsMock.mockReturnValue(buildHookReturn());
  });

  it("renders title and planets from hook", () => {
    render(<StarWarsDashboard />);

    expect(screen.getByText(enUS.planetTable.title)).toBeInTheDocument();

    expect(screen.getByText("Tatooine")).toBeInTheDocument();
    expect(screen.getByText("Hoth")).toBeInTheDocument();
  });

  it("opens PlanetDetailDialog when a row is clicked", () => {
    render(<StarWarsDashboard />);

    fireEvent.click(screen.getByText("Tatooine"));

    expect(dialogController.open).toHaveBeenCalledTimes(1);
    expect(dialogController.open).toHaveBeenCalledWith({
      id: "PlanetDetailDialog",
      props: { planetUrl: "https://swapi.dev/api/planets/1/" },
    });
  });

  it("changes sorting via Select (placeholder sets null)", () => {
    const hookState = buildHookReturn();
    usePlanetsMock.mockReturnValue(hookState);

    render(<StarWarsDashboard />);

    const select = screen.getByLabelText(
      enUS.planetTable.sort,
    ) as HTMLSelectElement;

    fireEvent.change(select, {
      target: { value: enUS.planetTable.selectPlaceholder },
    });

    expect(hookState.setSortBy).toHaveBeenCalledTimes(1);
    expect(hookState.setSortBy).toHaveBeenCalledWith(null);
  });

  it("toggles only favorites checkbox", () => {
    const hookState = buildHookReturn();
    usePlanetsMock.mockReturnValue(hookState);

    render(<StarWarsDashboard />);

    const firstLineFavoriteButton =
      screen.getByTestId("table-row-Tatooine").firstChild?.firstChild;

    fireEvent.click(firstLineFavoriteButton as ChildNode);

    const checkbox = screen.getByLabelText(enUS.planetTable.onlyFavorites);
    fireEvent.click(checkbox);

    expect(hookState.toggleSetOnlyFavorites).toHaveBeenCalledTimes(1);
  });

  it("shows Loading component when loading is true", () => {
    usePlanetsMock.mockReturnValue(buildHookReturn({ loading: true }));

    render(<StarWarsDashboard />);

    expect(screen.getByText(enUS.loadingComponent.loading)).toBeInTheDocument();
  });
});
