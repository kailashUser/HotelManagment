import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <!-- Previous button -->
        <li class="page-item" [class.disabled]="currentPage === 1">
          <a class="page-link" (click)="onPageChange(currentPage - 1)" style="cursor: pointer">
            Previous
          </a>
        </li>

        <!-- Page numbers -->
        <ng-container *ngFor="let page of getPageNumbers()">
          <li class="page-item" [class.active]="page === currentPage">
            <a class="page-link" (click)="onPageChange(page)" style="cursor: pointer">
              {{ page }}
            </a>
          </li>
        </ng-container>

        <!-- Next button -->
        <li class="page-item" [class.disabled]="currentPage === totalPages">
          <a class="page-link" (click)="onPageChange(currentPage + 1)" style="cursor: pointer">
            Next
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .pagination {
      margin-bottom: 0;
    }
    .page-link {
      color: #0d6efd;
    }
    .page-item.active .page-link {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
  `]
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() itemsPerPage = 20;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
} 