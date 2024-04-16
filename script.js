document.addEventListener('DOMContentLoaded', function() {
  var todoForm = document.getElementById('todo-form');
  var todoInput = document.getElementById('todo-input');
  var todoInput1 = document.getElementById('todo-input_1');
  var todoInput2 = document.getElementById('todo-input_2');
  var todoInput3 = document.getElementById('todo-input_3');
  var todoList = document.getElementById('todo-list');
  var totalTasks = document.getElementById('total-tasks');
  
  // Loading tasks from local storage
  var savedTasks = JSON.parse(localStorage.getItem('tasks')) || {};
  Object.keys(savedTasks).forEach(function(date) {
    addTaskGroup(date, savedTasks[date]);
  });

  todoForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    if (todoInput.value.trim() !== '' && todoInput1.value.trim() !== '' && todoInput2.value.trim() !== '' && todoInput3.value.trim() !== '') {
      var currentDate = new Date();
      var taskDate = currentDate.toDateString();
      var taskTime = getCurrentTime();
      var taskContainer = document.getElementById(taskDate);
      
      if (!taskContainer) {
        taskContainer = createTaskContainer(taskDate);
        todoList.appendChild(taskContainer);
      }
      
      addTask(taskContainer, todoInput.value.trim(), todoInput1.value.trim(), todoInput2.value, todoInput3.value, taskTime);
      todoInput.value = '';
      todoInput1.value = '';
      todoInput2.value = '';
      todoInput3.value = '';
      saveTasks(); 
      
      updateTotalTasks();
    }
  });

  function addTaskGroup(taskDate, tasks) {
    var taskContainer = createTaskContainer(taskDate);
    tasks.forEach(function(task) {
      addTask(taskContainer, task.content, task.assignee, task.dueDate, task.description, task.time, task.completed);
    });
    todoList.appendChild(taskContainer);
  }

  function addTask(taskContainer, taskContent, assignee, dueDate, description, taskTime, completed) {

    /*if (taskContent === "" || assignee === "assignee3" || dueDate === "" || description === "") {
      alert("Please enter all the details before adding the task.");
      return false; 
    } */
    var newTodo = document.createElement('li');
    newTodo.classList.add('newTodo');

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox_input');
    checkbox.checked = completed || false; // Set checked state from saved data
    checkbox.addEventListener('change', function() {
      if (checkbox.checked) {
        newTodo.classList.add('completed');
      } else {
        newTodo.classList.remove('completed');
      }
      saveTasks();
    });
    newTodo.appendChild(checkbox);

   
    var taskText = document.createElement('span');
    var t1=taskText;
    taskText.classList.add('task-text');
    var truncatedTaskContent = taskContent.length >= 30 ? taskContent.substring(0, 30) + '...' : taskContent;
    taskText.textContent = truncatedTaskContent ; 
    newTodo.appendChild(taskText);

    var assigneeSpan = document.createElement('span');
    assigneeSpan.textContent =  assignee ;
    assigneeSpan.classList.add('assigneeSpan'); 
    newTodo.appendChild(assigneeSpan);

    var dueDateSpan = document.createElement('span');
    dueDateSpan.textContent =  dueDate ; 
    dueDateSpan.classList.add('dueDateSpan'); 
    newTodo.appendChild(dueDateSpan);

    var descriptionSpan = document.createElement('span');
    descriptionSpan.textContent =  description ; 
    descriptionSpan.classList.add('descriptionSpan'); 
    newTodo.appendChild(descriptionSpan);

    var timeSpan = document.createElement('span');
    timeSpan.textContent = '[' + taskTime + '] '; 
    timeSpan.classList.add('task-time');
    newTodo.appendChild(timeSpan);

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function() {
      taskContainer.removeChild(newTodo);
      updateTotalTasks();
      saveTasks();
    });

    var updateButton = document.createElement('button'); 
    updateButton.textContent = 'Edit';
    updateButton.classList.add('update-button');
    updateButton.addEventListener('click', function() {
      var newContent = prompt('Enter the new task, assignee, due date, and description separated by commas', taskContent.trim() + ', ' + assignee + ', ' + dueDate + ', ' + description);
      if (newContent !== null) {
        var parts = newContent.split(',').map(function(item) {
          return item.trim();
        });
        if (parts.length === 4) {
          var newTaskContent = parts[0];
          var newAssignee = parts[1];
          var newDueDate = parts[2];
          var newDescription = parts[3];
          
          var newTime = getCurrentTime();
          taskText.textContent = newTaskContent; 
          var selectOptions = Array.from(todoInput1.options);
          console.log(selectOptions);
          for (var i = 0; i < selectOptions.length; i++) {
            if (selectOptions[i].text === newAssignee) {
              assigneeSpan.textContent = newAssignee; 
              break;
            }
            if(i==selectOptions.length){
              alert("Person is not in the list");
              break;
            }
          }
          dueDateSpan.textContent = newDueDate; 
          descriptionSpan.textContent = newDescription; 
          timeSpan.textContent = '[' + newTime + '] '; 
          saveTasks();
        } else {
          alert('Please enter all the details separated by commas.');
        }
      }
    });

    newTodo.appendChild(deleteButton);
    newTodo.appendChild(updateButton);
    if (!taskContainer.querySelector('.heading-container')) {
      var headingDiv = document.createElement('div');
  
      headingDiv.classList.add('heading-container');
  
      var taskHeading = document.createElement('span');
      taskHeading.textContent = 'Task Name';
      taskHeading.classList.add('taskHeading');
      headingDiv.appendChild(taskHeading);
  
      var assigneeHeading = document.createElement('span');
      assigneeHeading.textContent = 'Assignee';
      assigneeHeading.classList.add('assigneeHeading');
      headingDiv.appendChild(assigneeHeading);
  
      var dueDateHeading = document.createElement('span');
      dueDateHeading.textContent = 'Due Date';
      dueDateHeading.classList.add('dueDateHeading');
      headingDiv.appendChild(dueDateHeading);
  
      var descriptionHeading = document.createElement('span');
      descriptionHeading.textContent = 'Description';
      descriptionHeading.classList.add('descriptionHeading');
      headingDiv.appendChild(descriptionHeading);
  
      taskContainer.appendChild(headingDiv);
  }
  
    taskContainer.appendChild(newTodo);
    updateTotalTasks();
  }

  function createTaskContainer(taskDate) {
    var container = document.createElement('div');
    container.classList.add('task-container'); // Add task-container class
    container.setAttribute('id', taskDate);
    
    var dateHeader = document.createElement('h2');
    dateHeader.textContent = taskDate;
    container.appendChild(dateHeader);

    // Add delete button for task container
    var deleteContainerButton = document.createElement('button');
    deleteContainerButton.innerHTML = 'Delete'; // Use Font Awesome trash icon
    deleteContainerButton.classList.add('delete-container-button');
    deleteContainerButton.addEventListener('click', function() {
      container.parentNode.removeChild(container); // Remove the task container
      updateTotalTasks();
      saveTasks();
    });
    
    todoList.appendChild(deleteContainerButton);
    
    return container;
  }

  var isRefreshing = true; 

  function updateTotalTasks() {
    if (isRefreshing ) {
      totalTasks.textContent = todoList.querySelectorAll('li').length;
    } else {
      var totalCount = 0;
      Object.keys(savedTasks).forEach(function(date) {
        savedTasks[date].forEach(function(task) {
          totalCount++;
        });
      });
      totalTasks.textContent = totalCount;
      isRefreshing = false; 
    }
  }
  
  function saveTasks() {
    var taskContainers = todoList.querySelectorAll('.task-container'); // Select task containers
    var tasks = {};
    taskContainers.forEach(function(taskContainer) {
      var dateHeader = taskContainer.querySelector('h2');
      var date = dateHeader.textContent;
      var taskElements = taskContainer.querySelectorAll('.newTodo');
      tasks[date] = [];
      taskElements.forEach(function(taskElement) {
        var taskName = taskElement.querySelector('.task-text').textContent.trim(); // Extracting task name
        var assignee = taskElement.querySelector('span:nth-of-type(2)').textContent.replace('Assignee: ', '').trim();
        var dueDate = taskElement.querySelector('span:nth-of-type(3)').textContent.replace('Due Date: ', '').trim();
        var description = taskElement.querySelector('span:nth-of-type(4)').textContent.replace('Description: ', '').trim();
        var taskTime = taskElement.querySelector('.task-time').textContent;
        taskTime = taskTime.replace(/\[|\]/g, '');
        var completed = taskElement.classList.contains('completed'); // Check if task is completed
        tasks[date].push({ content: taskName, assignee: assignee, dueDate: dueDate, description: description, time: taskTime, completed: completed }); 
      });
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTotalTasks(); 
  }

  function getCurrentTime() {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds;
  }
});


/*document.addEventListener('DOMContentLoaded', function() {
  var todoForm = document.getElementById('todo-form');
  var todoInput = document.getElementById('todo-input');
  var todoInput1 = document.getElementById('todo-input_1');
  var todoInput2 = document.getElementById('todo-input_2');
  var todoInput3 = document.getElementById('todo-input_3');
  var todoList = document.getElementById('todo-list');
  var totalTasks = document.getElementById('total-tasks');
  
  // Loading tasks from local storage
  var savedTasks = JSON.parse(localStorage.getItem('tasks')) || {};
  Object.keys(savedTasks).forEach(function(date) {
    addTaskGroup(date, savedTasks[date]);
  });

  todoForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    if (todoInput.value.trim() !== '') {
      var currentDate = new Date();
      var taskDate = currentDate.toDateString();
      var taskTime = getCurrentTime();
      var taskContainer = document.getElementById(taskDate);
      
      if (!taskContainer) {
        taskContainer = createTaskContainer(taskDate);
        todoList.appendChild(taskContainer);
      }
      
      addTask(taskContainer, todoInput.value.trim(), taskTime);
      todoInput.value = '';
      saveTasks(); 
      
      updateTotalTasks();
    }
  });

  function addTaskGroup(taskDate, tasks) {
    var taskContainer = createTaskContainer(taskDate);
    tasks.forEach(function(task) {
      addTask(taskContainer, task.content, task.time, task.completed);
    });
    todoList.appendChild(taskContainer);
  }

  function addTask(taskContainer, taskContent, taskTime, completed) {
    var newTodo = document.createElement('li');
    newTodo.classList.add('newTodo');

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox_input');
    checkbox.checked = completed || false; // Set checked state from saved data
    checkbox.addEventListener('change', function() {
      if (checkbox.checked) {
        newTodo.classList.add('completed');
      } else {
        newTodo.classList.remove('completed');
      }
      saveTasks();
    });
    newTodo.appendChild(checkbox);

    var taskText = document.createElement('span');
    var t1=taskText;
    taskText.classList.add('task-text');
    var truncatedTaskContent = taskContent.length > 20 ? taskContent.substring(0, 20) + '...' : taskContent;
    taskText.textContent = truncatedTaskContent + ' '; 
    newTodo.appendChild(taskText);

    var timeSpan = document.createElement('span');
    timeSpan.textContent = '[' + taskTime + '] '; 
    timeSpan.classList.add('task-time');
    newTodo.appendChild(timeSpan);

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function() {
      taskContainer.removeChild(newTodo);
      updateTotalTasks();
      saveTasks();
    });

    var updateButton = document.createElement('button'); 
    updateButton.textContent = 'Edit';
    updateButton.classList.add('update-button');
    updateButton.addEventListener('click', function() {
      var newContent = prompt('Enter the new task',taskContent.trim());
      if (newContent !== null ) {
        var newTime = getCurrentTime();
        taskText.textContent = newContent + ' '; // Updating task content
        timeSpan.textContent = '[' + newTime + '] '; // Update time
        saveTasks();
      }
    });

    newTodo.appendChild(deleteButton);
    newTodo.appendChild(updateButton);
    taskContainer.appendChild(newTodo);
    updateTotalTasks();
  }

  function createTaskContainer(taskDate) {
    var container = document.createElement('div');
    container.classList.add('task-container'); // Add task-container class
    container.setAttribute('id', taskDate);
    
    var dateHeader = document.createElement('h2');
    dateHeader.textContent = taskDate;
    container.appendChild(dateHeader);

    // Add delete button for task container
    var deleteContainerButton = document.createElement('button');
    deleteContainerButton.innerHTML = 'Delete'; // Use Font Awesome trash icon
    deleteContainerButton.classList.add('delete-container-button');
    deleteContainerButton.addEventListener('click', function() {
      container.parentNode.removeChild(container); // Remove the task container
      updateTotalTasks();
      saveTasks();
    });
    
    

    container.appendChild(deleteContainerButton);
    
    return container;
  }
  

  var isRefreshing = true; 

  function updateTotalTasks() {
      if (isRefreshing ) {
          totalTasks.textContent = todoList.querySelectorAll('li').length;
      } else {
          var totalCount = 0;
          Object.keys(savedTasks).forEach(function(date) {
              savedTasks[date].forEach(function(task) {
                  totalCount++;
              });
          });
          totalTasks.textContent = totalCount;
          isRefreshing = false; 
      }
  }
  
  function saveTasks() {
      var taskContainers = todoList.querySelectorAll('.task-container'); // Select task containers
      var tasks = {};
      taskContainers.forEach(function(taskContainer) {
          var dateHeader = taskContainer.querySelector('h2');
          var date = dateHeader.textContent;
          var taskElements = taskContainer.querySelectorAll('.newTodo');
          tasks[date] = [];
          taskElements.forEach(function(taskElement) {
              var taskName = taskElement.querySelector('span').textContent.trim(); // Extracting task name
              var taskTime = taskElement.querySelector('.task-time').textContent;
              taskTime = taskTime.replace(/\[|\]/g, '');
              var completed = taskElement.classList.contains('completed'); // Check if task is completed
              tasks[date].push({ content: taskName, time: taskTime, completed: completed }); 
          });
      });
      
      localStorage.setItem('tasks', JSON.stringify(tasks));
      updateTotalTasks(); 
  }

  function getCurrentTime() {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds;
  }
});*/
