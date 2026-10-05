import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BattlefieldSeasonData } from './battlefield-season.model';

@Injectable({ providedIn: 'root' })
export class BattlefieldSeasonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://192.168.1.21:8081/bf6/seasons';

  createSeason(name: string, startDate: string, endDate: string): Observable<BattlefieldSeasonData> {
    return this.http.post<BattlefieldSeasonData>(this.apiUrl, { name, startDate, endDate });
  }

  getLatestSeason(): Observable<BattlefieldSeasonData> {
    return this.http.get<BattlefieldSeasonData>(`${this.apiUrl}/latest`);
  }

  getRemainingTiers(seasonId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${seasonId}/remaining-tiers`);
  }

  incrementXpLevel(seasonId: number): Observable<BattlefieldSeasonData> {
    return this.http.patch<BattlefieldSeasonData>(`${this.apiUrl}/${seasonId}/xp-levels`, null);
  }

  decrementXpLevel(seasonId: number): Observable<BattlefieldSeasonData> {
    return this.http.patch<BattlefieldSeasonData>(
      `${this.apiUrl}/${seasonId}/xp-levels/decrement`,
      null,
    );
  }
}
