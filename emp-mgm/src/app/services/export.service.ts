import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

export class SheetData{
  [sheet:string]:XLSX.WorkSheet;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportonesheet(title,data){
    var today = this.getDateFormat();
    var filename=title+'_'+today+'_.xlsx';
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workBook: XLSX.WorkBook = { Sheets: { 'Sheet 1': worksheet },SheetNames:['Sheet 1']};
    XLSX.writeFile(workBook, filename);
  }

  getDateFormat():string{
    let d = new Date()
    return d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear();
  }

  createmultiplesheet(title,arr:any[],sheets:string[]){
    let sheet:XLSX.WorkSheet[]=[]
    let worksheets = new SheetData()
    var today = this.getDateFormat();
    var filename=title+'_'+today+'_.xlsx';
    arr.forEach(e=>{sheet.push(XLSX.utils.json_to_sheet(e))})
    var i=0
    sheets.forEach(e=>{worksheets[e]=sheet[i];i++})
    const workBook: XLSX.WorkBook = { 
      Sheets: worksheets,
      SheetNames:sheets
    };
    XLSX.writeFile(workBook, filename);
  }
}
