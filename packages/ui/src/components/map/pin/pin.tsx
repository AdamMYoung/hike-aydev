import { useEffect } from "react";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import { Icon, Style } from "ol/style.js";
import { useMapContext } from "../map.context";
import { Coordinate } from "ol/coordinate";
import { usePinGroupContext } from "../pin-group/pin-group.context";
import { toOSMCoordinates } from "../../../lib";

type PinProps = {
  coordinates: Coordinate;
};

export const Pin = ({ coordinates }: PinProps) => {
  const { map } = useMapContext();
  const { layer } = usePinGroupContext();

  useEffect(() => {
    if (!map) {
      return;
    }

    const iconFeature = new Feature({
      geometry: new Point(toOSMCoordinates(coordinates)),
    });

    const iconStyle = new Style({
      image: new Icon({
        src: "/data/icon.png",
      }),
    });

    iconFeature.setStyle(iconStyle);
    layer.addFeature(iconFeature);

    return () => {
      layer.removeFeature(iconFeature);
    };
  }, [map, layer, coordinates]);

  return null;
};
