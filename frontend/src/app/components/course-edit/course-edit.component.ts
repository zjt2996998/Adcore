import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
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
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss'],
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
    MatSelectModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    CourseService
  ]
})
export class CourseEditComponent implements OnInit {
  courseForm: FormGroup;
  universities: string[] = [
    'Universidade de Passo Fundo',
    'Universitas Bunda Mulia Jakarta',
    'Foundation University',
    'FAAP - Fundação Armando Alvares Penteado',
    'Fundación Universitaria San Martín'
  ];
  countries: string[] = [
    'United States',
    'Canada',
    'Mexico',
    'United Kingdom',
    'Germany'
  ];
  cities: string[] = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Philadelphia'
  ];
  currencies: string[] = [
    'USD', 'EUR', 'JPY', 'GBP', 'CNY', 'INR', 'BRL', 'HNL', 'RUB', 'ZAR', 'CZK', 'PEN'
  ];

  filteredUniversities: Observable<string[]>;
  filteredCountries: Observable<string[]>;
  filteredCities: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.courseForm = this.fb.group({
      university: [{ value: '', disabled: true }, Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
      country: [{ value: '', disabled: true }, Validators.required],
      course_name: [{ value: '', disabled: true }, Validators.required],
      course_description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      currency: ['', Validators.required],
    });

    // Initialize the filtered options
    this.filteredUniversities = new Observable<string[]>();
    this.filteredCountries = new Observable<string[]>();
    this.filteredCities = new Observable<string[]>();
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe(course => {
        this.courseForm.patchValue({
          university: course.university,
          city: course.city,
          country: course.country,
          course_name: course.course_name,
          course_description: course.course_description,
          start_date: new Date(course.start_date),
          end_date: new Date(course.end_date),
          price: course.price,
          currency: course.currency
        });
      });
    }

    const universityControl = this.courseForm.get('university');
    const countryControl = this.courseForm.get('country');
    const cityControl = this.courseForm.get('city');

    if (universityControl) {
      this.filteredUniversities = universityControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, this.universities))
      );
    }

    if (countryControl) {
      this.filteredCountries = countryControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, this.countries))
      );
    }

    if (cityControl) {
      this.filteredCities = cityControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, this.cities))
      );
    }
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const courseId = this.route.snapshot.paramMap.get('id');
      const courseData = {
        ...this.courseForm.value,
        start_date: this.formatDate(this.courseForm.value.start_date),
        end_date: this.formatDate(this.courseForm.value.end_date)
      };

      if (courseId) {
        this.courseService.updateCourse(courseId, courseData).subscribe(() => {
          this.router.navigate(['/course']);
        }, error => {
          console.error('Error updating course:', error);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/course']);
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
