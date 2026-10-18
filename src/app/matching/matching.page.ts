import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular';
import { AppUser } from '../models/movie.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.page.html',
  styleUrls: ['./matching.page.scss'],
  imports: [RouterLink, IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar],
})
export class MatchingPage {
  matches: { user: AppUser; rate: number }[] = [];
  private auth = inject(AuthService);
  private changeDetector = inject(ChangeDetectorRef);

  async ionViewWillEnter(): Promise<void> {
    await this.loadMatches();
  }

  private async loadMatches(): Promise<void> {
    const current = await this.auth.getCurrentUserAsync();
    if (!current) return;
    this.matches = (await this.auth.getUsers())
      .filter((user) => user.id !== current.id && user.active)
      .map((user) => {
        const common = current.favoriteMovieIds.filter((id) => user.favoriteMovieIds.includes(id)).length;
        const denominator = Math.max(current.favoriteMovieIds.length, user.favoriteMovieIds.length, 1);
        return { user, rate: Math.round((common / denominator) * 100) };
      })
      .filter((match) => match.rate > 75)
      .sort((a, b) => b.rate - a.rate);
    this.changeDetector.detectChanges();
  }
}
