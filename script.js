 "use strict";

//__________________________________________________________FETCH AND PREPARE DATA _______________________________________________________________________________________________

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

function start() {
  console.log("ready");

  loadJSON();
}

function loadJSON() {
  fetch("students.json")
    .then(response => response.json())
    .then(jsonData => {
      prepareObjects(jsonData);
    });
  displayList();
}

//__________________________________________________________CLEANING DATA _______________________________________________________________________________________________


function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    const Student = {
      firstName: "",
      lastName: "",
      middleName: "",
      nickName: "Null",
      image: "",
      house: "",
    };

    const student = Object.create(Student);


    // FIRST NAME_______________________________________________________________________________________________

    let fullnameString = jsonObject.fullname;
    let result = "";

    let trimmedString1 = fullnameString.trimStart();
    result = trimmedString1.substring(0, trimmedString1.indexOf(" "));
  
    student.firstName = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();

    console.log(student.firstName);

    // LEANNE ?? _______________________________________________________________________________________________
     // // If the fullname is Leanne, just show the fullname
    // if (fullnameString === "Leanne") {
    //   result = fullnameString;
    // }  

    //   if (lastnameL === "leanne") {
    //   imageSrc.src = "";
    // }

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

    // ADD TO ALL STUDENTS INTO GLOBAL ARRAY

    allStudents.push(student);
    console.log(allStudents);
  });

  displayList();
}

function displayList() {
  document.querySelector("#list tbody").innerHTML = "";

  allStudents.forEach(displayStudent);
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

  document.querySelector("#list tbody").appendChild(clone);
}





//__________________________________________________________FILTER_______________________________________________________________________________________________





//__________________________________________________________MASONRY GRID_______________________________________________________________________________________________


//SORT

document.getElementById('sortByFirstName').addEventListener('click', sortStudentsByFirstName);
document.getElementById('sortByLastName').addEventListener('click', sortStudentsByLastName);
document.getElementById('sortByHouse').addEventListener('click', sortStudentsByHouse);

// Add event listeners to the house buttons
const houseButtons = document.querySelectorAll('.houseButton');
houseButtons.forEach(button => {
  button.addEventListener('click', () => {
    const house = button.getAttribute('data-house');
    filterStudentsByHouse(house);
  });
});

function sortStudentsByFirstName() {
  allStudents.sort((a, b) => a.firstName.localeCompare(b.firstName));
  displayList();
}

function sortStudentsByLastName() {
  allStudents.sort((a, b) => a.lastName.localeCompare(b.lastName));
  displayList();
}

function sortStudentsByHouse() {
  allStudents.sort((a, b) => a.house.localeCompare(b.house));
  displayList();
}

function filterStudentsByHouse(house) {
  const filteredStudents = allStudents.filter(student => student.house === house);
  displayFilteredStudents(filteredStudents);
}

function displayFilteredStudents(filteredStudents) {
  document.querySelector("#list tbody").innerHTML = "";

  filteredStudents.forEach(displayStudent);
}

function displayList() {
  document.querySelector("#list tbody").innerHTML = "";

  allStudents.forEach(displayStudent);
}


//SEARCH

function start() {
  console.log("ready");

  loadJSON();

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", performSearch);
}

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

  filteredStudents.forEach(displayStudent);
}


//MODAL WITH INFO

//HACK

//BLOOD STATUS

//EXPELLING

//PREFECTS

//INQUISITORIAL