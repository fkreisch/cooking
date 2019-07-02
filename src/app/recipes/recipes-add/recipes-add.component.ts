import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipes-add',
  templateUrl: './recipes-add.component.html',
  styleUrls: ['./recipes-add.component.scss']
})

export class RecipesAddComponent implements OnInit {

  public recipeForm: FormGroup;

  constructor(private fb: FormBuilder, private recipeService: RecipeService) { }

  ngOnInit() {
    this.clearRecipeForm();
  }

  get stepForm() {
    return this.recipeForm.get('steps') as FormArray;
  }
  get ingredientForm() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addStep() {
    const step = this.fb.group({
      step: [],
    });
    this.stepForm.push(step);
  }
  addIngredient() {
    const ingredient = this.fb.group({
      quanity: [],
      ingredient: [],
    });
    this.ingredientForm.push(ingredient);
  }

  deleteStep(i) {
    this.stepForm.removeAt(i);
  }
  deleteIngredient(i) {
    this.ingredientForm.removeAt(i);
  }

  clearRecipeForm() {
    this.recipeForm = this.fb.group({
      name: null,
      short: null,
      long: null,
      serves: null,
      servesfor: 'személyre',
      time: null,
      picture: null,
      steps: this.fb.array([]),
      ingredients: this.fb.array([]),
      like: null,
      opened: null,
      favourite: false,
    });
    this.addStep();
    this.addIngredient();
  }

  writeRecipeForm() {
    this.recipeService.addRecipe(this.recipeForm.value);
    this.clearRecipeForm();
  }
}
