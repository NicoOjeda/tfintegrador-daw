import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Encuesta } from "./entities/encuesta.entity";
import { Pregunta } from "./entities/pregunta.entity";
import { Opcion } from "./entities/opcion.entity";
import { Respuesta } from "./entities/respuesta.entity";
import { RespuestaAbierta } from "./entities/respuesta_abierta.entity";
import { RespuestaOpcion } from "./entities/respuesta_opcion.entity";
import { EncuestasController } from "./controllers/encuestas.controller";
import { EncuestasService } from "./services/encuestas.service";

@Module({
  imports: [TypeOrmModule.forFeature([Encuesta, Pregunta, Opcion, Respuesta, RespuestaAbierta, RespuestaOpcion])],
  controllers: [EncuestasController],
  providers: [EncuestasService],
})
export class EncuestasModule {}
