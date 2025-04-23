import {Entity, PrimaryColumn, Column, CreateDateColumn} from "typeorm";
@Entity('note_app')
    export class NoteApp{
        @PrimaryColumn()
        id: string;

        @Column({name:'user_id'})
        userId: string;
        
        @Column()
        title: string;
        @Column()
        description: string;
        @Column()
        categories: string;
        @Column({nullable:true})
        image: string;
        @Column({default:false})
        pin?: boolean;
        @Column({default:false})
        lock?: boolean;
        // @Column({nullable:true})
        // pass?:string;
        @Column({default:false})
        archive?:boolean;
        @Column('boolean',{default:false})
        delete?:boolean;
        @Column({ name:"noteDeletedAt",nullable:true})
        noteDeletedAt?:Date;
        @CreateDateColumn({ type: "date", default: () => "CURRENT_TIMESTAMP(6)" })
         created_at?: Date;

    }
    
@Entity('lock_notes')
    export class LockNote{
        @PrimaryColumn()
        userId:string;
        @Column({name:"lock_password"})
        lockPassword:string;
    }