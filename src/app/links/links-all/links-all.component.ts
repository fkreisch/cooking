import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { RecipeDataService } from '../../_services/recipe-data.service';
import { Data } from '../../_interfaces/interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-links-all',
  templateUrl: './links-all.component.html',
  styleUrls: ['./links-all.component.scss']
})
export class LinksAllComponent implements OnInit {

  public selectedRecipeId: any;
  public displayedColumns = ['name'];
  public dataSource: MatTableDataSource<Data['comments']>;
  public recipedata: Data['comments'];
  public comments: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private recipeDataService: RecipeDataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.selectedRecipeId = this.route.snapshot.paramMap.get('id');
    this.recipeDataService.getRecipeData(this.selectedRecipeId).subscribe(recipedata => {
      this.comments = recipedata.comments;
      if (this.comments) {
        this.dataSource = new MatTableDataSource(this.comments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}

