import { useMemo, type ChangeEvent } from "react";
import { Table } from "../../components/table/Table";
import { useStartWarsPlanets } from "../../services/star-wars/useStarWarsPlanets";
import type {
  Sort,
  StarWarsPlanet,
} from "../../services/star-wars/starWars.api.types";
import type { TableColumns } from "../../components/table/Table.types";
import { getLocale } from "../../locales/locales";
import "./StarWarsDashboard.css";
import { Typography } from "../../components/typography/Typography";
import { dialogController } from "../../dialogs/controller";
import { InputText } from "../../components/input-text/InputText";
import {
  SORTABLE_COLUMNS,
  type StarWarsFilterKey,
} from "../../services/star-wars/starWars.constants";
import { NumberUtils } from "../../utils/number/number.utils";
import { Select } from "../../components/select/Select";
import { Button } from "../../components/button/Button";
import { Icon } from "../../components/icon/Icon";
import { ScrollableContainer } from "../../components/scrollable-container/ScrollableContainer";
import { Loading } from "../../components/loading/Loading";
import { Checkbox } from "../../components/checkbox/Checkbox";

const strings = getLocale().planetTable;

export function StarWarsDashboard() {
  const {
    planets,
    setFilter,
    filters,
    setSortBy,
    favorites,
    toggleFavorite,
    loading,
    onlyFavorites,
    toggleSetOnlyFavorites,
  } = useStartWarsPlanets();

  const columns = useMemo(
    (): TableColumns<StarWarsPlanet> => [
      {
        id: "favorite",
        header: strings.favorite,
        cell: ({ row }) => (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(row.name);
            }}
          >
            <Icon
              icon="star"
              weight={favorites.includes(row.name) ? "fill" : "regular"}
            />
          </Button>
        ),
      },
      {
        id: "name",
        header: strings.name,
        cell: ({ row }) => <Typography align="center">{row.name}</Typography>,
      },
      {
        id: "climate",
        header: strings.climate,
        cell: ({ row }) => (
          <Typography align="center">{row.climate}</Typography>
        ),
      },
      {
        id: "terrain",
        header: strings.terrain,
        cell: ({ row }) => (
          <Typography align="center">{row.terrain}</Typography>
        ),
      },
      {
        id: "population",
        header: strings.population,
        cell: ({ row }) => (
          <Typography align="center">
            {NumberUtils.format(row.population)}
          </Typography>
        ),
      },
      /* 
      DOC does not ask for diameter as a column, but I think it is a good call since we are sorting by this.
      It would work without this, but UX would not be good.
      */
      {
        id: "diameter",
        header: strings.diameter,
        cell: ({ row }) => (
          <Typography align="center">
            {NumberUtils.format(row.diameter)}
          </Typography>
        ),
      },
      {
        id: "residents",
        header: strings.residents,
        cell: ({ row }) => (
          <Typography align="center">{row.residents.length}</Typography>
        ),
      },
    ],
    [favorites, toggleFavorite],
  );

  const handleInputFilter =
    (key: StarWarsFilterKey) => (e: ChangeEvent<HTMLInputElement>) =>
      setFilter(key, e.target.value);

  const handleSort = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    const newValue = (
      value === strings.selectPlaceholder ? null : value
    ) as Sort;

    setSortBy(newValue);
  };

  return (
    <div className="star-wars-dashboard">
      <Typography as="h1" size="title" align="center">
        {strings.title}
      </Typography>

      <div className="star-wars-dashboard-menu">
        <div className="star-wars-dashboard-filters">
          <Typography bold size="regular" variant="secondary">
            {strings.filters}
          </Typography>
          <div className="star-wars-dashboard-filters-inputs">
            <InputText
              label={strings.climate}
              debounce={300}
              onChange={handleInputFilter("climate")}
              value={filters.climate}
            />
            <InputText
              label={strings.terrain}
              debounce={300}
              onChange={handleInputFilter("terrain")}
              value={filters.terrain}
            />
            <Checkbox
              label={strings.onlyFavorites}
              checked={onlyFavorites}
              onChange={toggleSetOnlyFavorites}
            />
          </div>
        </div>
        <div className="star-wars-dashboard-sort">
          <Select label={strings.sort} onChange={handleSort}>
            {[strings.selectPlaceholder, ...SORTABLE_COLUMNS].map((item) => (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <ScrollableContainer>
        <Table
          columns={columns}
          rows={planets}
          primaryKey="name"
          pageLimit={10}
          hideNoData={!!loading}
          onRowClick={(row) => {
            dialogController.open({
              id: "PlanetDetailDialog",
              props: { planetUrl: row.url },
            });
          }}
        />
      </ScrollableContainer>

      {loading ? <Loading /> : null}
    </div>
  );
}
