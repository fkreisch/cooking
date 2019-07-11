import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgxHmCarouselBreakPointUp } from 'ngx-hm-carousel';
import { RecipeService } from '../recipes/recipe.service';
import { RecipeId, RecipeDisplay } from '../recipes/recipe-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private recipes: RecipeId[];

  currentIndex = 0;
  speed = 5000;
  infinite = true;
  direction = 'right';
  directionToggle = true;
  autoplay = true;
  public avatars: any;

  breakpoint: NgxHmCarouselBreakPointUp[] = [
    {
      width: 500,
      number: 1
    },
    {
      width: 800,
      number: 2
    },
    {
      width: 1024,
      number: 4
    },
  ];

  constructor(private recipeService: RecipeService, private router: Router) { }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.avatars = recipes;
    });
  }

  click(i) {
    this.router.navigate([`recipe/${i}`]);
  }
}