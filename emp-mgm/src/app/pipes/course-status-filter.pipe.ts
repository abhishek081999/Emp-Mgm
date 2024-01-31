import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user.service';

@Pipe({
  name: 'courseStatusFilter'
})
export class CourseStatusFilterPipe implements PipeTransform {
constructor(private userService:UserService){}
  
  transform(array: any[], query: String): any {
    var payload=this.userService.getUserPayload()
    if(query){
      if(query=="approved"){
        function approvefilter(element,index,array){
          return element.approved==true
        }
        return array.filter(approvefilter);
      }
      else if(query=="Mycourses"){
        function mycourse(element,index,array){
          return (element.submittedby==payload.profileid)
        }
        return array.filter(mycourse);
      }
      else if(query=="Upcoming"){
        function upcoming(element,index,array){
          return (element.upcoming)
        }
        return array.filter(upcoming);
      }
      else{
        function pendingfilter(element,index,array){
          return (element.approved==false);
        }
        return array.filter(pendingfilter);
      }
      
    }
    return array;
  }

}
