import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TitleBarComponent } from './title-bar/title-bar';
import { LoadingComponent } from './loading/loading';
import { ScrollviewComponent } from './scrollview/scrollview';

@NgModule({
    declarations: [
        TitleBarComponent,
        LoadingComponent,
        ScrollviewComponent
    ],
    imports: [CommonModule],
    exports: [
        TitleBarComponent,
        LoadingComponent,
        ScrollviewComponent
    ]
})
export class ComponentsModule { }
