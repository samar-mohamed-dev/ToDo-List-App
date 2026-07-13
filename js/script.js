//  إنشاء مصفوفة فارغة
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentEditIndex = null; 

// حفظ المهام في كل مرا عند فتح صفحه
displayTasks();

// 2. داله حفظ البيانات
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 3. إضافة مهمة جديدة
function addTask() {
    const input = document.getElementById("taskInput");
    const errorMsg = document.getElementById("errorMsg");
    const taskText = input.value.trim();

    if (taskText === "") {
        errorMsg.innerText = "Please enter a task first! ✍️";
        errorMsg.classList.add("show");
        setTimeout(() => errorMsg.classList.remove("show"), 2000);
        return;
    }

    errorMsg.classList.remove("show");
    tasks.push({ text: taskText, completed: false });
    input.value = "";

    saveTasks();
    displayTasks();
}

// 4. عرض المهام في الصفحة الرئيسية
function displayTasks() {
    const list = document.getElementById("taskList");
    if (!list) return; 
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <div>
                <button class="check-btn" onclick="toggleTask(${index})">✔</button>
                <button class="del-btn" onclick="deleteTask(${index})">❌</button>
            </div>
        `;
        list.appendChild(li);
    });
    updateCount();
}

// 5. تبديل حالة المهمة (مكتملة / غير مكتملة)
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    
    saveTasks();
    displayTasks();
    

    if (document.getElementById('overlay').style.display === "flex") {
        checkAll();
    }
}

// 6. حذف مهمة واحدة
function deleteTask(index) {
    tasks.splice(index, 1); 
    saveTasks();           
    displayTasks();        
    
    if (document.getElementById('overlay').style.display === "flex") {
        checkAll(); 
    }
}

// 7."Check All" (عرض ملخص المهام)
function checkAll() {
    const overlay = document.getElementById('overlay');
    const focusedList = document.getElementById('focused-tasks-list');
    
    focusedList.innerHTML = ""; 

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-summary-item';
        taskItem.innerHTML = `
            <div class="task-info">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                <span class="${task.completed ? 'completed-text' : ''}">${task.text}</span>
            </div>
            <div class="task-actions">
                <button onclick="editTask(${index})" class="edit-mini-btn">✏️</button>
                <button onclick="deleteTask(${index})" class="delete-mini-btn">🗑️</button>
            </div>
        `;
        focusedList.appendChild(taskItem);
    });

    overlay.style.display = "flex";
}

// 8. وظائف إغلاق النوافذ
function closeTasksModal() {
    document.getElementById('overlay').style.display = "none";
}

function closeEditModal() {
    document.getElementById('editOverlay').style.display = "none";
    currentEditIndex = null;
}

function closeDeleteModal() {
    document.getElementById('deleteConfirmOverlay').style.display = "none";
}

// 9. وظائف تعديل المهام
function editTask(index) {
    currentEditIndex = index; 
    const editOverlay = document.getElementById('editOverlay');
    const editInput = document.getElementById('editTaskInput');
    
    editInput.value = tasks[index].text; 
    editOverlay.style.display = "flex"; 
}

// تفعيل زر حفظ التعديلات
document.getElementById('saveEditBtn').onclick = function() {
    const editInput = document.getElementById('editTaskInput');
    const newText = editInput.value.trim();

    if (newText !== "" && currentEditIndex !== null) {
        tasks[currentEditIndex].text = newText;
        saveTasks();
        displayTasks();
        if (document.getElementById('overlay').style.display === "flex") {
            checkAll(); 
        }
        closeEditModal();
    }
}

// 10. وظائف الحذف الكلي (Custom Delete Modal)
function deleteAll() {
    const deleteOverlay = document.getElementById('deleteConfirmOverlay');
    deleteOverlay.style.display = "flex";
}

// تفعيل زر التأكيد داخل نافذة الحذف المخصصة
document.getElementById('confirmDeleteBtn').onclick = function() {
    tasks = []; 
    saveTasks(); 
    displayTasks(); 
    closeDeleteModal(); 
    
    if (document.getElementById('overlay').style.display === "flex") {
        checkAll();
    }
}

// 11. تحديث عداد المهام (Total / Completed)
function updateCount() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const counter = document.getElementById("taskCount");
    if (counter) {
        counter.innerText = `Total: ${total} | Completed: ${completed}`;
    }
}

// 12. تشغيل الإضافة عند الضغط على مفتاح Enter
document.getElementById("taskInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") addTask();
});