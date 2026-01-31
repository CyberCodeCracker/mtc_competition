import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginatedResponse,
  Company,
  CompanyStats,
  Offer,
  Application,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly apiUrl = `${environment.apiUrl}/companies`;

  constructor(private http: HttpClient) {}

  getAllCompanies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sector?: string;
    isApproved?: boolean;
  }): Observable<ApiResponse<PaginatedResponse<Company>>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Company>>>(this.apiUrl, { params: httpParams });
  }

  getCompanyById(id: number): Observable<ApiResponse<Company>> {
    return this.http.get<ApiResponse<Company>>(`${this.apiUrl}/${id}`);
  }

  updateCompany(id: number, data: Partial<Company>): Observable<ApiResponse<Company>> {
    return this.http.put<ApiResponse<Company>>(`${this.apiUrl}/${id}`, data);
  }

  deleteCompany(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  toggleApproval(id: number, isApproved: boolean): Observable<ApiResponse<Company>> {
    return this.http.patch<ApiResponse<Company>>(`${this.apiUrl}/${id}/approval`, { isApproved });
  }

  // Current company endpoints
  getMyOffers(status?: string): Observable<ApiResponse<Offer[]>> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ApiResponse<Offer[]>>(`${this.apiUrl}/me/offers`, { params });
  }

  getMyStats(): Observable<ApiResponse<CompanyStats>> {
    return this.http.get<ApiResponse<CompanyStats>>(`${this.apiUrl}/me/stats`);
  }

  getMyApplications(params?: { status?: string; offerId?: number }): Observable<ApiResponse<Application[]>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Application[]>>(`${this.apiUrl}/me/applications`, { params: httpParams });
  }
}
