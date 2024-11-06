import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  columns: Column[] = [
    { name: 'To_Do', cards: [] },
    { name: 'In_Progress', cards: [] },
    { name: 'Done', cards: [] }
  ];

  showTaskForm: boolean = false;
  minDate: string = new Date().toISOString().split('T')[0]; // Set min date to today's date

  newTask: Card = {
    taskId: '',
    taskName: '',
    priority: 'MEDIUM',
    status: 'To_Do',
    assignedEmployees: { userId: '', userName: '', userPassword: null, userRole: null },
    startDate: this.minDate,
    endDate: ''
  };

  users: Employee[] = [];
  isAdmin: boolean = false;
  selectedUserId: string = '';
  errorMessage: string = '';

  constructor(private taskService: TaskService, private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();


    this.columns.forEach(column => {
      this.taskService.getColumnTasks(column.name).subscribe(
        (tasks: Card[]) => {
          const columnIndex = this.columns.findIndex(c => c.name.trim() === column.name.trim());
          if (columnIndex !== -1) {
            this.columns[columnIndex].cards = tasks;
          }
        },
        error => {
          console.error(`Failed to load tasks for column ${column.name}`, error);
        }
      );
    });

    this.taskService.getUsers().subscribe(
      (users: Employee[]) => {
        this.users = users;
      },
      error => {
        console.error('Failed to load users:', error);
      }
    );
  }

  showAddTaskForm() {
    this.showTaskForm = true;
  }

  onUserChange(userId: string) {
    this.selectedUserId = userId;
    const selectedUser = this.users.find(user => user.userId === userId);
    if (selectedUser) {
      this.newTask.assignedEmployees = selectedUser;
    } else {
      this.newTask.assignedEmployees = { userId: '', userName: '', userPassword: null, userRole: null };
    }
  }

  // saveTask() {
  //   console.log(this.newTask);
  //   if (this.newTask.taskName && this.newTask.priority && this.newTask.endDate && this.newTask.assignedEmployees.userId) {
  //     console.log("in save task");
  //     const cardId = this.newTask.status;
  
  //     this.taskService.addTaskToCard(cardId, this.newTask).subscribe(
  //       response => {
  //         console.log('Task added response:', response); // Handle plain text response
  //         const columnIndex = this.columns.findIndex(c => c.name === this.newTask.status);
  //         if (columnIndex !== -1) {
  //           this.columns[columnIndex].cards.push({ ...this.newTask });
  //         }
  //         this.showTaskForm = false;
  //         this.resetTaskForm();
  //       },
  //       error => {
  //         console.error('Failed to save task:', error);
  //       }
  //     );
  //   }
  // }

  saveTask() {
    this.errorMessage = ''; // Reset error message
    if (this.newTask.taskName && this.newTask.priority && this.newTask.endDate && this.selectedUserId) {
      const cardId = this.newTask.status;

      this.taskService.addTaskToCard(cardId, this.newTask).subscribe(
        response => {
          console.log('Task added response:', response); // Handle plain text response
          const columnIndex = this.columns.findIndex(c => c.name === this.newTask.status);
          if (columnIndex !== -1) {
            this.columns[columnIndex].cards.push({ ...this.newTask });
          }
          this.showTaskForm = false;
          this.resetTaskForm();
        },
        error => {
          console.error('Failed to save task:', error);
          this.snackBar.open('Failed to save task. Please try again.', 'Close', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['error-snackbar']
          });
        }
      );
    } else {
      this.errorMessage = 'Please fill all the fields before saving.'; // Set error message
    }
  }


  cancel() {
    this.showTaskForm = false;
    this.resetTaskForm();
  }

  resetTaskForm() {
    this.newTask = {
      taskId: '',
      taskName: '',
      priority: 'MEDIUM',
      status: 'To_Do',
      assignedEmployees: { userId: '', userName: '', userPassword: null, userRole: null },
      startDate: this.minDate,
      endDate: ''
    };
    this.selectedUserId = '';
  }

  // onDrop(event: CdkDragDrop<Card[], Card[]>) {
  //   if (this.isAdmin) return;
  //   const sourceColumn = this.columns.find(column => column.cards === event.previousContainer.data);
  //   const destinationColumn = this.columns.find(column => column.cards === event.container.data);

  //   if (!sourceColumn || !destinationColumn) return;

  //   const movedCard = event.item.data as Card;
  //   const taskId = movedCard.taskId;

  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

  //     // Update the task in the backend
  //     this.taskService.updateTaskColumn(sourceColumn.name, destinationColumn.name, taskId).subscribe(
  //       response => {
  //         console.log('Task updated successfully:', response);
  //       },
  //       error => {
  //         console.error('Failed to update task:', error);
  //       }
  //     );
  //   }
  // }
  onDrop(event: CdkDragDrop<Card[], Card[]>) {
    if (this.isAdmin) return;

    const sourceColumn = this.columns.find(column => column.cards === event.previousContainer.data);
    const destinationColumn = this.columns.find(column => column.cards === event.container.data);

    if (!sourceColumn || !destinationColumn) return;

    const movedCard = event.item.data as Card;
    const taskId = movedCard.taskId;

    // Make a copy of the columns before the operation
    const originalSourceCards = [...sourceColumn.cards];
    const originalDestinationCards = [...destinationColumn.cards];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      // Update the task in the backend
    this.taskService.updateTaskColumn(sourceColumn.name, destinationColumn.name, taskId).subscribe(
      response => {
        console.log('Task updated successfully:', response);
        // Handle success if needed
      },
      error => {
        console.error('Failed to update task:', error);

        // Rollback to original state
        sourceColumn.cards = originalSourceCards;
        destinationColumn.cards = originalDestinationCards;

        // Show a snackbar with error message
        this.snackBar.open('Failed to move task. In Progress can only have 3 tasks max.', 'Close', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar']
        });
      }
    );
    }

    
  }

  onTaskUpdated(card: Card) {
    console.log('Task updated:', card);
    
    // Assuming card.status contains the column name
    this.taskService.updateTask(card.status, card).subscribe(
      response => {
        console.log('Task saved successfully:', response);
      },
      error => {
        console.error('Failed to save task:', error);
      }
    );
  }

}