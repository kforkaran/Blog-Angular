import { Post } from './post.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class PostsService {
    private posts: Post[] = [];
    private postAdded = new Subject<{ posts: Post[], postCount: number }>();

    constructor(private http: HttpClient, private router: Router) { }

    getPosts(postPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
        this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
            .pipe(map((postData) => {
                return {
                    posts: postData.posts.map(post => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath
                        };
                    }),
                    maxPosts: postData.maxPosts
                };
            }))
            .subscribe((postsData) => {
                this.posts = postsData.posts;
                this.postAdded.next({ posts: [...this.posts], postCount: postsData.maxPosts });
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
        return this.http.delete('http://localhost:3000/api/posts/' + id);
    }
}
