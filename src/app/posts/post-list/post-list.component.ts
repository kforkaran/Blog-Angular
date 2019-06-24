import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    private postsSubscription: Subscription;
    isLoading = false;
    totalPosts = 0;
    postPerPage = 5;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];

    constructor(public postsService: PostsService) { }

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postPerPage, this.currentPage);
        this.postsSubscription = this.postsService.getPostAddedListener()
            .subscribe((postData: { posts: Post[], postCount: number }) => {
                this.isLoading = false;
                this.posts = postData.posts;
                this.totalPosts = postData.postCount;
            });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.postPerPage = pageData.pageSize;
        this.currentPage = pageData.pageIndex + 1;
        this.postsService.getPosts(this.postPerPage, this.currentPage);
    }

    onDelete(id: string) {
        this.isLoading = true;
        this.postsService.deletePost(id).subscribe(() => {
            this.postsService.getPosts(this.postPerPage, this.currentPage);
        });
    }


    ngOnDestroy() {
        this.postsSubscription.unsubscribe();
    }
}
