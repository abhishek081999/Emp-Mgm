import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quizsearch'
})
export class QuizsearchPipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
      query=query.toLowerCase();
        return array.filter((e)=>e.quizname.toString().toLowerCase().indexOf(query)>-1 || e.quizid.toLowerCase().indexOf(query)>-1 || e.type.toLowerCase().indexOf(query)>-1 || e.numberofattempt.toString().toLowerCase().indexOf(query)>-1 || e.totalmarks.toString().toLowerCase().indexOf(query)>-1 || e.passingmarks.toString().toLowerCase().indexOf(query)>-1 || e.teachername.toString().toLowerCase().indexOf(query)>-1 || e.time.toString().toLowerCase().indexOf(query)>-1);
    }
    return array;
  }

}
