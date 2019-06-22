import { Post } from './post.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class PostsService {
    private posts: Post[] = [];
    private postAdded = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) { }

    getPosts() {
        this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath
                    };
                });
            }))
            .subscribe((posts) => {
                this.posts = posts;
                this.postAdded.next([...this.posts]);
            });
    }

    getPostAddedListener() {
        return this.postAdded.asObservable();
    }

    getPost(id: string) {
        return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http.post<{ post: Post }>('http://localhost:3000/api/posts', postData)
            .subscribe(responseData => {
                const post: Post = { id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath };
                this.posts.push(post);
                this.postAdded.next([...this.posts]);
                this.router.navigate(["/"]);
            });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof (image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image);
        } else {
            postData = { id: id, title: title, content: content, imagePath: image };
        }
        this.http.put('http://localhost:3000/api/posts/' + id, postData)
            .subscribe(() => this.router.navigate(["/"]));
    }

    deletePost(id: string) {
        this.http.delete('http://localhost:3000/api/posts/' + id)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== id);
                this.posts = updatedPosts;
                this.postAdded.next([...this.posts]);
            });
    }
}
