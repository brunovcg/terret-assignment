import { getLocale } from "../../../locales/locales";
import { useStarWarsPlanetDetails } from "../../../services/star-wars/useStarWarsPlanetDetails";
import { Dialog } from "../../Dialog";
import "./PlanetDetailDialog.css";
import { Loading } from "../../../components/loading/Loading";
import { PlanetDetailDialogPlanetInfo } from "./components/PlanetDetailDialogPlanetInfo";
import { PlanetDetailDialogResidents } from "./components/PlanetDetailDialogResidents";

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
            <PlanetDetailDialogResidents
              reducedResidents={reducedResidents}
              planetWithResidents={planetWithResidents}
            />
          </>
        )}
      </Dialog.Content>
    </Dialog>
  );
}
