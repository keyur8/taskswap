import { Component, OnInit } from '@angular/core';
import { TaskBoardService } from '../../services/task-board.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  taskBoards: any = [];
  tasksBox1: any= [];
  tasksBox2: any = [];
  dropData: any;
  
  isEditing: boolean = false;
  editingTask: any = null;
  
  taskForm: FormGroup;
  optionSelected = 1;
  isActiveTask: boolean = false;

  constructor(private taskBoardService: TaskBoardService, 
    private userProfile:  AuthService,
    private fb: FormBuilder,
    private router: Router) {
  }

  currentUser:any
  userData:any

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('token');
    this.getCurrentUser();

    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      taskBox: ['', Validators.required],
      description: ['']
    });
    // this.getTaskBoards();
  }

  getCurrentUser(){
    this.userProfile.currentUser(this.currentUser)
    .subscribe(
      (response:any) => {
        this.userData = response
        this.getTaskBoards();
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }

  toggleCreateTask() {
    this.isActiveTask = !this.isActiveTask;
  }

  getTaskBoards(): void {
    this.taskBoardService.getTaskBoards().subscribe(
      (data) => {
        this.taskBoards = data;
        this.tasksBox1 = data.filter(task => task.box === 1 && task.userId === this.userData._id);
        this.tasksBox2 = data.filter(task => task.box === 2 && task.userId === this.userData._id);
      },
      (error) => {
        console.error('Error fetching task boards:', error);
      }
    );
  }

  allowDrop = (drag: any, drop: any) => {
    if (drop.id === "includeList" && this.optionSelected === 1) {
      return true;
    } else if (drop.id === "optionsList" && this.optionSelected === 2) {
      return true;
    } else {
      return false;
    }
  };

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      if (event.previousIndex !== event.currentIndex) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.dropData = event.container.data[event.currentIndex];
      const taskIndex = this.taskBoards.findIndex((task: any) => task._id === this.dropData._id);
      if (taskIndex > -1) {
        const task = this.taskBoards[taskIndex];
        task.box = event.container.id === 'optionsList' ? 1 : 2;
        this.taskBoardService.updateTask(task._id, task).subscribe(
          (updatedTask) => {
            console.log('Task updated:', updatedTask);
          },
          (error) => {
            console.error('Error updating task:', error);
          }
        );
      }
    }
  }

  createTaskBoard(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    if (this.taskForm.valid) {
      const taskBoard = {...this.taskForm.value, userId:this.userData._id };
      this.taskBoardService.createTaskBoard(taskBoard).subscribe(
        () => {
          this.getTaskBoards();
          this.isActiveTask = false;
          this.taskForm.reset();
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }

  editTask(task: any): void {
    const currentUser = this.userData
      this.isActiveTask = true;
      this.isEditing = true;
      this.editingTask = task;
      this.taskForm.patchValue({
        name: task.name,
        taskBox: task.box,
        description: task.description
      });
  }

  updateTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    if (this.editingTask && this.taskForm.valid) {
      const updatedTask = { ...this.editingTask, ...this.taskForm.value, userId:this.userData._id  };
      this.taskBoardService.updateTask(updatedTask._id, updatedTask).subscribe(
        () => {
          this.getTaskBoards();
          this.isEditing = false;
          this.editingTask = null;
          this.isActiveTask = false;
          this.taskForm.reset();
        },
        (error) => {
          console.error('Error updating task:', error);
        }
      );
    }
  }

  deleteTask(id: string): void {
    this.taskBoardService.deleteTaskBoard(id).subscribe(
      () => {
        this.getTaskBoards();
      },
      (error) => {
        console.error('Error deleting task board:', error);
      }
    );
  }
  
  clearForm(){
    this.taskForm.reset();
    this.isActiveTask = false;
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
