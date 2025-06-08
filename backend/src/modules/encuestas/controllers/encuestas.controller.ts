import { Body, Controller, Get, Param, Post, Query, Res, Put } from '@nestjs/common';
import { CreateEncuestaDTO } from '../dtos/create-encuesta.dto';
import { ObtenerEncuestaDto } from '../dtos/obtener-encuesta.dto';
import { CreateRespuestasDTO } from '../dtos/create-respuesta.dto';
import { EncuestasService } from '../services/encuestas.service';
import { Encuesta } from '../entities/encuesta.entity';
import { Response } from 'express';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';



type FilaCSV = {
  encuesta: string;
  numero_pregunta: number;
  texto_pregunta: string;
  tipo_pregunta: string;
  texto_opcion: string;
  texto_respuesta_abierta: string;
};

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
    const encuesta = await this.encuestasService.obtenerEncuesta(
      id,
      dto.codigo,
      dto.tipo,
    );

    return {
      id: encuesta.id,
      nombre: encuesta.nombre,
      codigoRespuesta: encuesta.codigoRespuesta,
      codigoResultados: encuesta.codigoResultados,
      preguntas: encuesta.preguntas,
      deshabilitar:encuesta.deshabilitar
    };
  }

  @Post('/responder/:codigoRespuesta')
  async responderEncuesta(
    @Param('codigoRespuesta') codigoRespuesta: string,
    @Body() dto: CreateRespuestasDTO,
  ): Promise<boolean> {
    return await this.encuestasService.guardarRespuestas(codigoRespuesta, dto);
  }

  @Get('exportar-csv/:codigoRespuesta')
  async exportarCsv(
    @Param('codigoRespuesta') codigoRespuesta: string,
    @Res({ passthrough: false }) res: Response,
  ) {
    try {
      const csv =
        await this.encuestasService.exportarRespuestasCsv(codigoRespuesta);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="respuestas.csv"',
      );
      res.status(200).send(csv);
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      res.status(500).send('Error al generar el archivo CSV');
    }
  }

  @Put('/deshabilitar/:id')
  async deshabilitarEncuesta(@Param('id') id: number) {
  return await this.encuestasService.deshabilitarEncuesta(id);
}
}
