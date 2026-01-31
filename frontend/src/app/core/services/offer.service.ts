import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginatedResponse,
  Offer,
  CreateOfferData,
  Application,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private readonly apiUrl = `${environment.apiUrl}/offers`;

  constructor(private http: HttpClient) {}

  getOffers(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
    companyId?: number;
  }): Observable<ApiResponse<PaginatedResponse<Offer>>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Offer>>>(this.apiUrl, { params: httpParams });
  }

  getOfferById(id: number): Observable<ApiResponse<Offer>> {
    return this.http.get<ApiResponse<Offer>>(`${this.apiUrl}/${id}`);
  }

  createOffer(data: CreateOfferData): Observable<ApiResponse<Offer>> {
    return this.http.post<ApiResponse<Offer>>(this.apiUrl, data);
  }

  updateOffer(id: number, data: Partial<CreateOfferData>): Observable<ApiResponse<Offer>> {
    return this.http.put<ApiResponse<Offer>>(`${this.apiUrl}/${id}`, data);
  }

  deleteOffer(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getOfferApplications(id: number, status?: string): Observable<ApiResponse<Application[]>> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ApiResponse<Application[]>>(`${this.apiUrl}/${id}/applications`, { params });
  }
}
