import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { RecipeService } from '../../_services/recipe.service';
import { Comments } from '../../_interfaces/interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-comments',
  templateUrl: './recipe-comments.component.html',
  styleUrls: ['./recipe-comments.component.scss']
})
export class RecipeCommentsComponent implements OnInit {

  public selectedRecipeId: any;
  public displayedColumns = ['name'];
  public dataSource: MatTableDataSource<Comments>;

  public comments: Comments[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = '';
    this.selectedRecipeId = this.route.snapshot.paramMap.get('id');

    this.recipeService.getRecipe(this.selectedRecipeId).subscribe(recipe => {
      if (!recipe) { return; }
      this.comments = recipe.comments;
      this.dataSource = new MatTableDataSource(this.comments);
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
