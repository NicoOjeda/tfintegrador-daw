import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateEncueastaDto } from '../interfaces/create-encuesta.dto';
import { Observable } from 'rxjs';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { EncuestaDto } from '../interfaces/encuesta.dto';

@Injectable({ providedIn: 'root' })
export class EncuestasService {
  private httpClient = inject(HttpClient);

  crearEncuesta(dto: CreateEncueastaDto): Observable<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    return this.httpClient.post<{
      id: number;
      codigoRespuesta: string;
      codigoResultados: string;
    }>('/api/encuestas', dto);
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
    })
  }
}
