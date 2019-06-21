import { Post } from './post.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class PostsService {
    private posts: Post[] = [];
    private postAdded = new Subject<Post[]>();

    constructor(private http: HttpClient) { }

    getPosts() {
        this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
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

    addPost(title: string, content: string) {
        const post: Post = { id: null, title: title, content: content };
        this.http.post<{ postId: string }>('http://localhost:3000/api/posts', post)
            .subscribe(responseData => {
                post.id = responseData.postId;
                this.posts.push(post);
                this.postAdded.next([...this.posts]);
            });
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
