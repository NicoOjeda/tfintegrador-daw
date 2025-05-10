import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateEncuestaDTO } from '../dtos/create-encuesta.dto';
import { ObtenerEncuestaDto } from '../dtos/obtener-encuesta.dto';
import { CreateRespuestasDTO } from '../dtos/create-respuesta.dto';
import { EncuestasService } from '../services/encuestas.service';
import { Encuesta } from '../entities/encuesta.entity';

@Controller('/encuestas')
export class EncuestasController {
  constructor(private encuestasService: EncuestasService) {}

  @Get('/test')
  testRoute(): string {
    return 'Esta es una ruta de prueba';
  }

  @Post()
  async createEncuesta(@Body() dto: CreateEncuestaDTO): Promise<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    return await this.encuestasService.createEncuesta(dto);
  }

  @Get(':id')
  async obtenerEncuestas(
    @Param('id') id: number,
    @Query() dto: ObtenerEncuestaDto,
  ): Promise<Encuesta> {
    return await this.encuestasService.obtenerEncuesta(
      id,
      dto.codigo,
      dto.tipo,
    );
  }

  @Post('/responder/:codigoRespuesta')
  async responderEncuesta(
    @Param('codigoRespuesta') codigoRespuesta: string,
    @Body() dto: CreateRespuestasDTO): Promise<boolean> {
    return await this.encuestasService.guardarRespuestas(codigoRespuesta, dto);
  }
}
