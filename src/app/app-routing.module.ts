import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportPageComponent } from './import-page/import-page.component';

const routes: Routes = [  { path: '', component: ImportPageComponent },
  { path: 'import', component: ImportPageComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
