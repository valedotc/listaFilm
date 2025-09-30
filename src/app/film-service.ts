import { Injectable, signal } from '@angular/core';
import { FilmInterface } from './film/film';

@Injectable({ providedIn: 'root' })
export class FilmService {
  private _films = signal<FilmInterface[]>([]);
  readonly films = this._films.asReadonly();

  addFilm(film: FilmInterface): void {
    this._films.update((current) =>
      current.some((f) => f.id === film.id) ? current : [...current, film]
    );
  }

  removeFilm(filmId: string): void {
    this._films.update((current) => current.filter((f) => f.id !== filmId));
  }

  removeFilms(filmIds: string[]): void {
    const idsSet = new Set(filmIds);
    this._films.update((current) => current.filter((film) => !idsSet.has(film.id)));
  }
}
