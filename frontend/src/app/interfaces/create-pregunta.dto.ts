import { OpcionDto } from "./opcion.dto";
import { PreguntaDto } from "./pregunta.dto";

export interface CreatePreguntaDto extends Pick<PreguntaDto, 'numero' | 'texto' | 'tipo'> {
    opciones: OpcionDto[];
}