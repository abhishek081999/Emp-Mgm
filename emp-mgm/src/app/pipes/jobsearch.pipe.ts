import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jobsearch'
})
export class JobsearchPipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
      query=query.toLowerCase();
        return array.filter((e)=>e.title.toString().toLowerCase().indexOf(query)>-1 || e.experience.toLowerCase().indexOf(query)>-1 || e.salary.toLowerCase().indexOf(query)>-1 || e.details.toString().toLowerCase().indexOf(query)>-1 || e.jobid.toString().toLowerCase().indexOf(query)>-1 || e.location.toString().toLowerCase().indexOf(query)>-1 || e.company.toString().toLowerCase().indexOf(query)>-1);
    }
    return array;
  }

}
