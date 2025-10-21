import { Client } from "../client";

const client = new Client("https://swapi.dev/api");

export class StarWarsService {
  static async getPlanets() {
    return client.get("https://swapi.dev/api/planets");
  }

  static getPeople() {
    return client.get("/planets");
  }

  static getAllPlanetPages() {}
}
