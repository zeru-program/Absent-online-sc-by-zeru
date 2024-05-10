const urlDb = "https://absensi-online-10-default-rtdb.firebaseio.com/";
// sub data ready is "account" and "absensi"

const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener("click", function () {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove("active");
        });
        li.classList.add("active");
    });
});

// handle navbar
document.querySelectorAll(".navs").forEach(nv => {
    nv.addEventListener("click", e => {
        document.querySelectorAll(".disp-nav").forEach(dn => {
            dn.style.display = "none";
        });
        const dNav = nv.getAttribute("d-nav");
        document.getElementById(dNav).style.display = "block";
    });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
    sidebar.classList.toggle("hide");
});

const searchButton = document.querySelector(
    "#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
    "#content nav form .form-input button .bx"
);
const searchForm = document.querySelector("#content nav form");

searchButton.addEventListener("click", function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle("show");
        if (searchForm.classList.contains("show")) {
            searchButtonIcon.classList.replace("bx-search", "bx-x");
        } else {
            searchButtonIcon.classList.replace("bx-x", "bx-search");
        }
    }
});

if (window.innerWidth < 768) {
    sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
}

window.addEventListener("resize", function () {
    if (this.innerWidth > 576) {
        searchButtonIcon.classList.replace("bx-x", "bx-search");
        searchForm.classList.remove("show");
    }
});
/*
const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
    if (this.checked) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
});
*/

fetch(urlDb + "account.json")
    .then(res => res.json())
    .then(data => {
        let length = 0;
        for (let key in data) {
            length++;
        }
        document.getElementById("lengthAcc").textContent = length;
    });
fetch(urlDb + "absensi.json")
    .then(res => res.json())
    .then(data => {
        let lengthAbs = 0;
        var currentDate = new Date(); // Tanggal hari ini
        var currentDateFormatted =
            currentDate.getFullYear() +
            "-" +
            (currentDate.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            currentDate.getDate().toString().padStart(2, "0");
        for (let key in data) {
            var val = data[key];
            if (val.date === currentDateFormatted) {
                // Membandingkan dengan tanggal hari ini
                lengthAbs++;
            }
        }
        document.getElementById("lengthAbsen").textContent = lengthAbs;
    });

function getDataAbsen() { 
    var currentDate = new Date();
    var currentDateFormatted =
                currentDate.getFullYear() +
                "-" +
                (currentDate.getMonth() + 1).toString().padStart(2, "0") +
                "-" +
                currentDate.getDate().toString().padStart(2, "0");
          
    fetch(urlDb + "absensi.json")
        .then(res => res.json())
        .then(data => {
            const absenBody = document.getElementById("absent-dash");
            const absenBodyToday = document.getElementById("absent-dash-today");
            const absenBodyAbs = document.getElementById("absent-dash-abs");
            for (let key in data) {
                var val = data[key];
                const append = document.createElement("tr");
                append.innerHTML = `
                <td>${val.id}</td>
                <td>${val.class}</td>
                <td>${val.teacher}</td>
                <td>${val.date}</td>
                <td>${val.total_students}</td>
                <td>${val.present}</td>
                <td>${val.sick}</td>
                <td>${val.permission}</td>
                <td>${val.cakes}</td>
                <td>${val.sick_students}</td>
                <td>${val.permission_students}</td>
                <td>${val.cakes_students}</td>
                <td>${val.description}</td>
                    <td class="" style="gap:5px;display:flex">
                        <button class="status" style="border:0; border-radius:8px; background:#ffd100; padding-inline:10px;padding-block:10px !important;color:#000 !important;" onclick="editAbsent('${key}', this)">EDIT</button>
                        <button class="status" style="border:0; border-radius:8px; background:#ff0000; padding-inline:10px;padding-block:10px !important;" onclick="deleteAbsent('${key}')">DELETE</button>
                    </td>
                `;
                absenBody.appendChild(append);
                absenBodyAbs.appendChild(append.cloneNode(true));
                if (val.date === currentDateFormatted) {
                    absenBodyToday.appendChild(append.cloneNode(true));
                }
            }
        })
        .catch(e => console.error(e));
}

// call the function
getDataAbsen();

function deleteAbsent(key) {
    // first fetch the db 
    fetch(urlDb + "absensi/" + key + ".json", {
        method: "DELETE"
    })
    .then(res => {
        if (res.ok) {
            alert('delete successfully');
            location.reload();
        } else {
            alert('cannot delete it');
        }
    })
    .catch(error => console.error(error.message));
}

function editAbsent(uniqueId, elem) {
    // lets ready for update
    // it will get all the td of the tr in which btn in clicked
    var siblingTd = elem.parentElement.parentElement.getElementsByTagName("td");
    // convert first three td to editable
    for (var i = 0; i < siblingTd.length - 1; i++) {
        siblingTd[i].contentEditable = true;
        siblingTd[i].classList.add("temp-update-class");
    }
    // also change onclick function
    elem.setAttribute("onclick", `updateAbsent('${uniqueId}'), this`);
    elem.innerHTML = "SAVE";
}

function updateAbsent(uniqueId, elem) {
    var contentId = document.querySelectorAll(".temp-update-class");
    // now create obj using same keys as used during sending

    // create reference to the data first where data will update
   var obj = {
    id: contentId[0].textContent,
    class: contentId[1].textContent,
    teacher: contentId[2].textContent,
    date: contentId[3].textContent,
    total_students: contentId[4].textContent,
    present: contentId[5].textContent,
    sick: contentId[6].textContent,
    permission: contentId[7].textContent,
    cakes: contentId[8].textContent,
    sick_students: contentId[9].textContent,
    permission_students: contentId[10].textContent,
    cakes_students: contentId[11].textContent,
    description: contentId[12].textContent
};

    // and than update it
    // uniqueId will be the id of each message in db
    fetch(urlDb + `absensi/${uniqueId}.json`, {
        method: "PATCH",
        body: JSON.stringify(obj)
    })
        .then(res => {
            if (res.ok) {
                alert("data saved");
                location.reload();
            } else {
                alert("nothing to refs error");
            }
        })
        .catch(error => console.error(error.message));
}

function deleteAbsent(key) {
    // first fetch the db 
    fetch(urlDb + "/absensi/" + key + ".json", {
        method: "DELETE"
    })
    .then(res => {
        if (res.ok) {
            alert('delete successfully');
            location.reload();
        } else {
            alert('cannot delete it');
        }
    })
    .catch(error => console.error(error.message));
}
// insert data absent
document.getElementById('postToAbsen').addEventListener("submit", (e) => {
  e.preventDefault();
  postAbsen();
});
function postAbsen() {
    const classInput = document.getElementById("class").value;
    const teacher = document.getElementById("teacher").value;
    const date = document.getElementById("date").value;
    const totalStudents = document.getElementById("total_students").value;
    const present = document.getElementById("present").value;
    const sick = document.getElementById("sick").value;
    const permission = document.getElementById("permission").value;
    const cakes = document.getElementById("cakes").value;
    const sickStudents = document.getElementById("sick_students").value;
    const permissionStudents = document.getElementById("permission_students").value;
    const cakesStudents = document.getElementById("cakes_students").value;
    const description = document.getElementById("description").value;

    if (!classInput || !teacher || !date || !totalStudents || !present || !sick || !permission || !cakes || !sickStudents || !permissionStudents || !cakesStudents || !description) {
        const modals = document.getElementById('modals-wrong');
        modals.classList.remove("d-none");
        modals.classList.add("d-flex");
        setTimeout(function() {
            modals.classList.remove("d-flex");
            modals.classList.add("d-none");
        }, 2000);
        return;
    }

    fetch(urlDb + 'absensi.json')
        .then(res => res.json())
        .then(data => {
            let length = 0;
            for (let key in data) {
                length++;
            }
            const nextId = length + 1;

            const datas = {
                id: nextId,
                class: classInput,
                teacher: teacher,
                date: date,
                total_students: totalStudents,
                present: present,
                sick: sick,
                permission: permission,
                cakes: cakes,
                sick_students: sickStudents,
                permission_students: permissionStudents,
                cakes_students: cakesStudents,
                description: description
            };

            fetch(urlDb + 'absensi.json', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datas)
            })
            .then(res => {
                if (res.ok) {
                  alert('successfully! go refresh this page')
                    location.reload();
                }
            })
            .catch(error => console.error(error.message));
        })
        .catch(error => console.error(error.message)); 
}

function showFormAbsent(elm) {
  document.getElementById('postToAbsen').style.display = "block"
  elm.style.display = 'none'
}
function cancelAddAbsent() {
  document.getElementById('postToAbsen').style.display = "none"
  document.getElementById('btnAddAbsent').style.display = "block"
}
function showFormNotif(elm) {
  document.getElementById('postToNotif').style.display = "block"
  elm.style.display = 'none'
}
function cancelAddNotif() {
  document.getElementById('postToNotif').style.display = "none"
  document.getElementById('btnAddNotif').style.display = "block"
}
function showFormAcc(elm) {
  document.getElementById('postToAcc').style.display = "block"
  elm.style.display = 'none'
}
function cancelAddAccount() {
  document.getElementById('postToAcc').style.display = "none"
  document.getElementById('btnAddAcc').style.display = "block"
}

// get notif
fetch(urlDb + "notification.json")
.then(res => res.json())
.then(data => {
  let length = 0;
  const bodyNotif = document.getElementById('notif-dash')
  for (let key in data) {
    var val = data[key]
    const app = document.createElement('tr')
    app.innerHTML = `
    <td>${val.id}</td>
    <td>${val.title}</td>
    <td>${val.message}</td>
    <td>${val.date}</td>
	  <td class="" style="gap:5px;display:flex"><button class="status" style="border:0; border-radius:8px; background:#ffd100; padding-inline:10px;padding-block:10px !important;color:#000 !important;" onclick="editNotif('${key}', this)">EDIT</button><button class="status" style="border:0; border-radius:8px; background:#ff0000; padding-inline:10px;padding-block:10px !important;" onclick="deleteNotif('${key}')">DELETE</button></td>
    `
    bodyNotif.appendChild(app)
    length++
  }
  document.getElementById('lengthNotif').textContent = length;
  document.getElementById('lengthNotif2').textContent = length;
})

.catch(error => console.error(error.message))
const formNotif = document.getElementById('postToNotif');
formNotif.addEventListener("submit", (e) => {
 // prevent default for prevent event post this form
  e.preventDefault();
  
  // first fetch get , to amouse length data
  fetch(urlDb + "notification.json")
  .then(res => res.json())
  .then(data => {
    let lengthData = 0;
    // looping the data to add the value lengthData
    for (let key in data) {
      lengthData++;
    }
    // set the nextId 
    var nextId = lengthData + 1;
    
    const titled = document.getElementById('title-notif').value;
    const message = document.getElementById("message-notif").value;
    const date = document.getElementById("date-notif").value;
    
    // let's declare the data to submit firebase
    var datasAcc = {
      id: nextId,
      title: titled,
      message: message,
      date: date
    }
    
    // then fetch with method post
   fetch(urlDb + "notification.json", {
     method: "POST",
     headers: {
      "Content-Type": "application/json"
     },
     body: JSON.stringify(datasAcc)
   })
   .then(res => {
     if (res.ok) {
       alert('successfully! go refresh this page')
       location.reload()
     }
   })
   .catch(error => console.error(error.message))
    console.log('test')
    
  })
   .catch(error => console.error(error.message))
  
})
function editNotif(uniqueId, elem) {
    // lets ready for update
    // it will get all the td of the tr in which btn in clicked
    var siblingTd = elem.parentElement.parentElement.getElementsByTagName("td");
    // convert first three td to editable
    for (var i = 0; i < siblingTd.length - 1; i++) {
        siblingTd[i].contentEditable = true;
        siblingTd[i].classList.add("temp-update-class");
    }
    // also change onclick function
    elem.setAttribute("onclick", `updateNotif('${uniqueId}'), this`);
    elem.innerHTML = "SAVE";
}
function updateNotif(uniqueId, elem) {
    var contentId = document.querySelectorAll(".temp-update-class");
    // now create obj using same keys as used during sending
    var obj = {
        id: contentId[0].textContent,
        title: contentId[1].textContent,
        message: contentId[2].textContent,
        date: contentId[3].textContent
    };
    // create reference to the data first where data will update

    // and than update it
    // uniqueId will be the id of each message in db
    fetch(urlDb + `notification/${uniqueId}.json`, {
        method: "PATCH",
        body: JSON.stringify(obj)
    })
        .then(res => {
            if (res.ok) {
                alert("data saved");
                location.reload();
            } else {
                alert("nothing to refs error");
            }
        })
        .catch(error => console.error(error.message));
}
function deleteNotif(key) {
  // first fetch the db 
  fetch(urlDb + `notification/${key}.json`, {
    method: "DELETE"
  })
  .then(res => {
    if (res.ok) {
      alert('delete successfully')
      location.reload()
    } else {
      alert('cannot delete it')
    }
  })
  .catch(error => console.error(error.message))
}


// get acc
fetch(urlDb + "account.json")
.then(res => res.json())
.then(data => {
  const bodyNotif = document.getElementById('acc-dash')
  for (let key in data) {
    var val = data[key]
    const app = document.createElement('tr')
    app.innerHTML = `
    <td>${val.id}</td>
    <td>${val.username}</td>
    <td>${val.password}</td>
    <td>${val.school_year}</td>
    <td>${val.status}</td>
	  <td class="" style="gap:5px;display:flex"><button class="status" style="border:0; border-radius:8px; background:#ffd100; padding-inline:10px;padding-block:10px !important;color:#000 !important;" onclick="editAcc('${key}', this)">EDIT</button><button class="status" style="border:0; border-radius:8px; background:#ff0000; padding-inline:10px;padding-block:10px !important;" onclick="deleteAcc('${key}')">DELETE</button></td>
    `
    bodyNotif.appendChild(app)
  }
})
.catch(error => console.error(error.message))
const formAcc = document.getElementById('postToAcc');
formAcc.addEventListener("submit", (e) => {
 // prevent default for prevent event post this form
  e.preventDefault();
  
  // first fetch get , to amouse length data
  fetch(urlDb + "account.json")
  .then(res => res.json())
  .then(data => {
    let lengthData = 0;
    // looping the data to add the value lengthData
    for (let key in data) {
      lengthData++;
    }
    // set the nextId 
    var nextId = lengthData + 1;
    
    const usn = document.getElementById('username-acc').value;
    const pass = document.getElementById("password-acc").value;
    const scYear = document.getElementById("school-year-acc").value;
    
    // let's declare the data to submit firebase
    var datasAcc = {
      id: nextId,
      username: usn,
      password: pass,
      school_year: scYear,
      status: "offline"
    }
    
    // then fetch with method post
   fetch(urlDb + "account.json", {
     method: "POST",
     headers: {
      "Content-Type": "application/json"
     },
     body: JSON.stringify(datasAcc)
   })
   .then(res => {
     if (res.ok) {
        alert('successfully! go refresh this page')
        location.reload();
     }
   })
   .catch(error => console.error(error.message))
    console.log('test')
    
  })
   .catch(error => console.error(error.message))
  
})
function editAcc(uniqueId, elem) {
    // lets ready for update
    // it will get all the td of the tr in which btn in clicked
    var siblingTd = elem.parentElement.parentElement.getElementsByTagName("td");
    // convert first three td to editable
    for (var i = 0; i < siblingTd.length - 1; i++) {
        siblingTd[i].contentEditable = true;
        siblingTd[i].classList.add("temp-update-class");
    }
    // also change onclick function
    elem.setAttribute("onclick", `updateAcc('${uniqueId}'), this`);
    elem.innerHTML = "SAVE";
}
function updateAcc(uniqueId, elem) {
    var contentId = document.querySelectorAll(".temp-update-class");
    // now create obj using same keys as used during sending
    var obj = {
        id: contentId[0].textContent,
        username: contentId[1].textContent,
        password: contentId[2].textContent,
        school_year: contentId[3].textContent
    };
    // create reference to the data first where data will update

    // and than update it
    // uniqueId will be the id of each message in db
    fetch(urlDb + `account/${uniqueId}.json`, {
        method: "PATCH",
        body: JSON.stringify(obj)
    })
        .then(res => {
            if (res.ok) {
                alert("data saved");
                location.reload();
            } else {
                alert("nothing to refs error");
            }
        })
        .catch(error => console.error(error.message));
}
function deleteAcc(key) {
  // first fetch the db 
  fetch(urlDb + `account/${key}.json`, {
    method: "DELETE"
  })
  .then(res => {
    if (res.ok) {
      alert('delete successfully')
      location.reload()
    } else {
      alert('cannot delete it')
    }
  })
  .catch(error => console.error(error.message))
}

//handle logout
    function handleLogout() {
      localStorage.removeItem('hasLogin')
      localStorage.removeItem('username')
      localStorage.removeItem('password')
      location.reload();
    }