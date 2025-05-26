import { CreatePreguntaDto } from "./create-pregunta.dto";
import { EncuestaDto } from "./encuesta.dto";

export interface CreateEncueastaDto extends Pick<EncuestaDto, 'nombre'> {
    preguntas: CreatePreguntaDto[];

}