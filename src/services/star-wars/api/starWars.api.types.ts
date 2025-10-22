import type { WithHttp } from "../../../types/globalTypes";
import type { SORTABLE_COLUMNS } from "../starWars.constants";

export interface StarWarsPageable<ResultType> {
  count: number;
  next: string | null;
  previous: string | null;
  results: ResultType[];
}

export interface StarWarsPlanet {
  climate: string;
  created: string;
  diameter: string;
  edited: string;
  films: WithHttp[];
  gravity: string;
  name: string;
  orbital_period: string;
  population: string;
  residents: WithHttp[];
  rotation_period: string;
  surface_water: string;
  terrain: string;
  url: WithHttp;
}

export interface StarWarsPerson {
  birth_year: string;
  eye_color: string;
  films: string[];
  gender: string;
  hair_color: string;
  height: string;
  homeworld: WithHttp;
  mass: string;
  name: string;
  skin_color: string;
  created: string;
  edited: string;
  species: WithHttp[];
  starships: string[];
  url: WithHttp;
  vehicles: string[];
}

export type Sort = (typeof SORTABLE_COLUMNS)[number];

export type StarWarsPlanetWithResidents = Omit<StarWarsPlanet, "residents"> & {
  residents: StarWarsPerson[];
};
