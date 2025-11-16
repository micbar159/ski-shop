import { inject, Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/products';
import { ShopService } from '../../core/services/shop';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from "@angular/material/dialog"
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-shop',
  imports: [
    ProductItemComponent, 
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})

export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog)
  public products: Product[] = [];
  public selectedBrands: string[] = [];
  public selectedTypes: string[] = [];
  public selectedSort: string = 'name';
  public sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price Low-High', value: 'priceAsc'},
    {name: 'Price High-Low', value: 'priceDesc'}
  ];
  
  ngOnInit(): void {
    this.initializeShop();
  }

  initializeShop() {
    this.shopService.loadBrands();
    this.shopService.loadTypes();
    this.getProducts();
  }

  getProducts(){
      this.shopService.getProducts(this.selectedBrands, this.selectedTypes, this.selectedSort).subscribe({
      next: response => this.products = response.data,
      error: error => console.log(error)
    })
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.selectedBrands,
        selectedTypes: this.selectedTypes
      }
    });

    dialogRef.afterClosed().subscribe({
      next: results => {
        if (results)
        {
          this.selectedBrands = results.selectedBrands;
          this.selectedTypes = results.selectedTypes;
          this.getProducts();
        }
      }
    })
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption){
      this.selectedSort = selectedOption.value;
      this.getProducts();
    }    
  }
}
