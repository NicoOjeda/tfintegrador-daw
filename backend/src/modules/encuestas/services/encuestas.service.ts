import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Encuesta } from '../entities/encuesta.entity';
import { Repository } from 'typeorm';
import { CreateEncuestaDTO } from '../dtos/create-encuesta.dto';
import { v4 } from 'uuid';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { CreateRespuestasDTO } from '../dtos/create-respuesta.dto';
import { Respuesta } from '../entities/respuesta.entity';
import { RespuestaAbierta } from '../entities/respuesta_abierta.entity';
import { RespuestaOpcion } from '../entities/respuesta_opcion.entity';

@Injectable()
export class EncuestasService {
  constructor(
    @InjectRepository(Encuesta)
    private encuestasRepository: Repository<Encuesta>,
    @InjectRepository(Respuesta)
    private respuestaRepository: Repository<Respuesta>,
    @InjectRepository(RespuestaAbierta)
    private respuestaAbiertaRepository: Repository<RespuestaAbierta>,
    @InjectRepository(RespuestaOpcion)
    private respuestaOpcionRepository: Repository<RespuestaOpcion>,
  ) {}

  async createEncuesta(dto: CreateEncuestaDTO): Promise<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    const encuesta: Encuesta = this.encuestasRepository.create({
      ...dto,
      codigoRespuesta: v4(),
      codigoResultados: v4(),
    });
    const encuestaGuardada = await this.encuestasRepository.save(encuesta);

    return {
      id: encuestaGuardada.id,
      codigoRespuesta: encuestaGuardada.codigoRespuesta,
      codigoResultados: encuestaGuardada.codigoResultados,
    };
  }

  async obtenerEncuesta(
    id: number,
    codigo: string,
    codigoTipo: CodigoTipoEnum.RESPUESTA | CodigoTipoEnum.RESULTADOS,
  ): Promise<Encuesta> {
    const query = this.encuestasRepository
      .createQueryBuilder('encuesta')
      .innerJoinAndSelect('encuesta.preguntas', 'pregunta')
      .leftJoinAndSelect('pregunta.opciones', 'preguntaOpcion')
      .where('encuesta.id = :id', { id });

    switch (codigoTipo) {
      case CodigoTipoEnum.RESPUESTA:
        query.andWhere('encuesta.codigoRespuesta = :codigo', { codigo });
        break;

      case CodigoTipoEnum.RESULTADOS:
        query.andWhere('encuesta.codigoResultados = :codigo', { codigo });
        break;
    }

    query.orderBy('pregunta.numero', 'ASC');
    query.addOrderBy('preguntaOpcion.numero', 'ASC');

    const encuesta = await query.getOne();

    if (!encuesta) {
      throw new BadRequestException('Datos de encuesta no válidos');
    }

    return (codigoTipo === CodigoTipoEnum.RESULTADOS) ? this.obtenerResultadosEncuesta(encuesta) : encuesta;
  }

  private async obtenerResultadosEncuesta(encuesta: Encuesta) : Promise<Encuesta> {
    for (const pregunta of encuesta.preguntas) {
        if (pregunta.tipo === 'ABIERTA') {
          const respuestasAbiertas = await this.respuestaAbiertaRepository.find(
            {
              where: { pregunta: { id: pregunta.id } },
            },
          );
          pregunta.opciones = respuestasAbiertas.map((respuesta) => ({
            id: respuesta.id, 
            texto: respuesta.texto, 
            numero: 1, 
          }));
        } else if (
          pregunta.tipo === 'OPCION_MULTIPLE_SELECCION_SIMPLE' ||
          pregunta.tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE'
        ) {
          const respuestasOpciones = await this.respuestaOpcionRepository.find({
            where: { opcion: { pregunta: { id: pregunta.id } } },
            relations: ['opcion'],
          });
          pregunta.opciones = respuestasOpciones.map((respuesta) => ({
            id: respuesta.opcion.id,
            texto: respuesta.opcion.texto,
            numero: respuesta.opcion.numero,
            seleccionada: true,
          }));
        }
      }

      return encuesta;
  }

  async guardarRespuestas(
    codigoRespuesta: string,
    dto: CreateRespuestasDTO,
  ): Promise<boolean> {
    try {
      const encuesta = await this.encuestasRepository.findOne({
        where: { codigoRespuesta },
      });

      if (!encuesta) {
        throw new BadRequestException('El código de respuesta no es válido.');
      }
      for (const respuestaDto of dto.respuestas) {
        const respuesta = this.respuestaRepository.create({
          encuesta,
        });
        const respuestaGuardada =
          await this.respuestaRepository.save(respuesta);

        if (respuestaDto.tipo === 'ABIERTA') {
          const respuestaAbierta = this.respuestaAbiertaRepository.create({
            texto: respuestaDto.respuestaAbierta?.texto,
            pregunta: { id: respuestaDto.respuestaAbierta?.idPregunta },
            respuesta: respuestaGuardada,
          });
          await this.respuestaAbiertaRepository.save(respuestaAbierta);
        } else if (
          respuestaDto.tipo === 'OPCION_MULTIPLE_SELECCION_SIMPLE' ||
          respuestaDto.tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE'
        ) {
          const respuestasOpciones =
            respuestaDto.respuestasOpciones?.flatMap((respuestaOpcion) =>
              respuestaOpcion.opciones.map((opcion) =>
                this.respuestaOpcionRepository.create({
                  opcion: { id: opcion.idOpcion },
                  respuesta: respuestaGuardada,
                }),
              ),
            ) || [];
          if (respuestasOpciones.length === 0) {
            throw new BadRequestException(
              'No se encontraron opciones válidas para la respuestas.',
            );
          }
          await this.respuestaOpcionRepository.save(respuestasOpciones);
        }
      }

      return true;
    } catch (error) {
      console.error('Error al guardar las respuestas:', error);
      return false;
    }
  }
}
