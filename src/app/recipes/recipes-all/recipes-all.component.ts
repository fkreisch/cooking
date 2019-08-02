import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { RecipeService } from '../../_services/recipe.service';
import { LoginService } from '../../_services/login.service';
import { RecipeId } from '../../_interfaces/interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipes-all',
  templateUrl: './recipes-all.component.html',
  styleUrls: ['./recipes-all.component.scss']
})

export class RecipesAllComponent implements OnInit {

  public displayedColumns = ['name'];
  public recipes: RecipeId[];
  public dataSource: MatTableDataSource<RecipeId>;
  private user: firebase.User;
  public loggedInUserId: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private loginService: LoginService) {
  }

  ngOnInit() {
    const pageFilter = this.route.snapshot.paramMap.get('pagefilter');
    console.log(pageFilter);
    this.paginator._intl.itemsPerPageLabel = '';
    if (pageFilter === 'myrecipes') {
      this.loginService.getLoggedInUser().subscribe(user => {
        this.user = user;
        if (!this.user) { return; }
        this.loggedInUserId = user.uid;
        this.recipeService.getMyRecipes(this.loggedInUserId).subscribe(recipes => {
          this.recipes = recipes;
          if (!this.recipes) { return; }
          this.dataSource = new MatTableDataSource(recipes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      });
    } else {
      this.recipeService.getSharedRecipes().subscribe(recipes => {
        this.recipes = recipes;
        if (!this.recipes) { return; }
        this.dataSource = new MatTableDataSource(recipes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}

