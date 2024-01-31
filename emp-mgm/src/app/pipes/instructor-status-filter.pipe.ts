import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";
@Pipe({
  name: 'instructorStatusFilter'
})
export class InstructorStatusFilterPipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
      if(query=="approved"){
        function approvefilter(element,index,array){
          return element.approved==true
        }
        return array.filter(approvefilter);
      }
      else if(query=="rejected"){
        function rejectedfilter(element,index,array){
          return element.rejected==true
        }
        return array.filter(rejectedfilter);
      }
      else if(query=="profilecomplete"){
        function rejectedfilter(element,index,array){
          return element.profilecomplete==true
        }
        return array.filter(rejectedfilter);
      }
      else if(query=="deactivate"){
        function rejectedfilter(element,index,array){
          return element.deactivate==true
        }
        return array.filter(rejectedfilter);
      }
      else{
        function pendingfilter(element,index,array){
          return (element.approved==false && element.rejected==false);
        }
        return array.filter(pendingfilter);
      }
      
    }
    return array;
  }

}
