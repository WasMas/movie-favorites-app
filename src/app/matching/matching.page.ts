import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular';
import { AppUser } from '../models/movie.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.page.html',
  imports: [RouterLink, IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar],
})
export class MatchingPage implements OnInit {
  matches: { user: AppUser; rate: number }[] = [];
  private auth = inject(AuthService);

  ngOnInit(): void {
    const current = this.auth.getCurrentUser();
    if (!current) return;
    this.matches = this.auth.getUsers()
      .filter((user) => user.id !== current.id && user.active)
      .map((user) => {
        const common = current.favoriteMovieIds.filter((id) => user.favoriteMovieIds.includes(id)).length;
        const denominator = Math.max(current.favoriteMovieIds.length, user.favoriteMovieIds.length, 1);
        return { user, rate: Math.round((common / denominator) * 100) };
      })
      .filter((match) => match.rate > 75)
      .sort((a, b) => b.rate - a.rate);
  }
}
