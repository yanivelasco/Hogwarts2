"use strict";

//__________________________________________________________FETCH AND PREPARE DATA _______________________________________________________________________________________________

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];
const inquisitorialSquad = []; 
let expelledStudents = [];
const modal = document.getElementById("myModal");
const prefects = [];
const houseColors = {
  "Gryffindor": "red",
  "Hufflepuff": "yellow",
  "Ravenclaw": "blue",
  "Slytherin": "green",

};




function loadJSON() {
  
  fetch("students.json")
    .then(response => response.json())
    .then(jsonData => {
      prepareObjects(jsonData);
      displayList();
      const totalCount = allStudents.length;
      const houseCounts = countStudents();
      displayStudentCounts(totalCount, totalCount, houseCounts);
    });
}


//__________________________________________________________CLEANING DATA _______________________________________________________________________________________________


async function prepareObjects(jsonData) {
  const bloodStatusData = await loadBloodStatusData();
  jsonData.forEach(jsonObject => {
    const Student = {
      firstName: "",
      lastName: "",
      middleName: "",
      nickName: "Null",
      image: "",
      house: "",
      bloodStatus: "",
      inquisitorialSquad: false
    };

    const student = Object.create(Student);
    

    


    // FIRST NAME_______________________________________________________________________________________________

    let fullnameString = jsonObject.fullname;
    let result = "";

    let trimmedString1 = fullnameString.trimStart();
    result = trimmedString1.substring(0, trimmedString1.indexOf(" "));
  
    student.firstName = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();

    console.log(student.firstName);



    // MIDDLE NAME_______________________________________________________________________________________________

    let middlename = "";
    let trimmedString3 = "";
    let result3 = "";

    trimmedString3 = fullnameString.trim();

    result3 = trimmedString3
      .substring(trimmedString3.indexOf(" "), trimmedString3.lastIndexOf(" "))
      .trim();

    middlename = result3;

    student.middleName = middlename.charAt(0).toUpperCase() + middlename.slice(1).toLowerCase();

    if (student.middleName === "" || student.middleName === student.firstName) {
      student.middleName = "";
    }

    else if (student.middleName.includes(`"`)) {
      student.middleName = "";
    }

    else if (student.middleName.includes("-")) {
      student.middleName =
        middlename.charAt(indexOf("-") + 1).toUpperCase() +
        middlename.slice(indexOf("-") + 2).toLowerCase();
    }
    console.log(student.middleName);

    // HOUSES_______________________________________________________________________________________________

    let houseName = jsonObject.house;

    houseName = houseName.trimStart();
    houseName = houseName.trimEnd();

    student.house = houseName.charAt(0).toUpperCase() + houseName.slice(1).toLowerCase();

    console.log(student.house);


    // LAST NAME_______________________________________________________________________________________________

    let trimmedString2 = "";
    let result2 = "";

    trimmedString2 = fullnameString.trimEnd();

    result2 = trimmedString2.substring(trimmedString2.lastIndexOf(" ") + 1);
    student.lastName = result2.charAt(0).toUpperCase() + result2.slice(1).toLowerCase();

    if (student.lastName.includes("-")) {
      student.lastName =
        result2.substring(0, result2.lastIndexOf("-") + 1) +
        result2
          .substring(result2.lastIndexOf("-") + 1, result2.lastIndexOf("-") + 2)
          .toUpperCase() +
        result2.substring(result2.lastIndexOf("-") + 2).toLowerCase();
    }
    console.log(student.lastName);

    // NICKNAME_______________________________________________________________________________________________

    let result4 = fullnameString.substring(
      fullnameString.indexOf(`"`),
      fullnameString.lastIndexOf(`"`) + 1
    );

    student.nickName = result4.replaceAll(`"`, ``);
    console.log(student.nickName);

    // PHOTO_______________________________________________________________________________________________

    let imageSrc = new Image();

    student.image = imageSrc;

    let lastnameL = student.lastName.toLowerCase();

    let firstnameL = student.firstName.charAt(0).toLowerCase();

    imageSrc.src = "images/" + lastnameL + "_" + firstnameL + ".jpg";


   
    if (lastnameL.includes("patil")) {
      imageSrc.src = "images/" + lastnameL + "_" + student.firstName.toLowerCase() + ".jpg";
    }

    else if (student.firstName === "Leanne") {
      student.image = "images/default.jpg";
    }

    else if (lastnameL.includes("-")) {
      imageSrc.src =
        "images/" + lastnameL.substring(lastnameL.indexOf("-") + 1) + "_" + firstnameL + ".jpg";
    }


    
    const { half, pure } = bloodStatusData;
    const isPureBlood = pure.includes(student.lastName);
    const isHalfBlood = half.includes(student.lastName);

    if (isPureBlood) {
      student.bloodStatus = "Pure-Blood";
    } else if (isHalfBlood) {
      student.bloodStatus = "Half-Blood";
    } else {
      student.bloodStatus = "Muggle";
    }

    

    // ADD TO ALL STUDENTS INTO GLOBAL ARRAY

    allStudents.push(student);
    console.log(allStudents);
  });

  displayList();
}


//__________________________________________________________CLONING_______________________________________________________________________________________________
function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=nickName]").textContent = student.nickName;
  clone.querySelector("#studentImage").src = student.image.src;
  clone.querySelector("[data-field=house]").textContent = student.house;

  

  const studentImage = clone.querySelector("#studentImage");
  studentImage.addEventListener("click", () => {
    openModal(student);

    if (student.expelled) {
      return; 
    }
  
    const clone = document.querySelector("template#student").content.cloneNode(true); 
  });

  document.querySelector("#list tbody").appendChild(clone);

  
}







//SEARCH

function performSearch() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const filteredStudents = allStudents.filter(student => {
    const fullName = `${student.firstName} ${student.middleName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchInput);
  });
  displayFilteredStudents(filteredStudents);
}

function displayFilteredStudents(filteredStudents) {
  const listContainer = document.querySelector("#list tbody");
  listContainer.innerHTML = "";

  filteredStudents.forEach(student => {
    displayStudent(student);
  });

  const displayedCount = filteredStudents.length; 
  const totalCount = allStudents.length;
  const houseCounts = countStudents();
  displayStudentCounts(displayedCount, totalCount, houseCounts);
}



//STUDENTS COUNT
function countStudents() {
  const houseCounts = {
    Gryffindor: 0,
    Hufflepuff: 0,
    Ravenclaw: 0,
    Slytherin: 0,
  };

  allStudents.forEach(student => {
    houseCounts[student.house]++;
  });

  houseCounts.total = allStudents.length;

  return houseCounts;
}




/////DISPALY----------------

function displayList(sortBy) {
  const listContainer = document.querySelector("#list tbody");
  listContainer.innerHTML = "";

  let studentsToDisplay = allStudents;

  const activeHouse = document.querySelector(".activeHouse");
  if (activeHouse) {
    const house = activeHouse.getAttribute("data-house");
    studentsToDisplay = allStudents.filter(student => student.house === house);
  }

  let sortedStudents = [...studentsToDisplay];

  if (sortBy === "firstName") {
    sortedStudents.sort((a, b) => a.firstName.localeCompare(b.firstName));
  } else if (sortBy === "lastName") {
    sortedStudents.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }

  sortedStudents.forEach(displayStudent);

  
  const displayedCount = sortedStudents.length;
  const totalCount = allStudents.length;
  const houseCounts = countStudents(sortedStudents);
  displayStudentCounts(displayedCount, totalCount, houseCounts);
}











// START ---------------------------------- 
function start() {
  console.log("ready");

  loadJSON();

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", performSearch);
  const sortAllByFirstNameBtn = document.getElementById("sortAllByFirstNameBtn");
  sortAllByFirstNameBtn.addEventListener("click", sortAllStudentsByFirstName);
  
  const sortAllByLastNameBtn = document.getElementById("sortAllByLastNameBtn");
  sortAllByLastNameBtn.addEventListener("click", sortAllStudentsByLastName);
}


//FILTER
const gryffindorBtn = document.getElementById("gryffindorBtn");
const hufflepuffBtn = document.getElementById("hufflepuffBtn");
const ravenclawBtn = document.getElementById("ravenclawBtn");
const slytherinBtn = document.getElementById("slytherinBtn");

gryffindorBtn.addEventListener("click", filterStudentsByHouse.bind(null, "Gryffindor"));
hufflepuffBtn.addEventListener("click", filterStudentsByHouse.bind(null, "Hufflepuff"));
ravenclawBtn.addEventListener("click", filterStudentsByHouse.bind(null, "Ravenclaw"));
slytherinBtn.addEventListener("click", filterStudentsByHouse.bind(null, "Slytherin"));

function filterStudentsByHouse(house) {
  const filteredStudents = allStudents.filter(student => student.house === house);
  const sortBy = document.querySelector(".activeSort")?.getAttribute("data-sort");
  
  if (sortBy === "firstName") {
    filteredStudents.sort((a, b) => a.firstName.localeCompare(b.firstName));
  } else if (sortBy === "lastName") {
    filteredStudents.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }
  
  displayFilteredStudents(filteredStudents);
}

function displayFilteredStudents(filteredStudents) {
  const listContainer = document.querySelector("#list tbody");
  listContainer.innerHTML = "";

  filteredStudents.forEach(displayStudent);

  const displayedCount = filteredStudents.length;
  const totalCount = allStudents.length;
  const houseCounts = countStudents(filteredStudents);
  displayStudentCounts(displayedCount, totalCount, houseCounts);
}




//SORT


let filteredAndSortedStudents = [];



function filterStudentsByHouse(house) {
  const filteredStudents = allStudents.filter(student => student.house === house);
  filteredAndSortedStudents = [...filteredStudents];
  displayFilteredStudents(filteredAndSortedStudents);
}


const sortByFirstNameBtn = document.getElementById("sortByFirstNameBtn");
const sortByLastNameBtn = document.getElementById("sortByLastNameBtn");


sortByFirstNameBtn.addEventListener("click", () => {
  sortByFirstNameBtn.classList.add("activeSort");
  sortByLastNameBtn.classList.remove("activeSort");
  sortFilteredStudents("firstName");
});

sortByLastNameBtn.addEventListener("click", () => {
  sortByLastNameBtn.classList.add("activeSort");
  sortByFirstNameBtn.classList.remove("activeSort");
  sortFilteredStudents("lastName");
});


function sortFilteredStudents(sortBy) {
  if (sortBy === "firstName") {
    filteredAndSortedStudents.sort((a, b) => a.firstName.localeCompare(b.firstName));
  } else if (sortBy === "lastName") {
    filteredAndSortedStudents.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }
  displayFilteredStudents(filteredAndSortedStudents);
}


function sortAllStudentsByFirstName() {
  allStudents.sort((a, b) => a.firstName.localeCompare(b.firstName));
  displayList();
}

function sortAllStudentsByLastName() {
  allStudents.sort((a, b) => a.lastName.localeCompare(b.lastName));
  displayList();
}


//MODAL STUDENT INFO



function openModal(student) {
  const modal = document.getElementById("myModal");
  const modalContent = modal.querySelector(".modal-content");
  const studentInfo = document.getElementById("studentInfo");

  studentInfo.innerHTML = `
    <!-- Student information -->

    <p><strong>First Name:</strong> ${student.firstName}</p>
    <p><strong>Middle Name:</strong> ${student.middleName}</p>
    <p><strong>Nick Name:</strong> ${student.nickName}</p>
    <p><strong>Last Name:</strong> ${student.lastName}</p>
    <img src="${student.image.src}" alt="${student.firstName}'s photo">
    <p><strong>House:</strong> ${student.house}</p>
    <p><strong>Blood Status:</strong> ${student.bloodStatus}</p>
    <p id="inquisitorialSquadStatus"><strong>Inquisitorial Squad:</strong> ${inquisitorialSquad.includes(student) ? 'Yes' : 'No'}</p>
    <button id="inquisitorialBtn">${student.inquisitorialSquad ? "Remove from Inquisitorial Squad" : "Add to Inquisitorial Squad"}</button>
    <p id="prefectStatus"><strong>Prefect:</strong> ${student.prefect ? 'Yes' : 'No'}</p>
    <button id="prefectBtn">${student.prefect ? "Remove from Prefects" : "Add to Prefects"}</button>
      <button id="expelStudentBtn">Expel Student</button>
    
  `;

  modal.style.display = "block";

  const closeModalBtn = modal.querySelector(".close");
  closeModalBtn.addEventListener("click", () => {
    closeModal(modal);
    const inquisitorialBtn = document.querySelector("#inquisitorialBtn");
    const inquisitorialSquadStatus = document.querySelector("#inquisitorialSquadStatus");
    inquisitorialBtn.innerText = student.inquisitorialSquad ? "Remove from Inquisitorial Squad" : "Add to Inquisitorial Squad";
    inquisitorialSquadStatus.innerText = `Inquisitorial Squad: ${inquisitorialSquad.includes(student) ? 'Yes' : 'No'}`;

    

    const prefectStatus = document.querySelector("#prefectStatus");
prefectStatus.innerText = `Prefect: ${student.prefect ? 'Yes' : 'No'}`;
prefectBtn.innerText = student.prefect ? "Remove from Prefects" : "Add to Prefects";

  });

  const prefectBtn = modal.querySelector("#prefectBtn");
prefectBtn.addEventListener("click", () => {
  togglePrefect(student);
  console.log('Prefect button clicked');


  
});

const expelStudentBtn = modal.querySelector("#expelStudentBtn");
  expelStudentBtn.addEventListener("click", expelStudent.bind(null, student));



  const inquisitorialBtn = modal.querySelector("#inquisitorialBtn");
  
  if (student.bloodStatus !== "Pure-Blood" && !(student.bloodStatus === "Half-Blood" && student.house === "Slytherin")) {

    inquisitorialBtn.disabled = true;
    inquisitorialBtn.classList.add("not-eligible", "tooltip");
    
  
    inquisitorialBtn.innerHTML += '<span class="tooltip-text">You can only add pure-blood students or students from Slytherin.</span>';
  } else {
    inquisitorialBtn.classList.remove("tooltip");
  }
  

  inquisitorialBtn.addEventListener("click", () => {
    toggleInquisitorialSquad(student);
  });
}



  function closeModal(modal) {
    modal.style.display = "none";
  }
  
 
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
      closeModal(modal);
    }
  });
  

  //BLOOD STATUS

  function loadBloodStatusData() {
    return fetch("https://petlatkea.dk/2021/hogwarts/families.json")
      .then(response => response.json())
      .then(data => data);
  }
  

  //INQ SQUAD

  
  function toggleInquisitorialSquad(student) {
    const isInInquisitorialSquad = inquisitorialSquad.includes(student);
    const inquisitorialBtn = document.querySelector("#inquisitorialBtn");
    const inquisitorialSquadStatus = document.querySelector("#inquisitorialSquadStatus");
  
    if (isInInquisitorialSquad) {
  
      const index = inquisitorialSquad.indexOf(student);
      inquisitorialSquad.splice(index, 1);
      student.inquisitorialSquad = false; 
      console.log(`${student.firstName} ${student.lastName} removed from the Inquisitorial Squad.`);
      inquisitorialBtn.innerText = "Add to Inquisitorial Squad";
      inquisitorialSquadStatus.innerText = "Inquisitorial Squad: No";
    } else {
     
      if (!isInInquisitorialSquad && (student.bloodStatus === 'Pure-Blood' || (student.bloodStatus === 'Half-Blood' && student.house === 'Slytherin'))) {
        inquisitorialSquad.push(student);
        student.inquisitorialSquad = true; 
        console.log(`${student.firstName} ${student.lastName} added to the Inquisitorial Squad.`);
        inquisitorialBtn.innerText = "Remove from Inquisitorial Squad";
        inquisitorialSquadStatus.innerText = "Inquisitorial Squad: Yes";
      } else {
        console.log(`${student.firstName} ${student.lastName} cannot be added to the Inquisitorial Squad.`);
      }
      updateStudentCount();
    }
  
    
    const displayedCount = filteredAndSortedStudents.length;
    const totalCount = allStudents.length;
    const houseCounts = countStudents(filteredAndSortedStudents);
    displayStudentCounts(displayedCount, totalCount, houseCounts);
  }
  
  
  
  
  
  
  

  
  
  const removeStudentButton = document.getElementById('removeStudentButton');
  function removeStudentFromSquad() {
  
    console.log('Student removed from the Inquisitorial Squad');
    

    removeStudentButton.style.display = 'none';
  }
  removeStudentButton.addEventListener('click', removeStudentFromSquad);


function displayInquisitorialSquad() {

  const inquisitorialStudents = allStudents.filter(student => inquisitorialSquad.includes(student));


  inquisitorialStudents.sort((a, b) => a.firstName.localeCompare(b.firstName));

  const listContainer = document.querySelector("#list tbody");
  listContainer.innerHTML = "";

  inquisitorialStudents.forEach(displayStudent);

  const displayedCount = inquisitorialStudents.length;
  const totalCount = allStudents.length;
  const houseCounts = countStudents(inquisitorialStudents);
  displayStudentCounts(displayedCount, totalCount, houseCounts);
}


document.querySelector("#studentCounts").addEventListener('click', event => {
  if (event.target.textContent.startsWith('Inquisitorial Squad: ')) {
    displayInquisitorialSquad();
  }
});

const inquisitorialSquadBtn = document.getElementById("inquisitorialSquadBtn");
inquisitorialSquadBtn.addEventListener("click", filterStudentsByInquisitorialSquad);

function filterStudentsByInquisitorialSquad() {
  const inquisitorialSquadStudents = allStudents.filter(student => student.inquisitorialSquad === true);
  displayFilteredStudents(inquisitorialSquadStudents);
}


//PREFECTS

function togglePrefect(student) {
  const prefectBtn = document.querySelector("#prefectBtn");
  const prefectStatus = document.querySelector("#prefectStatus");

  if (student.prefect) {
   
    const index = prefects.indexOf(student);
    if (index > -1) {
      prefects.splice(index, 1);
      student.prefect = false; 
      prefectBtn.innerText = "Add to Prefects";
      prefectStatus.innerText = "Prefect: No";
      updateStudentCount(); 
    }
  } else {
    const sameHousePrefects = prefects.filter(prefect => prefect.house === student.house);
    if (sameHousePrefects.length < 2) {
      prefects.push(student);
      student.prefect = true; 
      prefectBtn.innerText = "Remove from Prefects";
      prefectStatus.innerText = "Prefect: Yes";
      updateStudentCount(); 
    } else {
     
      prefectBtn.disabled = true;
      prefectBtn.classList.add("not-eligible", "tooltip");

      
      prefectBtn.innerHTML += '<span class="tooltip-text">There are already two prefects from the same house.</span>';
    }
  }
}






document.getElementById("prefectsBtn").addEventListener('click', event => {
  
    displayPrefects();
  
});

function displayPrefects() {
  const prefectStudents = allStudents.filter(student => student.prefect);

  const listContainer = document.querySelector("#list tbody");
  listContainer.innerHTML = "";

  prefectStudents.forEach(displayStudent);

  const displayedCount = prefectStudents.length;
  const totalCount = allStudents.length;
  const houseCounts = countStudents(prefectStudents);
  displayStudentCounts(displayedCount, totalCount, houseCounts);
}


const prefectsBtn = document.getElementById("prefectsBtn");
prefectsBtn.addEventListener("click", displayPrefects);


// const prefectsBtn = document.getElementById("prefectsBtn");
// prefectsBtn.addEventListener("click", filterStudentsByPrefect);


// function filterStudentsByPrefect() {
//   const filteredStudents = allStudents.filter(student => student.prefect);
//   displayFilteredStudents(filteredStudents);
// }





  openModal(student);



function isPrefect(student) {
  return prefects.includes(student);
}


//UPDATEEEEEE

function updateStudentCount() {
  const displayedCount = filteredAndSortedStudents.length;
  const totalCount = allStudents.length;
  const houseCounts = countStudents(filteredAndSortedStudents);
  displayStudentCounts(displayedCount, totalCount, houseCounts);

  
  const countContainer = document.querySelector("#studentCounts");
  const totalCountElement = countContainer.querySelector("div:first-child");
  totalCountElement.textContent = `Showing ${displayedCount} of ${totalCount} students`;

  const prefectCountElement = document.querySelector("#studentCounts div:nth-child(5)"); 
  prefectCountElement.textContent = `Prefects: ${prefects.length}`;


  const prefectCount = prefects.length; 
  prefectCountElement.textContent = `Prefects: ${prefectCount}`; 
}


//DISPAYED STUDENTS

function displayStudentCounts(displayedCount, totalCount, counts, expelledCount = 0) {
  const countContainer = document.querySelector("#studentCounts");
  countContainer.innerHTML = "";

  const totalCountElement = document.createElement("div");
  totalCountElement.textContent = `Showing ${displayedCount} of ${totalCount} students`;
  countContainer.appendChild(totalCountElement);

  for (const house in counts) {
    const countElement = document.createElement("div");
    countElement.textContent = `${house}: ${counts[house]}`;
    countContainer.appendChild(countElement);
  }

  const inquisitorialCount = inquisitorialSquad.length;
  const inquisitorialCountElement = document.createElement("div");
  inquisitorialCountElement.textContent = `Inquisitorial Squad: ${inquisitorialCount}`;
  countContainer.appendChild(inquisitorialCountElement);

  const prefectCount = prefects.length;
  const prefectCountElement = document.createElement("div");
  prefectCountElement.textContent = `Prefects: ${prefectCount}`;
  countContainer.appendChild(prefectCountElement);

  const expelledCountElement = document.createElement("div");
  expelledCountElement.textContent = `Expelled: ${expelledCount}`;
  countContainer.appendChild(expelledCountElement);
}



//EXPEL

function expelStudent(student) {
  
  if (!expelledStudents.includes(student)) {
   
    expelledStudents.push(student);
  } else {
    console.log("Attempted to expel a student who was already expelled: ", student);
    return;  
  }

 
  const index = allStudents.indexOf(student);
  if (index > -1) {
    allStudents.splice(index, 1);
    
  }

  
  student.expelled = true;


  const studentElement = document.getElementById(student.id);
  if (studentElement) {
    studentElement.classList.add('expelled');
  }




  updateStudentCount();



  const inquisitorialIndex = inquisitorialSquad.indexOf(student);
  if (inquisitorialIndex > -1) {
    inquisitorialSquad.splice(inquisitorialIndex, 1);
  }

  const prefectIndex = prefects.indexOf(student);
  if (prefectIndex > -1) {
    prefects.splice(prefectIndex, 1);
  }

  expelledStudents.push(student);
  console.log(`The student ${student.firstName} ${student.lastName} has been expelled.`);

  if (student.firstName === "Dudley" && student.lastName === "Dursley") {
    alert("Not today, my friend! You cannot expel the Dark Magic Master");
    return;
  }
  
  closeModal(modal);
  updateStudentCount();

  displayList();

}




function showExpelledStudents() {
  const listContainer = document.querySelector("#list tbody");

  listContainer.innerHTML = "";

  const uniqueExpelledStudents = expelledStudents.filter(
    (student, index, self) =>
      index === self.findIndex((s) => s === student)
  );

  uniqueExpelledStudents.forEach(displayStudent);

  const displayedCount = uniqueExpelledStudents.length;
  const totalCount = allStudents.length;
  const houseCounts = countStudents(uniqueExpelledStudents);
  const expelledCount = uniqueExpelledStudents.length;

  displayStudentCounts(displayedCount, totalCount, houseCounts, expelledCount);
}



const showExpelledBtn = document.getElementById("showExpelledBtn");
showExpelledBtn.addEventListener("click", showExpelledStudents);


//HACK

function hackTheSystem() {
  const newStudent = {
    firstName: "Dudley",
    lastName: "Dursley",
    middleName: "",
    nickName: "Duddy",
    image:"./dd.jpg",
    house: "4 Privet Drive Street",
    bloodStatus: "Dark-Blood",
    inquisitorialSquad: false,
    expelled: false,
    prefect: false
  };

  const imageSrc = new Image();
  newStudent.image = imageSrc;

  imageSrc.src = "images/dd.jpg"; // 

  allStudents.push(newStudent);
  displayStudent(newStudent);
  allStudents.forEach((student) => {
    if (student.bloodStatus === "Pure-Blood") {
      student.bloodStatus = "Muggle";
    } else if (student.bloodStatus === "Half-Blood" || student.bloodStatus === "Muggle") {
      student.bloodStatus = "Pure-Blood";
    }
  });

  const displayedCount = filteredAndSortedStudents.length + 1;
  const totalCount = allStudents.length;
  const houseCounts = countStudents(filteredAndSortedStudents);
  displayStudentCounts(displayedCount, totalCount, houseCounts);

  console.log("The system has been hacked!");
}

document.getElementById('hackButton').addEventListener('click', function() {
  hackTheSystem();

 
  this.disabled = true;
});

  





