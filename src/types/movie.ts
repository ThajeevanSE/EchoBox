export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string;
  vote_average: number;
  popularity?: number;
  statusLabel?: string;
}

export interface MovieDetails extends Movie {
  genres?: { id: number; name: string }[];
  runtime?: number;
  homepage?: string;
  tagline?: string;
}
