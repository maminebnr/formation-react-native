//destructing object
export const voiture = {
    modele:"renaut",
    couleur:"noir",
    year:2009,
    puissance:4
}

const {year,puissance,...test}=voiture
console.log(year,puissance,test)

//Destructing tableau 
const arr =['hello',"javascript","android","ios","web","php"]
const [text1,text2,...data]=arr
console.log(text1,text2,data)