
var taskArray = []
var groupList = []

function Task(name, group, details, showD, date, done) {
    this.taskName = name;
    this.group = group;
    this.doBy = date;
    this.done = done
    this.details = details;
    this.showD = showD;
}

function addTask(){
    var tName = document.getElementById("task").value;
    var tGroup = document.getElementById("group").value;
    var tDetails  = document.getElementById("details").value;
    var tDate = document.getElementById("doBy").value;
    var tDone = false;
    var tShowD = false;
    // only adds new task if there is a name
    if(tName.trim()!=""){
        var newTask = new Task(tName, tGroup, tDetails, tShowD, tDate, tDone);
        taskArray.push(newTask);
        // adds new group to dropdown list
        if (tGroup.trim()!=""&&!groupList.includes(tGroup)){
            groupList.push(tGroup);
            var newGroup = document.createElement('option'); 
            newGroup.text = tGroup;
            cloneGroup = newGroup.cloneNode(true);
            document.getElementById("groups").appendChild(newGroup);
            document.getElementById("filter").appendChild(cloneGroup);
        }
    }
    showTasks(taskArray);  
} 

function initList(){
    if(localStorage.getItem('listofgroups')!=null){
        groupList = JSON.parse(localStorage.getItem('listofgroups'));
        groupList.forEach((el) =>  {
            var newGroup = document.createElement('option'); 
            newGroup.text = el;
            cloneGroup = newGroup.cloneNode(true);
            document.getElementById("groups").appendChild(newGroup);
            document.getElementById("filter").appendChild(cloneGroup);
        });
    }
    parsedTasks = JSON.parse(localStorage.getItem('todolist'));
    // if there are previous tasks stored in localStorage create Task objects and add to taskarray
    if (parsedTasks.length != 0){
        console.log("test 1");
        parsedTasks.forEach((el) => {
            var newItem = new Task(el.taskName,el.group, el.details, el.showD, el.doBy,el.done);
            taskArray.push(newItem);
        });

        showTasks(taskArray);
    }
    else{
        console.log("test 2");
        var start = document.createElement("div");
        start.appendChild(document.createTextNode("Start Adding Tasks . . ."));
        start.setAttribute("class","startStyle");
        document.getElementById("taskColumn").appendChild(start);
    }
    
}


function updateStorage(){
    localStorage.setItem('todolist',JSON.stringify(taskArray));
    localStorage.setItem('listofgroups',JSON.stringify(groupList));
}
function showTasks(taskArray){
    updateStorage();
    taskArray.sort(function(a,b) { 
        // sort all the no dates to the end of the list
        if (b.doBy == ""){
            return -1;
        }
        else if (a.doBy == ""){
            return 1;
        }
        else{
            var aDate = new Date(a.doBy);
            var bDate = new Date(b.doBy);
            return aDate-bDate;
        }
    });
    // clear the tasks div
    var div = document.getElementById('taskColumn');
    while(div.children.length>1) {
        div.removeChild(div.lastChild);
    }
    
    var d = "";
    var header;
    // popuplating the div with sorted tasks    
    for (let i =0; i<taskArray.length;i++){
        var t = taskArray[i];
        d = t.doBy;
        // if the date is valid and there is no valid header 
        if (d != "" && d!= header){
            header = d;
            var h = document.createElement("div");
            h.setAttribute("class","hContainer");

            var dateSpan = document.createElement("div");
            dateSpan.appendChild(document.createTextNode(header));
            dateSpan.setAttribute("class","dateH");

            var line = document.createElement("div");
            line.setAttribute("class","headerLine")

            h.appendChild(dateSpan);
            h.appendChild(line);

            document.getElementById("taskColumn").appendChild(h);
            
        }
        // first time no date appears
        else if (d=="" && d!= header){
            header = d;
            var h = document.createElement("div");
            h.setAttribute("class","hContainer");

            var dateSpan = document.createElement("div");
            dateSpan.appendChild(document.createTextNode("No Date"));
            dateSpan.setAttribute("class","dateH");

            var line = document.createElement("div");
            line.setAttribute("class","headerLine")

            
            h.appendChild(dateSpan);
            h.appendChild(line);

            document.getElementById("taskColumn").appendChild(h);
        }

        var newTDiv = document.createElement('div'); 
        newTDiv.setAttribute("id", i);
        newTDiv.setAttribute("class", "taskDivStyle");

        var taskInfo = document.createElement('div');
        taskInfo.setAttribute("class", "taskInfoStyle");
        var checkSpan = document.createElement('span');
        var tNameText = document.createTextNode(t.taskName);
        var taskSpan = document.createElement('span'); 
       
       
        if (t.group.trim()!=""){
            var gNameText = document.createTextNode(t.group);
            var groupSpan = document.createElement('span');
            groupSpan.appendChild(gNameText);
            
        }


        if(t.done == true){
            checkSpan.setAttribute("class", "fas fa-check-circle");
            taskSpan.setAttribute("class", "taskDoneStyle");
            if(t.group.trim()!=""){
                groupSpan.setAttribute("class", "tDGStyle");
            }
        }
        else{
            checkSpan.setAttribute("class", "far fa-circle");
            taskSpan.setAttribute("class", "taskStyle");
            if(t.group.trim()!=""){
                groupSpan.setAttribute("class","groupStyle");
            }
        }
        checkSpan.setAttribute("onclick", "checked(this)");
    
        taskSpan.appendChild(tNameText);
        taskInfo.appendChild(taskSpan);
        taskInfo.appendChild(groupSpan);
        newTDiv.appendChild(checkSpan);


        newTDiv.appendChild(taskInfo);

         // details dropdown
        var detailIcon = document.createElement('span');
        if (t.details.trim()!="" && t.showD == false){
            detailIcon.setAttribute("class", "fas fa-angle-down");
            detailIcon.setAttribute("onclick","showDetails(this)");
            newTDiv.appendChild(detailIcon);
        }
        else if (t.details.trim()!="" && t.showD == true){
            detailIcon.setAttribute("class", "fas fa-angle-up");
            detailIcon.setAttribute("onclick","hideDetails(this)");
            newTDiv.appendChild(detailIcon);
        }
        // delete icon
        var delSpan = document.createElement('span');
        delSpan.setAttribute("class", "fas fa-trash");
        delSpan.setAttribute("onclick","deleteTask(this)");
        newTDiv.appendChild(delSpan);
       
        
        

        document.getElementById("taskColumn").appendChild(newTDiv);
        // if there were details for the task and it is unhidden display details
        if (detailIcon.className == "fas fa-angle-up"){
            var detailDiv = document.createElement('div');
            detailDiv.setAttribute("class", "detailsDiv");
            var dArrow = document.createElement('span');
            dArrow.setAttribute("class", "fas fa-level-up-alt fa-rotate-90");

            var detailSpan = document.createElement('span');
            detailSpan.setAttribute("class", "details");
            var DText = document.createTextNode(t.details);
            detailSpan.appendChild(DText);
            detailDiv.appendChild(dArrow);
            detailDiv.appendChild(detailSpan);

            document.getElementById("taskColumn").appendChild(detailDiv);
        }
    }
}

// checks or unchecks the task when clicked
function showDetails(icon){
    taskArray[icon.parentElement.id].showD = true;
    showTasks(taskArray);
}

function hideDetails(icon){
    taskArray[icon.parentElement.id].showD = false;
    showTasks(taskArray);
}

function checked(element){
    element.classList.toggle('fas');
    element.classList.toggle('far');
    element.classList.toggle('fa-check-circle');
    element.classList.toggle('fa-circle');
    if (element.classList[0]== "fas"){
        taskArray[element.parentElement.id].done = true;
        element.nextSibling.firstChild.className= 'taskDoneStyle';
        if (taskArray[element.parentElement.id].group!= ""){
            element.nextSibling.lastChild.className= 'tDGStyle';
        }
        
    }
    else {
        taskArray[element.parentElement.id].done = false;
        element.nextSibling.firstChild.className= 'taskStyle';
        if (taskArray[element.parentElement.id].group!= ""){
            element.nextSibling.lastChild.className= 'groupStyle';
        }
    }
}

function deleteTask(icon){
    num = icon.parentElement.id;
    taskGroup = taskArray[num].group;
    // delete the group if the deleted task is the only one in the group
    var counter = 0;
    taskArray.forEach((el) =>  {
        if (el.group == taskGroup){
            counter ++;
        }
    });
    if (counter==1){
        var gIndex = groupList.indexOf(taskGroup); 
        document.getElementById("groups").remove(gIndex);
        document.getElementById("filter").remove(gIndex+1);
        groupList.splice(gIndex,1);
    }
    taskArray.splice(num,1); // delete task from array
    showTasks(taskArray);
}

function filterTasks(){
    var fGroup = document.getElementById("filter").value;
    var filteredTasks = []
    if(fGroup!="View All"){
        taskArray.forEach((task) =>  {
            if (task.group == fGroup){
                filteredTasks.push(task);
            }
        });
        showTasks(filteredTasks);
    }
    else{
        showTasks(taskArray);
    }
    
}

function showThemes(el){
    if(el.style.float =="right"){
        el.style.float ="left";
        document.getElementById("colors").style.visibility = "visible";
    }
    else{
        el.style.float ="right"
        document.getElementById("colors").style.visibility = "hidden";
    }
    
}

function changeTheme(el){
    if (el.id == "redTheme"){
        document.querySelector(':root').style.setProperty('--theme', 'var(--red-theme)')
    }
    else if (el.id == "blueTheme"){
        document.querySelector(':root').style.setProperty('--theme', 'var(--blue-theme)')
    }
    else if (el.id == "greenTheme"){
        document.querySelector(':root').style.setProperty('--theme', 'var(--green-theme)')
    }
}





