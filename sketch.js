var trex, trex_running, trex_collided;

var ground, invisibleGround, groundImage;

var nubesgrupo, obstaculosgrupo

var cloud, cloudsGroup, cloudImage;

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var PLAY = 1;

var FIN = 2;

var ESPERANDO = 3;

var estadodeljuego = ESPERANDO;

var score;

var GameOver

var overimage;

var sonidosalto;

var SonidoMorido;

var restart , restartimage , startimagen;

var botoninicio;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  SonidoMorido = loadSound ("muerte-de-minecraft-sonido.mp3");
  sonidosalto = loadSound ("sonido-de-salto-caricatura.mp3");

  overimage = loadImage ("game_over_PNG57.png");
  restartimage = loadImage("retart.png");
  startimagen = loadImage("start.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;
  trex.debug = false ;
  trex.setCollider ("circle", 0, 0 , 30);

  ground = createSprite(width/2,height-40,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(width/2,height-30,width,10);
  invisibleGround.visible = false;
  
  GameOver = createSprite(width/2,height/2,50,50);
  GameOver.addImage ("GameOver", overimage); 
  GameOver.scale = 0.2;

  restart = createSprite(width/2,height/2 + 75, 50, 50);
  restart.addImage ("restart", restartimage);
  restart.scale = 0.2;

  console.log("Hola" + 5);
  
  score = 0;

  botoninicio = createSprite(width/2, height/2, 50, 50);
  botoninicio.addImage ("start", startimagen);
  botoninicio.scale = 0.2;

  obstaculosgrupo = new Group();
  nubesgrupo = new Group();
}



function draw() {
  background(180);
  
  text("Puntuación: "+ score, width - 200,50);
  text(estadodeljuego, 50,50);
 
  if (estadodeljuego === ESPERANDO){
    botoninicio.visible = true
    GameOver.visible = false;
    restart.visible = false;
    trex.changeAnimation ("running",trex_running);

    ground.velocityX = 0 ;
    
    trex.velocityY = 0 ; 

    if ((touches.length > 0 ||mousePressedOver(botoninicio))){
      score = 0;
      estadodeljuego = PLAY
      obstaculosgrupo.destroyEach ();
      nubesgrupo.destroyEach ();
    }

  } 

  if (estadodeljuego === PLAY){

    botoninicio.visible = false;
    ground.velocityX = -4 ;

    if((touches.length > 0 || keyDown("space"))&& trex.y >= 100) {
      trex.velocityY = -10;
      sonidosalto.play();
    }
    score = score + Math.round(frameCount/100);
    //oculto botones 

    GameOver.visible = false;
    restart.visible = false;

    trex.velocityY = trex.velocityY + 0.8
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

     //aparecer nubes
    spawnClouds();
  
   //aparecer obstáculos en el suelo
   spawnObstacles();

   if(obstaculosgrupo.isTouching(trex)){
    SonidoMorido.play();
    estadodeljuego = FIN;
  }
  }
  
  if (estadodeljuego === FIN){

    ground.velocityX = 0 ;
    obstaculosgrupo.setVelocityXEach(0);
    nubesgrupo.setVelocityXEach(0);
    trex.velocityY = 0 ;

    trex.changeAnimation ("collided", trex_collided);

    obstaculosgrupo.setLifetimeEach(-1);
    nubesgrupo.setLifetimeEach(-1);

    GameOver.visible = true;
    restart.visible = true;
    botoninicio.visible = false;

    if ((touches.length > 0 ||mousePressedOver(restart))){
      estadodeljuego = ESPERANDO;
    }
  }
    
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width/2,height - 50,10,40);
   obstacle.velocityX = -6;

   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y ciclo de vida al obstáculo            
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaculosgrupo.add (obstacle);
 }
}




function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,500,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar ciclo de vida a la variable
    cloud.lifetime = 200;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    nubesgrupo.add (cloud);
  }
  
}
