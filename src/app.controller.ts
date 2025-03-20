import {Body,Controller,Delete,Get,Param,Post,Put,} from '@nestjs/common';
import { AppService } from './app.service';
import { INote } from './note.interface';


@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Post('createNotes')
  createNote(@Body() createNotes: INote) {
    console.log('create===>>', createNotes);
    return this.appService.createNotes(createNotes);
  }

  @Get('get/:id')
  async findId(@Param() params: { id: string }) {
    // console.log('data------>>>', params.id);
    return this.appService.getId(params.id);
  
  }

  @Get('getAll')
    async allNote(){
      return this.appService.getAll()
    }

  @Put('update/:id')
    async updateNote(@Param() params:{id:string} ,
      @Body() data:INote) {
       console.log(data)
      return this.appService.Update(params.id,data)
    }

  @Delete('deleteById/:id')
    async DeleteNote(@Param() params:{id: string} ){
      return this.appService.Remove(params.id)
    }
  
  @Get('last30Days')
    async LastDeletedNote(){
      return this.appService.Deleted()
    }
  }

