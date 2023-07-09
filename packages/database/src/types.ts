import { LogSource } from "@prisma/client";

export type UserDTO = {
  name: string;
  email: string;
  image: string | null;
};

export type FellGroupDTO = {
  id: number;
  name: string;
  imageUrl: string;
  fellCount: number;
};

export type FellDTO = {
  id: number;
  name: string;
  fellGroupIds: number[];
  lat: number;
  lng: number;
  metres: number;
  feet: number;
};

export type TimelineGroupDTO = {
  id: string;
  start: string;
  end: string | null;
  polyline: string | null;
  source: LogSource;
  entries: TimelineEntryDTO[];
};

export type TimelineEntryDTO = {
  id: string;
  fell: FellDTO;
  climbed: boolean;
  camped: boolean;
  comments: string | null;
};
