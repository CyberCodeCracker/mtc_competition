import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginatedResponse,
  Student,
  StudentStats,
  Application,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getAllStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    studyLevel?: string;
    groupName?: string;
  }): Observable<ApiResponse<PaginatedResponse<Student>>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Student>>>(this.apiUrl, { params: httpParams });
  }

  getStudentById(id: number): Observable<ApiResponse<Student>> {
    return this.http.get<ApiResponse<Student>>(`${this.apiUrl}/${id}`);
  }

  updateStudent(id: number, data: Partial<Student>): Observable<ApiResponse<Student>> {
    return this.http.put<ApiResponse<Student>>(`${this.apiUrl}/${id}`, data);
  }

  deleteStudent(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Current student endpoints
  getMyApplications(status?: string): Observable<ApiResponse<Application[]>> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ApiResponse<Application[]>>(`${this.apiUrl}/me/applications`, { params });
  }

  getMyStats(): Observable<ApiResponse<StudentStats>> {
    return this.http.get<ApiResponse<StudentStats>>(`${this.apiUrl}/me/stats`);
  }
}
