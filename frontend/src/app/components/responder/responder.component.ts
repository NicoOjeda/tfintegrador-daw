import { Component, inject, Input, signal } from '@angular/core';
import { EncuestaDto } from '../../interfaces/encuesta.dto';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TiposRespuestaEnum } from '../../enums/tipos-respuestas.enum';
import { EncuestasService } from '../../services/encuestas.service';
import { PreguntaDto } from '../../interfaces/pregunta.dto';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CreateRespuestasDTO } from '../../interfaces/create-respuestas.dto';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-responder',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    RadioButtonModule,
    CheckboxModule,
    ButtonModule,
    MenubarModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './responder.component.html',
  styleUrl: './responder.component.css',
})
export class ResponderComponent {
  @Input() encuesta!: EncuestaDto;
  form!: FormGroup;
  tipos = TiposRespuestaEnum;
  nombreEncuesta = signal<string>('');

  private encuestasService: EncuestasService = inject(EncuestasService);
  private fb: FormBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    //console.log(this.encuesta);
    this.nombreEncuesta.set(this.encuesta.nombre);
    this.form = this.fb.group({
      respuestas: this.fb.array(
        this.encuesta.preguntas.map((pregunta) =>
          this.crearControlPregunta(pregunta),
        ),
      ),
    });
  }

  crearControlPregunta(pregunta: PreguntaDto): any {
    switch (pregunta.tipo) {
      case this.tipos.ABIERTA:
        return new FormControl('');
      case this.tipos.OPCION_MULTIPLE_SELECCION_SIMPLE:
        return new FormControl(null);
      case this.tipos.OPCION_MULTIPLE_SELECCION_MULTIPLE:
        return this.fb.array(pregunta.opciones!.map(() => false));
    }
  }

  enviar(): void {
    const respuestasFormateadas = this.form.value.respuestas.map(
      (respuesta: any, i: number) => {
        const pregunta = this.encuesta.preguntas[i];
        switch (pregunta.tipo) {

          case this.tipos.ABIERTA:
            return {
              tipo: this.tipos.ABIERTA,
              respuestaAbierta: {
                texto: respuesta,
                idPregunta: pregunta.id,
              },
            };

          case this.tipos.OPCION_MULTIPLE_SELECCION_SIMPLE:
            return {
              tipo: this.tipos.OPCION_MULTIPLE_SELECCION_SIMPLE,
              respuestasOpciones: [
                {
                  idPregunta: pregunta.id,
                  opciones: [{ idOpcion: respuesta }],
                },
              ],
            };

          case this.tipos.OPCION_MULTIPLE_SELECCION_MULTIPLE:
            const seleccionadas = respuesta
              .map((checked: boolean, idx: number) =>
                checked ? { idOpcion: pregunta.opciones![idx].id } : null,
              )
              .filter((val: any) => val !== null);
            return {
              tipo: this.tipos.OPCION_MULTIPLE_SELECCION_MULTIPLE,
              respuestasOpciones: [
                {
                  idPregunta: pregunta.id,
                  opciones: seleccionadas,
                },
              ],
            };
        }
      },
    );

    const dto: CreateRespuestasDTO = {
      codigoRespuesta: this.encuesta.codigoRespuesta,
      respuestas: respuestasFormateadas,
    };

    this.encuestasService
      .guardarRespuestas(this.encuesta.codigoRespuesta, dto)
      .subscribe({
        next: (response) => {
          if (response === true) {
            this.messageService.add({
              severity: 'success',
              summary: '¡Éxito!',
              detail: 'Las respuestas se guardaron correctamente.',
              life: 3000,
            });
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Aviso',
              detail: 'El servidor respondió, pero algo salio mal.',
            });
          }
          //console.log('Respuestas guardadas exitosamente:', response);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron guardar las respuestas. Intenta de nuevo.',
          });
          console.error('Error al guardar respuestas:', error);
        },
      });

    console.log('Respuestas enviadas:', respuestasFormateadas);
  }
}
