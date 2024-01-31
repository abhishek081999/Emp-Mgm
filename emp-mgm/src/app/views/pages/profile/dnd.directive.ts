import { Directive, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {

  @HostBinding('class.fileover') fileover:boolean
  @Output("fileDropped") fileDropped:EventEmitter<any>=new EventEmitter();
 
  constructor() { }

  @HostListener('dragover',['$event']) onDragOver(evt){
    evt.preventDefault();
    evt.stopPropagation();
    
  }

  @HostListener('dragleave',['$event']) onDragLeave(evt){
    evt.preventDefault();
    evt.stopPropagation();
    
  }

  @HostListener('drop',['$event']) public ondrop(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileover =false;
    
    const files = evt.dataTransfer.files;
    if(files.length>0){
      this.fileDropped.emit(files)
      
    }
  }

}
