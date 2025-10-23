
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('t_meeting_schedules')
export class MeetingScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  meeting_id: number;

  @Column('text')
  content: string;

  @Column('datetime')
  start_date: Date;

  @Column('datetime')
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
