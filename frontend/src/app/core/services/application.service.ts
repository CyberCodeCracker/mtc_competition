import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  Application,
  CreateApplicationData,
  ApplicationStatus,
  PaginatedResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  createApplication(data: CreateApplicationData): Observable<ApiResponse<Application>> {
    return this.http.post<ApiResponse<Application>>(this.apiUrl, data);
  }

  getApplicationById(id: number): Observable<ApiResponse<Application>> {
    return this.http.get<ApiResponse<Application>>(`${this.apiUrl}/${id}`);
  }

  getAllApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
    studentId?: number;
    offerId?: number;
    companyId?: number;
  }): Observable<ApiResponse<PaginatedResponse<Application>>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Application>>>(this.apiUrl, { params: httpParams });
  }

  updateApplicationStatus(id: number, status: ApplicationStatus): Observable<ApiResponse<Application>> {
    return this.http.patch<ApiResponse<Application>>(`${this.apiUrl}/${id}/status`, { status });
  }

  withdrawApplication(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}/withdraw`);
  }
}
