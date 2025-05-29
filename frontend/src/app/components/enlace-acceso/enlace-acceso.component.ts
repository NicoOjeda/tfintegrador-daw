import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.service';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';
import { EncuestaDto } from '../../interfaces/encuesta.dto';
import { HeaderComponent } from '../header/header.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enlace-acceso',
  imports: [HeaderComponent,  ToastModule, CommonModule],
  templateUrl: './enlace-acceso.component.html',
  styleUrl: './enlace-acceso.component.css',
  providers: [MessageService],
})
export class EnlaceAccesoComponent implements OnInit {
  id!: number;
  codigo!: string;
  tipo!: CodigoTipoEnum;

  encuestaCargada = false;
  encuesta?: EncuestaDto;

  private encuestasService: EncuestasService = inject(EncuestasService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
      ? Number(this.route.snapshot.paramMap.get('id'))
      : 0;

    this.route.queryParamMap.subscribe((params) => {
      this.codigo = params.get('codigo') || '';
      this.tipo =
        (params.get('tipo') as CodigoTipoEnum) || CodigoTipoEnum.RESPUESTA;
    });

    if (this.id && this.codigo && this.tipo) {
      this.obtenerEncuesta();
    } else {
      console.error('Parámetros inválidos para obtener la encuesta');
      this.mostrarError('Parámetros inválidos para obtener la encuesta');
    }
  }

  private obtenerEncuesta(): void {
    this.encuestasService
      .traerEncuesta(this.id, this.codigo, this.tipo)
      .subscribe({
        next: (res: EncuestaDto) => {
          console.log('Encuesta obtenida:', res.nombre);
          this.encuesta = res;
          this.encuestaCargada = true;
        },
        error: (err) => {
          this.mostrarError('Error al obtener la encuesta del servidor');
        },
      });
  }

   mostrarError(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail,
      life: 5000,
    });
  }


}
