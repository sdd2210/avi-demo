
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('m_participants')
export class ParticipantEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    meeting_id: number;

    @Column()
    full_name: string;

    @Column()
    type: string;

    @Column()
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
