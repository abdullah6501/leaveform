// src/app/services/leave-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class LeaveManagementService {
    private apiUrl = 'localhost:1019';
    // private baseUrl = 'http://192.168.0.135:1019/api/leave_management';


    constructor(private http: HttpClient) {}

    createLeaveApplication(leave: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/leave_management`, leave);
    }

    getLeaveApplications(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/leave_management`);
    }

    getLeaveApplicationById(empId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/leave_management/${empId}`);
    }

    updateLeaveStatus(id: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/leave_management/${id}`, { status });
    }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
