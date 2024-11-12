import { Entity, Unique } from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project')
@Unique(['domain'])
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    ip: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    domain: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'int' })
    generation: number;
}
