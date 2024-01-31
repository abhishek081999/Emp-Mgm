import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupportSlaService } from 'src/app/services/support-sla.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-support-sla-policy',
  templateUrl: './support-sla-policy.component.html',
  styleUrls: ['./support-sla-policy.component.scss']
})
export class SupportSlaPolicyComponent implements OnInit {
  slaPolicies: any[] = []
  showOptions: boolean = false;
  selectedPolicy: string | null = null;
  constructor(private router: Router, private supportSlaService: SupportSlaService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchSlaPolicies()
  }

  toggleOptions(policyId: string) {
    this.showOptions = !this.showOptions;

    if (this.selectedPolicy === policyId) {
      this.selectedPolicy = null; // Close options if clicked again
    } else {
      this.selectedPolicy = policyId;
    }
  }

  redirectToNewPage() {
    this.router.navigateByUrl('support-portal/setting/support-sla');
  }

  fetchSlaPolicies() {
    this.supportSlaService.getSlaPolicies()
      .toPromise()
      .then((response: any) => {
        this.slaPolicies = response;
        console.log('Fetched SLA Policies:', this.slaPolicies);
      })
      .catch((error: any) => {
        console.error('Error fetching SLA policies:', error);
      });
  }
  

  editPolicy(policy: any) {
    this.router.navigate(['support-portal/setting/support-sla', policy._id]);
    this.selectedPolicy = null;
  }

  deleteSlaPolicy(groupId: string): void {
    this.supportSlaService
      .deleteSlaPolicy(groupId)
      .toPromise()
      .then((res: any) => {
        if (res) {
          console.log('Data deleted successfully');         
          this.fetchSlaPolicies();
          this.snackBar.open('Data deleted successfully', 'Close', { duration: 3000 });

        } else {
          console.error('Error while deleting group:', res);
          this.snackBar.open('Error deleting data', 'Close', { duration: 3000, panelClass: 'error-snackbar' });

        }
      })
      .catch((error: any) => {
        console.error('Error while deleting group:', error);
        this.snackBar.open('Error deleting data', 'Close', { duration: 3000, panelClass: 'error-snackbar' });

      });
      this.selectedPolicy = null;
  }
  

}