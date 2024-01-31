import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'instructornamefilter'
})
export class InstructornamefilterPipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
    
        return array.filter((element)=>element.instructor_id.toString().toLowerCase().indexOf(query)>-1  );
    }
    return array;
  }

}
