/**
 * Stores the list of robots
 * @type {Kitten[]}
 */

let robots = [];

loadRobots()
botCheck()

/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the robots list.
 * Then reset the form
 */
function addRobot(event) {
  event.preventDefault()
  let form = event.target
  let robotId = generateId()
  let robotName = form.robotName.value
  let robot = robots.find(robot => robot.name == robotName)
  document.getElementById("drill-sound").play()

  if(!robot){
    let robot = {id: robotId, name: robotName, mood: "tolerant",  affection: 5}
    robots.push(robot)
    saveRobots()
  }
  form.reset()
  drawRobots()
}

/**
 * Converts the robots array to a JSON string then
 * Saves the string to localstorage at the key robots
 */
function saveRobots() {
  window.localStorage.setItem("robots", JSON.stringify(robots))
  drawRobots()
}

/**
 * Attempts to retrieve the robots string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the robots array to the retrieved array
 */
function loadRobots() {
  let robotsData = JSON.parse(window.localStorage.getItem("robots"))
  if(robotsData){
    robots = robotsData
  }
}

function botCheck(){
    if(robots.length > 0){
      document.getElementById("destroy-button").classList.remove("hidden")
    }
  }


function destruction(){
  while(robots.length > 0){
    robots.pop();
    localStorage.clear();
    document.getElementById("destroy-button").classList.add("hidden")
  }
}


/**
 * Draw all of the robots to the robots element
 */
function drawRobots() {
  loadRobots()
  let robotElem = document.getElementById("robots")
  let robotTemplate = ""

  robots.forEach(robot => {
    robotTemplate +=`
    <div class="robot-border bg-dark robot ${robot.mood} text-light mr-1 mt-2">
      <img class="robot" src="https://robohash.org/${robot.name}?set=set1&size=150x150">
      <div class="d-flex justify-content-center"><span style="font-weight: bold;">Name:&nbsp;</span> ${robot.name}</div>
      <div id="is-gone" class="">
      <div class="d-flex justify-content-center"><span style="font-weight: bold;">Mood:&nbsp;</span> ${robot.mood}</div>
      <div class="d-flex justify-content-center"><span style="font-weight: bold;">Affection:&nbsp;</span> ${robot.affection}</div>
      <div class="d-flex space-between"></div>
      <button class="btn-cancel m-1" onclick="grease('${robot.id}')">Grease</button>
      <button class="m-1" onclick="reboot('${robot.id}')">Reboot</button>
      </div>
      <div class="d-flex justify-content-center"><i class="fa fa-window-close text-danger2 mb-1 mt-1" onclick="deleteRobot('${robot.id}')"></i></div>
      </div>
    </div>
 `
})
robotElem.innerHTML = robotTemplate
}

/**
 * Find the robot in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findRobotById(id) {
  return robots.find(k => k.id == id);
}

/**
 * Find the robot in the array of robots
 * Generate a random Number
 * if the number is greater than .7
 * increase the robots affection
 * otherwise decrease the affection
 * save the robots
 * @param {string} id
 */
function grease(id) {
  let myRobotId = findRobotById(id)
  let greaseNum = Math.random()
  document.getElementById("grease-sound").play()


  if(greaseNum >.7){
    myRobotId.affection ++
    setRobotMood(myRobotId)
    saveRobots()
  }
  else myRobotId.affection --
  setRobotMood(myRobotId)
  saveRobots()
}

/**
 * Find the robot in the array of robots
 * Set the robot's mood to tolerant
 * Set the robot's affection to 5
 * save the robots
 * @param {string} id
 */
function reboot(id) {
  let myRobotId = findRobotById(id)
  myRobotId.mood = "tolerant"
  myRobotId.affection = 5

  document.getElementById("reboot-sound").play()
  saveRobots()
}

/**
 * Sets the robots mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} robot
 */
function setRobotMood(robot) {
  document.getElementById("robots").classList.remove(robot.mood)

  if (robot.affection >= 6) {robot.mood = "happy"}
  if (robot.affection <= 5) {robot.mood = "tolerant"}
  if (robot.affection <= 3) {robot.mood = "angry"}
  if (robot.affection <= 0) {robot.mood = "gone"}

  document.getElementById("robots").classList.add(robot.mood)
  saveRobots()
}

function getStarted() {
  document.getElementById("welcome").remove();
  document.getElementById("main-div").classList.remove("hidden")
  document.getElementById("start-sound").play()
  drawRobots()
}

function deleteRobot(id){
  let robotIn = robots.findIndex(robot => robot.id == id)
  robots.splice(robotIn, 1)
  saveRobots()
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}
