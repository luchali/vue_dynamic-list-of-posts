<script>
import { createTodo, getTodos, updateTodo, deleteTodo } from "./api/todos";
import StatusFilter from "./StatusFilter.vue";
import TodoItem from "./TodoItem.vue";
import Message from "./Message.vue";

export default {
  components: {
    StatusFilter,
    TodoItem,
    Message,
  },
  data() {
    let todos = [];
    const jsonData = localStorage.getItem('todos') || '[]';
    
    try {
      todos = JSON.parse(jsonData);
    } catch (error) {
      console.error('Error parsing todos from localStorage:', error);
    }

    return {
      todos,
      title:'',
      status: 'all',
      errorMessage: '',
    };
  },
  computed: {
    activeTodos() {
      return this.todos.filter((todo) => !todo.completed);
    },
    completedTodos() {
      return this.todos.filter((todo) => todo.completed);
    },
    visibleTodos() {
      switch(this.status){
        case 'active':
          return this.activeTodos;
        case 'completed':
          return this.completedTodos;
        default:
          return this.todos;
      }
    }
  },
  // watch:{
  //   todos:{
  //     deep:true,
  //     handler(){
  //       localStorage.setItem('todos', JSON.stringify(this.todos));
  //     }
  //   }
  // },
  mounted(){
    getTodos()
    .then((data)=> { this.todos = data;})
    .catch(() => {
      this.errorMessage = 'Unable to load todos';
    });
  },
  methods:{
    handleSubmit(){
      if(this.title === ''){
        return;
      }
      createTodo(this.title)
      .then((data) => {
        this.todos= [...this.todos, data];
        this.title = '';
      });
    },
    updateTodo({ id, title, completed }){
      updateTodo({ id, title, completed })
      .then(( data ) => {
        this.todos = this.todos.map(
          todo => todo.id !== id ? todo : data,
        )
      })
    },
    deleteTodo(todoId) {
      deleteTodo(todoId)
        .then(() => {
          this.todos = this.todos.filter(todo => todo.id !== todoId);
        });
    },
  }
};
</script>

<template>
  <div class="todoapp">
    <h1 class="todoapp__title">todos</h1>

    <div class="todoapp__content">
      <header class="todoapp__header">
        <button
          type="button"
          class="todoapp__toggle-all"
          :class="{active: activeTodos.length === 0}"
          data-cy="ToggleAllButton"
        />

        <form @submit.prevent="handleSubmit">
          <input
            data-cy="NewTodoField"
            type="text"
            class="todoapp__new-todo"
            placeholder="What needs to be done?"
            v-model="title"
          />
        </form>
      </header>

      <TransitionGroup name="list" tag="section" class="todoapp__main" data-cy="TodoList">
        <TodoItem v-for="todo, index in visibleTodos"
          :key="todo.id"
          :todo="todo"
          @update="updateTodo"
          @delete="deleteTodo(todo.id)"
        />
      </TransitionGroup>

      <footer class="todoapp__footer" data-cy="Footer">
        <span class="todo-count" data-cy="TodosCounter"> {{ activeTodos.length }} items left </span>

        <StatusFilter 
          v-model="status" 
        />

        <button
          type="button"
          class="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          v-if="activeTodos.length > 0"
        >
          Clear completed
        </button>
      </footer>
    </div>

    <Message :text="errorMessage" class="is-danger"/>

    <!-- <div
        data-cy="ErrorNotification"
        class="notification is-danger is-light has-text-weight-normal"
      >
        <button data-cy="HideErrorButton" type="button" class="delete" />
        Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div> -->
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  max-height: 60px;
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0);
}
</style>
