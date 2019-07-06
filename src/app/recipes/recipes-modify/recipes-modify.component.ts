import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { RecipeId } from '../recipe-interface';

@Component({
  selector: 'app-recipes-modify',
  templateUrl: './recipes-modify.component.html',
  styleUrls: ['./recipes-modify.component.scss']
})

export class RecipesModifyComponent implements OnInit {

  public recipes: RecipeId[];

  recipeForm = new FormGroup({
    name: new FormControl(),
    short: new FormControl(),
    long: new FormControl(),
    serves: new FormControl(),
    servesfor: new FormControl(),
    time: new FormControl(),
    picture: new FormControl(),
    steps: new FormArray([]),
    ingredients: new FormArray([])
  });

  constructor(private fb: FormBuilder, private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
    });
  }

  // --> Array field functions BEGIN
  get stepForm() {
    return this.recipeForm.get('steps') as FormArray;
  }
  get ingredientForm() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  fillSteps(item) {
    this.stepForm.clear();
    item.steps.forEach(ill => {
      const step = this.fb.group(ill);
      ill = this.stepForm.push(step);
    });
  }
  fillIngredients(item) {
    this.ingredientForm.clear();
    item.ingredients.forEach(ill => {
      const ingredient = this.fb.group(ill);
      ill = this.ingredientForm.push(ingredient);
    });
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
      ingred: [],
    });
    this.ingredientForm.push(ingredient);
  }

  deleteStep(i) {
    this.stepForm.removeAt(i);
  }
  deleteIngredient(i) {
    this.ingredientForm.removeAt(i);
  }

  // --> Array field functions END

  editRecipe(event, item) {
      this.recipeForm.patchValue(item);
      this.fillSteps(item);
      this.fillIngredients(item);
  }

  deleteForms(event, item) {
    this.recipeService.deleteRecipe(item.id);
  }

  updateForms(event, item) {
    this.recipeService.updateRecipe(item.id, this.recipeForm.value);
    console.log(item.id);
  }
}
