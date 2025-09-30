import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { Film, FilmInterface, Generi } from '../film/film';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, provideRouter } from '@angular/router';

import { routes } from '../app.routes';
import { FilmService } from '../film-service';

@Component({
  selector: 'app-lista-film',
  imports: [Film, CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-film.html',
  styleUrl: './lista-film.css',
})
export class ListaFilm {
  private filmService = inject(FilmService);

  protected films = this.filmService.films;

  readonly selectedIds = signal<Set<string>>(new Set());
  readonly selectedFilms = computed(() =>
    this.films().filter((film) => this.selectedIds().has(film.id))
  );

  readonly hasSelectedFilms = computed(() => this.selectedIds().size > 0);
  readonly selectedCount = computed(() => this.selectedIds().size);
  readonly isAllSelected = computed(() => this.selectedIds().size === this.films().length);

  addFilm(filmData: FilmInterface): void {
    this.filmService.addFilm(filmData);
  }

  removeFilm(filmId: string): void {
    this.filmService.removeFilm(filmId);
    this.deselectFilm(filmId);
  }

  deleteSelectedFilms(): void {
    const selectedIds = Array.from(this.selectedIds());
    this.filmService.removeFilms(selectedIds);
    this.clearSelection();
  }

  trackByFilmId(index: number, film: FilmInterface): string {
    return film.id;
  }

  getAverageRating(): number {
    const films = this.films();
    if (films.length === 0) return 0;
    const total = films.reduce((sum, film) => sum + film.valutazione, 0);
    return total / films.length;
  }

  getMostPopularGenre(): string {
    const films = this.films();
    if (films.length === 0) return 'N/A';

    const genreCount = films.reduce((acc, film) => {
      acc[film.genere] = (acc[film.genere] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(genreCount).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
  }

  selectAll(): void {
    const allIds = this.films().map((film) => film.id);
    this.selectedIds.set(new Set(allIds));
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  toggleSelection(filmId: string): void {
    this.selectedIds.update((selected) => {
      const newSelected = new Set(selected);
      if (newSelected.has(filmId)) {
        newSelected.delete(filmId);
      } else {
        newSelected.add(filmId);
      }
      return newSelected;
    });
  }

  isSelected(filmId: string): boolean {
    return this.selectedIds().has(filmId);
  }

  deselectFilm(filmId: string): void {
    this.selectedIds.update((selected) => {
      const newSelected = new Set(selected);
      newSelected.delete(filmId);
      return newSelected;
    });
  }

  isEmpty(): boolean {
    return this.films().length === 0;
  }
}
