import { voiture } from "./ex4.js"
const fruits =['apple','banana','orange']
fruits.forEach(item=>console.log(item))
//iteration tableau
for(const item of fruits){
    console.log(item)
}
//iteration key object
for(const item in voiture){
    console.log(item)
}
const numbers = [1,2,3,4,5,6,7,8]
const newNumbers = numbers.map(item =>item *2)
console.log(newNumbers)
const filterNumbers = numbers.filter(item => item % 2 ===0)
console.log(filterNumbers)
const users = [{id:1,name:"ahmed "},{id:2,name:"amine"},{id:3,name:"salim"},{id:4,name:"sara"},{id:5,name:"lina"},{id:6,name:"yassine"}]
const user=users.find(u=>u.name==="sara")
const userIndex=users.findIndex(u=>u.name==="sara")

console.log(user===undefined?"no user found":user)
console.log(userIndex=== -1 ?"no user found":userIndex)
const scores = [30,50,60]
console.log(scores.some(s=>s>55))
console.log(scores.every(s=>s>55))
console.log(scores.reduce((acc,n)=>acc+n,0))
console.log(fruits.includes('orange'))
const items = [67,45,100,25]
console.log(items.sort((a,b)=> a-b))
console.log(scores.concat(items))
const arr =[1,[2,[3,4]]]
console.log(arr.flat(1))

const test= [1,2,[3,4,[5,6]]]
//mettre en un seul tableau 
//faire le map de multiplication 
//concatener avec un tableau deja mapé 
//faire le tri 
//faire laffichage sous forme boucle 
console.log("*********************")
let data = ((test.flat(4)).map(item=>item*2)).concat(scores).sort((a,b)=>b-a)
for(const item of data  ){
console.log(item)
}
console.log("*********************")
