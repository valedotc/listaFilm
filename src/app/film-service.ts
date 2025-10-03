import { Injectable, signal } from '@angular/core';
import { FilmInterface } from './film/film';

@Injectable({ providedIn: 'root' })
export class FilmService {
  private _films = signal<FilmInterface[]>([]);
  readonly films = this._films.asReadonly();

  addFilm(film: FilmInterface): void {
    this._films.update((current) => {
      const newFilm: FilmInterface = {
        ...film,
        id: film.id || this.generateId(current),
      };

      return current.some((f) => f.id === newFilm.id) ? current : [...current, newFilm];
    });
  }

  removeFilm(filmId: string): void {
    this._films.update((current) => current.filter((f) => f.id !== filmId));
  }

  removeFilms(filmIds: string[]): void {
    const idsSet = new Set(filmIds);
    this._films.update((current) => current.filter((film) => !idsSet.has(film.id)));
  }

  getFilmById(id: number): FilmInterface | undefined {
    return this.films().find((film) => +film.id === id);
  }

  updateFilm(id: number, updatedFilm: FilmInterface): void {
    this._films.update((current) => {
      const index = current.findIndex((film) => +film.id === id);
      if (index !== -1) {
        const updated = [...current];
        updated[index] = { ...updated[index], ...updatedFilm, id: current[index].id };
        return updated;
      }
      return current;
    });
  }

  private generateId(currentFilms: FilmInterface[]): string {
    if (currentFilms.length === 0) {
      return '1';
    }

    const maxId = Math.max(...currentFilms.map((f) => parseInt(f.id) || 0));
    return (maxId + 1).toString();
  }
}
