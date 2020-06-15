const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

const questions = [
  {
    type: "list",
    message: "What type of Employee would you like to add?",
    name: "role",
    choices: [
        "Manager",
        "Engineer",
        "Intern"
    ]
  },
  {
    type: "input",
    name: "name",
    message: "What is the employee's name?"
  },
  {
    type: "input",
    name: "id",
    message: "What is the employee's id number?"
  },
  {
    type: "input",
    name: "email",
    message: "What is the employee's email?"
  },
  // Manager question
  {
    type: "input",
    name: "office",
    message: "What is the manager's office number?",
    when: (questions) => questions.empType === "Manager"
  },
  // Engineer question
  {
    type: "input",
    name: "github",
    message: "What is the engineer's GitHub username?",
    when: (questions) => questions.empType === "Engineer"
  },
  // Intern question
  {
    type: "input",
    name: "school",
    message: "What school does the intern's attend?",
    when: (questions) => questions.empType === "Intern"
  },
  // Add employee
  {
    type: "list",
    name: "add",
    message: "Would you like to add another employee?",
    choices: [
      "Yes",
      "No"
    ]
  }
];

let answers = []

async function init() {
  try {
    await inquirer.prompt(questions).then(data => {
      answers.push(data);
      if (data.add === "Yes") {
        init();
      } else {
        const employees = []

        const engineers = answers.filter(employee => employee.role === 'Engineer');
        const interns = answers.filter(employee => employee.role === 'Intern');
        const managers = answers.filter(employee => employee.role === 'Manager');

        engineers.forEach(engineer => {
          employees.push(new Engineer(engineer.name, engineer.id, engineer.email, engineer.ghUn));
        });
  
        interns.forEach(intern => {
          employees.push(new Intern(intern.name, intern.id, intern.email, intern.school));
        });
  
        managers.forEach(manager => {
          employees.push(new Manager(manager.name, manager.id, manager.email, manager.officeNumber));
        });
  
        const employeeHTML = render(employees);

        console.log(employeeHTML);
      }
    });

  } catch (err) {
    console.log(err);
  }
}


init();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
