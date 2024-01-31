import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort2Filter'
})
export class Sort2filterPipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
      console.log(query)
      if(query=='34')
        return array.filter((element)=>element.teacherrating>=3 && element.teacherrating<=4 );
      else if(query=='3')
        return array.filter((element)=>element.teacherrating<3 );
      else
        return array.filter((element)=>element.teacherrating>4 );
    }
    return array;
  }

}
