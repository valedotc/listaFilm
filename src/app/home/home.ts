import { Component } from '@angular/core';
import { ListaFilm } from '../lista-film/lista-film';

@Component({
  selector: 'app-home',
  imports: [ListaFilm],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
