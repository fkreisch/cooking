import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { RecipeService } from '../../_services/recipe.service';
import { LoginService } from '../../_services/login.service';
import { UserService } from '../../_services/user.service';
import { User } from '../../_interfaces/interface';
import { finalize, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-recipe-send',
  templateUrl: './recipe-send.component.html',
  styleUrls: ['./recipe-send.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})

export class RecipeSendComponent implements OnInit {

  FormGroup1: FormGroup;
  FormGroup2: FormGroup;
  FormGroup3: FormGroup;
  FormGroup4: FormGroup;
  FormGroup5: FormGroup;

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  private user: firebase.User;
  private loggedInUserData: User;
  public loggedInUserId: string;


  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private loginService: LoginService,
    private userService: UserService,
    private storage: AngularFireStorage,
    private ngZone: NgZone) { }

  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;
  triggerResize() {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.clearRecipeForm();
    this.loginService.getLoggedInUser().subscribe(user => {
      if (!user) { return; }
      this.user = user;
      this.loggedInUserId = user.uid;
      this.userService.getUser(this.loggedInUserId).subscribe(userdata => {
        if (!userdata) { return; }
        this.loggedInUserData = userdata;
        this.FormGroup5 = this.fb.group({
          share: [false, Validators.required],
          opened: 0,
          senderId: this.loggedInUserId,
          senderPhotoURL: this.loggedInUserData.photoURL,
          senderName: this.loggedInUserData.name,
          sendingDate: new Date()
        });
      });
    });
  }

  get stepForm() {
    return this.FormGroup3.get('steps') as FormArray;
  }
  get ingredientForm() {
    return this.FormGroup4.get('ingredients') as FormArray;
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
    this.FormGroup1 = this.fb.group({
      name: ['', Validators.required],
      short: ['', Validators.required],
      long: ['', Validators.required],
      picture: ['', Validators.required],
    });
    this.FormGroup2 = this.fb.group({
      serves: ['', Validators.required],
      servesfor: ['személyre', Validators.required],
      time: ['', Validators.required],
    });
    this.FormGroup3 = this.fb.group({
      steps: this.fb.array([]),
    });
    this.FormGroup4 = this.fb.group({
      ingredients: this.fb.array([]),
    });
    this.FormGroup5 = this.fb.group({
      share: [false, Validators.required],
    });
    this.addStep();
    this.addIngredient();
  }

  writeRecipeForm() {
    const sendForm = {
      ...this.FormGroup1.value,
      ...this.FormGroup2.value,
      ...this.FormGroup3.value,
      ...this.FormGroup4.value,
      ...this.FormGroup5.value
    };
    this.recipeService.addRecipe(sendForm);
    this.clearRecipeForm();
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'foods/' + Math.random().toString(36).substring(7) + '-' + event.target.files[0].name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          if (!url) { return; }
          this.downloadURL = url;
          this.FormGroup1.patchValue({
            picture: this.downloadURL
          });
          this.uploadPercent = null;
        });
      })
    )
      .subscribe();

  }
}
