const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const btnLeft = document.getElementById('left')
const btnRight = document.getElementById('right')
const btnJump = document.getElementById('jump')
const btnAttackOne = document.getElementById('attack-1')
const btnAttackTwo = document.getElementById('attack-2')

let canvasWidth = canvas.offsetWidth
let canvasHeight = canvas.offsetHeight

let velocity = 2

let timeJump = 400
let ground = 90
const spriteMoviments = ['Idle','Run','Jump','Attack_1','Attack_2','Dead']
const nameCharacter = ['samurai-commander','samurai_archer','samurai','kunochi','ninja-monk','ninja-peasant','fire-vizard','lightning-mage','wanderer-magican']

const player = {
  name: 'Player',
  actionActual: 0,
  countSprites: 0,
  numSprites: 0,
  animationTime: 0,
  spritePos: 40,
  sprite: new Image(),
  spriteImg: function(){
    this.sprite.src = `assets/${nameCharacter[3]}/${spriteMoviments[this.actionActual]}.png`
  },
  x:60,
  y:0,
  sizeX: 25,
  sizeY: 60,
  movimentY: 2,
  movimentX: velocity,
  left: false,
  right:false,
  attackOne: false,
  attackTwo: false,
  attackSize: 40,
  jump: [false,0],
  direction: 1,
  life: 100,
  lifeX:2,
  damage: false,
  win: null,
  idle: true,
}

const opponent = {
  name: 'Opponent',
  actionActual: 0,
  countSprites: 0,
  numSprites: 0,
  animationTime: 0,
  spritePos: 47,
  sprite: new Image(),
  spriteImg: function(){
    this.sprite.src = `assets/${nameCharacter[0]}/${spriteMoviments[this.actionActual]}.png`
  },
  x:200,
  y:0,
  sizeX: 25,
  sizeY: 60,
  movimentY: 1.5,
  movimentX: velocity,
  left: false,
  right:false,
  attackOne: false,
  attackTwo: false,
  attackSize: 40,
  jump: [false,0],
  direction: -1,
  life: 100,
  lifeX: 297,
  damage: false,
  win: null,
  idle: false,
}

let largSprites = 0
let posIniX = 0

let time = 60
let countTime = setInterval(()=>{time--},1000)

function updateGame(){
  ctx.clearRect(0,0,canvasWidth,canvasHeight)
  drawPlayer()
  drawOpponent()
  movimentOpponent()
  requestAnimationFrame(updateGame)
}
requestAnimationFrame(updateGame)


function updateCharacter(character){
  character.y += character.movimentY
  character.y += character.jump[1]
  gameCharacters(character)
  drawLife(character)
  drawMoviment(character)
  drawJump(character)
  attack(character)
}
let backgroundImg = new Image()
function drawPlayer(){
  updateCharacter(player)
  detectedWin(player,opponent)
  
}

function drawOpponent(){
  updateCharacter(opponent)
  detectedWin(opponent,player)
}

function draw(element){
  element.spriteImg()
  element.numSprites = element.sprite.width/element.sprite.height
  largSprites = element.sprite.width/element.numSprites
}

let animationInterval = 100
let spriteAnimation = setInterval(()=>{player.countSprites++,opponent.countSprites++
},animationInterval)
function gameCharacters(element){
  ctx.fillStyle = "#00000000"
  draw(element)
  ctx.fillRect(element.x,element.y,element.sizeX,element.sizeY)
  if(element.y >= ground){
    element.movimentY = 0
  }
  function drawSprites(timeActual){
    if(element.countSprites > element.numSprites-1){
      element.countSprites = 0
        }
    posIniX = largSprites*element.countSprites
    let elementDirection = element.direction
    let spritePosition = elementDirection*-element.spritePos
    ctx.scale(elementDirection,1)
    ctx.drawImage(element.sprite,posIniX,30,largSprites,128,(elementDirection*element.x)+spritePosition,element.y,elementDirection*88,70)
    ctx.scale(elementDirection,1)
  }
  if(element.win == false){
    element.actionActual = 5
    element.y = ground
    if(element.countSprites >= element.numSprites-1){
      clearInterval(spriteAnimation)
    }
  }
  else if(element.win){
    element.actionActual = 0
    element.y = ground
  }
  else{
    if(element.right  && element.jump[1] == 0 || element.left && element.jump[1] == 0){
      element.actionActual = 1
    }
    else if(element.jump[1] != 0 || element.y != ground){
      element.actionActual = 2
      if(element.countSprites >= element.numSprites){
        player.countSprites = 0
      }
    }
    else if(element.attackOne){
      element.actionActual = 3
      
      if(element.countSprites >= element.numSprites){
        player.countSprites = 0
      }
    }
    else if(element.attackTwo){
      element.actionActual = 4
      
      if(element.countSprites >= element.numSprites){
        player.countSprites = 0
      }
    }
    else if(element.idle){
      element.actionActual = 0
    }
  }
  drawSprites()
}

function drawLife(element){
  let lifeX = 0
  let directionLife = 1
  ctx.fillStyle="#ff0000"
  ctx.strokeStyle="#ffffff"
  if(element == opponent){
    directionLife = -1
    lifeX = 298
  }
  ctx.scale(-directionLife,1)
  ctx.strokeRect(lifeX,0,-102,23)
  ctx.fillRect(element.lifeX,2,-element.life,20)
  ctx.scale(-directionLife,1)
}

btnLeft.addEventListener('touchstart',(ev)=>{
  ev.preventDefault()
  player.left = true
  player.direction = 1
})

btnLeft.addEventListener('touchend',(ev)=>{
  ev.preventDefault()
  player.left = false
})

btnRight.addEventListener('touchstart',(ev)=>{
  ev.preventDefault()
  player.right = true
})
btnRight.addEventListener('touchend',()=>{
  player.right = false
})

btnAttackOne.addEventListener('click',()=>{
  if(player.attackOne == false && player.attackTwo == false && player.win == null){
    player.attackOne = true
    setTimeout(()=>{
      player.attackOne = false
    },900)
  }
})
btnAttackTwo.addEventListener('click',()=>{
  if(player.attackTwo == false && player.attackOne == false && player.win == null){
    player.attackTwo = true
    setTimeout(()=>{
      player.attackTwo = false
    },900)
  }
})

btnJump.addEventListener('click',()=>{
  if(player.y == ground){
    player.jump[0] = true
    setTimeout(()=>{player.jump[0] = false},timeJump)
  }
})


function attack(element){
  if(element.attackOne && element.win == null || element.attackTwo && element.win == null ){
    ctx.fillStyle="#00000000"
    let ajustedDirection = -10
    if(element.attackTwo){
      element.attackSize = 60
      ajustedDirection = -30
    }
    else{
      element.attackSize = 40
    }
    ctx.fillRect(element.x+element.sizeX*element.direction+ajustedDirection,element.y,element.attackSize,15)
  }
} 

function detectedWin(element,elementTarget){
  function drawTime(){
    ctx.font="25px Arial"
    ctx.fillStyle="#ffffff"
    ctx.fillText(`${time}`,135,23)
    if(time == 0){
      clearInterval(countTime)
      if(element.life < elementTarget.life){
        element.win = true
        elementTarget.win = false
      }
      if(element.life < elementTarget.life){
        elementTarget.win = true
        element.win = false
      }
      if(element.life == elementTarget.life){
        ctx.fillText(`Empate`,100,90)
      }
      }
      if(element.win){
        ctx.font=`12px arial`
        ctx.fillStyle="#ffffff"
        ctx.fillText(`${element.name} Win`,100,90)
        velocity = 0
        clearInterval(countTime)
    }
  }
  drawTime()
  if(element.attackOne || element.attackTwo){
    if(element.x+element.attackSize*element.direction < elementTarget.x + elementTarget.sizeX &&
      element.x+element.attackSize + element.attackSize*element.direction > elementTarget.x &&
        element.y < elementTarget.y + elementTarget.sizeY &&
        element.y + element.sizeY > elementTarget.y){
          elementTarget.damage = true
          if(elementTarget.life <= 0){
            lifeLess = 0
            element.win = true
            elementTarget.win = false
          }
          else{
            let lifeLess = 0.2
            while(elementTarget.damage){
              
              elementTarget.life -= lifeLess
              break
            }
            
          }
      }
  }
    else{
      elementTarget.damage = false
    }
}


function drawJump(element){
  if(element.jump[0] && element.y == ground){
    element.jump[1] = -velocity
    element.idle = false
  }
  if(element.jump[0] == false && element.y <= 50 && element.jump[1] == -2){
      element.jump[1] = velocity
    }
  if(element.y == ground && element.jump[0] == false){
    element.jump[1] = 0
    element.idle= true
  }
}
let intelligence;
setInterval(()=>{intelligence = Math.round(Math.random()*5)},100)
function movimentOpponent(){
  let playersDistance = opponent.x - player.x
  if(playersDistance <= 0 && opponent.left == false && opponent.attackOne == false  && opponent.attackTwo == false && intelligence == 0){
    opponent.right = true
  }
  if(playersDistance >= 60 && playersDistance <= 250  && opponent.attackOne == false && opponent.attackTwo == false &&  opponent.right == false && intelligence == 1){
    opponent.left = true
  }
  if(playersDistance <= 30){
    opponent.left = false
  }
  if(playersDistance >= -30){
    opponent.right = false
  }
  if(playersDistance >=-30 && playersDistance <= 50 && opponent.attackOne == false && opponent.attackTwo == false && opponent.win == null && intelligence == 2){
    opponent.attackOne = true
    setTimeout(()=>{
      opponent.attackOne = false
    },800)
    }
  if(playersDistance >=-30 && playersDistance <= 40 && opponent.attackOne == false && opponent.attackTwo == false && opponent.win == null && intelligence == 5){
      opponent.attackTwo = true
    setTimeout(()=>{
      opponent.attackTwo = false
    },800)
    }
  if(playersDistance >= 40 && opponent.y == ground && opponent.life <= 85 && opponent.attackOne == false && opponent.attackTwo == false && intelligence == 3){
    setTimeout(()=>{
      opponent.jump[0] = true
    },timeJump)
    setTimeout(()=>{
      opponent.jump[0] = false
    },timeJump*2)
  }
  if(opponent.right == false && opponent.left == false && intelligence == 4){
    opponent.idle = true
  }
}

function drawMoviment(element){
    if(element.right){
      element.x += velocity
      element.direction = 1
    }
    if(element.left){
      element.x -= velocity
      element.direction = -1
    }
    if(element.x <= 0){
      element.x = 0
    }
    if(element.x >= canvasWidth-60){
      element.x = canvasWidth-60
    }
    
}
