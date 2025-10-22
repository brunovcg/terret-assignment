import { getLocale } from "../../../locales/locales";
import { useStarWarsPlanetDetails } from "../../../services/star-wars/useStarWarsPlanetDetails";
import { Dialog } from "../../Dialog";
import "./PlanetDetailDialog.css";
import { Loading } from "../../../components/loading/Loading";
import { PlanetDetailDialogPlanetInfo } from "./components/PlanetDetailDialogPlanetInfo";
import { PlanetDetailDialogResidents } from "./components/PlanetDetailDialogResidents";
import { PlanetDetailDialogCharts } from "./components/PlanetDetailDialogCharts";
import { PlanetDetailDialogAverages } from "./components/PlanetDetailDialogAverages";
import { Typography } from "../../../components/typography/Typography";

const string = getLocale().planetDetailDialog;

type Props = {
  planetUrl: string;
};

export function PlanetDetailDialog({ planetUrl }: Props) {
  const { planetWithResidents, reducedResidents, loading } =
    useStarWarsPlanetDetails(planetUrl);

  return (
    <Dialog dialogId="PlanetDetailDialog" heading={string.title} width={800}>
      <Dialog.Content>
        {loading ? (
          <Loading />
        ) : (
          <>
            <PlanetDetailDialogPlanetInfo
              planetWithResidents={planetWithResidents}
            />
            {planetWithResidents?.residents.length ? (
              <>
                <PlanetDetailDialogResidents
                  planetWithResidents={planetWithResidents}
                />
                <PlanetDetailDialogCharts reducedResidents={reducedResidents} />
                <PlanetDetailDialogAverages
                  reducedResidents={reducedResidents}
                />
              </>
            ) : (
              <Typography align="center" bold variant="error">
                {string.noData}
              </Typography>
            )}
          </>
        )}
      </Dialog.Content>
    </Dialog>
  );
}
