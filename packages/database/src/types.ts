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
  lat: number;
  lng: number;
  metres: number;
  feet: number;
};

export type TimelineEntryDTO = {
  fellId: number;
  date: Date;
  climbed: boolean;
  camped: boolean;
  comments: string | null;
};

export type TimelineDetailEntryDTO = {
  fell: FellDTO;
  date: Date;
  climbed: boolean;
  camped: boolean;
  comments: string | null;
};

export type TimeoutDTO = {
  expires: Date;
  event: string;
};
