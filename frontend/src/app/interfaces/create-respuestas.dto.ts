import { TiposRespuestaEnum } from "../enums/tipos-respuestas.enum";

export interface RespuestaAbiertaDto {
  valor: string;
}

 export interface RespuestaOpcionesDto {
  opcionId: number;
}

export interface RespuestaDTO {
  tipo: TiposRespuestaEnum;
  respuestaAbierta?: RespuestaAbiertaDto;
  respuestasOpciones?: RespuestaOpcionesDto[];
}

export interface CreateRespuestasDTO {
  codigoRespuesta: string;
  respuestas: RespuestaDTO[];
}
