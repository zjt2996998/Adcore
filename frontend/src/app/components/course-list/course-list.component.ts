import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatIconModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    CourseService
  ]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  search = '';
  page = 1;
  pageSize = 10;
  totalCourses = 0;

  constructor(private courseService: CourseService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses(this.search, this.page, this.pageSize).subscribe({
      next: (data) => {
        this.courses = data.courses;
        this.totalCourses = data.totalCount;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  calculateCourseLength(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  }

  formatPrice(price: number, currencyCode: string, locale: string = 'es-HN'): string {
    try {
      const currencyToLocaleMap: { [currencyCode: string]: string } = {
        'USD': 'en-US',
        'EUR': 'de-DE',
        'JPY': 'ja-JP',
        'GBP': 'en-GB',
        'CNY': 'zh-CN',
        'INR': 'en-IN',
        'BRL': 'pt-BR',
        'HNL': 'es-HN',
        'RUB': 'ru-RU',
        'ZAR': 'en-ZA',
        'CZK': 'cs-CZ',
        'PEN': 'es-PE',
      };
      const locale = currencyToLocaleMap[currencyCode] || 'en-US';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'symbol',
      }).format(price);
    } catch (error) {
      return price.toString(); 
    }
  }

  onSearchChange(): void {
    console.log('Search changed:', this.search);
    this.page = 1;
    this.loadCourses();
  }

  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event.pageIndex + 1, 'pageSize:', event.pageSize);
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCourses();
  }

  deleteCourse(id: string): void {
    console.log('Deleting course with id:', id);
    this.courseService.deleteCourse(id).subscribe(() => this.loadCourses());
  }
}
