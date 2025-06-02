import { PreguntaDto } from "./pregunta.dto";

export interface EncuestaDto {
  id: number;
  nombre: string;
  preguntas: PreguntaDto[];
  codigoRespuesta: string;
}



