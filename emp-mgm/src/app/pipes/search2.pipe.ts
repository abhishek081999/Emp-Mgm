import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search2'
})
export class Search2Pipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
      query=query.toLowerCase();
        return array.filter((e)=>e.fullName.toLowerCase().indexOf(query)>-1 || e.telephone.toLowerCase().indexOf(query)>-1 || (e.state && e.state.toLowerCase().indexOf(query)>-1) ||(e.language && e.language.toString().toLowerCase().indexOf(query)>-1) || (e.specialization && e.specialization.toString().toLowerCase().indexOf(query)>-1) || (e.invid && e.invid.toLowerCase().indexOf(query)>-1));
    }
    return array;
  }

}
