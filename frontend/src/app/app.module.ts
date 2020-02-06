import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgxJsonapiModule } from 'ngx-jsonapi';

import { AppComponent } from './app.component';
import { AuthorsService } from './authors/authors.service';
import { BooksService } from './books/books.service';
import { PhotosService } from './photos/photos.service';
import { AuthorsComponent } from './authors/components/authors.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/authors',
        pathMatch: 'full'
    },
    {
        path: 'authors',
        component: AuthorsComponent
    },
    // {
    //     path: 'books',
    //     loadChildren: './books/books.module#BooksModule'
    // }
];

@NgModule({
    providers: [AuthorsService, BooksService, PhotosService],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { useHash: true }),
        NgxJsonapiModule.forRoot({
            url: '//jsonapiplayground.reyesoft.com/v2/'
        })
    ],
    declarations: [AppComponent,AuthorsComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}