import {Entity, PrimaryColumn, Column, CreateDateColumn} from "typeorm";
@Entity('note_app')
    export class NoteApp{
        @PrimaryColumn()
        id: string;
        @Column()
        title: string;
        @Column()
        description: string;
        @Column()
        categories: string;
        @Column()
        image: string;
        @Column()
        pin: boolean;
        @Column()
        lock: boolean;
        @Column()
        archive:boolean;
        @Column('boolean',{default:false})
        delete:boolean;
        @Column({name:"noteDeletedAt",nullable:true})
        noteDeletedAt:Date;
        @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
         created_at: Date;

}