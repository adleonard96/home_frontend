import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BattlefieldSeasonData } from './battlefield-season.model';
import { BattlefieldSeasonService } from './battlefield-season.service';

@Component({
  selector: 'app-battlefield-season',
  imports: [FormsModule],
  templateUrl: './BattlefieldSeason.html',
  styleUrl: './BattlefieldSeason.css',
})
export class BattlefieldSeason implements OnInit {
  private readonly seasonService = inject(BattlefieldSeasonService);

  protected readonly season = signal<BattlefieldSeasonData | null>(null);
  protected readonly remainingTiers = signal<number | null>(null);
  protected readonly loadingSeason = signal(true);
  protected readonly creatingSeason = signal(false);
  protected readonly updatingProgress = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected seasonName = 'Season 1';
  protected startDate = this.getLocalDateInputValue();
  protected weeks = 10;

  ngOnInit(): void {
    this.loadLatestSeason();
  }

  protected createSeason(): void {
    const name = this.seasonName.trim();
    if (!name || !this.startDate || !Number.isInteger(this.weeks) || this.weeks < 1) {
      this.errorMessage.set('Enter a season name, start date, and a whole number of weeks.');
      return;
    }

    const endDate = this.getEndDate(this.startDate, this.weeks);
    if (!endDate) {
      this.errorMessage.set('Enter a valid start date.');
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.creatingSeason.set(true);
    this.seasonService.createSeason(name, this.startDate, endDate).subscribe({
      next: (season) => {
        this.season.set(season);
        this.seasonName = `Season ${season.id + 1}`;
        this.remainingTiers.set(null);
        this.creatingSeason.set(false);
        this.successMessage.set('Season created.');
        this.loadRemainingTiers(season.id);
      },
      error: (error: HttpErrorResponse) => {
        this.creatingSeason.set(false);
        this.errorMessage.set(this.getRequestErrorMessage(error, 'Could not create the season.'));
      },
    });
  }

  protected changeXpLevel(change: 'increment' | 'decrement'): void {
    const currentSeason = this.season();
    if (!currentSeason || this.updatingProgress()) {
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.updatingProgress.set(true);
    const request =
      change === 'increment'
        ? this.seasonService.incrementXpLevel(currentSeason.id)
        : this.seasonService.decrementXpLevel(currentSeason.id);

    request.subscribe({
      next: (season) => {
        this.season.set(season);
        this.updatingProgress.set(false);
        this.loadRemainingTiers(season.id);
      },
      error: (error: HttpErrorResponse) => {
        this.updatingProgress.set(false);
        this.errorMessage.set(this.getRequestErrorMessage(error, 'Could not update XP progress.'));
      },
    });
  }

  private loadLatestSeason(): void {
    this.loadingSeason.set(true);
    this.seasonService.getLatestSeason().subscribe({
      next: (season) => {
        this.season.set(season);
        this.seasonName = `Season ${season.id + 1}`;
        this.loadingSeason.set(false);
        this.loadRemainingTiers(season.id);
      },
      error: (error: HttpErrorResponse) => {
        this.loadingSeason.set(false);
        if (error.status === 404) {
          this.season.set(null);
          this.remainingTiers.set(null);
          return;
        }
        this.errorMessage.set(this.getRequestErrorMessage(error, 'Could not load the latest season.'));
      },
    });
  }

  private loadRemainingTiers(seasonId: number): void {
    this.seasonService.getRemainingTiers(seasonId).subscribe({
      next: (remainingTiers) => this.remainingTiers.set(remainingTiers),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(
          this.getRequestErrorMessage(error, 'Season loaded, but remaining tiers could not be retrieved.'),
        );
      },
    });
  }

  private getEndDate(startDate: string, weeks: number): string | null {
    const date = new Date(`${startDate}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    date.setUTCDate(date.getUTCDate() + weeks * 7);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().slice(0, 10);
  }

  private getLocalDateInputValue(): string {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  private getRequestErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }
    if (typeof error.error?.message === 'string' && error.error.message.trim()) {
      return error.error.message;
    }
    return fallback;
  }
}
