//import{pi,getMyAge} from './ex8.js'
import * as data from './ex8.js'
//console.log(pi,getMyAge(2000))
console.log(data.pi,data.getMyAge(2000))


function simulerOperationAsynchrone(duree) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.5;
            if (success) {
                resolve(`Opération terminée avec succès après ${duree / 1000} secondes !`);
            } else {
                reject(new Error(`Échec de l'opération après ${duree / 1000} secondes.`));
            }
        }, duree);
    });
}

console.log("Début de l'opération...");

simulerOperationAsynchrone(2000)
    .then(resultat => {
        console.log("Succès:", resultat);
    })
    .catch(error => {
        console.error("Erreur:", error.message);
    }).finally("verify your network ");