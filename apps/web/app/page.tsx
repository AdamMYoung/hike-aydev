import { toOSMCoordinates, ZoomPoint } from "ui";

export default function Home() {
  return <ZoomPoint coordinates={toOSMCoordinates([-2.5478, 54.0039])} />;
}
