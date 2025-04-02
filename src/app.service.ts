import { Injectable } from '@nestjs/common';
import {INote} from './note.interface';
import { generateID } from '@jetit/id';
import { NoteApp } from './notes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {Between, Repository} from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()

export class AppService {
  
  constructor(
    @InjectRepository(NoteApp)
    private noteEntity: Repository<NoteApp>,
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

  async getId(id:string,data:string){
    try{
    //  const search= this.noteList.find((i)=>{
    //   return i.id===id
    //  })
    // if(! search)throw new Error("No match found")
    //   // console.log(search)
    // return search
    console.log(id)
    const byId= await this.noteEntity.findOne({where:{id,delete:false}});
    // console.log("By Id---",byId) 
    if(!byId) throw new Error("Id not found")
    return {status:'SUCCESS',message:"Retrieved Note By Id",data:byId}
     
    
    }
    catch(e){
        return `Request failed with error:  ${e.message}`
    }
  }
  async getAll(){
    try{
      // return this.noteList;
      const allData=(await this.noteEntity.find({where:{delete:false,archive:false,pass:"false"},order:{pin:'DESC'}}));
      return {status:'SUCCESS',message:"Listed All Notes",data:allData}
    }
    catch(e){
      return `Request failed with error:  ${e.message}`
    }
  }
  async Update(id:string,data: INote){
    try{
    //   const search= this.noteList.find((i)=>{
    //    return i.id===id
    //   })
    //  if(! search)throw new Error("No match found")
    //   const update=this.noteList.indexOf(search)
    //         this.noteList.splice(update,1)
            
    //         const newData={...search,...data}
    //         this.noteList.push(newData)
    //         // console.log(newData)
    //         return newData
           if(! /^(personal|work)$/.test(data.categories)){
            throw new Error("Choose either work or personal ")
           }
           const find=await this.noteEntity.findOne({where:{id}})
            if(!find)throw new Error("Id not found")
          //  console.log("data---->",find)
            const updateResult= await this.noteEntity.update({id},data)
            // const byId= await this.noteEntity.findOne({where:{id}});
            return {status:'SUCCESS',message:"Note Updated Successfully",data:{...find,...data}}

     }
     catch(e){
         return `Request failed with error:  ${e.message}`
     }
  }


  async Remove(id: string){
    try{
      // const search= this.noteList.findIndex((i)=>{
      //   return i.id===id
      //  })
      // if(! search)throw new Error("No match found")
      //   this.noteList.splice(search,1)
      // return this.noteList
      const check= await this.noteEntity.findOne({where:{id}});
      if(!check)throw new Error("Id not found")
        // console.log("check----->",check)
      const upd=await this.noteEntity.update({id},{delete:true,noteDeletedAt:new Date()})
      
      return {status:"SUCCESS",message:"Note Deleted Successfully"}
    }
    catch(e){
      return `Request failed with error:  ${e.message}`
    }
  }


  async Deleted(){
    try{
      const last= await this.noteEntity.find({where:{noteDeletedAt: Between(new Date(2025,2,20),new Date(2025,3,20))}})
      // console.log("Data=======>",last)
      return {status:'SUCCESS',data:last}
    }
    catch(e){
      return `Request failed with error:  ${e.message}`
    }
  }


  async pin(id:string,user_id:string){
    try{
      const pinned=await this.noteEntity.findOne({where:{id}})
      if(!pinned) throw new Error("Id not found")
      const limit=5
      const setLimit=await this.noteEntity.count({where:{userId:user_id,pin:true}})
      if(setLimit>limit){
        throw new Error("The pin limit is only 5")
      }
      const pinnedId=await this.noteEntity.update({id},{pin:true})
      return {status:"SUCCESS",message:"The note is pinned"}
    }
   catch(e){
    return `Request failed with error:  ${e.message}`
   }
  }


  async archive(id:string){
    try{
      const data=await this.noteEntity.findOne({where:{id}})
      if(!data) throw new Error("Id not found")
      const archive_data=await this.noteEntity.update({id},{archive:true})
      return {status:"SUCCESS",message:"The note is archived"}
    }
    catch(e){
      return `Request failed with error:  ${e.message}`
     }
  }

 async lock(id:string,inData:string){
  try{
    const find=await this.noteEntity.findOne({where:{id}})
    if(!find) throw new Error("Id not found")
    const password=inData
  
    // console.log(password)
  const save=await this.noteEntity.update({id},{pass:password})
  return {status:"SUCCESS",message:"Password created!"}
  }
  catch(e){
    return `Request failed with error:  ${e.message}`
   }
 }


}

