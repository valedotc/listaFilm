import { Component, signal, computed, OnInit } from '@angular/core';
import { Film, FilmInterface, Generi } from '../film/film';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, provideRouter } from '@angular/router';

import { routes } from '../app.routes';

@Component({
  selector: 'app-lista-film',
  imports: [Film, CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-film.html',
  styleUrl: './lista-film.css',
})
export class ListaFilm implements OnInit {
  protected films = signal<FilmInterface[]>([]);

  readonly selectedIds = signal<Set<string>>(new Set());
  readonly selectedFilms = computed(() =>
    this.films().filter((film) => this.selectedIds().has(film.id))
  );

  readonly hasSelectedFilms = computed(() => this.selectedIds().size > 0);
  readonly selectedCount = computed(() => this.selectedIds().size);
  readonly isAllSelected = computed(() => this.selectedIds().size === this.films().length);

  ngOnInit(): void {
    this.loadFilmsFromStorage();
  }

  // ✅ CORRETTO - Carica direttamente FilmInterface
  private loadFilmsFromStorage(): void {
    const savedFilms = JSON.parse(localStorage.getItem('films') || '[]') as FilmInterface[];
    // Converti le date da string a Date
    const filmsWithDates = savedFilms.map((film) => ({
      ...film,
      data: new Date(film.data),
    }));
    this.films.set(filmsWithDates);
  }

  addFilmFromForm(filmData: FilmInterface): void {
    this.films.update((currentFilms) => [...currentFilms, filmData]);
    // Salva anche nel localStorage
    this.saveToStorage();
  }

  removeFilm(filmId: string): void {
    this.films.update((currentFilms) => currentFilms.filter((f) => f.id !== filmId));
    this.deselectFilm(filmId);
    this.saveToStorage();
  }

  deleteSelectedFilms(): void {
    const selectedIds = this.selectedIds();
    this.films.update((currentFilms) => currentFilms.filter((film) => !selectedIds.has(film.id)));
    this.clearSelection();
    this.saveToStorage();
  }

  private saveToStorage(): void {
    localStorage.setItem('films', JSON.stringify(this.films()));
  }

  // Altri metodi rimangono uguali ma con film.id invece di film.film().id
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

  // Altri metodi rimangono uguali...
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

  private searchTerm = signal<string>('');
  private searchTimeout?: ReturnType<typeof setTimeout>;
}
