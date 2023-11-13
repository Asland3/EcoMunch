import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from 'src/app/models/recipe.model';

const baseUrl = 'http://localhost:8080/api/recipe';

@Injectable({
  providedIn: 'root'
})
export class NodeJsExpressService {

  
  constructor(private http: HttpClient) { }

  getAll(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(baseUrl);
  }

  get(id: any): Observable<Recipe> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByName(name: any): Observable<Recipe[]> { 
    return this.http.get<Recipe[]>(`${baseUrl}?name=${name}`);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8080/api/user/login', { username, password });
  }
  
}
