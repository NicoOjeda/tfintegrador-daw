import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';

import { EncuestasService } from '../../services/encuestas.service';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';
import { EncuestaDto } from '../../interfaces/encuesta.dto';
import { OpcionDto } from '../../interfaces/opcion.dto';
import { RespuestaDTO } from '../../interfaces/create-respuestas.dto';
import { PreguntaDto } from '../../interfaces/pregunta.dto';

@Component({
  selector: 'app-gestionar',
  standalone: true,
  imports: [
    ButtonModule,
    MenubarModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    RouterModule,
    AccordionModule,
  ],
  templateUrl: './gestionar.component.html',
  styleUrl: './gestionar.component.css',
})
export class GestionarComponent implements OnInit {
  enlace: string = '';
  nombreEncuesta = signal<string>('');

  nombrePregunta = signal<string>('');
  preguntas: PreguntaDto[] = [];
  respuestasAgrupadas: any[] = [];
  private encuestasService: EncuestasService = inject(EncuestasService);

  sinRespuestas = false;

  constructor() {}
  @Input() encuesta!: EncuestaDto;

  ngOnInit(): void {
    if (!this.encuesta) {
      console.error('No se recibió la encuesta');
      return;
    }

    this.preguntas = this.encuesta.preguntas;
    this.nombreEncuesta.set(this.encuesta.nombre);

    this.encuesta.preguntas.forEach((pregunta) => {
      this.nombrePregunta.set(pregunta.texto);
    });

    this.respuestasAgrupadas = this.preguntas.map((pregunta) => {
      const conteo: { [key: string]: number } = {};

      pregunta.opciones?.forEach((opcion) => {
        const texto = opcion.texto.trim();
        conteo[texto] = (conteo[texto] || 0) + 1;
      });

      const respuestasUnicas = Object.entries(conteo).map(
        ([texto, cantidad]) => ({
          texto,
          cantidad,
        }),
      );

      return {
        ...pregunta,
        respuestasUnicas,
      };
    });
    this.sinRespuestas = this.respuestasAgrupadas.every(
      (p) => p.respuestasUnicas.length === 0,
    );
  }

  descargarCsv() {
    this.encuestasService.exportarCsvComoArchivo(this.encuesta.codigoResultados).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'respuestas.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar CSV', err);
      },
    });
  }
}
