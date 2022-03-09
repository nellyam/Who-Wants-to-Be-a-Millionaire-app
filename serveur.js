const http = require("http");
const url = require("url");
const fs = require("fs");
const queryString = require("querystring");
require("remedial");
const gestionPage = require("./js_serveurs/gestionPage.js");
const questionnaireManager = require("./js_serveurs/questionnaireManager.js");
//const { queryString } = require("./js serveurs/gestionPage.js");

let gererServeur = function(requete, reponse) {   
    let monUrl = url.parse(requete.url);
    let urlQueryString = queryString.parse(monUrl.query);
    let extension = monUrl.pathname.substring(monUrl.pathname.indexOf("."), monUrl.pathname.length);
    
    gestionPage.initialisation(monUrl, extension, requete, reponse, urlQueryString);

    if(requete.method === "POST") {

        let body = "";

        requete.on("data", chunk => {
            body += chunk.toString();
          });

        requete.on("end", () => {
           let obj = queryString.parse(body);

        if(monUrl.pathname === "/validationCreationQuestion.html") {
             questionnaireManager.creerQuestionBD(obj);
        } 
        else if(monUrl.pathname === "/validationCreationQuestionnaire.html") {
            questionnaireManager.creerQuestionnaireBD(obj); 
        }  
        else if(monUrl.pathname === "/suppressionQuestionnaire.html") {
             questionnaireManager.supprimerQuestionnaireBD(obj);
        }   
        else if (monUrl.pathname === "/modificationQuestionnaire.html") {
            questionnaireManager.modificationQuestionnaire(obj);
        }   
        else if(monUrl.pathname === "/modifierQuestionnaireBD") {
            questionnaireManager.modifierQuestionnaireBD(obj);
        }   
        else if(monUrl.pathname === "/suppressionQuestion.html") {
            questionnaireManager.supprimerQuestionBD(obj);
        }   
        else if(monUrl.pathname === "/modificationQuestion.html") {
            questionnaireManager.modifierQuestion(obj);
        } 
        else if(monUrl.pathname === "/modifierQuestionBD") {
            questionnaireManager.modifierQuestionBD(obj);
        }
            });
        } else {
            if(gestionPage.url.pathname !== "/favicon.ico") {
            gererFichier();
            }        
        }    
}


function gererFichier() {
    if(gestionPage.url.pathname === "/" || gestionPage.extension === ".html") {

        if(gestionPage.url.pathname === "/afficherQuestion.html") {
           questionnaireManager.afficherQuestion(); 
        } 
        else if(gestionPage.url.pathname === "/afficherQuestionnaires.html") {
           questionnaireManager.afficherQuestionnaires(); 
        } 
        else if(gestionPage.url.pathname === "/creerQuestion.html") {
            questionnaireManager.gererCreationQuestions(); 
        } 
        else if(gestionPage.url.pathname === "/creerQuestionnaires.html") {
            questionnaireManager.gererCreationQuestionnaire(); 
        }  
        else if(gestionPage.url.pathname ==="/jeu.html"){ 
            
            if(!gestionPage.queryString.idquestionnaire) {
                questionnaireManager.gererQuestionJeu(1,1);
            } else {
                if(!gestionPage.queryString.idquestion){
                    questionnaireManager.gererQuestionJeu(gestionPage.queryString.idquestionnaire,1);
                } else {
                    questionnaireManager.gererQuestionJeu(gestionPage.queryString.idquestionnaire,gestionPage.queryString.idquestion);
                }
            }
            
                } else {
                gestionPage.envoyerDataToUser(); //for index.html
        }
        
    } else {
        gestionPage.envoyerDataToUser();
    }
     
}
const serveur = http.createServer(gererServeur);
serveur.listen(12345);