import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseNameFilter'
})
export class CourseNameFilterPipe implements PipeTransform {

  transform(array: any[], query: String): any {
    if(query){
    
        return array.filter((element)=>element.courseid==query || element.coursename==query );
    }
    return array;
  }

}
