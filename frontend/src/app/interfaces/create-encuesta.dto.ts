import { CreatePreguntaDto } from "./create-pregunta.dto";
import { EncuestaDto } from "./encuesta.dto";

export interface CreateEncuestaDto extends Pick<EncuestaDto, 'nombre'> {
    preguntas: CreatePreguntaDto[];

}