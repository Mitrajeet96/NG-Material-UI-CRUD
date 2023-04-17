import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  conditionList = ['Brand New', 'Used', 'Refurbished'];
  productForm!: FormGroup;
  actionBtn: string = 'Save';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) private editData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      condition: ['', Validators.required],
      price: ['', Validators.required],
      Comment: ['', Validators.required],
      date: ['', Validators.required],
    });
    if (this.editData) {
      this.actionBtn = 'Update';
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['condition'].setValue(this.editData.condition);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['Comment'].setValue(this.editData.Comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  addProduct() {
    //console.log(this.productForm.value);
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next: (res) => {
            alert('Product Added Succesfully');
            this.productForm.reset();
            this.dialogRef.close('Save');
          },
          error: (err) => {
            alert('Error While Adding The Product');
            console.warn(err);
          },
        });
      }
    } else {
        this.updateproduct();
      }

  }

  updateproduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Product updated successfully");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert('Errorupdatingproduct')
    }

    })
    console.log("Productform",this.productForm+this.editData);
  }

}


//   updateproduct() {
//     this.api.putProduct(this.productForm.value, this.editData.id)
//     .subscribe({
//       next: (res) => {
//         alert('Product updated Succesfully');
//         this.productForm.reset();
//         this.dialogRef.close('update');
//       },
//       error: (err) => {
//         alert('Error While Updating The Product');
//         //console.warn(err);
//       }
//     });
//   }
// }
