import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Product } from '../model/Product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductSearchService } from '../service/product-search.service';


@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  displayedColumns: string[] = ['imageUrl', 'name', 'description', 'price'];
  loginForm: FormGroup;
  products: Product[];
  // Pagination
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageSize = 5;
  index: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productSearchService: ProductSearchService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      search: [null, Validators.required]
    });
   }

  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return  this.productSearchService.searchProducts(this.paginator.pageIndex * this.pageSize,
            this.pageSize, this.loginForm.value.search)
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          // FIXME: This data should be coming from backend
          this.resultsLength = 6;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.products = data;
      });
   }

  public submit() {
    if (!this.loginForm.valid)
      return;
    this.paginator.pageIndex = 0;
    this.ngAfterViewInit();
  }

  indexing() {
    this.productSearchService.indexProducts().subscribe(response =>{
      if (response['status'] == 204)
        this.index = true;
    });
  }
}
