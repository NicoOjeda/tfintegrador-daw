import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateEncuestaDto } from '../interfaces/create-encuesta.dto';
import { Observable } from 'rxjs';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { EncuestaDto } from '../interfaces/encuesta.dto';
import { CreateRespuestasDTO } from '../interfaces/create-respuestas.dto';

@Injectable({ providedIn: 'root' })
export class EncuestasService {
  private httpClient = inject(HttpClient);

  crearEncuesta(dto: CreateEncuestaDto): Observable<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    return this.httpClient.post<{
      id: number;
      codigoRespuesta: string;
      codigoResultados: string;
    }>('/api/v1/encuestas', dto);
  }

  traerEncuesta(
    idEncuesta: number,
    codigo: string,
    tipo: CodigoTipoEnum,
  ): Observable<EncuestaDto> {
    return this.httpClient.get<EncuestaDto>(
      'api/v1/encuestas/' + idEncuesta + '?codigo=' + codigo + '&tipo=' + tipo,
    );
  }

  test() {
    this.traerEncuesta(1, '123', CodigoTipoEnum.RESPUESTA).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err),
    });
  }

  exportarCsvComoArchivo(codigo: string): Observable<Blob> {
    return this.httpClient.get(`/api/v1/encuestas/exportar-csv/${codigo}`, {
      responseType: 'blob',
    });
  }

  guardarRespuestas(
    codigoRespuesta: number,
    dto: CreateRespuestasDTO,
  ): Observable<boolean> {
    return this.httpClient.post<boolean>(
      '/api/v1/encuestas/responder/' + codigoRespuesta,
      dto,
    );
  }

  /* Ejemplo completo de lo que el frontend enviaría:

  const payload: CreateRespuestasDTO = {
  codigoRespuesta: '3ab25b59-c59d-4349-a98f-76bb9a97ce6b',
  respuestas: [
    {
      tipo: TiposRespuestaEnum.ABIERTA,
      respuestaAbierta: { valor: 'Me gusta el helado de menta granizada' },
    },
    {
      tipo: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE,
      respuestasOpciones: [{ opcionId: 5 }],
    },
    {
      tipo: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE,
      respuestasOpciones: [{ opcionId: 3 }, { opcionId: 4 }],
    },
  ],
};

this.guardarRespuestas(payload.codigoRespuesta, payload).subscribe({
  next: (res) => {
    console.log('Respuesta enviada correctamente', res);
  },
  error: (err) => {
    console.error('Error al enviar la respuesta', err);
  },
});

  */
}
