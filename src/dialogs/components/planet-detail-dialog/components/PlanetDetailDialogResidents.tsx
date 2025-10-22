import { LazyBarChart } from "../../../../components/charts/bar-chart/LazyBarChart";
import { LazyPieChart } from "../../../../components/charts/pie-chart/LazyPieChart";
import { Typography } from "../../../../components/typography/Typography";
import { getLocale } from "../../../../locales/locales";
import type { StarWarsPlanetWithResidents } from "../../../../services/star-wars/starWars.api.types";
import type { useStarWarsPlanetDetails } from "../../../../services/star-wars/useStarWarsPlanetDetails";
import { PlanetDetailDialogResident } from "./PlanetDetailDialogResident";

const string = getLocale().planetDetailDialog;

interface Props {
  planetWithResidents: StarWarsPlanetWithResidents | null;
  reducedResidents: ReturnType<
    typeof useStarWarsPlanetDetails
  >["reducedResidents"];
}

export function PlanetDetailDialogResidents({
  planetWithResidents,
  reducedResidents,
}: Props) {
  if (!planetWithResidents?.residents.length) {
    return (
      <Typography align="center" bold variant="error">
        {string.noData}
      </Typography>
    );
  }

  return (
    <div className="planet-residents">
      <Typography bold as="h3" align="center" size="large">
        {string.residents}
      </Typography>
      <div className="dialog-resident-cards">
        {planetWithResidents?.residents.map((resident) => (
          <PlanetDetailDialogResident resident={resident} key={resident.name} />
        ))}
      </div>
      <div className="dialog-charts">
        <Typography bold variant="primary" as="h3" align="center" size="large">
          {string.statistics}
        </Typography>
        <div className="dialog-pie-chart">
          <Typography bold variant="secondary">
            {string.gender}
          </Typography>
          <LazyPieChart
            datasets={reducedResidents?.gender.datasets ?? []}
            labels={reducedResidents?.gender.labels ?? []}
          />
        </div>
        <div className="dialog-bar-chart">
          <Typography bold variant="secondary">
            {string.height}
          </Typography>
          <LazyBarChart
            label={string.heightLabel}
            data={reducedResidents?.height}
            height="200px"
          />
        </div>
      </div>
      <div className="averages">
        <Typography bold as="h3" align="center" size="large">
          {string.averages}
        </Typography>
        <div className="average-card-list">
          <div className="average-card">
            <Typography bold>{string.averageMass}</Typography>
            <Typography variant="secondary" size="large" bold>
              {reducedResidents?.averageMass}
            </Typography>
          </div>
          <div className="average-card">
            <Typography bold>{string.averageHeight}</Typography>
            <Typography variant="secondary" size="large" bold>
              {reducedResidents?.averageHeight}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
