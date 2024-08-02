import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CourseService } from '../../services/course.service';
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
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.scss'],
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
    HttpClientModule,
    MatSelectModule,
  ],
  providers: [
    CourseService
  ]
})
export class CourseCreateComponent implements OnInit {
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
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      university: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      course_name: ['', Validators.required],
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
      this.courseService.createCourse(this.courseForm.value).subscribe(() => {
        this.router.navigate(['course']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['course']);
  }
}
