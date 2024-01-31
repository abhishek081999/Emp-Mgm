import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
      query=query.toLowerCase();
        return array.filter((e)=>e.coursecategory.toString().toLowerCase().indexOf(query)>-1 || e.coursecode.toLowerCase().indexOf(query)>-1 || e.coursename.toLowerCase().indexOf(query)>-1 || e.teachername.toLowerCase().indexOf(query)>-1 || e.teacherid.toLowerCase().indexOf(query)>-1 || e.studentname.toLowerCase().indexOf(query)>-1);
    }
    return array;
  }

}
