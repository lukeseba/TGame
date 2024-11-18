let appName, header, message, objective, destination

function preload() {
  base = loadImage('/base.png');
  backgroundGradient = loadImage('/background-gradient.png');
  notiCard = loadImage('/notiCard.png');
  notiCardTint = loadImage('/notiCardNoTransp.png');


  
  messagesIcon = loadImage('/Messages.png');
  bostonTIcon = loadImage('/bostonT.png');
  dunkinIcon = loadImage('/dunkin.png');
  calendarIcon = loadImage('/calendar.png');
  
  alexandriaFont = loadFont('/alexandria.ttf')
  alexandriaSemiBoldFont = loadFont('/alexandria-semi-bold.ttf')
  alexandriaLightFont = loadFont('/alexandria-light.ttf')
  alexandriaMediumFont = loadFont('/alexandria-medium.ttf')
  
  cardTable = loadTable('/cards.csv', "csv", "header")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  greenLine = ["green", "Boston", "South", "Chestnut", "Chiswick", "Suther", "Washingtn", "Warren", "Allston", "Griggs", "Harvard", "Packard", "Babcock", "Amory", "Blandfrd", "Kenmore", "Hynes", "Copley", "Arlington", "Boylston", "Park", "GovtCenter", "Cleveland", "Englewood", "Dean", "Tappan", "Fairbanks", "Brandon", "Summit", "Coolidge", "Paul", "Kent", "Hawes", "Marys", "Riverside", "Woodland", "Waban", "Eliot", "Highlands", "Centre", "Reservoir", "Beaconsfield", "Hills", "Village", "Longwood", "Fenway", "Haymarket", "North", "Science", "Lechmere", "Somerville", "Gilman", "Magoun", "Ball", "Medford", "Union", "Heath", "Back", "Riverway", "Mission", "Fenwood", "Brigham", "Museum", "Northeastern", "Symphony", "Prudential"]
  orangeLine = ["orange", "Oak", "Malden", "Wellington", "Assembly", "Sullivan", "Community", "North", "Haymarket", "State", "Downtown", "Chinatown", "Tufts", "BackBay", "MassAve", "Ruggles", "Roxbury", "Jackson", "Stony", "Green", "Forest"]
  redLine = ["red", "Alewife", "Davis", "Porter", "Harvard", "Central", "Kendall", "Charles", "Park", "Downtown", "South", "Broadway", "Andrew", "JFK", "NorthQuincy", "Wollaston", "QuincyCenter", "QuincyAdams", "Braintree", "Savin", "Fields", "Shawmut", "Ashmont"]
  blueLine = ["blue", "Wonderland", "Revere", "Beachmont", "Suffolk", "Orient", "Wood", "Airport", "Maverick", "Aquarium", "State", "GovtCen", "Bowdoin"]
  
  lines = [blueLine, orangeLine, redLine, greenLine]
  
  icons = [messagesIcon, bostonTIcon, dunkinIcon, calendarIcon]
  iconNames = ["Messages", "Boston Transit", "Dunkin", "Calendar"]
  
  
  cards = []
  currentCards = []
  for (let i = 0; i < cardTable.getRowCount(); i++) {
    cards.push(new Card(
      cardTable.getString(i, 0),
      cardTable.getString(i, 1),
      cardTable.getString(i, 2),
      cardTable.getString(i, 3),
      cardTable.getString(i, 4).split(" "),
      boolean(cardTable.getString(i, 5))))
  }
  notiButton = new Button("rectangle", "#FF8181", 
               width/2, height/2, 
               width/1.2, width/4, 
               "New Notification", "black", newNoti)
  
  resizeHeight = windowHeight
}

function draw() {
  notiButton.update()
  
  if (currentCards.length > 0) {
    createCanvas(width, max(windowHeight, currentCards.length * (currentCards[0].h /1.05) + notiButton.h*1.3))
  } else {
    createCanvas(width, windowHeight)
  }
  image(backgroundGradient, 0, 0, width, height)
  
  for (let i = 0; i < currentCards.length; i++) {
    currentCards[i].moveY = i * currentCards[i].h/1.05
    currentCards[i].lockY = currentCards[i].moveY
    currentCards[i].render()
    currentCards[i].update()
  }
  if (currentCards.length > 0) {
    notiButton.y = currentCards.length * (currentCards[0].h /1.05) + notiButton.h/1.3
  } else {
    notiButton.y = notiButton.h
  }
  notiButton.render()
}

function newNoti() {
  let newCard = cards[floor(random(0, cards.length))]
  newCard.w = width/1.2
  newCard.h = newCard.w/1.4
  newCard.x = (width - newCard.w)/2
  newCard.lockX = newCard.x
  newCard.moveX = newCard.x
  newCard.y = height+newCard.h
  currentCards.push(newCard)
}

function wrap(txt, size) {
  let splitMessage = txt.split(" ")
  let wrappedMessage = [""];
  for(let word = 0; word < splitMessage.length; word++) {
    if (textWidth(wrappedMessage[wrappedMessage.length-1])
        + textWidth(splitMessage[word] + " ") >= size) {
      wrappedMessage.push("");
    }
    wrappedMessage[wrappedMessage.length-1] += splitMessage[word] + " ";
  }
  return wrappedMessage
}

function wrappedText(txt, x, y, gap) {
  for (let i = 0; i < txt.length; i++) {
    text(txt[i], x, y+(i*gap))
  }
}

function textStops(stops, x, y) {
  blendMode(BLEND)
  let xOffset = x
  for (let i = 0; i < stops.length; i++) {
    for (let s = 0; s < lines.length; s++) {
      if (lines[s].includes(stops[i])) {
        fill(lines[s][0])
        text(stops[i], xOffset, y)
        xOffset += textWidth(stops[i])
        if(i < stops.length-1) {
          fill("black")
          text(", ", xOffset, y)
          xOffset += textWidth(", ")
        }
        break
      }
    }
  }
}
  
class Card { 
  constructor(appName, header, message, objective, destination, instant) {
    this.appName = appName
    this.header = header
    this.message = message
    this.objective = objective
    this.destination = destination
    this.instant = instant
    this.img = createImage(1008, 720)
    this.updateImage()
    this.x = 0
    this.y = 0
    this.lockX = 0
    this.lockY = 0
    this.moveX = 0
    this.moveY = 0
    this.w = 1008
    this.h = 720
    this.animSpeed = 1
    this.swipeState = 0
    this.justReleased = false
  }
  update() {
    if (mouseX >= this.x && mouseX <= this.x+this.w &&
        mouseY >= this.y && mouseY <= this.y+this.h && mouseIsPressed) {
      this.justReleased = false
      this.moveX += mouseX - pmouseX
    } else {
      if (this.justReleased == false) {
        this.justReleased = true 
        if (pmouseX - mouseX >= this.w/10) {
          this.moveX = -this.w*2
          this.swipeState = 1
        }
      }
      if (this.swipeState == 0) {
        this.moveX = this.lockX
      }
    }
    if (this.swipeState == 1 && this.x < -this.w) {
      for (let i = 0; i < currentCards.length; i++) {
        if (currentCards[i].y == this.y) {
          currentCards.splice(i, 1)
        }
      }
    }
    this.x = lerp(this.x, this.moveX, this.animSpeed/10)
    this.y = lerp(this.y, this.moveY, this.animSpeed/10)
  }
  render(x, y, w, h) {
    if (x == null) {
      x = this.x
      y = this.y
    } else {
      x += this.x
      y += this.y
    }
    if (w == null) {
      w = this.w
      h = this.h
    } else {
      w += this.w
      h += this.h
    }
    image(this.img, x, y, w, h)
  }
  
  updateImage() {
    let rememberWidth = width
    let rememberHeight = height
    createCanvas(1008, 720)
    this.renderReal()
    this.img = get()
    createCanvas(rememberWidth, rememberHeight)
  }
  renderReal() {
    //background(255);
    fill("#051d1c")
    blendMode(BLEND)
    //image(backgroundGradient, 0, 0)
    image(notiCardTint, 0, 0)
    tint(255, 210)
    for (let i = 0; i < iconNames.length; i++) {
      if (iconNames[i] == this.appName) {
        image(icons[i], 0, 0)
      }
    }
    tint(255, 255)

    textFont(alexandriaFont, 45)
    blendMode(OVERLAY)
    text("1m ago", 735, 160)
    textSize(60)
    text(this.appName, 200, 160)

    textFont(alexandriaSemiBoldFont)
    blendMode(HARD_LIGHT)
    text(this.header, 75, 275)

    textFont(alexandriaLightFont, 50)
    wrappedText(wrap(this.message, width-150), 75, 345, 60)

    textFont(alexandriaSemiBoldFont)
    blendMode(OVERLAY)
    if (this.instant)
      text("Swipe Instantly", 75, 490)
    else
      text("Swipe After", 75, 490)

    textFont(alexandriaMediumFont)
    blendMode(SOFT_LIGHT)
    wrappedText(wrap(this.objective, width-150), 75, 550, 60)

    textStops(this.destination, 75, 615)
  }
}