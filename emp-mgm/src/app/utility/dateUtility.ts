import { NgbDate, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export function ngbDateToJsDate(date: NgbDateStruct): Date {
    try {
        return new Date(date.year, date.month - 1, date.day);
    } catch (error) {
        console.log(error)
        return null;
    }
}

export function jsDateToNgbDate(date: Date): NgbDateStruct {
    try {
        return NgbDate.from({ day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() });
    } catch (error) {
        console.log(error)
        return null;
    }
}

export function ngbDateEqual(one: NgbDateStruct, two: NgbDateStruct) {
    return one && two && two.year === one.year && two.month === one.month && two.day === one.day;
}

export function ngbDateBefore(one: NgbDateStruct, two: NgbDateStruct) {
    return !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
        ? false : one.day < two.day : one.month < two.month : one.year < two.year;
}
export function ngbDateAfter(one: NgbDateStruct, two: NgbDateStruct) {
    return !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
        ? false : one.day > two.day : one.month > two.month : one.year > two.year;
}
export function ngbDateIsSunday(date: NgbDateStruct) {
    const jsDate = ngbDateToJsDate(date);
    return jsDate.getDay() === 0; // 0 represents Sunday
};