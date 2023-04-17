import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MaterialReactiveForms';
  displayedColumns: string[] = ['productName', 'price', 'condition', 'category', 'date','action'];
  dataSource!: MatTableDataSource<any>; //Why !?

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog,private api:ApiService) {}
  ngOnInit() {
    this.getAllProducts()
  }

  openDialog() {
    this.dialog.open(DialogComponent,{
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val=='save'){
        this.getAllProducts()
      }
    })
    }

    getAllProducts(){
     this.api.getProducts().subscribe({
      next: (res) => {
        //console.log(res);
        this.dataSource=new MatTableDataSource(res);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
      },error: (err) => {
        alert("Error while getting Data");
        console.warn(err);
     }
    })}

    editProduct(row:any){
      this.dialog.open(DialogComponent,{
        width: '30%',
        data:row
      }).afterClosed().subscribe(val=>{
        if(val=='update'){
          this.getAllProducts()
        }
      })
    }

    deleteProduct(id:number){
      this.api.deleteProduct(id).subscribe({
        next: (res) => {
          alert("Product deleted Successfully");
          this.getAllProducts()
        },
        error: (err) => {
          alert("Error while Deleting Data");
          console.warn(err);
        }
      })
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }







  }

