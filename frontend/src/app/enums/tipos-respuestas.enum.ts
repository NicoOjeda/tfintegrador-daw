export enum TiposRespuestaEnum {
  ABIERTA = 'ABIERTA',
  OPCION_MULTIPLE_SELECCION_SIMPLE = 'OPCION_MULTIPLE_SELECCION_SIMPLE',
  OPCION_MULTIPLE_SELECCION_MULTIPLE = 'OPCION_MULTIPLE_SELECCION_MULTIPLE',
}

export const tiposPreguntaPrecentacion: {
  tipo: TiposRespuestaEnum;
  descripcion: string;
}[] = [
  {
    tipo: TiposRespuestaEnum.ABIERTA,
    descripcion: 'Pregunta abierta',
  },
  {
    tipo: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_SIMPLE,
    descripcion: 'Selección simple',
  },
  {
    tipo: TiposRespuestaEnum.OPCION_MULTIPLE_SELECCION_MULTIPLE,
    descripcion: 'Selección múltiple',
  },
];
