import { Component, OnInit, inject, signal } from '@angular/core';
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
    AccordionModule
  ],
  templateUrl: './gestionar.component.html',
  styleUrl: './gestionar.component.css'
})

export class GestionarComponent implements OnInit {
  enlace: string = '';
  nombreEncuesta = signal<string>("")

  nombrePregunta = signal<string>("")
  preguntas: PreguntaDto[] = [];
  respuestasAgrupadas: any[] = [];
  private encuestasService: EncuestasService = inject(EncuestasService);

  constructor() {
  }

  ngOnInit(): void {
  this.encuestasService.traerEncuesta(
    1,
    '47d8d483-1562-4cc6-9e1e-8a6a7a5660c1',
    CodigoTipoEnum.RESULTADOS
  ).subscribe({
    next: (res: EncuestaDto) => {
      this.preguntas = res.preguntas;
      this.nombreEncuesta.set(res.nombre);

      res.preguntas.forEach(pregunta => {
        this.nombrePregunta.set(pregunta.texto);
      });

      this.respuestasAgrupadas = this.preguntas.map(pregunta => {
        const conteo: { [key: string]: number } = {};

        pregunta.opciones?.forEach(opcion => {
          const texto = opcion.texto.trim();
          conteo[texto] = (conteo[texto] || 0) + 1;
        });

        const respuestasUnicas = Object.entries(conteo).map(([texto, cantidad]) => ({
          texto,
          cantidad
        }));

        return {
          ...pregunta,
          respuestasUnicas
        };
      });
    },
    error: err => {
      console.error('Error al traer la encuesta:', err);
    }
  });
}


  copiarEnlace() {
    navigator.clipboard.writeText(this.enlace);
  }
}

