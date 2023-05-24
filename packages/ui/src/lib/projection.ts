import { Coordinate } from 'ol/coordinate';
import proj4 from 'proj4';

// OSM Projection (Google Maps, OSM)
proj4.defs(
  "EPSG:3857",
  "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs"
);

// WGS Projection (GPS)
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs +type=crs");

export const toOSMCoordinates = (coordinates: Coordinate) => {
  return proj4("EPSG:4326", "EPSG:3857", coordinates);
};

export const toWGSCoordinates = (coordinates: Coordinate) => {
  return proj4("EPSG:3857", "EPSG:4326", coordinates);
};
