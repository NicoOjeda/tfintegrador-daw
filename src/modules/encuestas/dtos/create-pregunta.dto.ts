import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Validate, ValidateNested } from "class-validator";
import { TiposRespuestaEnum } from "../enums/tipos-respuestas.enum";
import { Type } from "class-transformer";
import { CreateOpcionDTO } from "./create-opcion.dto";


export class CreatePreguntaDTO {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    numero: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    texto: string;

    @ApiProperty({ enum: TiposRespuestaEnum })
    @IsEnum(TiposRespuestaEnum)
    @IsNotEmpty()
    tipo: TiposRespuestaEnum;

    @ApiProperty({ type: [CreateOpcionDTO], required: false })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateOpcionDTO)
    opciones?: CreateOpcionDTO[];
}