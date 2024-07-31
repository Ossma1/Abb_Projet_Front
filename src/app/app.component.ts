import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
 export class AppComponent {
//   title = 'AbbFront';
//   activeItem: MenuItem| undefined;
//   items: MenuItem[]=  [
//     {icon:"pi pi-file-import", label: 'Importe file'},
//     {icon:"pi pi-history", label: 'Historique du chargement' },
// ]; ;
// constructor(private router: Router){
// }
// ngOnInit() {
//   this.activeItem = this.items[0] ;
// }
// onActiveItemChange(event: MenuItem) {
//   this.activeItem = event;
//   let link;
// if (this.activeItem?.label?.toLowerCase() === "historique du chargement") {
//  link = 'history'
// }else{
// link = "import"
// }
//   if (link) {
//     this.router.navigate(['/'+link]);
//   }
// }
}
