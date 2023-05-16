import { decode } from "@googlemaps/polyline-codec";
import circle from "@turf/circle";
import { lineString } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";
import { getFellPoints } from "./requests";

export const getFellsOnPolyline = async (polyline: string) => {
  const decodedPolyline = decode(polyline);
  const points = await getFellPoints();

  const line = lineString(decodedPolyline);
  const circles = points.map((c) => circle([c.lat, c.lng], 0.1, { properties: { id: c.id, name: c.name } }));

  const intersectingCircles = circles.filter((c) => lineIntersect(c, line).features.length > 0);
  const intersectingIds = intersectingCircles.map((c) => c.properties.id);

  return points.filter((p) => intersectingIds.includes(p.id));
};
