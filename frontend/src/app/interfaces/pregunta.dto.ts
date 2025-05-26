import { TiposRespuestaEnum } from "../enums/tipos-respuestas.enum";
import { OpcionDto } from "./opcion.dto";

export interface PreguntaDto {
    id: number;
    numero: number;
    texto: string;
    tipo: TiposRespuestaEnum;
    opciones?: OpcionDto[];
}