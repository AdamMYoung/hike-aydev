import { decode } from "@googlemaps/polyline-codec";
import booleanIntersects from "@turf/boolean-intersects";
import circle from "@turf/circle";
import { Feature, LineString, lineString } from "@turf/helpers";
import { getAllFells, FellDTO } from "database";

export const getFellsOnPolyline = async (polyline: string) => {
  const decodedPolyline = decode(polyline);
  const flippedPolyline = decodedPolyline.map((p) => [p[1], p[0]]);

  const line = lineString(flippedPolyline);
  return getFellsOnLineString(line);
};

export const getFellsOnLineString = async (lineString: Feature<LineString>) => {
  const points = await getAllFells();

  return points.reduce((prev, curr) => {
    const pointCircle = circle([curr.lng, curr.lat], 0.1);
    const isIntersecting = booleanIntersects(lineString, pointCircle);

    if (isIntersecting) {
      return [...prev, curr];
    }

    return prev;
  }, [] as FellDTO[]);
};
