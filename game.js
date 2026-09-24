/* Coded by Mr Sabaz Ali Khan */
'use strict';
const E=CandyEngine,$=id=>document.getElementById(id);
const names=['Pink round candy','Purple diamond','Yellow square','Blue drop','Green mint','Orange bean'];
const targets=[1200,1500,1800,2100,2400,2700,3000,3400,3800,4200];
let board=[],level=0,score=0,moves=24,mixes=2,selected=null,busy=false,best=0,sound=false,audio=null;
try{best=Number(localStorage.getItem('sabaz-candy-best'))||0;}catch(_){}
const cells=Array.from({length:64},(_,i)=>{const b=document.createElement('button');b.className='cell';b.addEventListener('click',()=>pick(i));b.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowLeft')n=i%8?i-1:i;if(e.key==='ArrowRight')n=i%8<7?i+1:i;if(e.key==='ArrowUp')n=Math.max(0,i-8);if(e.key==='ArrowDown')n=Math.min(63,i+8);if(e.key.startsWith('Arrow')){e.preventDefault();cells[n].focus();}});$('board').append(b);return b;});
function render(){cells.forEach((b,i)=>{b.innerHTML='<span aria-hidden="true" class="candy t'+board[i]+'"></span>';b.className='cell'+(i===selected?' selected':'');b.setAttribute('aria-label',names[board[i]]+', row '+(Math.floor(i/8)+1)+', column '+(i%8+1));b.setAttribute('aria-pressed',String(i===selected));b.disabled=busy;});$('score').textContent=score.toLocaleString();$('best').textContent=best.toLocaleString();$('moves').textContent=moves;$('target').textContent=targets[level].toLocaleString();$('level').textContent='LEVEL '+String(level+1).padStart(2,'0')+' / 10';$('progress').max=targets[level];$('progress').value=score;$('shuffle').textContent='⤨ Mix ('+mixes+')';['hint','restart','shuffle'].forEach(id=>$(id).disabled=busy||(id==='shuffle'&&mixes===0));}
function say(t){$('status').textContent=t;}
function saveBest(){if(score>best){best=score;try{localStorage.setItem('sabaz-candy-best',String(best));}catch(_){}}}
function tone(chain){if(!sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=440+chain*110;g.gain.setValueAtTime(.055,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.18);o.start();o.stop(audio.currentTime+.19);}catch(_){}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function start(){score=0;moves=24;mixes=2;selected=null;busy=false;board=E.fresh();render();say('Match 3 or more. Let’s make something sweet!');}
async function pick(i){if(busy||$('result').open)return;if(selected===null){selected=i;render();return;}if(selected===i){selected=null;render();return;}if(!E.adjacent(selected,i)){selected=i;render();return;}const a=selected;selected=null;busy=true;E.swap(board,a,i);render();await sleep(170);let hits=E.matches(board);if(!hits.length){E.swap(board,a,i);busy=false;render();say('Try another swap — make a line of 3.');return;}
 moves--;let chain=0;
 while(hits.length){chain++;score+=hits.length*60*chain;saveBest();render();say(chain>1?'Sweet cascade! ×'+chain:'Sweet match! +'+hits.length*60);hits.forEach(n=>cells[n].classList.add('clearing'));tone(chain);await sleep(220);E.collapse(board,hits);render();await sleep(180);hits=E.matches(board);}
 busy=false;render();if(score>=targets[level])finish(true);else if(moves===0)finish(false);else if(!E.validMove(board)){board=E.fresh();render();say('No moves left on the board — free remix!');}}
function finish(won){const complete=won&&level===9;$('resultTitle').textContent=complete?'Carnival champion!':won?'Sweet victory!':'One more try?';$('resultText').textContent='Level '+(level+1)+' · '+score.toLocaleString()+' points. '+(complete?'You completed all 10 levels!':won?'Your next sweet challenge is waiting.':'Reach '+targets[level].toLocaleString()+' points to advance.');$('continue').textContent=complete?'Play again →':won?'Next level →':'Retry level →';$('continue').onclick=()=>{$('result').close();if(won)level=complete?0:level+1;start();};$('result').showModal();}
$('result').addEventListener('cancel',e=>e.preventDefault());
$('hint').onclick=()=>{if(busy)return;const pair=E.validMove(board);render();if(pair){pair.forEach(i=>cells[i].classList.add('hinted'));say('Swap the two highlighted candies.');}};
$('shuffle').onclick=()=>{if(busy||mixes<1)return;mixes--;selected=null;board=E.fresh();render();say('Fresh candy mix! No move spent.');};
$('restart').onclick=()=>{if(!busy&&confirm('Restart this level? Your current level score will reset.'))start();};
$('sound').onclick=()=>{sound=!sound;$('sound').textContent='Sound: '+(sound?'on':'off');$('sound').setAttribute('aria-pressed',String(sound));tone(1);};
start();
