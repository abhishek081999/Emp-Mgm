import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search1'
})
export class Search1Pipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
      console.log(query)
      query=query.toLowerCase();
        return array.filter((e)=>e.coursecategory.toString().toLowerCase().indexOf(query)>-1 || e.coursecode.toLowerCase().indexOf(query)>-1 || e.coursename.toLowerCase().indexOf(query)>-1 || e.instructorname.toLowerCase().indexOf(query)>-1 || e.teacherid.toLowerCase().indexOf(query)>-1 || e.name.toLowerCase().indexOf(query)>-1 || e.invid.toLowerCase().indexOf(query)>-1);
    }
    return array;
  }

}
