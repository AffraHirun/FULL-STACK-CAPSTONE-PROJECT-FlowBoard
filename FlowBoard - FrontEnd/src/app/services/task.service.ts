import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Employee {
  userId: string;
  userName: string;
  userPassword: string | null;
  userRole: string | null;
}

interface Card {
  taskId: string;
  taskName: string;
  priority: string;
  status: string;
  assignedEmployees: Employee;
  startDate: string;
  endDate: string;
}

interface Column {
  name: string;
  cards: Card[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/v2';  // Removed extra slash

  constructor(private http: HttpClient) {}

  // Fetch tasks for a specific column
  getColumnTasks(columnName: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/user/card/${columnName}`);
  }

  // addTaskToCard(cardId: string, task: Card): Observable<Card> {
  //   return this.http.post<Card>(`${this.apiUrl}/user/${cardId}/addTask`, task);
  // }
  addTaskToCard(cardId: string, newTask: Card): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/user/${cardId}/addTask`, newTask, { responseType: 'text' as 'json' });
  }
  // @PostMapping("/user/{cardId}/addTask")//----working----


  // Move a task from one column to another
  updateTaskColumn(fromColumnName: string, toColumnName: string, taskId: string): Observable<any> {
    const payload = {
      fromCardId: fromColumnName,
      toCardId: toColumnName,
      taskId: taskId
    };

    return this.http.post(`${this.apiUrl}/user/moveTask`, payload);
  }

  getUsers(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/user/nonAdminUsers`);
  }

  // Update a specific task's details
  // updateTask(card: Card): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/user/card/${card.taskId}`, card);
  // }
  updateTask(columnName: string, task: Card): Observable<any> {
    const url = `${this.apiUrl}/user/${columnName}/tasks`;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<any>(url, task, { headers });
  }

}
