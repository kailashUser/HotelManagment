import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BillingReport } from '../../../interfaces/billing-report';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BillingReportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
      'Content-Type': 'application/json',
    });
  }

  getBillingReport(): Observable<BillingReport[]> {
    return this.http
      .get<{ success: boolean; message: string; data: BillingReport[] }>(
        `${this.apiUrl}/Report/billing-report`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        map((res) =>
          res.data.filter((report) => report.reservationStatus === 3)
        )
      );
  }
}
