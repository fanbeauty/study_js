var sumA = require('./a');
var sumB = require('./b');
var resultA = sumA.sum(1,4);
var resultB = sumB.sum(resultA);
console.log(resultB);