/* Candy Carnival — Coded by Mr Sabaz Ali Khan. Pure match-3 rules. */
(function(root){
'use strict';
const SIZE=8, TYPES=6;
function adjacent(a,b){return Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b>=0&&a<64&&b<64&&Math.abs(a%SIZE-b%SIZE)+Math.abs(Math.floor(a/SIZE)-Math.floor(b/SIZE))===1;}
function swap(board,a,b){[board[a],board[b]]=[board[b],board[a]];}
function matches(board){
 const hits=new Set();
 for(let axis=0;axis<2;axis++)for(let line=0;line<SIZE;line++){
  let run=[];
  function flush(){if(run.length>=3)run.forEach(i=>hits.add(i));}
  for(let p=0;p<=SIZE;p++){
   const i=axis===0?line*SIZE+p:p*SIZE+line;
   if(p<SIZE&&board[i]!=null&&(!run.length||board[i]===board[run[0]]))run.push(i);
   else{flush();run=p<SIZE&&board[i]!=null?[i]:[];}
  }
 }
 return [...hits];
}
function validMove(board){for(let a=0;a<64;a++)for(const b of [a+1,a+8]){if(!adjacent(a,b))continue;swap(board,a,b);const ok=matches(board).length>0;swap(board,a,b);if(ok)return [a,b];}return null;}
function fresh(random=Math.random){for(let attempt=0;attempt<1000;attempt++){const b=[];for(let i=0;i<64;i++){const available=Array.from({length:TYPES},(_,v)=>v).filter(v=>!(i%8>=2&&b[i-1]===v&&b[i-2]===v)&&!(i>=16&&b[i-8]===v&&b[i-16]===v));b.push(available[Math.floor(random()*available.length)]);}if(validMove(b))return b;}throw new Error('Could not create a playable board');}
function collapse(board,removed,random=Math.random){removed.forEach(i=>board[i]=null);for(let c=0;c<SIZE;c++){const values=[];for(let r=SIZE-1;r>=0;r--)if(board[r*SIZE+c]!=null)values.push(board[r*SIZE+c]);for(let r=SIZE-1;r>=0;r--)board[r*SIZE+c]=values.length?values.shift():Math.floor(random()*TYPES);}return board;}
const api={SIZE,TYPES,adjacent,swap,matches,validMove,fresh,collapse};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CandyEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
