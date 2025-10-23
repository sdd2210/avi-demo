
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('t_documents')
export class DocumentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    meeting_id: number;

    @Column()
    file_name: string;

    @Column()
    file_path: string;

    @Column()
    file_type: string;

    @Column({default: false})
    hidden: boolean;

    @Column('text', {nullable: true})
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
