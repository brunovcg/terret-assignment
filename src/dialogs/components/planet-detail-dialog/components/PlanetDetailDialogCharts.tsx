import { LazyBarChart } from "../../../../components/charts/bar-chart/LazyBarChart";
import { LazyPieChart } from "../../../../components/charts/pie-chart/LazyPieChart";
import { Typography } from "../../../../components/typography/Typography";
import { getLocale } from "../../../../locales/locales";
import type { useStarWarsPlanetDetails } from "../../../../services/star-wars/useStarWarsPlanetDetails";

const string = getLocale().planetDetailDialog;

interface Props {
  reducedResidents: ReturnType<
    typeof useStarWarsPlanetDetails
  >["reducedResidents"];
}

export function PlanetDetailDialogCharts({ reducedResidents }: Props) {
  return (
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
  );
}
