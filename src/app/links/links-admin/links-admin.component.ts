import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { RecipeService } from '../../_services/recipe.service';
import { RecipeId } from '../../_interfaces/interface';

@Component({
  selector: 'app-links-admin',
  templateUrl: './links-admin.component.html',
  styleUrls: ['./links-admin.component.scss']
})
export class LinksAdminComponent implements OnInit {
  displayedColumns = ['name'];
  private recipes: RecipeId[];
  dataSource: MatTableDataSource<RecipeId>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
      this.dataSource = new MatTableDataSource(recipes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
