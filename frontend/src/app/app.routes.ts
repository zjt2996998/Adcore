import { Routes } from '@angular/router';
import { CourseCreateComponent } from './components/course-create/course-create.component';
import { CourseEditComponent } from './components/course-edit/course-edit.component';
import { CourseListComponent } from './components/course-list/course-list.component';

export const routes: Routes = [
  { path: 'course', component: CourseListComponent },
  { path: 'create', component: CourseCreateComponent },
  { path: 'edit/:id', component: CourseEditComponent }
];
