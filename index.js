
const root = document.querySelector('#root')


//создание контейнера для всего todo
let container = document.createElement('div')
let title = document.createElement('h1')
title.innerText = "Todo List";
let formTodo = document.createElement('div')
formTodo.classList.add('formTodo')
let input = document.createElement('input')
input.classList.add('mainInput')
input.type = 'text';
let button = document.createElement('button')
button.innerText = '+';

//нижняя часть контейнера
// прогресс бар и кнопка удалить все
let botomPart = document.createElement('div')
botomPart.classList.add('botom') 
let progressBar = document.createElement('progress')
progressBar.max = -1;
botomPart.append(progressBar)
let removeChecked = document.createElement('button')
removeChecked.addEventListener('click', removeAllCheked)
removeChecked.innerText = 'remove all cheched'
button.addEventListener('click', addTodo);
input.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        addTodo()
    }
})

//отображение его на странице
//внутри дива root
botomPart.append(removeChecked)
formTodo.append(input)
formTodo.append(button)
container.append(title)
container.append(formTodo)
root.append(container)
root.append(botomPart)



//счетчик для отмечания уже сделаныч todo
let countDone = [];

// функция отображает все что есть в localStorage
// и вешает события на кнопки с localStorage
function showTasks() {
    if(localStorage.hasOwnProperty('loglevel')) {
        localStorage.removeItem(loglevel)
    }
    if(localStorage.length > 0) {
        for(let i = localStorage.length - 1; i >= 0; i--) {

            let c = localStorage.key(i)
            let todoItem = localStorage[c]
            if(todoItem != 'INFO') {
                let div = document.createElement('div')
                div.innerHTML = todoItem
                container.append(div)
            }
        }

        if(edit != undefined) {
            if(edit.length == undefined) {
                edit.setAttribute('value', true)
                let id = edit.parentElement.previousElementSibling.previousElementSibling.id
                edit.addEventListener('click', () => { editItem.bind(edit)(id) })
            }else {
                for(let i of edit) {
             
                    i.setAttribute('value', true)
                    let id = i.parentElement.previousElementSibling.previousElementSibling.id
                    i.addEventListener('click', () => { editItem.bind(i)(id) })
                }
            }
            if(remove.length == undefined) {
                let id = remove.parentElement.previousElementSibling.previousElementSibling.id
             
                remove.addEventListener('click', () => removeTodo(event,id))
            }else {
                for(let i of remove) {
                    let id = i.parentElement.previousElementSibling.previousElementSibling.id
                    i.addEventListener('click', () => removeTodo(event,id))
                }
            }
        }
 
   
   
    }


}
showTasks()


// добавляет новые todo создает все элементы. заполняет их и вешает события на кнопки 
// remove edit. присваевает todoItem id по его содержанию и потом записывает в localStorage по этому id
function addTodo() {
    if(input.value.length > 0) {

        let todoItem = document.createElement('div');
        todoItem.classList.add('todoItem')
        let check = document.createElement('input');
        check.addEventListener('click', addDone)
        check.type = 'checkbox';
        check.id = input.value;
        let label = document.createElement('label')
        label.setAttribute('for', input.value);
    
        label.innerText = input.value
        
        let buttons = document.createElement('div')
        let edit = document.createElement('button')
        edit.innerText = 'edit';
        edit.id = 'edit';
        edit.setAttribute('value', true)
        edit.addEventListener('click', () => { editItem.bind(edit)(check.id) })
        let remove = document.createElement('button');
        remove.id = 'remove'
        remove.addEventListener('click', () => { removeFromAddTodo(event, check.id) })
        remove.innerText = 'remove';

        buttons.append(edit)
        buttons.append(remove)
    
        todoItem.append(check)
        todoItem.append(label)
        todoItem.append(buttons)

        container.append(todoItem);
        input.value = '';
        progressBar.value = countDone.length;
        progressBar.max = document.querySelectorAll('.todoItem').length;
 
        progressBar.dataset.el = `${countDone.length} of ${progressBar.max} tasks done`;

        localStorage.setItem(check.id, todoItem.outerHTML)

    }else {
        console.log('add task')
    }
 
}


//функция редактирования todo. берет текст добавляет его в инпут удаляет label вставляет новый label c новым текстом
function editItem(counter) {

    if(this.value == 'true') {
        let paragraph = this.parentElement.parentElement.querySelector('label')
        let field = document.createElement('input')
        field.id = 'text'
        field.type = 'text';
        field.classList.add('text')
        field.value = paragraph.innerText;
        paragraph.after(field)
        paragraph.remove()
        this.value = false;

    }else {
        let paragraph = document.createElement('label');
        paragraph.setAttribute('for',counter)
        let field = this.parentElement.parentElement.querySelector('#text');
        paragraph.innerText = field.value;
    
        field.after(paragraph);
        field.remove()
        localStorage.setItem(counter, paragraph.parentElement.outerHTML)
        this.value = true;

    }
  
}



// отдельно функция вешается при создании todo
// удаляет todo
function removeFromAddTodo(event,id) {
    console.log(event.target)
    progressBar.value = countDone.length;
    progressBar.max = document.querySelectorAll('.todoItem').length - 1;
    progressBar.dataset.el = `${countDone.length} of ${progressBar.max} tasks done`
    localStorage.removeItem(id)
    event.target.parentElement.parentElement.remove()
}

// функция на уже существующие todo подгруженые с localStorage
// удаляет todo
function removeTodo(event, id) {
    countDone.pop()
    progressBar.value = countDone.length;
    progressBar.max = document.querySelectorAll('.todoItem').length - 1;
    progressBar.dataset.el = `${countDone.length} of ${progressBar.max} tasks done`
    localStorage.removeItem(id)
    event.target.parentElement.parentElement.remove()
  
}


// удаляет все отмечные todo
function removeAllCheked() {
    let allDone = document.querySelectorAll('input[type="checkbox"]:checked');
    for(let i of allDone) {
        i.parentElement.remove(event)
        removeTodoAllFromStorage(i.id)
    }
  
}

 function removeTodoAllFromStorage(id) {
    localStorage.removeItem(id)
 }

 //обновляет прогрес бар при нажатии на checkbox
function addDone(event) {
    if(event.target.checked) {
        countDone.push(1)
     
        event.target.nextElementSibling.style.textDecoration = "line-through"
        event.target.dataset.done = false;
        localStorage.setItem(event.target.id, event.target.parentElement.outerHTML)
        progressBar.value = countDone.length;
       progressBar.dataset.el = `${countDone.length} of ${progressBar.max} tasks done`
    }else {
        countDone.pop()
        event.target.nextElementSibling.style.textDecoration = 'none'
        progressBar.value = countDone.length;
        event.target.dataset.done = true;
        localStorage.setItem(event.target.id, event.target.parentElement.outerHTML)
     
        progressBar.dataset.el = `${countDone.length} of ${progressBar.max} tasks done`
    }
   
}
let allTodoItems = document.querySelectorAll('.todoItem')

for(let i of allTodoItems) {

    if(i.firstChild.dataset.done == 'false') {
        // console.log(i.firstChild)
        i.firstChild.checked = true;
        i.firstChild.nextElementSibling.style.textDecoration = 'line-through'
        countDone.push(1)
    }else {
        i.firstChild.checked = false
    }
 
}

// события длч todo c localStorage обновление прогресс бара
let allDone = document.querySelectorAll('input[type="checkbox"]');
for(let i of allDone) {
    i.addEventListener('click', addDone)
}

progressBar.max = document.querySelectorAll('.todoItem').length;
progressBar.dataset.el = `${countDone.length} of ${progressBar.max} tasks done`;
