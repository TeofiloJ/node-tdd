import { Injectable } from '@angular/core';
import { Autoregister, Service, Resource, DocumentCollection, DocumentResource } from 'ngx-jsonapi';
import { Book } from '../books/books.service';

export class Photo extends Resource {
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
export class PhotosService extends Service<Photo> {
    public resource = Photo;
    public type = 'photos';
}