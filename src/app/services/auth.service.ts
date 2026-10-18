import { Injectable, inject } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { AppUser } from '../models/movie.model';
import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private firebase = inject(FirebaseService);
  private currentUser?: AppUser;
  private authReady: Promise<void>;

  constructor() {
    this.authReady = new Promise((resolve) => {
      onAuthStateChanged(this.firebase.auth, async (firebaseUser) => {
        this.currentUser = firebaseUser
          ? await this.readProfile(firebaseUser.uid)
          : undefined;
        resolve();
      });
    });
  }

  async login(email: string, password: string): Promise<string | null> {
    try {
      const result = await signInWithEmailAndPassword(this.firebase.auth, email, password);
      const profile = await this.readProfile(result.user.uid);
      if (!profile || !profile.active) {
        await signOut(this.firebase.auth);
        this.currentUser = undefined;
        return 'Ce compte est désactivé ou son profil est introuvable.';
      }
      this.currentUser = profile;
      return null;
    } catch {
      return 'Email ou mot de passe incorrect.';
    }
  }

  async register(user: Omit<AppUser, 'id' | 'favoriteMovieIds' | 'active' | 'role'>): Promise<string | null> {
    try {
      const result = await createUserWithEmailAndPassword(this.firebase.auth, user.email, user.password || '');
      const profile: AppUser = {
        id: result.user.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        photo: user.photo ? await this.preparePhoto(user.photo) : undefined,
        favoriteMovieIds: [],
        active: true,
        role: 'user',
      };
      await setDoc(doc(this.firebase.db, 'users', profile.id), profile);
      this.currentUser = profile;
      return null;
    } catch {
      return 'Impossible de créer ce compte. Vérifiez vos informations.';
    }
  }

  getCurrentUser(): AppUser | null {
    return this.currentUser || null;
  }

  async getCurrentUserAsync(): Promise<AppUser | null> {
    await this.authReady;
    const firebaseUser = this.firebase.auth.currentUser;
    if (!firebaseUser) {
      this.currentUser = undefined;
      return null;
    }
    try {
      const profile = await this.readProfile(firebaseUser.uid);
      if (profile) this.currentUser = profile;
    } catch (error) {
      console.error('Impossible de recharger le profil Firebase.', error);
    }
    return this.currentUser || null;
  }

  async getUsers(): Promise<AppUser[]> {
    const snapshot = await getDocs(collection(this.firebase.db, 'users'));
    return snapshot.docs.map((item) => item.data() as AppUser);
  }

  async updateUser(user: AppUser): Promise<string | null> {
    try {
      const firebaseUser = this.firebase.auth.currentUser;
      if (
        firebaseUser &&
        firebaseUser.uid === user.id &&
        firebaseUser.email !== user.email
      ) {
        await updateEmail(firebaseUser, user.email);
      }
      const profile = { ...user };
      delete profile.password;
      if (profile.photo && !profile.photo.startsWith('data:') && !profile.photo.startsWith('https://')) {
        profile.photo = await this.preparePhoto(profile.photo);
      }
      await updateDoc(doc(this.firebase.db, 'users', user.id), profile);
      user.photo = profile.photo;
      this.currentUser = user;
      return null;
    } catch {
      return 'Impossible de mettre à jour le profil.';
    }
  }

  async logout(): Promise<void> {
    await signOut(this.firebase.auth);
    this.currentUser = undefined;
  }

  private async readProfile(uid: string): Promise<AppUser | undefined> {
    const snapshot = await getDoc(doc(this.firebase.db, 'users', uid));
    return snapshot.exists() ? snapshot.data() as AppUser : undefined;
  }

  private async preparePhoto(photoUrl: string): Promise<string> {
    const response = await fetch(photoUrl);
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    try {
      const image = await this.loadImage(imageUrl);
      const size = 160;
      const scale = Math.min(size / image.width, size / image.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.7);
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Impossible de lire la photo.'));
      image.src = url;
    });
  }
}
