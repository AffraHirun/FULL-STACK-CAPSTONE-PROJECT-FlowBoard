import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';

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

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() card: Card | null = null;
  @Output() taskUpdated = new EventEmitter<Card>();

  isEditing: boolean = false;
  users: Employee[] = [];
  isAdmin: boolean = false;

  constructor(private taskService: TaskService, private authService: AuthService) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.taskService.getUsers().subscribe(
      (users: Employee[]) => this.users = users,
      error => console.error('Failed to fetch users:', error)
    );
  }

  get taskName() {
    return this.card ? this.card.taskName : '';
  }

  set taskName(value: string) {
    if (this.card) this.card.taskName = value;
  }

  get priority() {
    return this.card ? this.card.priority : '';
  }

  set priority(value: string) {
    if (this.card) this.card.priority = value;
  }

  get startDate() {
    return this.card ? this.card.startDate : '';
  }

  set startDate(value: string) {
    if (this.card) this.card.startDate = value;
  }

  get endDate() {
    return this.card ? this.card.endDate : '';
  }

  set endDate(value: string) {
    if (this.card) this.card.endDate = value;
  }

  get assignedEmployee() {
    return this.card ? this.card.assignedEmployees : { userId: '', userName: '', userPassword: null, userRole: null };
  }

  set assignedEmployee(employee: Employee) {
    if (this.card) this.card.assignedEmployees = employee;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
  getPriorityTooltip(): string {
    switch (this.priority) {
      case 'HIGH':
        return 'High Priority';
      case 'MEDIUM':
        return 'Medium Priority';
      case 'LOW':
        return 'Low Priority';
      default:
        return 'No Priority Set';
    }
  }
  
  saveTask() {
    if (this.card) {
      this.isEditing = false;
      const updatedTask: Card = {
        ...this.card,
        taskName: this.taskName,
        priority: this.priority,
        startDate: this.startDate,
        endDate: this.endDate,
        assignedEmployees: this.assignedEmployee // Pass the complete employee object
      };
      this.taskUpdated.emit(updatedTask);
    }
  }

  deleteTask() {
    alert('Task deleted');
  }

  getPriorityClass(): string {
    switch (this.priority) {
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      case 'LOW':
        return 'priority-low';
      default:
        return '';
    }
  }
}
