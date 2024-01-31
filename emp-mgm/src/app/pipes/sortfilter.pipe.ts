import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortFilter'
})
export class SortfilterPipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
      console.log(query)
      if(query=='34')
        return array.filter((element)=>element.rating>=3 && element.rating<=4 );
      else if(query=='3')
        return array.filter((element)=>element.rating<3 );
      else
        return array.filter((element)=>element.rating>4 );
    }
    return array;
  }

}
