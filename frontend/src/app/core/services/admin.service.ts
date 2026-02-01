import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, DashboardStats } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/dashboard/stats`);
  }

  getOffersByCategory(): Observable<ApiResponse<{ PFE: number; SUMMER_INTERNSHIP: number; JOB: number }>> {
    return this.http.get<ApiResponse<{ PFE: number; SUMMER_INTERNSHIP: number; JOB: number }>>(
      `${this.apiUrl}/dashboard/offers-by-category`
    );
  }

  getRecentActivity(): Observable<ApiResponse<{
    recentApplications: any[];
    recentOffers: any[];
    recentStudents: any[];
    recentCompanies: any[];
  }>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/dashboard/recent-activity`);
  }

  getApplicationTrends(): Observable<ApiResponse<Array<{
    month: string;
    total: number;
    accepted: number;
    rejected: number;
    pending: number;
  }>>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/dashboard/application-trends`);
  }

  getTopCompanies(): Observable<ApiResponse<Array<{
    id: number;
    name: string;
    logoPath?: string;
    sector: string;
    totalOffers: number;
    totalApplications: number;
  }>>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/dashboard/top-companies`);
  }
}
