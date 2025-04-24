import { Injectable } from '@nestjs/common';
import {INote} from './note.interface';
import { generateID } from '@jetit/id';
import { NoteApp } from './notes.entity';
import { LockNote } from './notes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {Between, LessThan, MoreThan, Repository} from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { subDays } from 'date-fns/subDays';
import { format } from 'date-fns';

@Injectable()

export class AppService {
  
  constructor(
    @InjectRepository(NoteApp) private noteEntity: Repository<NoteApp>,
    @InjectRepository(LockNote) private lockEntity: Repository<LockNote>,
   
    private jwtService: JwtService,
  ){}
  // getHello(): string {
  //   return 'Hello World!';
  // }
  
  private noteList:any[]=[]
  
  async createNotes(inData:INote,user_id:string){
    try{
      // if(typeof inData.title !== "string"){
      //   throw new Error("Title should be a string")
      // }
      // if(typeof inData.description !== "string"){
      //   throw new Error("Description should be a string")
      // }
      // if (! /^(personal|work)$/.test(inData.categories)) {
      //   throw new Error("Choose only personal or work")
      // }
   
      if(!user_id){
        throw new Error("User Id is needed")
      }

     switch(true){
        case typeof inData.title !== "string":
          throw new Error("Title should be a string");
        case typeof inData.description !== "string":
          throw new Error("Description should be a string");
        case ! /^(personal|work)$/.test(inData.categories):
          throw new Error("Choose only personal or work");
        
      }
      const id:  string =`E_${generateID('HEX')}`
      
     const notes:NoteApp={...inData,userId:user_id,id}
     console.log(notes)
     this.noteEntity.save(notes)
      // console.log(this.noteList)
      
    return {status:'SUCCESS',message:"Note Created Successfully",data:notes}
    }
    catch(e){
      return `Request failed with error:  ${e.message}`
    }
  }

  async getId(user_id:any,data:{id:string},login_id:any){
    try{
      const find_new=await this.noteEntity.find({where:{userId:login_id}})
      if(!find_new) throw new Error("User Id not found")
      const Id=data.id
    const byId= await this.noteEntity.findOne({where:{id:Id,delete:false,lock:false,archive:false}});
    // console.log("By Id---",byId) 
    if(!byId) throw new Error("Id not found")
    return {status:'SUCCESS',message:"Retrieved Note By Id",data:byId}
     
    
    }
    catch(e){
        return `Request failed with error:  ${e.message}`
    }
  }
  async getAll(login_id:any){
    try{
      const find_new=await this.noteEntity.find({where:{userId:login_id}})
      if(!find_new) throw new Error("Id not found")
      // return this.noteList;
      const allData=await this.noteEntity.find({where:{delete:false,archive:false,lock:false},order:{pin:'DESC'}});
      return {status:'SUCCESS',message:"Listed All Notes",data:allData}
    }
    catch(e){
      return `Request failed with error:  ${e.message}`
    }
  }
  async Update(user_id:any,data: INote,login_id:any){
    try{
      const find_new=await this.noteEntity.find({where:{userId:login_id}})
      if(!find_new) throw new Error("Id not found")
     
          //  console.log("data details--->",data)
           const Id=data.id
           const find=await this.noteEntity.findOne({where:{id:Id}})
            if(!find)throw new Error("Id not found")
           console.log("data id---->",find)
            const updateResult= await this.noteEntity.update({id:Id},data)
            // const byId= await this.noteEntity.findOne({where:{id}});
            return {status:'SUCCESS',message:"Note Updated Successfully",data:{...find,...data}}

     }
     catch(e){
         return `Request failed with error:  ${e.message}`
     }
  }


  async Remove(user_id:any,data:{id:string},login_id:any){
    try{

      const find=await this.noteEntity.find({where:{userId:login_id}})
      if(!find) throw new Error("Id not found")
      const Id=data.id
        const new1= await this.noteEntity.findOne({where:{id:Id}})
        if(!new1){
          throw new Error("Id not found")
        }
      const upd=await this.noteEntity.update({id:Id},{delete:true,noteDeletedAt:new Date()})
      
      return {status:"SUCCESS",message:"Note Deleted Successfully"}
    }
    catch(e){
      return `Request failed with error:  ${e.message}`
    }
  }


  async Deleted(login_id:any){
    try{
      const find=await this.noteEntity.find({where:{userId:login_id}})
      if(!find) throw new Error("Id not found")
      const last= await this.noteEntity.find({where:{noteDeletedAt: MoreThan(subDays(new Date(),30))}})
       console.log("Data=======>",last)
      return {status:'SUCCESS',data:last}
    }
    catch(e){
      return `Request failed with error:  ${e.message}`
    }
  }


  async pin(data:{id:string},login_id:any){
    try{
      const find=await this.noteEntity.find({where:{userId:login_id}})
      if(!find) throw new Error("Id not found")
      const Id=data.id
    
      const limit=5
      const setLimit=await this.noteEntity.count({where:{pin:true}})
      // console.log(setLimit)
      if(setLimit>limit){
        throw new Error("The pin limit is only 5")
      }

      const new1= await this.noteEntity.findOne({where:{id:Id}})
      // console.log(new1)
      if(!new1){
        throw new Error("Id not found")
      }

       const pinnedId=await this.noteEntity.update({id:Id},{pin:true})
      
      return {status:"SUCCESS",message:"The note is pinned"}
    }
   catch(e){
    return `Request failed with error:  ${e.message}`
   }
  }


  async archive(user_id:any,data:{id:string},login_id:any){
    try{
      const find=await this.noteEntity.find({where:{userId:login_id}})
      if(!find) throw new Error("Id not found")
      const Id=data.id
      console.log("ID=====>",Id)
      const new1= await this.noteEntity.findOne({where:{id:Id}})
      if(!new1){
      throw new Error("Id not found")
      }
      const archive_data=await this.noteEntity.update({id:Id},{archive:true})
      return {status:"SUCCESS",message:"The note is archived"}
    }
    catch(e){
      return `Request failed with error:  ${e.message}`
     }
  }

 async lock(user_id:any,data:INote,login_id:any){
  try{
    
      console.log("note------->",login_id)
     const find=await this.noteEntity.find({where:{userId:login_id}})
     if(!find) throw new Error("User Id not found")
    const password=data.pass
    const Id=data.id
    console.log("data===>",data)
    // console.log(password)
    // console.log("id--->",Id)
  const new1= await this.noteEntity.findOne({where:{id:Id}})
  if(!new1){
    throw new Error("Id not found")
  }
  const detail={...login_id,lockPassword:password}
 console.log("detail",detail)
  const save=await this.noteEntity.update({id:Id},{lock:true})

  //  const lock=await this.lockEntity.save(detail)
  return {status:"SUCCESS",message:"Password created!"}
  }
  catch(e){
    return `Request failed with error:  ${e.message}`
   }
 }

async check(user_id:any,data:INote,login_id:any){
  try{
    const find=await this.noteEntity.find({where:{userId:login_id}})
    if(!find) throw new Error("User Id not found")
    
    const pass=data.pass
  
       const info=await this.lockEntity.findOne({where:{lockPassword:pass}})
      const display=await this.noteEntity.find({where:{lock:true}})

      // console.log(display)
      if(!info) throw new Error("Invalid password")
      return {status:"SUCCESS",message:"Passwords matched",data:display}
  }
  catch(e){
    return `Request failed with error:  ${e.message}`
  }
  
}

async getArchive(login_id:any){
  try{
    const find_new=await this.noteEntity.find({where:{userId:login_id}})
    if(!find_new) throw new Error("Id not found")
    // return this.noteList;
    const allData=await this.noteEntity.find({where:{archive:true,lock:false,delete:false}});
    return {status:'SUCCESS',message:"Listed All Archived Notes",data:allData}
  }
  catch(e){
    return `Request failed with error:  ${e.message}`
  }
}

async getLock(login_id:any){
  try{
    const find_new=await this.noteEntity.find({where:{userId:login_id}})
    if(!find_new) throw new Error("Id not found")
    // return this.noteList;
    const allData=await this.noteEntity.find({where:{lock:true,delete:false}});
    return {status:'SUCCESS',message:"Listed All locked Notes",data:allData}
  }
  catch(e){
    return `Request failed with error:  ${e.message}`
  }
}


}



