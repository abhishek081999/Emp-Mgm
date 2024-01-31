
import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingService } from 'src/app/services/setting.service';

interface ApiResponse {
  businessHour: {
    _id: string;
    name: string;
    activeHours: {
      isActive: boolean;
      startingHour: string;
      closingHour: string;
    }[];
    reason: string | null;
  };
}

@Component({
  selector: 'app-business-hour',
  templateUrl: './business-hour.component.html',
  styleUrls: ['./business-hour.component.scss']
})
export class BusinessHourComponent implements OnInit {
  businessForm: FormGroup;
  isActive: boolean = false
  checked: [1, 2, 3, 4, 5, 6, 7]
  constructor(private fb: FormBuilder, private SettingService: SettingService) { }
  ngOnInit(): void {
    this.businessForm = this.fb.group({
      days: this.fb.array([]),
      displayMsg: ['']
    });
    this.initializeDays();
    this.fetchData();
  }
  get days(): FormArray {
    return this.businessForm.get('days') as FormArray
  }
  hourAdd() {
    const days = this.fb.group({
      isActive: [false, Validators.required],
      startingHour: ['', Validators.required],
      closingHour: ''
    })
    this.days.push(days)
  }
  getDayName(index: number): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[index];
  }
  initializeDays() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    daysOfWeek.forEach(() => {
      const day = this.fb.group({
        isActive: [false],
        startingHour: " ",
        closingHour: " "
      });
      this.days.push(day);
    });
  }
  businessFormData(): void {
    const formData = this.businessForm.value;
    console.log('Form Data:', formData);
    // console.log(this.days.controls, 'jdg');
    this.SettingService.sendData(formData).subscribe(
      (response) => {
        console.log('Data sent successfully:', response);
      },
      (error) => {
        console.error('Error sending data:', error);
      }
    )
  }
  fetchData(): void {
    this.SettingService.getData().subscribe(
      (response: ApiResponse) => {
        const businessHourData = response.businessHour;
        const activeHoursFormArray = this.businessForm.get('days') as FormArray;
        businessHourData.activeHours.forEach((activeHour, index) => {
          const activeHourFormGroup = activeHoursFormArray.at(index);
          if (activeHourFormGroup) {
            activeHourFormGroup.patchValue(activeHour);
          }
        });
        console.log('display message', businessHourData.reason)
        this.businessForm.get('displayMsg').setValue(businessHourData.reason);
      },
      (error) => {
        console.error('Error retrieving data:', error);
      }
    );
  }
}