//Create variables here
var dog, database, foodS;
var fedTime, lastFed, currnetTime;
var feed, addfood;
var foodObj;
var bedroom, garden, washroom;
var gameState, readState;

function preload()
{
  //load images here
  dogImage = loadImage("pet/Dog.png");
  dogImage2 = loadImage("pet/happy dog.png");
  gardenImg = loadImage("pet/Garden.png");
  bedroomImg = loadImage("pet/Bed Room.png");
  washroomImg = loadImage("pet/Wash Room.png");
}

function setup() {
  database = firebase.database();

  createCanvas(1000, 500);

  foodObj = new Food();
  
  dog = createSprite(250, 350, 10, 10);
  dog.addImage(dogImage);
  dog.scale = 0.2;

  feed = createButton("Feed the dog");
  feed.position(650, 95);
  feed.mousePressed(feedDog);

  addfood = createButton("Add food");
  addfood.position(750, 95);
  addfood.mousePressed(addFood);

   foodObj = new Food();

   fedTime = database.ref('FeedTime');
   fedTime.on("value", function(data){
     lastFed = data.val();
   })

   foodStock = database.ref('Food');
   foodStock.on("value", readStock);

   readState=database.ref('gameState');
   readState.on("value",function(data){
     gameState=data.val();
   });
}


function draw() {  
  background("white");
  
  foodObj.getFoodStock();
  foodObj.display(foodS);

  drawSprites();

 
  strokeWeight(3);
  stroke("black");
  textSize(20);
  fill("white");
  text("Food Remaining : " + foodS, 150,150);
  text("Note : " + "Stuff is missing and I don't know how to fix", 475, 50);
  
  if(lastFed > 12){
    text(" Last Fed : " + lastFed%12 + " P.M", 300, 30);
  }else if(lastFed == 0){
    text("Last Fed : 12 A.M", 300, 30);
  }else{
    text("Last Fed : " + lastFed +  " A.M", 300, 30);
  }

 if(gameState!="Hungry"){
  feed.hide();
  addFood.remove();
  dog.remove();
  }else{
 feed.show();
 addFood.show();
 dog.addImage(sadDog);
  }

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

function writeStock(x) {
  if(x <= 0) {
    x = 0;
  }
  else{
    x = x - 1;
  }

  database.ref('/').update({
    Food : x
  })
}

function addFood() {
    foodS++;
    database.ref('/').update({
        Food : foodS
    })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}

