import { Component, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { Generi, FilmInterface } from '../film/film';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FilmService } from '../film-service';

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private filmService = inject(FilmService);

  isDragging = false;
  fileSelected = false;
  isSubmitting = false;
  maxDate = new Date().toISOString().split('T')[0];

  isEditMode = false;
  filmId: number | null = null;

  generiDisponibili = Object.values(Generi);

  filmForm = new FormGroup({
    titolo: new FormControl<string | null>(null, Validators.required),
    data: new FormControl<Date | null>(null, Validators.required),
    descrizione: new FormControl<string | null>(null),
    immagine: new FormControl<string | null>(null),
    valutazione: new FormControl<number | null>(5),
    genere: new FormControl<Generi | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idStr = params.get('id');

      if (idStr !== null) {
        this.isEditMode = true;
        this.filmId = +idStr;
        this.loadFilmData(this.filmId);
      } else {
        this.isEditMode = false;
        this.filmId = null;
        this.resetForm(this.filmForm);
      }
    });
  }

  private loadFilmData(id: number): void {
    const film = this.filmService.getFilmById(id);

    if (film) {
      this.filmForm.patchValue({
        titolo: film.titolo,
        data: film.data,
        descrizione: film.descrizione,
        immagine: film.immagine,
        valutazione: film.valutazione,
        genere: film.genere,
      });

      if (film.immagine) {
        this.fileSelected = true;
      }
    } else {
      console.error('Film non trovato');
      this.router.navigate(['/']);
    }
  }

  getStars(): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }

  hasHalfStar(): boolean {
    return (this.filmForm.value.valutazione || 0) % 2 !== 0;
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    try {
      if (this.isEditMode && this.filmId !== null) {
        this.updateFilm(this.filmForm.value as FilmInterface);
        console.log('Film aggiornato:', this.filmForm.value);
      } else {
        this.saveFilm(this.filmForm.value as FilmInterface);
        console.log('Film salvato:', this.filmForm.value);
      }

      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm(form: FormGroup): void {
    form.reset();
    this.filmForm.reset({ valutazione: 5 }); // Reset con valore default
    this.fileSelected = false;
  }

  private saveFilm(film: FilmInterface): void {
    this.filmService.addFilm(film);
  }

  private updateFilm(film: FilmInterface): void {
    if (this.filmId !== null) {
      this.filmService.updateFilm(this.filmId, film);
    }
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
    const maxSize = 25 * 1024 * 1024;
    if (!file.type.startsWith('image/')) {
      alert('Per favore seleziona un file immagine');
      return;
    }
    if (file.size > maxSize) {
      alert("L'immagine non può superare i 25MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.filmForm.controls.immagine.setValue(reader.result as string);
      this.fileSelected = true;
    };
    reader.onerror = () => {
      alert("Errore nel caricamento dell'immagine");
    };
    reader.readAsDataURL(file);
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.filmForm.controls.immagine.setValue('');
    this.fileSelected = false;
  }
}
