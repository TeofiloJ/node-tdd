import { Injectable } from '@angular/core';
import { Autoregister, Service, Resource, DocumentCollection, DocumentResource } from 'ngx-jsonapi';
import { Photo } from '../photos/photos.service';

export class Book extends Resource {
    public attributes = {
        name: 'default name',
        date_of_birth: ''
    };

    public relationships = {
        books: new DocumentCollection<Book>(),
        photo: new DocumentResource<Photo>()
    };
}

@Injectable()
@Autoregister()
export class BooksService extends Service<Book> {
    public resource = Book;
    public type = 'books';
}