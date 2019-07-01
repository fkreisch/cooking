import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { DemoId } from '../recipe-interface';

@Component({
  selector: 'app-recipes-add',
  templateUrl: './recipes-add.component.html',
  styleUrls: ['./recipes-add.component.scss']
})
export class RecipesAddComponent implements OnInit {

  private myForm: FormGroup;
  public demo: DemoId[];

  constructor(private fb: FormBuilder, private recipeService: RecipeService) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      record: '',
      details: '',
      fields: this.fb.array([])
    });
    this.addFields();
  }

  get fieldForms() {
    return this.myForm.get('fields') as FormArray;
  }

  addFields() {
    const field = this.fb.group({
      field1: [],
      field2: [],
      field3: [],
    });
    this.fieldForms.push(field);
  }

  deleteFields(i) {
    this.fieldForms.removeAt(i);
  }

  writeForms() {
    this.recipeService.addDemo(this.myForm.value);
  }
}
