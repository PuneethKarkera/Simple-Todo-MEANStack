import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import List from 'src/app/models/list';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss'],
})
export class NewListComponent implements OnInit {
  listId: string;
  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(
      (params: Params) => (this.listId = params.listId)
    );
  }

  ngOnInit(): void {}

  addList(value: string) {
    this.taskService
      .createList(value)
      .subscribe((list: List) =>
        this.router.navigate([`/lists/${list._id}/new-task`])
      );
  }
}
