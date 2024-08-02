import { Component, inject, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

export interface TodoItem {
  id?: string;
  isChecked: boolean;
  todoItem: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private readonly afs = inject(AngularFirestore);

  private todoItemCollection: AngularFirestoreCollection<TodoItem> =
    this.afs.collection('TodoItems');
  private todoItem!: AngularFirestoreDocument<TodoItem>;
  _todoItem!: Observable<TodoItem>;
  todoItems$: Observable<TodoItem[]> = new Observable<TodoItem[]>();

  constructor() {
    this.todoItem = this.afs.doc<TodoItem>('item/1');
  }

  ngOnInit(): void {
    this.getAllTodos();

    // study code

   
  }

  inputTask: string = '';

  addTodo() {
    const taskPayload = {
      todoItem: this.inputTask,
      isChecked: false,
    };

    this.todoItemCollection.add(taskPayload);
    this.inputTask = '';
  }

  updateTodo(item: TodoItem) {
    item.isChecked = !item.isChecked;
    this.todoItem = this.afs.doc<TodoItem>(`TodoItems/${item.id}`);
    this.todoItem.update(item);
  }

  deleteTodo(item: TodoItem) {
    this.todoItem = this.afs.doc<TodoItem>(`TodoItems/${item.id}`);
    this.todoItem.delete();
  }

  getAllTodos() {
    this.todoItems$ = this.todoItemCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as TodoItem;
          const id = a.payload.doc.id;

          return { id, ...data };
        })
      )
    );
  }

  // Study Code

  
}
