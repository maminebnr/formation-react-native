import {voiture}  from "./ex4.js"
//spread operation  tableau
const arr1 =[1,2,3,4]
const arr2 = [5,6,7,8]

const arr3 = [...arr1,...arr2]
console.log(arr3)

//spread operation objet
const data ={...voiture,driver:"john",numero:7}
console.log(data)

const person = {firstname:"amine",lastname:"bnr"}
const test = {...voiture,...person}
console.log(test)