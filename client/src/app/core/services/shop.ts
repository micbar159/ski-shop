import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../shared/models/products';
import { Pagination } from '../../shared/models/pagination';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ShopService {
  private baseUrl = 'https://localhost:7011/api/';
  private http = inject(HttpClient);

  getProducts(): Observable<Pagination<Product>> {
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products?pageSize=20');
  }
}
