import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";


@Pipe({
  name: 'studentFilter'
})
export class StudentFilterPipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
      return _.filter(array, row=>row.fullName.indexOf(query)>-1);
    }
    return array;
  }

}

