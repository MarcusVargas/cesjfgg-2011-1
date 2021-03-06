/*
This file are part of CESJFGG-2011-1.

CESJFGG-2011-1 is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

CESJFGG-2011-1 is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with CESJFGG-2011-1.  If not, see <http://www.gnu.org/licenses/>.
*/

var tela = document.getElementById("tela");
var ctx = tela.getContext("2d");

var pontos = 0;
var vidas = 5;
var x = 0;
var y = 0;
var gravidadeY = 30;
var acelerando=false;
document.addEventListener("keydown",botaoPressionado,false);
document.addEventListener("keyup",botaoSolto,false);
var r = 0;
var frame=0;
var framel=0;

const fps = 30;
const segundo = 1000;
var intervalo = segundo/fps;
var vy = 0 ;
setInterval(passo,intervalo);

var imagemInimigo = new Image();
imagemInimigo.src = "enemy_4.png";
var imagemBoom = new Image();
imagemBoom.src = "exp2_0.png";

var pcfoguete = new Sprite(150, 375, 70, 50);
var astro0 = new Sprite(-40,120,40,40);
var astro1 = new Sprite(340,50,40,40);
var astro2 = new Sprite(-100,220,40,40);
var inimigo1 = new Sprite(-100,280,32,32);
var boom = new Sprite(50,50,64,64);

function Sprite(x,y,h,w){
   this.x = x;
   this.y = y;
   this.h = h;
   this.w = w;
}

function desenhaFoguete(){

   ctx.strokeStyle = "rgb(0, 0, 0)";
   //Casco
   ctx.beginPath();
   ctx.rect(110+x,200+y, 40, 50);
   ctx.closePath();   
   ctx.fillStyle = "rgb(150, 150, 250)";
   ctx.fill();
   ctx.lineWidth = 2;
   ctx.stroke();


   ctx.beginPath();
   ctx.moveTo(110+x,250+y);
   ctx.lineTo(90+x,250+y);
   ctx.lineTo(110+x,235+y);
   ctx.closePath();
   ctx.fillStyle = "rgb(250, 150, 150)";
   ctx.fill();
   ctx.stroke();


   ctx.beginPath();
   ctx.moveTo(150+x,250+y);
   ctx.lineTo(170+x,250+y);
   ctx.lineTo(150+x,235+y);
   ctx.closePath();
   ctx.fill();
   ctx.stroke();


   ctx.beginPath();
   ctx.moveTo(110+x,200+y);
   ctx.lineTo(130+x,180+y);
   ctx.lineTo(150+x,200+y);
   ctx.closePath();
   ctx.fillStyle = "rgb(150, 250, 150)";
   ctx.fill();
   ctx.stroke();


   ctx.beginPath();
   ctx.arc(130+x,225+y, 10, 0, 2*Math.PI, false);
   ctx.closePath();
   ctx.fillStyle = "rgb(100, 100, 150)";
   ctx.fill();
   ctx.stroke();
}

//lipar a tela
function limpar(){
   ctx.fillStyle = "rgb(255, 255, 255)";
   ctx.fillRect(0,0, 300, 400);
}

function passo(){
   limpar();
   if(acelerando){
    vy-=100*(intervalo/1000);  
   }
   vy+=gravidadeY*(intervalo/1000);
   //y+=vy*(intervalo/1000); 
   pcfoguete.y+=vy*(intervalo/1000);
   y = pcfoguete.y-200-50/2;
   x = pcfoguete.x-110-40/2;
/*
   if(y>150){
      y=150;
      vy=0;   
   }
   if (y<(0-180)){
   y=-180;
   vy=0;
   }
*/
   if(pcfoguete.y>(400-pcfoguete.h/2)){
      pcfoguete.y=(400-pcfoguete.h/2);
      vy=0;   
   }
   if (pcfoguete.y<(0)){
   pcfoguete.y=0;
   vy=0;
   }
   desenhaFoguete();
   desenhaLimiteSprites(pcfoguete);
   

   desenhaAstronauta(astro0.x++, astro0.y, 45+r++);  
   desenhaLimiteSprites(astro0);
   desenhaAstronauta(astro1.x--, astro1.y, r++);  
   desenhaLimiteSprites(astro1);
   desenhaAstronauta(astro2.x++, astro2.y, 120+r++);  
   desenhaLimiteSprites(astro2);
   desenhaInimigo(inimigo1.x++, inimigo1.y, 50+r++);  
   desenhaLimiteSprites(inimigo1);
   desenhaBoom(boom.x, boom.y, 0);  
   if(++frame>3) {
      frame = 0;
      framel++;
   }
   if(framel>3) {
      framel = 0;
      boom.x = -1000;
      boom.y = -1000;
   }
   if(colisao(astro0, pcfoguete)){
      astro0.x=1000;
      pontos++;
   }
   if(colisao(astro1, pcfoguete)){
      astro1.x=-1000;
      pontos++;
   }
   if(colisao(astro2, pcfoguete)){
      astro2.x=1000;
      pontos++;
   }
   if(colisao(inimigo1, pcfoguete)){
      boom.x = pcfoguete.x;
      boom.y = pcfoguete.y;
      frame = 0;
      framel = 0;
      pcfoguete.y=(400-pcfoguete.h/2);
      vidas--;
   }

   if(astro0.x>340){
      astro0.x= -40;
   }
   if(astro1.x<-40){
      astro1.x= 340;
   }
   if(astro2.x>340){
      astro2.x= -40;
   }
   if(inimigo1.x>340){
      inimigo1.x= -40;
   }
   desenhaPlacar();
}

function botaoPressionado(evento){
   if(evento.keyCode==38){
      console.log(evento.keyCode);
      acelerando=true;     
   }
}

function botaoSolto(evento){
   if(evento.keyCode==38){
      console.log(evento.keyCode);
      acelerando=false;     
   }
}

function desenhaBoom(x, y, a){
   ctx.save();
   ctx.translate(x, y);
   //ctx.rotate(a*2*Math.PI/360);
   ctx.drawImage(imagemBoom,frame*64,framel*64,64, 64,-32,-32, 64, 64);
   ctx.restore();
}

function desenhaInimigo(x, y, a){
   ctx.save();
   ctx.translate(x, y);
   ctx.rotate(a*2*Math.PI/360);
   ctx.drawImage(imagemInimigo,-16,-16);
   ctx.restore();
}
function desenhaAstronauta(x, y, a){
   ctx.strokeStyle = "rgb(0, 0, 0)";
   ctx.save();
   ctx.translate(x, y);
   ctx.rotate(a*2*Math.PI/360);
   ctx.beginPath();
   ctx.arc(0, -10, 10, 0, 2*Math.PI, false);
   ctx.closePath();
   ctx.fillStyle = "yellow";
   ctx.fill();
   ctx.stroke();

   ctx.moveTo(-20,0);
   ctx.lineTo(20,0);
   ctx.stroke();
   ctx.moveTo(0,0);
   ctx.lineTo(20,20);
   ctx.stroke();
   ctx.moveTo(0,0);
   ctx.lineTo(-20,20);
   ctx.stroke();
   
   ctx.restore();
}

function colisao(o1, o2){
   if((o1.y-o1.h/2)>(o2.y+o2.h/2)){
      return false;
   }
   if((o1.y+o1.h/2)<(o2.y-o2.h/2)){
      return false;
   }

   if((o1.x+o1.w/2)<(o2.x-o2.w/2)){
      return false;
   }
   if((o1.x-o1.w/2)>(o2.x+o2.w/2)){
      return false;
   }

   return true;
}


function desenhaLimiteSprites(sprite){
   ctx.beginPath();
   ctx.rect(sprite.x-sprite.w/2,sprite.y-sprite.h/2, sprite.w, sprite.h);
   ctx.closePath();   
   ctx.strokeStyle = "rgb(255, 0, 0)";
   ctx.lineWidth = 2;
   ctx.stroke();

}

function desenhaPlacar(){
   ctx.strokeStyle = "rgb(0, 0, 0)";
   ctx.fillStyle = "rgb(0, 255, 0)";
   ctx.lineWidth = 1;
   ctx.font = '25px bold "Arial Black", sans-serif';

   ctx.fillText("Escore: "+pontos, 10, 25);
   ctx.strokeText("Escore: "+pontos, 10, 25);

   ctx.fillText("Vidas: "+vidas, 170, 25);
   ctx.strokeText("Vidas: "+vidas, 170, 25);
}
