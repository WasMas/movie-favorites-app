import { Injectable } from '@angular/core';
import { AppUser } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usersKey = 'movie-favorites-users';
  private readonly currentUserKey = 'movie-favorites-current-user';

  constructor() {
    if (!localStorage.getItem(this.usersKey)) {
      const demoUsers: AppUser[] = [
        { id: 1, firstName: 'Admin', lastName: 'Movies', age: 30, email: 'admin@movies.test', password: 'admin123', favoriteMovieIds: [1, 2, 3], active: true, role: 'admin' },
        { id: 2, firstName: 'Sara', lastName: 'Film', age: 24, email: 'sara@movies.test', password: '123456', favoriteMovieIds: [1, 2, 3, 4], active: true, role: 'user' },
        { id: 3, firstName: 'Yassine', lastName: 'Cinema', age: 26, email: 'yassine@movies.test', password: '123456', favoriteMovieIds: [1, 2, 3, 5], active: true, role: 'user' },
      ];
      localStorage.setItem(this.usersKey, JSON.stringify(demoUsers));
    }
  }

  login(email: string, password: string): string | null {
    const user = this.getUsers().find((item) => item.email === email && item.password === password);
    if (!user) return 'Email ou mot de passe incorrect.';
    if (!user.active) return 'Ce compte est désactivé par un administrateur.';
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    return null;
  }

  register(user: Omit<AppUser, 'id' | 'favoriteMovieIds' | 'active' | 'role'>): string | null {
    const users = this.getUsers();
    if (users.some((item) => item.email === user.email)) return 'Cet email existe déjà.';
    const newUser: AppUser = { ...user, id: Date.now(), favoriteMovieIds: [], active: true, role: 'user' };
    localStorage.setItem(this.usersKey, JSON.stringify([...users, newUser]));
    localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));
    return null;
  }

  getCurrentUser(): AppUser | null {
    const saved = localStorage.getItem(this.currentUserKey);
    return saved ? JSON.parse(saved) : null;
  }

  getUsers(): AppUser[] {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  }

  updateUser(user: AppUser): void {
    const users = this.getUsers().map((item) => item.id === user.id ? user : item);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    if (this.getCurrentUser()?.id === user.id) localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  logout(): void { localStorage.removeItem(this.currentUserKey); }
}
