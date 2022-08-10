//用 e 代替 document.querySelector 选择器
var e = function(selector) {
    return document.querySelector(selector)
}

//先给 完成 按钮添事件
var addButton = e('.todo-button')
addButton.addEventListener('click', function() {
    //先获取到input输入的值
    var todoInput = e('.todo-input')
    var c = function () {
        var todo = todoInput.value
        if (todo == '请输入' || todo == '') {
            todo.value = '输入无效'
            toggsClass(todo, false)
            saveTodos()
        } else {
            var todo = todoInput.value
            toggsClass(todo, false)
            saveTodos()
        }
    }
    c()
})
var toggsClass = function(todo, done, time) {
    //获取到他的父容器
    var todoContainer = e('.todo-container')
    
    //把输入进来的todo保存进去
    var t = todoTemplate(todo, done, time)
    //beforeend是把新添加的元素放在最后
    todoContainer.insertAdjacentHTML('beforeend', t)

}

var todoTemplate = function(todo, done, time) {
    var status = ''
    var time = data()
    if (done) {
        status = 'done'
    } else if(time == undefined) {
        time = data()
    }
    var t = `
    <div class="todo-cell ${status}" >
        <button class="todo-done">完成</button>
        <button class="todo-delete">删除</button>
        <span class="todo-span" contenteditable="true">${todo}</span>
        <span class="date-span">${time}<span>
    </div>
    `
    return t
}

//事件委托相关概念
// 问题在于, todo 都是运行的时候才添加的元素
// 对于这样的元素, 我们没办法实现绑定事件
// 我们可以把 click 事件绑定在事先存在的父元素上
// 然后在运行的时候检查被点击的对象(通过 event.target 属性)
// 是否是我们需要的对象, 这个概念就是事件委托
var todoContainer = e('.todo-container')
todoContainer.addEventListener('click', function(event) {
    let target = event.target
    if(target.classList.contains('todo-done')) {
        //找到这个元素的父元素
        var todoDiv = target.parentElement
        //给他添加一个class事件
        console.log('3312233');
        todoClass(todoDiv, 'done')
        saveTodos()
    } else if(target.classList.contains('todo-delete')) {
        //找到这个元素的父元素
        var todoDiv = target.parentElement
        //并且删除它
        todoDiv.remove()
        saveTodos()

    }
})

//一键删除功能
var deleteButton = e('.deletes-button')
deleteButton.addEventListener('click', function() {
    var delet = document.querySelectorAll('.todo-delete')
    var d = []
    //遍历出他的全部元素
    for (let i = 0; i < delet.length; i++) {
        var d = delet[i]
        //然后找到他的父元素
        var c = d.parentElement
        //全部删除掉
        c.remove()
        console.log('dsadsa', d, c)
    }
    saveTodos()
})

var todoClass = function(element, className) {
    //判断这个这个元素是否拥有这个class
    if (element.classList.contains(className)) {
        //如果有的话我们就删除
        element.classList.remove(className)
    } else {
        //没有的话我们就添加上
        element.classList.add(className)
    }
}

//找到container的全部子元素
//遍历出所有全部添加上 done
var classButton = e('.todo-class-button')
classButton.addEventListener('click', function() {
    var butt = todoContainer.children
    var c = []
    for (let i = 0; i < butt.length; i++) {
        var c = butt[i]
        c.classList.add('done')
    }
    saveTodos()
})

//实现一键反选
//把已有done这个元素变成没有，反之
var reverseButton = e('.todo-reverse-button')
reverseButton.addEventListener('click', function() {
    var butt = todoContainer.children
    var c = []
    for (let i = 0; i < butt.length; i++) {
        var c = butt[i]
        if (c.classList.contains('done')) {
            c.classList.remove('done')
        } else {
            c.classList.add('done')
        }
    }
    saveTodos()
})

//用lacalStorage实现本地储存
//因为localStorage只能存储字串的形式
//首先要把输进来的数组变成字符串
var save = function(array) {
    //JSON序列化数组
    var s = JSON.stringify(array)
    localStorage.todos = s
}

//读取并返回刚才保存的数据
var load = function() {
    //JSON反序列化读取
    var s = localStorage.todos
    return JSON.parse(s)
}

//接下来是要获取全部的 todos 用saveTodos 保存
var saveTodos =function() {
    // 1 先选出所有的 todo-span 标签
    // 2 取出 todo
    // 3 添加到一个 数组中
    // 4 保存数组
    var todoSpan = document.querySelectorAll('.todo-span')
    var todos = []
    for (var i = 0; i < todoSpan.length; i++) {
        //遍历出所有的tod0-span标签 
        var c = todoSpan[i]
        //找到他们的父节点看看是否有done
        var done = c.parentElement.classList.contains('done')
        var todo = {
            done: done,
            content: c.innerHTML,
        }
        todos.push(todo)
        console.log('todo', todo);
    }
    save(todos)
}

//读取解析并返回全部todos
var loadTodos = function() {
    var todos = load()
    for (let i = 0; i < todos.length; i++) {
        //把所有的load解析并返回
        var todo = todos[i]
        console.log(todo);
        //传入toggsClass函数
        toggsClass(todo.content, todo.done)      
    }

}
loadTodos()

//显示文本
var todoInt = function() {
    var int = e('.todo-input')
    int.onfocus = function() {
        var c = int.value
        if(c == '请输入') {
            int.value = ''
        }
    }

    int.onblur = function() {
        var c = int.value
        if(c == '') {
            int.value = '请输入'
        }
    }
}
todoInt()

//添加时间
function data() {
    var d = new Date()
    var nm = d.getFullYear()
    var yt = d.getMonth() + 1
    var ri = d.getDate()
    var ui = d.getHours()
    var ff = d.getMinutes()
    var mc = d.getSeconds()
    return `${nm}年${yt}月${ri}日${ui}时${ff}分${mc}秒`
}
