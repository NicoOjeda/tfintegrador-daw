import {
  Component,
  effect,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { CreateOpcionDto } from '../../interfaces/create-opcion.dto';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  tiposPreguntaPresentacion,
  TiposRespuestaEnum,
} from '../../enums/tipos-respuestas.enum';
import { PreguntaDto } from '../../interfaces/pregunta.dto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { opcionesNoVacias } from '../../validators/opciones-no-vacias.validator';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextoErrorComponent } from '../texto-error/texto-error.component';
import { SeccionComponent } from '../seccion/seccion.component';
import { GestionOpcionDialogComponent } from '../gestion-opcion-dialog/gestion-opcion-dialog.component';

@Component({
  selector: 'app-gestion-pregunta-dialog',
  imports: [
    DialogModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    TextoErrorComponent,
    SeccionComponent,
    GestionOpcionDialogComponent,
  ],
  templateUrl: './gestion-pregunta-dialog.component.html',
  styleUrl: './gestion-pregunta-dialog.component.css',
})
export class GestionPreguntaDialogComponent {
  readonly form: FormGroup;

  visible = model.required<boolean>();

  dialogGestionOpcionVisible = signal<boolean>(false);

  agregarPregunta = output<PreguntaDto>();

  opcionSeleccionada = signal<Pick<CreateOpcionDto, 'texto'> | null>(null);

  private messageService: MessageService = inject(MessageService);

  private confirmationService: ConfirmationService =
    inject(ConfirmationService);

  constructor() {
    this.form = new FormGroup(
      {
        texto: new FormControl<string>('', Validators.required),
        tipo: new FormControl<TiposRespuestaEnum | null>(
          null,
          Validators.required,
        ),
        opciones: new FormArray<FormControl<Pick<CreateOpcionDto, 'texto'>>>(
          [],
        ),
      },
      { validators: [opcionesNoVacias] },
    );

    effect(() => {
      if (this.visible()) {
        this.reset();
      }
    });
  }

  reset() {
    this.form.reset();
    this.resetearOpciones();
  }

  resetearOpciones() {
    this.opciones.clear();
  }

  getTiposPreguntaPresentacion(): {
    tipo: TiposRespuestaEnum;
    presentacion: string;
  }[] {
    return tiposPreguntaPresentacion;
  }

  get texto(): FormControl<string> {
    return this.form.get('texto') as FormControl<string>;
  }

  get tipo(): FormControl<TiposRespuestaEnum> {
    return this.form.get('tipo') as FormControl<TiposRespuestaEnum>;
  }

  get opciones(): FormArray<FormControl<Pick<CreateOpcionDto, 'texto'>>> {
    return this.form.get('opciones') as FormArray<
      FormControl<Pick<CreateOpcionDto, 'texto'>>
    >;
  }

  agregar() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Hay errores en el formulario',
      });
      return;
    }

    const pregunta: PreguntaDto = this.form.value;
    this.agregarPregunta.emit(pregunta);
    this.cerrar();
  }

  cerrar() {
    this.visible.set(false);
  }

  esMultipleChoice(tipo: TiposRespuestaEnum) {
    return [
      TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE,
      TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE,
    ].includes(tipo);
  }

  abrirAgregarOpcion() {
    this.dialogGestionOpcionVisible.set(true);
  }

  agregarOpcion(opcion: string) {
    this.opciones.push(
      new FormControl<Pick<CreateOpcionDto, 'texto'>>({
        texto: opcion,
      }) as FormControl<Pick<CreateOpcionDto, 'texto'>>,
    );
  }

  eliminarOpcion(index: number) {
    this.opciones.removeAt(index);
  }

  confirmarEliminarOpcion(index: number) {
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
        this.eliminarOpcion(index);
      },
    });
  }
}
