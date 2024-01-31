import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseSearch'
})
export class CourseSearchPipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
      query=query.toLowerCase();
        return array.filter((e)=>e.coursecategory.toString().toLowerCase().indexOf(query)>-1 || e.coursecode.toLowerCase().indexOf(query)>-1 || e.coursename.toLowerCase().indexOf(query)>-1 || e.teachername.toString().toLowerCase().indexOf(query)>-1 || e.coursetype.toString().toLowerCase().indexOf(query)>-1 || e.courselanguage.toString().toLowerCase().indexOf(query)>-1);
    }
    return array;
  }

}
