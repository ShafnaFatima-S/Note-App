import {Body,Controller,Delete,Get,Param,Post,Put,Headers} from '@nestjs/common';
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
    const auth:string=data.authorization
    console.log(response.data)
     const new_token1:string=auth.replace('Bearer','').trim()
    // console.log(new_token1)
     const decode=this.jwtService.verify(new_token1,{secret:'secret'})
    // console.log(decode)
    const user_id= decode.id
    // console.log(user_id)
    return user_id
   
  }
  @Post('createNotes')
  async createNote(@Headers() data:any, @Body() createNotes: INote) {
    try{
      const user_id = await this.condition(data);
     
      console.log(user_id)
      if(!user_id){
        throw new Error("Invalid token")
      }
      else{
        console.log('create===>>', createNotes);
        return this.appService.createNotes(createNotes,user_id);
      }
     
    }
    catch(e){
     return `Request failed with error:  ${e.message}`
    }
  }

  @Get('get/:id')
  async findId(@Headers() data:any,@Param() params: { id: string },@Body() data1:string) {
    // console.log('data------>>>', params.id);
    try{
      const user_id = await this.condition(data);
     
      console.log(user_id)
      if(!user_id){
        throw new Error("Invalid token")
      }
      else{
        return this.appService.getId(params.id,data1);
      }
  }
  catch(e){
    return `Request failed with error:  ${e.message}`
  }
  }
  @Get('getAll')
    async allNote(@Headers() data:any){
      try{
        const user_id = await this.condition(data);
       
        console.log(user_id)
        if(!user_id){
          throw new Error("Invalid token")
        }
        else{

          return this.appService.getAll()
        }
       
      }
      catch(e){
       return `Request failed with error:  ${e.message}`
      }
    }

  @Put('update/:id')
    async updateNote(@Headers() data:any,@Param() params:{id:string} ,
      @Body() data1:INote) {
        try{
          const user_id = await this.condition(data);
         
          console.log(user_id)
          if(!user_id){
            throw new Error("Invalid token")
          }
          else{
            console.log(data1)
            return this.appService.Update(params.id,data1)
          }
         
        }
        catch(e){
         return `Request failed with error:  ${e.message}`
        }
    }

  @Delete('deleteById/:id')
    async DeleteNote(@Headers() data:any,@Param() params:{id: string} ){
      try{
        const user_id = await this.condition(data);
       
        console.log(user_id)
        if(!user_id){
          throw new Error("Invalid token")
        }
        else{
          return this.appService.Remove(params.id)
        }
       
      }
      catch(e){
       return `Request failed with error:  ${e.message}`
      }

      
    }
  
  @Get('last30Days')
    async LastDeletedNote(@Headers() data:any){
      try{
        const user_id = await this.condition(data);
       
        console.log(user_id)
        if(!user_id){
          throw new Error("Invalid token")
        }
        else{
          return this.appService.Deleted()
        }
       
      }
      catch(e){
       return `Request failed with error:  ${e.message}`
      }

      
    }

  @Get('pin/:id')
    async pinNote(@Headers() data:any,@Param() params:{id: string} ){
      try{
        const user_id = await this.condition(data);
       
        console.log(user_id)
        if(!user_id){
          throw new Error("Invalid token")
        }
        else{
          return  this.appService.pin(params.id,user_id)
        }
      }
      catch(e){
       return `Request failed with error:  ${e.message}`
      }
  }
  @Get('archive/:id')
  async archiveNote(@Headers() data:any,@Param() params:{id: string}){
    try{
      const user_id = await this.condition(data);
     
      console.log(user_id)
      if(!user_id){
        throw new Error("Invalid token")
      }
      else{
        return  this.appService.archive(params.id)
      }
    }
    catch(e){
     return `Request failed with error:  ${e.message}`
    }
  }

@Post('lock/:id')
async lockNote(@Headers() data:any, @Param() params:{id:string}, @Body() data1:string){
  try{
    const user_id = await this.condition(data);
   
    console.log(user_id)
    if(!user_id){
      throw new Error("Invalid token")
    }
    else{
      return  this.appService.lock(params.id,data1)
    }
  }
  catch(e){
   return `Request failed with error:  ${e.message}`
  }
}


}



