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

  /* 
      Endpoint does not have sorting params (according to DOCs: https://swapi.dev/documentation#intro),
      this way I had to fetch everything to be able to sort no only the page, but all results
  */
  public async getAllPlanetPagesResults() {
    const starWarsApiLimit = 10;

    const firstPage = await this.getPlanets();
    const totalPages = Math.ceil(firstPage.count / starWarsApiLimit);

    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(this.getPlanets(i));
    }

    /* 
      Used Promise.all so we can fetch all other pages at once
  */
    const restPages = await Promise.all(promises);

    const restResults = restPages.flatMap((page) => page.results);

    return [...firstPage.results, ...restResults];
  }

  public async getAllPeopleInPlanet(peopleUrls: WithHttp[]) {
    const promises = peopleUrls.map((personUrl) => this.getPerson(personUrl));

    /* 
      Used Promise.all so we can fetch all people in planet as once
  */
    return await Promise.all(promises);
  }
}
