export const SORTABLE_COLUMNS = ["population", "name", "diameter"] as const;

export const INITIAL_FILTERS = { climate: "", terrain: "" } as const;

export type StarWarsFilterKey = keyof typeof INITIAL_FILTERS;
