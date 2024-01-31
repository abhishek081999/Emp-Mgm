import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort1Filter'
})
export class Sort1filterPipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
      console.log(query)
      if(query=='34')
        return array.filter((element)=>element.avgrating>=3 && element.avgrating<=4 );
      else if(query=='3')
        return array.filter((element)=>element.avgrating<3 );
      else
        return array.filter((element)=>element.avgrating>4 );
    }
    return array;
  }

}
