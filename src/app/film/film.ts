import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-film',
  imports: [CommonModule],
  templateUrl: './film.html',
  styleUrl: './film.css',
})
export class Film {
  film = input.required<FilmInterface>();
  selected = input.required<boolean>();

  selectedChange = output<boolean>();

  // Stato per la descrizione espansa
  isDescriptionExpanded = false;

  // Metodi per le stelle
  getStarsArray(): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }

  getFullStars(): number {
    return Math.floor(this.film().valutazione / 2);
  }

  hasHalfStar(): boolean {
    return this.film().valutazione % 2 !== 0;
  }

  // Formattazione data
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  }

  getYearFromDate(date: Date): number {
    return new Date(date).getFullYear();
  }

  // Gestione descrizione
  getDescriptionPreview(): string {
    const desc = this.film().descrizione;
    if (!desc) return '';

    if (this.isDescriptionExpanded || desc.length <= 100) {
      return desc;
    }

    return desc.substring(0, 100) + '...';
  }

  toggleDescription(event: Event): void {
    event.stopPropagation();
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  // Gestione immagine
  onImageError(event: any): void {
    event.target.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNkZGQiLz4KPHR0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4=';
    event.target.alt = 'Immagine non disponibile';
  }

  // Gestori eventi azioni
  onDetailsClick(event: Event): void {
    event.stopPropagation();
    // Implementa visualizzazione dettagli
    console.log('Dettagli film:', this.film());
  }

  onEditClick(event: Event): void {
    event.stopPropagation();
    // Implementa modifica film
    console.log('Modifica film:', this.film());
    // Potresti emettere un evento per il parent
  }

  onDeleteClick(event: Event): void {
    event.stopPropagation();
    // Implementa eliminazione film
    console.log('Elimina film:', this.film());
    // Potresti emettere un evento per il parent
  }
}

// Interfacce (rimangono uguali)
export interface FilmInterface {
  id: string;
  titolo: string;
  data: Date;
  descrizione: string;
  immagine: string;
  valutazione: number;
  genere: Generi;
}

export enum Generi {
  AZIONE = 'Azione',
  COMMEDIA = 'Commedia',
  DRAMMATICO = 'Drammatico',
  HORROR = 'Horror',
  FANTASCIENZA = 'Fantascienza',
  ANIMAZIONE = 'Animazione',
  THRILLER = 'Thriller',
  DOCUMENTARIO = 'Documentario',
}
