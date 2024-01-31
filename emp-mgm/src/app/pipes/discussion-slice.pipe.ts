import { Pipe, PipeTransform } from '@angular/core';
import { Discussion } from '../model/discussion.model';

@Pipe({
  name: 'discussionSlice'
})
export class DiscussionSlicePipe implements PipeTransform {

  transform(arr: Discussion[], ...args: number[]): Discussion[] {
    if(arr && args.length==1){
      return arr.slice(args[0])
    }
    else if(arr && args.length==2){
      return arr.slice(args[0],args[1])
    }
    return arr;
  }

}
