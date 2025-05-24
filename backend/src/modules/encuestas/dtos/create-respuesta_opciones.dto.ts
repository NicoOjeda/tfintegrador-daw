import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RespuestaOpcionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  idOpcion: number;
}

export class CreateRespuestaOpcionesDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  idPregunta: number;

  @ApiProperty({ type: [RespuestaOpcionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaOpcionDto)
  opciones: RespuestaOpcionDto[];
}
