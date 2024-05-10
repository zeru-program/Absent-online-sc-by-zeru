const urlDb = "https://absensi-online-10-default-rtdb.firebaseio.com/";
// sub data ready is "account" and "absensi"


/** home **/ 
function getDataAbsen() {
  fetch(urlDb + 'absensi.json')
  .then(res => res.json())
  .then(data => {
    const absenBody = document.getElementById('absen-body-home')
    for (let key in data) {
      var val = data[key];
      const append = document.createElement('tr')
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
      `;
      absenBody.appendChild(append);
    }
  })
  .catch(e => console.error(e))
}
getDataAbsen()

if (window.location.pathname === "/absen/" ||  window.location.pathname === "/absen/index.html") {
document.getElementById('postToAbsen').addEventListener("submit", (e) => {
  e.preventDefault();
  postAbsen();
});
}
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
                    location.reload();
                }
            })
            .catch(error => console.error(error.message));
        })
        .catch(error => console.error(error.message)); 
}

if (window.location.pathname === "/home/" || window.location.pathname === "/home/index.html") {
  checkAuth()
document.getElementById('formLogin').addEventListener('submit', (e) => {
  e.preventDefault();
  authLogin()
}) 
}

function checkAuth() {
  const getHasLog = localStorage.getItem('hasLogin');
  if (getHasLog) {
    document.getElementById('poppup-login').classList.remove('d-flex')
    document.getElementById('poppup-login').classList.add('d-none')
  }
}
function authLogin() {
  fetch(urlDb + "account.json")
  .then(res => res.json())
  .then(data => {
   var usn = document.getElementById("username-acc").value;
    var pw = document.getElementById("password-acc").value;
    // looping for search the account
    for (let key in data) {
      var val = data[key]
      
      if (usn === val.username && pw === val.password) {
      // set the data to localstoraage
      localStorage.setItem('hasLogin', true)
      localStorage.setItem('username', usn)
      localStorage.setItem('password', pw)
      localStorage.setItem('school-year', val.school_year)
        alert('login')
      } else {
        alert('username atau password salah')
      }
      
    }
  })
  .catch(error => console.error(error.message))
}

let clickedNotif = false;
// show notification
function showNotif() {
  console.log('dd')
  if (clickedNotif) {
  document.getElementById('popup-notif').style.display = 'none';
  } else {
  document.getElementById('popup-notif').style.display = 'block';
  }
  clickedNotif = !clickedNotif;
}
fetch(urlDb + 'notification.json')
.then(res => res.json())
.then(data => {
  const bodyNotif = document.getElementById('popup-notif')
  for (let key in data) {
    var val = data[key]
    const append = document.createElement("div")
    append.innerHTML = `
    <div class="d-flex flex-column px-2 w-100 py-4 bg-light rounded-4 text-dark" style="box-shadow:0 0 8px rgba(0,0,0,.3)">
      <h2 class="fw-bold" id="title-notif">${val.title}</h2>
      <p class="m-0" id="message-notif">${val.message}</p>
      <label class="m-0" id="date-notif">${val.date}</label>
    `
    bodyNotif.appendChild(append)
  }
})
