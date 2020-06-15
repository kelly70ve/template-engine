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
    when: (questions) => questions.role === "Manager"
  },
  // Engineer question
  {
    type: "input",
    name: "github",
    message: "What is the engineer's GitHub username?",
    when: (questions) => questions.role === "Engineer"
  },
  // Intern question
  {
    type: "input",
    name: "school",
    message: "What school does the intern's attend?",
    when: (questions) => questions.role === "Intern"
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

function init() {
  inquirer.prompt(questions).then(data => {
    answers.push(data);
    if (data.add === "Yes") {
      init();
    } else {
      const employees = []

      const engineers = answers.filter(employee => employee.role === 'Engineer');
      const interns = answers.filter(employee => employee.role === 'Intern');
      const managers = answers.filter(employee => employee.role === 'Manager');

      engineers.forEach(engineer => {
        employees.push(new Engineer(engineer.name, engineer.id, engineer.email, engineer.github));
      });

      interns.forEach(intern => {
        employees.push(new Intern(intern.name, intern.id, intern.email, intern.school));
      });

      managers.forEach(manager => {
        employees.push(new Manager(manager.name, manager.id, manager.email, manager.office));
      });

      const employeeHTML = render(employees);

      fs.writeFile(outputPath, employeeHTML, (err) => {
        if (err) throw err;
        console.log("Your team site has been made!")
      });
    }
  });
}

init();