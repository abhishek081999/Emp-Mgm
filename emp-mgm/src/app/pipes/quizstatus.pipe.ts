import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quizstatus'
})
export class QuizstatusPipe implements PipeTransform {

 
  transform(array: any[], query: String): any {
    var status=true;
    if(query){
      query=query.toLowerCase();
      if(query=='approved')
        status=true
      else
        status=false
        return array.filter((e)=>e.approved==status);
    }
    return array;
  }

}
