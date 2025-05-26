import { OpcionDto } from "./opcion.dto";

export type CreateOpcionDto = Pick<OpcionDto, 'numero' | 'texto'>;
