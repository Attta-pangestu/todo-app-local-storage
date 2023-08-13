
// Array Penampung Todo List, direset saat load
const todos = [];

// key render
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-event' ; 
const STORAGE_KEY = 'TODO_APPS' ; 


// Capturing window load 

window.addEventListener('DOMContentLoaded', function() {

  
  // Menyamakan todos array dengan local storage
  if(isStorageExist() && (localStorage.getItem(STORAGE_KEY) !== null) ) {
   let todoLocal  = JSON.parse(localStorage.getItem(STORAGE_KEY) ) ; 
   console.log(todoLocal);
    for(let todo of todoLocal ) {
      todos.push(todo) ; 
    }
     document.dispatchEvent(new Event(RENDER_EVENT));
  }
  
  
  // Event Saat Mengklik tombol submit
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addTodo();
  });
});


function addTodo() {
  const jobTodo = document.getElementById('title').value;
  const timeTodo = document.getElementById('date').value;
  const idTodo = generateId();

  const todoObject = generateTodoObject(idTodo, jobTodo, timeTodo, false);

  // memasukkan object todo kedalam list array
  todos.push(todoObject);

   // memasukkan object todo kedalam local storage
  saveData(todoObject) ; 

  

  // Render List Object Todo 
  document.dispatchEvent(new Event(RENDER_EVENT));

}



function generateId() {
  // berbasis pada perbedaan waktu pengisian 
  return +new Date();
}

function generateTodoObject(id, task, timeStamp, isCompleted) {
  return {
    id,
    task,
    timeStamp,
    isCompleted
  }
}

document.addEventListener(RENDER_EVENT, function() {
  // Field Uncompleted List
  const uncompletedList = document.getElementById('todos');
  const completedList = document.getElementById('completed-todos');

  // Clearing HTML
  uncompletedList.innerHTML = '';
  completedList.innerHTML = '';

  // Create Element Todo List dari Array Object
  for (let todo of todos) {
    const todoBox = renderTodo(todo);
    if (todo.isCompleted) {
      completedList.append(todoBox);
    }
    else {
      uncompletedList.append(todoBox);
    }

  }

});


function renderTodo(todoItem) {
  const { id, task, timeStamp, isCompleted } = todoItem;


  const textTask = document.createElement('h2');
  textTask.innerText = task;

  const textTime = document.createElement('p');
  textTime.innerText = timeStamp;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTask, textTime);

  const todoContainer = document.createElement('div');
  todoContainer.classList.add('item', 'shadow');
  todoContainer.setAttribute('id', `todo-${id}`);
  todoContainer.append(textContainer);

  // Menambahkan element conditional untuk completed dan uncompleted list

  if (isCompleted) {
    // Merender tombol undo 
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function() {
      undoTaskFromCompleted(id);
      // render perubahan 
      document.dispatchEvent(new Event(RENDER_EVENT));
    })

    // Merender tombol hapus 
    const delButton = document.createElement('button');
    delButton.classList.add('trash-button');
    delButton.addEventListener('click', function() {
      removeTaskFromCompleted(id);
       // render perubahan 
    document.dispatchEvent(new Event(RENDER_EVENT));

    });
   
    // Memasukkan elemen ke kontainer Todo
    todoContainer.append(undoButton, delButton);
  }
  else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function() {
      addTaskCompleted(id);
      // render perubahan 
      document.dispatchEvent(new Event(RENDER_EVENT));
    });
    todoContainer.append(checkButton);
  }

  return todoContainer;


}

function findTodo(id) {
  for (let todo of todos) {
    if (todo.id === id) {
      return todo;
    }
  }
}


function undoTaskFromCompleted(id) {
  // Temukan todo objek dari array lalu ubah properti isComplete
  let todoUndo = findTodo(id);
  todoUndo.isCompleted = false;
  saveData() ; 
}


function addTaskCompleted(id) {
  // Temukan todo objek dari array lalu ubah properti isComplete
  let todoCompleted = findTodo(id);
  todoCompleted.isCompleted = true;
  saveData() ; 

}

function removeTaskFromCompleted(id) {
  todos.splice(findIndex(id), 1);
  saveData()
}

function findIndex(id) {
  for (let index in todos) {
    if (todos[index].id === id) {
      return index;
    }
  }
}


function saveData() {
  if(isStorageExist()) {
    // Merubah object ke string object
    const stringed = JSON.stringify(todos) ; 
    localStorage.setItem(STORAGE_KEY, stringed) ; 
    document.dispatchEvent(new Event(SAVED_EVENT)) ; 
  }
}



function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser tidak mendukung local storage') ; 
    return false ; 
  }
  return true ; 
}

document.addEventListener(SAVED_EVENT, function() {
  console.log(localStorage.getItem(STORAGE_KEY)) ;   
});
