import { PreguntaDto } from "./pregunta.dto";

export interface EncuestaDto {
  id: number;
  nombre: string;
  pregunta: PreguntaDto[];
  codigoRespuesta: string;
}
