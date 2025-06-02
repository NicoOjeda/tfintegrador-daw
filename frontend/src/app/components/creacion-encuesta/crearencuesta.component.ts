import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextoErrorComponent } from '../texto-error/texto-error.component';
import { SeccionComponent } from '../seccion/seccion.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EncuestasService } from '../../services/encuestas.service';
import { Router } from '@angular/router';
import { PreguntaDto } from '../../interfaces/pregunta.dto';
import { CreateEncuestaDto } from '../../interfaces/create-encuesta.dto';
import { FloatLabelModule } from 'primeng/floatlabel';
import {
  tiposPreguntaPresentacion,
  TiposRespuestaEnum,
} from '../../enums/tipos-respuestas.enum';
import { GestionPreguntaDialogComponent } from '../gestion-pregunta-dialog/gestion-pregunta-dialog.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-crearencuesta',
  standalone: true,
  imports: [
    FloatLabelModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    FormsModule,
    SeccionComponent,
    GestionPreguntaDialogComponent,
    ButtonModule,
    ReactiveFormsModule,
    TextoErrorComponent,
    HeaderComponent,
  ],
  templateUrl: './crearencuesta.component.html',
  styleUrl: './crearencuesta.component.css',
})
export class CreacionEncuestaComponent {
  form: FormGroup;

  private messageService: MessageService = inject(MessageService);

  private router: Router = inject(Router);

  private confirmationService: ConfirmationService =
    inject(ConfirmationService);

  private encuestasService: EncuestasService = inject(EncuestasService);

  dialogGestionPreguntaVisible = signal<boolean>(false);

  preguntaSeleccionada = signal<PreguntaDto | null>(null);

  constructor() {
    this.form = new FormGroup({
      nombre: new FormControl<string>('', Validators.required),
      preguntas: new FormArray<FormControl<PreguntaDto>>(
        [],
        [Validators.required, Validators.minLength(1)],
      ),
    });
  }

  get preguntas(): FormArray<FormControl<PreguntaDto>> {
    return this.form.get('preguntas') as FormArray<FormControl<PreguntaDto>>;
  }

  get nombre(): FormControl<string> {
    return this.form.get('nombre') as FormControl<string>;
  }

  abrirDialog() {
    this.dialogGestionPreguntaVisible.set(true);
  }

  agregarPregunta(pregunta: PreguntaDto) {
    this.preguntas.push(
      new FormControl<PreguntaDto>(pregunta) as FormControl<PreguntaDto>,
    );
  }

  eliminarPregunta(index: number) {
    this.preguntas.removeAt(index);
  }

  getTipoPreguntaPresentacion(tipo: TiposRespuestaEnum): string {
    return tiposPreguntaPresentacion.find(
      (tipoPresentacion) => tipoPresentacion.tipo === tipo,
    )!?.presentacion;
  }

  confirmarCrearEncuesta() {
    this.confirmationService.confirm({
      message: 'Confirmar creación de encuesta?',
      header: 'Confirmación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
      },
      accept: () => {
        this.crearEncuesta();
      },
    });
  }

  confirmarEliminarPregunta(index: number) {
    this.confirmationService.confirm({
      message: 'Confirmar eliminación?',
      header: 'Confirmación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
      },
      accept: () => {
        this.eliminarPregunta(index);
      },
    });
  }

  crearEncuesta() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Hay errores en el formulario',
      });
      return;
    }

    const encuesta: CreateEncuestaDto = this.form.value;

    for (let i = 0; i < encuesta.preguntas.length; i++) {
      const pregunta = encuesta.preguntas[i];
      pregunta.numero = i + 1;

      if (pregunta.opciones) {
        for (let j = 0; j < pregunta.opciones.length; j++) {
          pregunta.opciones[j].numero = j + 1;
        }
      }
    }

    this.encuestasService.crearEncuesta(encuesta).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'La encuesta se creó con éxito',
        });

        this.router.navigate(['/enlaces'], {
          state: {
            id: res.id,
            codigoRespuesta: res.codigoRespuesta,
            codigoResultados: res.codigoResultados,
          },
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Ha ocurrido un error al crear la encuesta',
        });
      },
    });
  }
}
