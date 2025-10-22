import { Typography } from "../../../../components/typography/Typography";
import { getLocale } from "../../../../locales/locales";
import type { useStarWarsPlanetDetails } from "../../../../services/star-wars/useStarWarsPlanetDetails";

const string = getLocale().planetDetailDialog;

interface Props {
  reducedResidents: ReturnType<
    typeof useStarWarsPlanetDetails
  >["reducedResidents"];
}

export function PlanetDetailDialogAverages({ reducedResidents }: Props) {
  return (
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
  );
}
