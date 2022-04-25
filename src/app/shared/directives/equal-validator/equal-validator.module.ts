import { NgModule } from "@angular/core";
import { EqualValidator } from "./equal-validator.directive";

@NgModule({
    exports: [EqualValidator],
    declarations: [EqualValidator]
}) export class EqualValidatorModule {}