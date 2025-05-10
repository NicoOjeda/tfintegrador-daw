import { ApiProperty } from "@nestjs/swagger";
import { TiposRespuestaEnum } from "../enums/tipos-respuestas.enum";
import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateIf, ValidateNested } from "class-validator";
import { CreateRespuestaAbiertaDto } from "./create-respuesta_abierta.dto";
import { Type } from "class-transformer";
import { CreateRespuestaOpcionesDto } from "./create-respuesta_opciones.dto";

export class CreateRespuestaDTO {
    @ApiProperty({ enum: TiposRespuestaEnum })
    @IsEnum(TiposRespuestaEnum)
    @IsNotEmpty()
    tipo: TiposRespuestaEnum;
  
    @ApiProperty({ type: CreateRespuestaAbiertaDto, required: false })
    @ValidateIf((res) => res.tipo === 'ABIERTA') 
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => CreateRespuestaAbiertaDto)
    respuestaAbierta?: CreateRespuestaAbiertaDto;
  
    @ApiProperty({ type: [CreateRespuestaOpcionesDto], required: false })
    @IsArray()
    @ValidateIf(
      (res) =>
        res.tipo === 'OPCION_MULTIPLE_SELECCION_SIMPLE' ||
        res.tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE',
    )
    @ValidateNested({ each: true })
    @IsNotEmpty()
    @Type(() => CreateRespuestaOpcionesDto)
    respuestasOpciones?: CreateRespuestaOpcionesDto[];
  }

  export class CreateRespuestasDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    codigoRespuesta: string;
  
    @ApiProperty({ type: [CreateRespuestaDTO] })
    @ValidateNested({ each: true })
    @Type(() => CreateRespuestaDTO)
    respuestas: CreateRespuestaDTO[];
  }