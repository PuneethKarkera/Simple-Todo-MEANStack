import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import List from 'src/app/models/list';
import Task from 'src/app/models/task';
import { TaskService } from 'src/app/task.service';
import {
  AuthenticationService,
  UserDetails,
} from 'src/app/authentication.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  details: UserDetails;
  lists: List[] = [];
  tasks: Task[] = [];
  listId: string;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.auth.profile().subscribe(
      (user) => {
        this.details = user;
      },
      (err) => {
        console.error(err);
      }
    );
    this.taskService
      .getLists()
      .subscribe((lists: List[]) => (this.lists = lists));
    this.route.params.subscribe((params: Params) => {
      this.listId = params.listId;
      if (!this.listId) return;
      this.taskService
        .getTask(this.listId)
        .subscribe((tasks: Task[]) => (this.tasks = tasks));
    });
  }

  onTaskClick(task: Task) {
    this.taskService
      .setCompleted(this.listId, task)
      .subscribe(() => (task.completed = !task.completed));
  }

  deleteTask(task: Task) {
    this.taskService
      .deleteTask(this.listId, task._id)
      .subscribe(
        (task: Task) =>
          (this.tasks = this.tasks.filter((t) => t._id !== task._id))
      );
  }

  deleteList(list: List) {
    this.taskService
      .deleteList(list._id)
      .subscribe(
        () => (this.lists = this.lists.filter((l) => l._id !== list._id))
      );

    this.router.navigate(['/lists']);
  }

  addTaskClick() {
    if (!this.listId) {
      alert('Please select a list to add tasks to');
      return;
    }

    this.router.navigate(['./new-task'], { relativeTo: this.route });
  }

  updateTask(event: any, task: Task) {
    task.title = event.target.value;
    this.taskService
      .updateTask(this.listId, task._id, task.title)
      .subscribe(
        (task: Task) =>
          (this.tasks = this.tasks.filter((t) => t._id == task._id))
      );
  }
}
