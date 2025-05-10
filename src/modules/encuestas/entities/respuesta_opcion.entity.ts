import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Respuesta } from "./respuesta.entity";
import { Opcion } from "./opcion.entity";


@Entity('respuestas_opciones')
export class RespuestaOpcion {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Respuesta)
    @JoinColumn({ name: 'id_respuesta' })
    respuesta: Respuesta;

    @ManyToOne(() => Opcion)
    @JoinColumn({ name: 'id_opcion' })
    opcion: Opcion;
}