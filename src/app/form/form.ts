import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Generi, FilmInterface } from '../film/film';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit {
  private router = inject(Router);
  isDragging = false;
  fileSelected = false;
  // Proprietà per il form
  film = {
    id: '',
    titolo: '',
    data: new Date(),
    descrizione: '',
    immagine: '',
    valutazione: 5,
    genere: '' as Generi,
  };

  dataString = ''; // Per il binding del date input
  isSubmitting = false;
  maxDate = new Date().toISOString().split('T')[0]; // Data odierna come massimo

  generiDisponibili = Object.values(Generi);

  // Metodi per le stelle
  getStars(): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }

  getFullStars(): number {
    return Math.floor(this.film.valutazione / 2);
  }

  hasHalfStar(): boolean {
    return this.film.valutazione % 2 !== 0;
  }

  // Gestione immagine
  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  onImageLoad(): void {
    // Immagine caricata correttamente
  }

  // Submit del form
  async onSubmit(): Promise<void> {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    try {
      this.film.data = new Date(this.dataString);
      this.film.id = this.generateId();

      // Qui dovresti salvare il film (localStorage, servizio, etc.)
      this.saveFilm(this.film);

      console.log('Film salvato:', this.film);

      // Redirect alla home
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  // Reset form
  resetForm(form: any): void {
    form.resetForm();
    this.film = {
      id: '',
      titolo: '',
      data: new Date(),
      descrizione: '',
      immagine: '',
      valutazione: 5,
      genere: '' as Generi,
    };
    this.dataString = '';
    this.fileSelected = false;
  }

  // Genera ID univoco
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Lifecycle hook
  ngOnInit(): void {
    // Imposta la data corrente come default
    this.dataString = new Date().toISOString().split('T')[0];
  }
  private saveFilm(film: FilmInterface): void {
    // Opzione 1: localStorage
    const existingFilms = JSON.parse(localStorage.getItem('films') || '[]');
    existingFilms.push(film);
    localStorage.setItem('films', JSON.stringify(existingFilms));
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }

  private processFile(file: File): void {
    // Validation
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (!file.type.startsWith('image/')) {
      alert('Per favore seleziona un file immagine');
      return;
    }
    if (file.size > maxSize) {
      alert("L'immagine non può superare i 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.film.immagine = reader.result as string;
    };
    reader.onerror = () => {
      alert("Errore nel caricamento dell'immagine");
    };
    reader.readAsDataURL(file);
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.film.immagine = '';
  }
}
