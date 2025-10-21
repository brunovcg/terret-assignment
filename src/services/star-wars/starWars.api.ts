import type { WithHttp } from "../../types/globalTypes";
import { Client } from "../client";
import type {
  StarWarsPageable,
  StarWarsPlanet,
  StarWarsPerson,
} from "./starWars.api.types";

const client = new Client();

export class StarWarsService {
  private async getPlanets(page: number = 1) {
    return client.get<StarWarsPageable<StarWarsPlanet>>(
      `https://swapi.dev/api/planets/?page=${page}`,
    );
  }

  private async getPerson(personUrl: WithHttp) {
    return client.get<StarWarsPerson>(personUrl);
  }

  public async getAllPlanetPagesResults() {
    const starWarsApiLimit = 10;

    const firstPage = await this.getPlanets();
    const totalPages = Math.ceil(firstPage.count / starWarsApiLimit);

    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(this.getPlanets(i));
    }

    const restPages = await Promise.all(promises);

    const restResults = restPages.flatMap((page) => page.results);

    return [...firstPage.results, ...restResults];
  }

  public async getAllPeopleInPlanet(peopleUrls: WithHttp[]) {
    const promises = peopleUrls.map((personUrl) => this.getPerson(personUrl));

    return await Promise.all(promises);
  }
}
