import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {

  url = "http://localhost:8080/v1/products/search";
  productIndexUrl = "http://localhost:8080/v1/product/index";

  constructor(private httpClient: HttpClient) { }

  public searchProducts(offset: number, limit: number, q?: string): Observable<any> {
    if (q) {
      return this.httpClient.get(`${this.url}?q=${q}&offset=${offset}&limit=${limit}`);
    }
    return this.httpClient.get(`${this.url}?offset=${offset}&limit=${limit}`);
  };

  public indexProducts(): Observable<any> {
    return this.httpClient.get("http://localhost:8080/v1/product/index", { observe: 'response' });
  };
}
