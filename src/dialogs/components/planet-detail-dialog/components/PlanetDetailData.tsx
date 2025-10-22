import { Typography } from "../../../../components/typography/Typography";

interface Props {
  heading: string;
  value: string;
}

export function PlanetDetailData({ heading, value }: Props) {
  return (
    <div>
      <Typography bold as="span">{`${heading}: `}</Typography>
      <Typography as="span" variant="secondary">
        {value}
      </Typography>
    </div>
  );
}
