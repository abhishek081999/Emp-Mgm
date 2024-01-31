import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'texttourl'
})
export class TexttourlPipe implements PipeTransform {

  transform(value){
    var replacedText, replacePattern1, replacePattern2;
    replacedText=value;
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = replacedText?replacedText.replace(replacePattern1,'<a href="$1" target="_blank">$1</a>'):'';

    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText?replacedText.replace(replacePattern2,'<a href="http://$2" target="_blank">$2</a>'):'';


    return replacedText;
  }

}
