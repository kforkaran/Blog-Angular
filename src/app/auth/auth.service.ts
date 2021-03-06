import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) { }

    createUser(userEmail: string, userPassword: string) {
        const authData: AuthData = { email: userEmail, password: userPassword };
        this.http.post<{ message: string }>('http://localhost:3000/api/user/signup', authData)
            .subscribe(response => {
                console.log(response.message);
            }, err => {
                console.log(err);
            });
    }

    login(userEmail: string, userPassword: string) {
        const authData: AuthData = { email: userEmail, password: userPassword };
        this.http.post('http://locahost:3000/api/user/login', authData)
            .subscribe(response => {
                console.log(response);
            }, err => {
                console.log(err);
            });
    }
}
