import {DataSource,DataSourceOptions} from "typeorm";
import { NoteApp,LockNote } from "./notes.entity";
require('dotenv').config()

export const dataSource:DataSourceOptions ={
    type: 'postgres',
    host: process.env.HOST,
    port: parseInt(process.env.PORT??'3000'),
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [NoteApp,LockNote],
    synchronize: true ,

    
  }