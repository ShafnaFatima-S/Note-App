import {Body,Controller,Delete,Get,Param,Post,Put,Headers, Query} from '@nestjs/common';
import { AppService } from './app.service';
import { INote } from './note.interface';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';


@Controller()
export class AppController {
  
  // httpService: any;

  constructor(private readonly appService: AppService,
    private readonly httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }


async condition(data:any){
  let response= await axios.get('http://localhost:3000/checkLogIn',
    {'headers':{'Authorization':data.authorization}})
    // console.log("response=====>",response.data)
    if(!response){
      return {status:"ERROR",message:"Invalid token"}
    }
    const res=response.data.data
    console.log("res----->",res)
   return res
  }
  @Post('createNotes')
  async createNote(@Headers() data:any, @Body() createNotes: INote) {
    try{
      const user_id = await this.condition(data);
     
      console.log(user_id)
      
        console.log('create===>>', createNotes);
        return this.appService.createNotes(createNotes,user_id);
      
     
    }
    catch(e){
     return `Request failed with error:  ${e.message}`
    }
  }

  @Get('get')
  async findId(@Headers() data:any,@Query('id') id:string) {
    // console.log('data------>>>', params.id);
    try{
      const user_id = await this.condition(data);
     
        return this.appService.getId(data,{id},user_id);
      
  }
  catch(e){
    return `Request failed with error:  ${e.message}`
  }
  }
  @Get('getAll')
    async allNote(@Headers() data:any){
      try{
        const user_id = await this.condition(data);
          return this.appService.getAll(user_id);
       
      }
      catch(e){
       return `Request failed with error:  ${e.message}`
      }
    }

  @Put('update')
    async updateNote(@Headers() data:any,@Body() update:INote ,
      ) {
        try{
          const user_id = await this.condition(data);
           
            return this.appService.Update(data,update,user_id)
          }
        catch(e){
         return `Request failed with error:  ${e.message}`
        }
    }

  @Delete('delete')
    async DeleteNote(@Headers() data:any,@Query('id') id:string  ){
      try{
        const user_id = await this.condition(data);
          return this.appService.Remove(data,{id},user_id)
        }
      catch(e){
       return `Request failed with error:  ${e.message}`
      }
    }
  
  @Get('last30Days')
    async LastDeletedNote(@Headers() data:any){
      try{
        const user_id = await this.condition(data);
          return this.appService.Deleted(user_id)
        }
      catch(e){
       return `Request failed with error:  ${e.message}`
      }

      
    }

  @Get('pin')
    async pinNote(@Headers() data:any,@Query('id')id:string){
      try{
        const user_id = await this.condition(data);
          return  this.appService.pin({id},user_id)
        
      }
      catch(e){
       return `Request failed with error:  ${e.message}`
      }
  }
  @Get('archive')
  async archiveNote(@Headers() data:any,@Query('id')id:string){
    try{
      const user_id = await this.condition(data);
        return  this.appService.archive(data,{id},user_id)
      }
    
    catch(e){
     return `Request failed with error:  ${e.message}`
    }
  }

@Post('lock')
async lockNote(@Headers() data:any,  @Body()lock:INote){
  try{
    const user_id = await this.condition(data);
      return  this.appService.lock(data,lock,user_id)
    }
  
  catch(e){
   return `Request failed with error:  ${e.message}`
  }
}

@Get('check')
async CheckNote(@Headers() data:any, @Body() check:INote){
  try{
    const user_id = await this.condition(data);
      return  this.appService.check(data,check,user_id)
    }
  
  catch(e){
   return `Request failed with error:  ${e.message}`
  }
}

@Get('getArchive')
async GetArchive(@Headers() data:any){
  try{
    const user_id = await this.condition(data);
      return this.appService.getArchive(user_id);
   
  }
  catch(e){
   return `Request failed with error:  ${e.message}`
  }
}


@Get('getLock')
async GetLock(@Headers() data:any){
  try{
    const user_id = await this.condition(data);
      return this.appService.getLock(user_id);
   
  }
  catch(e){
   return `Request failed with error:  ${e.message}`
  }
}
}



