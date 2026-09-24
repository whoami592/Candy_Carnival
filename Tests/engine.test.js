'use strict';
const assert=require('node:assert/strict');
const E=require('../engine.js');
assert.equal(E.adjacent(7,8),false);assert.equal(E.adjacent(0,8),true);assert.equal(E.adjacent(0,9),false);
const empty=()=>Array(64).fill(null);
let b=empty();[0,1,2,8,16].forEach(i=>b[i]=2);assert.deepEqual(E.matches(b).sort((a,b)=>a-b),[0,1,2,8,16]);
b=empty();[6,7,8].forEach(i=>b[i]=2);assert.equal(E.matches(b).length,0);
b=empty();for(let i=0;i<8;i++)b[i*8]=i%6;E.collapse(b,[48,56],()=>0);assert.equal(b[56],5);assert.equal(b[48],4);
let seed=7919;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
for(let n=0;n<150;n++){
 b=E.fresh(random);assert.equal(E.matches(b).length,0);const old=b.slice(),pair=E.validMove(b);assert.ok(pair);assert.deepEqual(b,old);E.swap(b,...pair);assert.ok(E.matches(b).length>=3);
 let steps=0;while(E.matches(b).length){E.collapse(b,E.matches(b),random);assert.ok(++steps<100);}
 assert.equal(b.length,64);assert.ok(b.every(x=>Number.isInteger(x)&&x>=0&&x<6));
}
console.log('Passed: boundaries, match unions, row wrapping, gravity, 150 playable boards and cascade resolutions.');
