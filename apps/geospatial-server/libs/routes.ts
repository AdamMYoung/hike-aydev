import { decode } from "@googlemaps/polyline-codec";
import circle from "@turf/circle";
import { Feature, LineString, lineString } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";
import { getFellPoints } from "./requests";

export const getFellsOnPolyline = async (polyline: string) => {
  const decodedPolyline = decode(polyline);
  const flippedPolyline = decodedPolyline.map((p) => [p[1], p[0]]);

  const line = lineString(flippedPolyline);
  return getFellsOnLineString(line);
};

export const getFellsOnLineString = async (lineString: Feature<LineString>) => {
  const points = await getFellPoints();
  const circles = points.map((c) => circle([c.lng, c.lat], 0.1, { properties: { id: c.id, name: c.name } }));

  const intersectingCircles = circles.filter((c) => lineIntersect(c, lineString).features.length > 0);
  const intersectingIds = intersectingCircles.map((c) => c.properties.id);

  return points.filter((p) => intersectingIds.includes(p.id));
};
