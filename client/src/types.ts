export type Game = {
  id: number;
  title: string;
  cover?: string | null;
  rating?: number | null;
  released?: string | null;
  // genre?: string;
  // year?: number;
};

export type BacklogEntry = {
  id: number;
  status: string;
  addedAt: string;
  game: Game;
  userId: number;
};