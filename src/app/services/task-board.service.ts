import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskBoardService {

  private apiUrl = 'http://localhost:5000/api/taskBoards';

  constructor(private http: HttpClient) {}

  createTaskBoard(taskBoard: any): Observable<any> {
    return this.http.post(this.apiUrl, taskBoard);
  }

  getTaskBoards(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTaskBoard(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateTaskBoard(id: string, taskBoard: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, taskBoard);
  }

  deleteTaskBoard(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateTask(taskId: string, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}`, task);
  }



}
