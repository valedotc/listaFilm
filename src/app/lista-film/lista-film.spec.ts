import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFilm } from './lista-film';

describe('ListaFilm', () => {
  let component: ListaFilm;
  let fixture: ComponentFixture<ListaFilm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaFilm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaFilm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
