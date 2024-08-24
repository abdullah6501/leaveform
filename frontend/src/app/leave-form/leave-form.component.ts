import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveManagementService } from '../services/leave-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css'],
})
export class LeaveFormComponent implements OnInit {
  leaveForm: FormGroup;
  leaveTypes: string[] = ['Festival_Leave', 'Casual_Leave', 'Sick_Leave'];
  minToDate: string;
  characterCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveManagementService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.leaveForm = this.fb.group({
      leave_applied_date: [{ value: '', disabled: true }],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
      leave_type: ['', Validators.required],
      emp_email: [{ value: '', disabled: true }],
      reason: ['', Validators.required],
      unpaid: [0, [Validators.min(0)]],
      paid: [0, [Validators.min(0)]],
    });

    this.minToDate = '';
  }

  validateDays(event: any) {
    const input = event.target;
    if (input.value < 0) {
      input.value = 0;
    }
  }

  onFromDateChange() {
    const fromDate = this.leaveForm.get('from_date')?.value;
    if (fromDate) {
      this.minToDate = fromDate;
      // Reset the to_date if it is before the new from_date
      const toDate = this.leaveForm.get('to_date')?.value;
      if (toDate && toDate < fromDate) {
        this.leaveForm.get('to_date')?.setValue('');
      }
    } else {
      this.minToDate = '';
    }
  }
  updateCharacterCount(): void {
    const reasonControl = this.leaveForm.get('reason');
    if (reasonControl) {
      this.characterCount = reasonControl.value
        ? reasonControl.value.length
        : 0;
    }
  }
  ngOnInit() {
    const currentDate = new Date().toISOString().split('T')[0];
    this.leaveForm.patchValue({
      leave_applied_date: currentDate,
    });

    const empEmail = localStorage.getItem('auth');
    if (empEmail) {
      this.leaveForm.patchValue({
        emp_email: empEmail,
      });
    } else {
      alert('Employee email not found in local storage');
    }
  }

  openTimePicker(event: Event): void {
    const target = event.target as HTMLInputElement;
    target.showPicker();
  }
  onSubmit() {
    if (this.leaveForm.valid) {
      // Manually add disabled fields
      const formValue = {
        ...this.leaveForm.value,
        emp_email: this.leaveForm.get('emp_email')?.value,
        leave_applied_date: this.leaveForm.get('leave_applied_date')?.value,
      };

      this.leaveService.createLeaveApplication(formValue).subscribe(
        (Response) => {
          this.snackBar.open(
            'Leave application submitted successfully',
            'Close',
            {
              duration: 1019,
            }
          );
          this.router.navigate(['/editleave']);
        },
        (error) => {
          this.snackBar.open(
            'Leave application submitted successfully',
            'Close',
            {
              duration: 1019,
            }
          );
          this.router.navigate(['/editleave']);
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 1019,
      });
    }
  }
}
