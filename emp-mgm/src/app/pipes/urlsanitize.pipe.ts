import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'urlsanitize'
})
export class UrlsanitizePipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer){}
  transform(url: String):SafeResourceUrl{
    
    return this._sanitizer.bypassSecurityTrustResourceUrl(String(url));
  }
  

}
