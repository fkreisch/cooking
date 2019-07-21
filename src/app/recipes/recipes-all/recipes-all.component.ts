import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { RecipeService } from '../../_services/recipe.service';
import { RecipeId } from '../../_interfaces/interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipes-all',
  templateUrl: './recipes-all.component.html',
  styleUrls: ['./recipes-all.component.scss']
})

export class RecipesAllComponent implements OnInit {

  displayedColumns = ['name'];
  public recipes: RecipeId[];
  dataSource: MatTableDataSource<RecipeId>;
  public loggedInUserId: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = '';
    this.recipeService.getSharedRecipes().subscribe(recipes => {
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

