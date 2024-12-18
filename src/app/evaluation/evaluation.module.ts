import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxGaugeModule } from "ngx-gauge";
import { EvaluationRoutingModule } from "./evaluation-routing.module";
import { MaterialModule } from "../material/material.module";

import { EvaluationResultsPageComponent } from "./evaluation-results/evaluation-results.component";
import { WebpageCodePageComponent } from "./webpage-code/webpage-code.component";
import { ElementResultPageComponent } from "./element-result/element-result.component";
import { PipesModule } from "../pipes/pipes.module";

@NgModule({
  declarations: [
    EvaluationResultsPageComponent,
    ElementResultPageComponent,
    WebpageCodePageComponent,
  ],
  imports: [
    CommonModule,
    EvaluationRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TranslateModule,
    NgxGaugeModule,
    PipesModule
  ],
})
export class EvaluationModule {}
