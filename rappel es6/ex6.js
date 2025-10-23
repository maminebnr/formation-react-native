const somme=(...nombres) =>
{return nombres.reduce((acc, curr) => acc + curr, 0);}

console.log(somme(10,20))
console.log(somme(100,20,50,70))
console.log(somme(100,40,50,60,100,3000,4000))