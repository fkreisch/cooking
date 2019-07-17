import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { RecipeDataService } from '../../_services/recipe-data.service';
import { UserService } from '../../_services/user.service';
import { Data, Comments } from '../../_interfaces/interface';
import { ActivatedRoute } from '@angular/router';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-comments',
  templateUrl: './recipe-comments.component.html',
  styleUrls: ['./recipe-comments.component.scss']
})
export class RecipeCommentsComponent implements OnInit {

  public selectedRecipeId: any;
  public displayedColumns = ['name'];
  public dataSource: MatTableDataSource<Comments>;
  public recipedata: Data[];
  public commentsOrig: Data['comments'];
  public comments: any;
  public commentsDisplay: Comments[] = [];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private recipeDataService: RecipeDataService,
    private userService: UserService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = '';
    this.selectedRecipeId = this.route.snapshot.paramMap.get('id');

    this.recipeDataService.getRecipeData(this.selectedRecipeId).subscribe(recipedata => {
      if (!recipedata) { return; }
      this.comments = recipedata.comments;
      this.comments.map(cc => {
        this.userService.getUser(cc.uid).pipe(take(1)).subscribe(us => {
          if (!us) { return; }
          const thingsObj = {} as Comments;

          thingsObj.name = us.name;
          thingsObj.photoUrl = us.photoURL;
          thingsObj.comment = cc.comment;
          thingsObj.uid = cc.uid;
          thingsObj.commentdate = cc.commentdate;

          this.commentsDisplay.push(thingsObj);
        });
      });
      this.dataSource = new MatTableDataSource(this.commentsDisplay);
      console.log('KINT', this.comments, this.commentsDisplay, this.dataSource);
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
