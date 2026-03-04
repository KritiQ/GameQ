export type Game = {
  id: number;
  title: string;
  cover?: string | null;
  rating?: number | null;
  released?: string;
  genres?: string[];
  // year?: number;
};

export type BacklogEntry = {
  id: number;
  status: string;
  addedAt: string;
  game: Game;
  userId: number;
};

export type GameDetailType = {
  rawgId: number;
  title: string;
  cover?: string;
  description?: string;
  released?: string;
  rating?: number;
  metacritic?: number;
  website?: string;
  playtime?: number;
  platforms?: string;
  backgroundExtra?: string;
  genres?: string[];
};
