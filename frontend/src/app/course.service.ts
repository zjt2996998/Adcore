import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from './models/course.model';  // Create this model based on your Course schema

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://127.0.0.1:8000/courses';

  constructor(private http: HttpClient) { }

  getCourses(search: string, page: number, pageSize: number): Observable<{ courses: Course[], totalCount: number }> {
    return this.http.get<{ courses: Course[], totalCount: number }>(`${this.baseUrl}?search=${search}&page=${page}&pageSize=${pageSize}`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, course);
  }

  updateCourse(courseId: string, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${courseId}`, course);
  }

  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${courseId}`);
  }
}
