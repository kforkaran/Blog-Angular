import { Post } from './post.model';
import { Subject } from 'rxjs';

export class PostsService {
    private posts: Post[] = [];
    private postAdded = new Subject<Post[]>();

    getPosts() {
        return [...this.posts];
    }

    getPostAddedListener() {
        return this.postAdded.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = { title: title, content: content };
        this.posts.push(post);
        this.postAdded.next([...this.posts]);
    }
}
