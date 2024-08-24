import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

export interface Item {
  id: number;
  editable: boolean;
  isNew?: boolean;
  leave_applied_date: string;
  from_date: string;
  to_date: string;
  leave_type: string;
  emp_email: string;
  reason: string;
  paid: boolean;
  unpaid: string | null;
  status?: 'approved' | 'rejected' | 'pending';
  minToDate?: string;
}

@Component({
  selector: 'app-leave-edit',
  templateUrl: './leave-edit.component.html',
  styleUrls: ['./leave-edit.component.css']
})

export class LeaveEditComponent implements OnInit {
  @Input() userId: string | null | undefined;

  selectedItems: Item[] = [];
  error = '';
  item: Item | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.userId = localStorage.getItem('auth');
    if (this.userId) {
      this.getItemById();
    } else {
      console.error('userId not found in localStorage');
      this.error = 'userId not found in localStorage';
    }
  }

  checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  getItemById(): void {
    const userId = this.userId;
    if (!userId) {
      console.error('userId not found in localStorage');
      this.error = 'userId not found in localStorage';
      return;
    }

    this.http.get<Item[]>(`http://192.168.0.135:1019/api/leave_management/${encodeURIComponent(userId)}`)
      .subscribe({
        next: (items) => {
          this.selectedItems = items.map(item => ({
            ...item,
            editable: false,
            leave_applied_date: this.formatDateForUI(item.leave_applied_date),
            from_date: this.formatDateForUI(item.from_date),
            to_date: this.formatDateForUI(item.to_date),
            minToDate: this.formatDateForBackend(item.from_date)
          }));
        },
        error: (error) => {
          this.error = 'Error fetching leave details';
          console.error('Error fetching leave details:', error);
        }
      });
  }

  formatDateForUI(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // formatDateForBackend(date: string | null): string {
  //   if (!date) {
  //     console.warn('Date value is null or undefined');
  //     return ''; // Return a default value or handle it as needed
  //   }
  //   const [day, month, year] = date.split('/');
  //   return `${year}-${month}-${day}`;
  // }

  // toggleEdit(item: Item): void {
  //   if (item.editable) {
  //     if (this.validateItem(item)) {
  //       this.updateItem(item);
  //     } else {
  //       this.snackBar.open('Please fill in all required fields.', 'Close', {
  //         duration: 1019,
  //         verticalPosition: 'bottom',
  //         horizontalPosition: 'right'
  //       });
  //       return;
  //     }
  //   }
  //   item.editable = !item.editable;
  // }
  toggleEdit(item: Item): void {
    if (item.editable) {
      if (this.validateItem(item)) {
        // Convert the date back to the display format before saving
        item.from_date = this.formatDateForUI(item.from_date);
        item.to_date = this.formatDateForUI(item.to_date);
        this.updateItem(item);
      } else {
        this.snackBar.open('Please fill in all required fields.', 'Close', {
          duration: 1019,
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        });
        return;
      }
    } else {
      // Convert the date to the input field format for editing
      item.from_date = this.formatDateForBackend(item.from_date);
      item.to_date = this.formatDateForBackend(item.to_date);
    }
    item.editable = !item.editable;
  }


  validateItem(item: Item): boolean {
    return !!item.leave_type &&
           !!item.leave_applied_date &&
           !!item.from_date &&
           !!item.to_date &&
           !!item.emp_email &&
           !!item.reason;
  }

  updateMinToDate(item: Item): void {
    item.minToDate = item.from_date;
  }

  updateItem(item: Item): void {
    const { id, emp_email, leave_type, leave_applied_date, from_date, to_date, reason, paid, unpaid } = item;

    // Log original dates
    console.log('Original Dates:', { leave_applied_date, from_date, to_date });

    const formattedLeaveAppliedDate = this.formatDateForBackend(leave_applied_date);
    const formattedFromDate = this.formatDateForBackend(from_date);
    const formattedToDate = this.formatDateForBackend(to_date);

    // Log formatted dates
    console.log('Formatted Dates:', { formattedLeaveAppliedDate, formattedFromDate, formattedToDate });

    // Check for any invalid formatted dates
    if (!formattedLeaveAppliedDate || !formattedFromDate || !formattedToDate) {
        console.error('Date formatting error. Please check the input dates.');
        this.snackBar.open('Date formatting error. Please check the input dates.', 'Close', {
            duration: 1019,
            verticalPosition: 'bottom',
            horizontalPosition: 'right'
        });
        return;
    }

    this.http.put(`http://192.168.0.135:1019/api/leave_management/${emp_email}/${id}`, {
        emp_email,
        leave_type,
        leave_applied_date: formattedLeaveAppliedDate,
        from_date: formattedFromDate,
        to_date: formattedToDate,
        reason,
        paid,
        unpaid
    }).subscribe({
        next: () => {
            console.log('Item updated successfully.');
            this.snackBar.open('Leave details updated successfully!', 'Close', {
                duration: 1019,
                verticalPosition: 'bottom',
                horizontalPosition: 'right'
            });
            item.editable = false;
        },
        error: (error) => {
            console.log('Error updating item:', error);
            this.snackBar.open('Failed to update leave details.', 'Close', {
                duration: 1019,
                verticalPosition: 'bottom',
                horizontalPosition: 'right'
            });
        }
    });
}

formatDateForBackend(date: string | null): string {
  if (!date) {
      console.warn('Date value is null or undefined');
      return ''; // Return an empty string or a default value if needed
  }

  // Check if the date is in ISO 8601 format
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  if (isoDatePattern.test(date)) {
      const dateObject = new Date(date);
      return `${dateObject.getFullYear()}-${('0' + (dateObject.getMonth() + 1)).slice(-2)}-${('0' + dateObject.getDate()).slice(-2)}`;
  }

  // Check if the date is in "yyyy-mm-dd" format
  const yyyyMmDdPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (yyyyMmDdPattern.test(date)) {
      return date; // Return as is if it's already in "yyyy-mm-dd" format
  }

  // Check if the date is in "dd/mm/yyyy" format
  const ddMmYyyyParts = date.split('/');
  if (ddMmYyyyParts.length === 3) {
      const [day, month, year] = ddMmYyyyParts;

      // Validate date components
      if (day && month && year && !isNaN(Number(day)) && !isNaN(Number(month)) && !isNaN(Number(year))) {
          return `${year}-${month}-${day}`; // Convert to "yyyy-mm-dd" format
      } else {
          console.warn('Invalid date components:', { day, month, year });
          return ''; // Return an empty string or a default value if needed
      }
  }

  console.warn('Invalid date format:', date);
  return ''; // Return an empty string or a default value if needed
}


  // updateItem(item: Item | null): void {
  //   if (!item || !this.validateItem(item)) {
  //     this.snackBar.open('Please fill in all required fields.', 'Close', {
  //       duration: 1019,
  //       verticalPosition: 'bottom',
  //       horizontalPosition: 'right'
  //     });
  //     return;
  //   }

  //   const formattedLeaveAppliedDate = this.formatDateForBackend(item.leave_applied_date);
  //   const formattedFromDate = this.formatDateForBackend(item.from_date);
  //   const formattedToDate = this.formatDateForBackend(item.to_date);

  //   const url = `http://192.168.0.135:1019/api/leave_management/${item.emp_email}/${item.id}`;
  //   const updatedData = {
  //     leave_applied_date: formattedLeaveAppliedDate,
  //     from_date: formattedFromDate,
  //     to_date: formattedToDate,
  //     leave_type: item.leave_type,
  //     emp_email: item.emp_email,
  //     reason: item.reason,
  //     unpaid: item.unpaid,
  //     paid: item.paid,
  //     status: item.status
  //   };

  //   this.http.put(url, updatedData)
  //     .subscribe({
  //       next: () => {
  //         this.snackBar.open('Leave details updated successfully!', 'Close', {
  //           duration: 1019,
  //           verticalPosition: 'bottom',
  //           horizontalPosition: 'right'
  //         });
  //         item.editable = false;
  //       },
  //       error: (error) => {
  //         console.error('Failed to update leave details:', error);
  //         this.snackBar.open('Failed to update leave details.', 'Close', {
  //           duration: 1019,
  //           verticalPosition: 'bottom',
  //           horizontalPosition: 'right'
  //         });
  //       }
  //     });
  // }

  deleteItem(item: Item): void {
    if (item.status === 'pending') {
      this.snackBar.open('Cannot delete item with pending approval status.', 'Close', {
        duration: 1019,
        verticalPosition: 'bottom',
        horizontalPosition: 'right'
      });
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const url = `http://192.168.0.135:1019/api/leave_management/${item.emp_email}/${item.id}`;
        this.http.delete(url)
          .subscribe({
            next: () => {
              this.snackBar.open('Leave record deleted successfully!', 'Close', {
                duration: 1019,
                verticalPosition: 'bottom',
                horizontalPosition: 'right'
              });
              this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem.id !== item.id);
            },
            error: (error) => {
              console.error('Failed to delete leave record:', error);
              this.snackBar.open('Failed to delete leave record.', 'Close', {
                duration: 1019,
                verticalPosition: 'bottom',
                horizontalPosition: 'right'
              });
            }
          });
      }
    });
  }

  onFeaturesInput(item: Item): void {
    const words = item.reason.trim().split(/\s+/);
    if (words.length > 10) {
      words.splice(10);
      item.reason = words.join(' ');
      this.snackBar.open('Maximum 10 words allowed in features field.', 'Close', {
        duration: 1019,
        verticalPosition: 'bottom',
        horizontalPosition: 'right'
      });
    }
  }

  navigateToProfile(): void {
    this.router.navigate(['/apply-leave']);
  }

  navigateToLeave(): void {
    this.router.navigate(['/apply-leave']);
  }
}
