export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  poster: string;
  overview: string;
}

export interface AppUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  photo?: string;
  favoriteMovieIds: number[];
  active: boolean;
  role: 'user' | 'admin';
}
