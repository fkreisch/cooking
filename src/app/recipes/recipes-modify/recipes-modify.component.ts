import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { DemoId } from '../recipe-interface';

@Component({
  selector: 'app-recipes-modify',
  templateUrl: './recipes-modify.component.html',
  styleUrls: ['./recipes-modify.component.scss']
})

export class RecipesModifyComponent implements OnInit {

  public demo: DemoId[];

  myForm = new FormGroup({
    record: new FormControl(),
    details: new FormControl(),
    fields: new FormArray([])
  });

  constructor(private fb: FormBuilder, private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipeService.getDemo().subscribe(demo => {
      this.demo = demo;
    });
  }

  // --> Array field functions BEGIN
  get fieldForms() {
    return this.myForm.get('fields') as FormArray;
  }

  fillFields(item) {
    this.fieldForms.clear();
    item.fields.forEach(ill => {
      const field = this.fb.group(ill);
      ill = this.fieldForms.push(field);
    });
  }

  deleteFields(i) {
    this.fieldForms.removeAt(i);
  }

  addFields() {
    const field = this.fb.group({
      field1: [],
      field2: [],
      field3: [],
    });
    this.fieldForms.push(field);
  }
  // --> Array field functions END

  editForms(event, item) {
      this.myForm.patchValue(item);
      this.fillFields(item);
  }

  deleteForms(event, id) {
    this.recipeService.deleteDemo(id);
  }

  updateForms(event, id) {
    this.recipeService.updateDemo(this.myForm.value, id);
  }

}
