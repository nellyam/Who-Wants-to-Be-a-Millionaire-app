let mysql  = require('mysql');
let bd = require("./bd.js");
const gestionPage = require("./gestionPage.js");

let questionnaireManager = {

    afficherQuestion: function() {
        
        bd.connexion(); 
        let req = "select idquestion as num, nomQuestionnaire, description, reponseA, reponseB, reponseC, reponseD, bonneReponse from question inner join questionnaire on question.idQuestionnaire = questionnaire.idquestionnaire";
        bd.instance.query(req, function (error, results, fields) {
        if (error) throw error;
        let txt = "";
        for(let question of results) {
           txt += "<tr>"
               txt += '<th scope="row">' + question['num'] +  '</th>';
               txt += '<td scope="row">' + question['nomQuestionnaire'] +  '</td>';
               txt +='<td>' + question['description'] + '</td>';
               txt +='<td>'+ question['reponseA'] + '</td>';
               txt +='<td>'+ question['reponseB'] + '</td>';
               txt +='<td>'+ question['reponseC'] + '</td>';
               txt +='<td>'+ question['reponseD'] + '</td>';
               txt +='<td>'+ question['bonneReponse'] + '</td>';

               //debut modif

               txt += '<td>';
               txt += '<form method="POST" action="modificationQuestion.html">';
                 txt += '<input type="hidden" name="idquestion" value="' + question['num'] + '"/>'
                 txt += '<button type="submit" class="buttonIMG">';
                   txt += '<img src="edit.png">'; 
                 txt += '</button>'
               txt += '</form>';
            txt += '</td>';

               // fin modif
               txt += '<td>';
               txt += '<form method="POST" action="suppressionQuestion.html">';
                 txt += '<input type="hidden" name="idquestion" value="' + question['num'] + '"/>'
                 txt += '<button type="submit" class="buttonIMG">';
                   txt += '<img src="delete.png">'; 
                 txt += '</button>'
               txt += '</form>';
            txt += '</td>';
               txt +='</tr>';
        } 

        let alertsuppr = "";
        if(gestionPage.queryString.suppr === "yes") {
            alertsuppr = '<div class="alert alert-success" role="alert">La question a été bien supprimée en BD</div>';
        }
        let alertmodif = "";
        if(gestionPage.queryString.modif === "yes") {
            alertmodif = '<div class="alert alert-success" role="alert">La question a été bien modifiée en BD</div>';
        }
        gestionPage.objetToSupplant.supprQuestion = alertsuppr;
        gestionPage.objetToSupplant.modifQuestion = alertmodif;
        gestionPage.objetToSupplant.Questions = txt;
        gestionPage.envoyerDataToUser();
         });

        bd.deconexion();
    },

    afficherQuestionnaires: function() {
        bd.connexion(); 
        let req = "select questionnaire.idquestionnaire, `nomQuestionnaire`, `descriptionQuestionnaire`, COUNT(question.idquestion) as nbquestions from questionnaire left join question on questionnaire.idquestionnaire = question.idQuestionnaire GROUP BY 'idquestionnaire', `nomQuestionnaire`, `descriptionQuestionnaire`;";
        bd.instance.query(req, function (error, results, fields) {
        if (error) throw error;
        let txt = "";
        for(let questionnaire of results) {
           txt += "<tr>"
               txt += '<th scope="row">' + questionnaire['idquestionnaire'] +  '</th>';
               txt += '<td scope="row">' + questionnaire['nomQuestionnaire'] +  '</td>';
               txt += '<td>' + questionnaire['descriptionQuestionnaire'] + '</td>';
               txt += '<td>' + questionnaire['nbquestions'] + '</td>';

               txt += '<td>';
               txt += '<form method="POST" action="modificationQuestionnaire.html">';
                 txt += '<input type="hidden" name="idQuestionnaire" value="' + questionnaire['idquestionnaire'] + '"/>'
                 txt += '<button type="submit" class="buttonIMG">';
                   txt += '<img src="edit.png">'; 
                 txt += '</button>'
               txt += '</form>';
            txt += '</td>';

                 txt += '<td>';
                  txt += '<form method="POST" action="suppressionQuestionnaire.html">';
                    txt += '<input type="hidden" name="idQuestionnaire" value="' + questionnaire['idquestionnaire'] + '"/>'
                    txt += '<button type="submit" class="buttonIMG">';
                      txt += '<img src="delete.png" >'; 
                    txt += '</button>'
                  txt += '</form>';
               txt += '</td>';
             txt += '</tr>';
        }
        alertSup = "";
        if(gestionPage.queryString.suppr === "yes") {
            alertSup += '<div class="alert alert-success" role="alert"> Le questionnaire a bien été supprimé en BD !</div>';
        }

        alertModif = "";
        if(gestionPage.queryString.modif === "yes") {
            alertModif += '<div class="alert alert-success" role="alert"> Le questionnaire a bien été modifié en BD !</div>';
        }

        gestionPage.objetToSupplant.suppMessage = alertSup; 
        gestionPage.objetToSupplant.modifMessage = alertModif;
        gestionPage.objetToSupplant.Questionnaires = txt;
        gestionPage.envoyerDataToUser();
         });

        bd.deconexion();
    },

    gererCreationQuestions: function() {
        bd.connexion(); 
        let req = "select * from questionnaire";
        bd.instance.query(req, function (error, results, fields) {
            if (error) throw error;
            let validation = "";
            if(gestionPage.queryString.confirm === "yes") {
                validation += '<div class="alert alert-success" role="alert"> La question a bien été créée en BD !</div>';
            }
            let optionTxt = "";
            for(let ligne of results) {
                optionTxt += "<option value='" + ligne.idquestionnaire +"'>";
                optionTxt += ligne.nomQuestionnaire + " : " + ligne.descriptionQuestionnaire;
                optionTxt += "</option>";
            }
            gestionPage.objetToSupplant.validationSaisie = validation;
            gestionPage.objetToSupplant.optionQuestionnaires = optionTxt;
            gestionPage.envoyerDataToUser();
         });

        bd.deconexion();
    },
    gererCreationQuestionnaire: function() {
        let validation = "";
            if(gestionPage.queryString.confirm === "yes") {
                validation += '<div class="alert alert-success" role="alert"> Le questionnaire a bien été créée en BD !</div>';
            }
    
            gestionPage.objetToSupplant.validationSaisie = validation;
            gestionPage.envoyerDataToUser();
    },

    creerQuestionBD: function(info) {
        bd.connexion();
        let req = "INSERT INTO question(description, reponseA, reponseB, reponseC, reponseD, bonneReponse, idQuestionnaire) VALUES(?, ?, ?, ?, ?, ?, ?)" 
        bd.instance.query(req, [info.question, info.reponseA, info.reponseB, info.reponseC, info.reponseD, info.bonneReponse, parseInt(info.questionnaire)], function (error, results, fields) {
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='/creerQuestion.html?confirm=yes'</script>");
        });
        bd.deconexion();
    },
    creerQuestionnaireBD: function(info) {
        bd.connexion();
        let req = "INSERT INTO questionnaire(nomQuestionnaire, descriptionQuestionnaire) VALUES(?,?)" 
        bd.instance.query(req, [info.questionnaire, info.description], function (error, results, fields) {
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='/creerQuestionnaires.html?confirm=yes'</script>");
        });
        bd.deconexion();
    },
    
    supprimerQuestionnaireBD: function(info) {
        bd.connexion();
        let req = "DELETE FROM questionnaire WHERE idquestionnaire = ?" 
        bd.instance.query(req, [info.idQuestionnaire], function (error, results, fields) {
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='/afficherQuestionnaires.html?suppr=yes'</script>");
        });
        bd.deconexion();
    },

    // Gestion de la page permettant de modifier un questionnaire - formulaire
    modificationQuestionnaire: function(info) {
        bd.connexion(); 
        let req = "select * from questionnaire where idquestionnaire = ?";
        bd.instance.query(req, [info.idQuestionnaire], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        gestionPage.objetToSupplant.id = results[0].idquestionnaire;
        gestionPage.objetToSupplant.nomQuestionnaire = results[0].nomQuestionnaire;
        gestionPage.objetToSupplant.descriptionQuestionnaire = results[0].descriptionQuestionnaire;
        gestionPage.envoyerDataToUser();
         });

        bd.deconexion();
    },

    // modificaton en BD d'un questionnaire
    modifierQuestionnaireBD: function(info) {
      
        bd.connexion(); 
        let req = "update questionnaire set nomQuestionnaire = ?, descriptionQuestionnaire = ? where idQuestionnaire = ?";
       bd.instance.query(req, [info.nomQuestionnaire, info.descriptionQuestionnaire, info.id], function (error, results, fields) {
        if (error) throw error;
        gestionPage.reponse.end("<script>document.location.href='/afficherQuestionnaires.html?modif=yes'</script>");
         });

        bd.deconexion();
    },

    supprimerQuestionBD: function(info) {
         bd.connexion();
         let req = "delete from question where idquestion = ?"
         bd.instance.query(req, [info.idquestion], function(error, results, fields)  {
             if (error) throw error;
             gestionPage.reponse.end("<script>document.location.href='/afficherQuestion.html?suppr=yes'</script>");

        });
        bd.deconexion();
    },

    modifierQuestion: function(info) {
     bd.connexion();
     let req = "select * from question where idquestion = ?";
     bd.instance.query(req, [info.idquestion], (error, results, fields) => {
         if(error) throw error;
         console.log(results); 
         gestionPage.objetToSupplant.id = results[0].idquestion
         gestionPage.objetToSupplant.descriptionQuestion = results[0].description
         gestionPage.objetToSupplant.reponseA = results[0].reponseA;
         gestionPage.objetToSupplant.reponseB = results[0].reponseB;
         gestionPage.objetToSupplant.reponseC = results[0].reponseC;
         gestionPage.objetToSupplant.reponseD = results[0].reponseD;
         gestionPage.objetToSupplant.bonneReponse = results[0].bonneReponse;
         gestionPage.objetToSupplant.idQuestionnaire = results[0].idQuestionnaire;
         questionnaireManager.listeQuestionnaire(results[0].idQuestionnaire);
     });
     bd.deconexion();
    },

    listeQuestionnaire: function(idQuestionnaire) {
        bd.connexion();
        let req = "select * from questionnaire";
        bd.instance.query(req, (error, results, fields) => {
            if(error) throw error;
            let txt = "";
            for(let questionnaire of results) {
                if(idQuestionnaire === questionnaire.idquestionnaire) {
                 txt += "<option value='" + questionnaire.idquestionnaire + "' selected>";                   
                } else {
                 txt += "<option value='" + questionnaire.idquestionnaire + "'>";
                }
                txt += questionnaire.nomQuestionnaire + " - " + questionnaire.descriptionQuestionnaire;
                txt += "</option>";
            }
            gestionPage.objetToSupplant.optionGroupe = txt;
            gestionPage.envoyerDataToUser();
        });
        bd.deconexion();
    },

    modifierQuestionBD: function(info) {
        bd.connexion(); 
        let req = "update question set description = ?, reponseA = ?, reponseB = ?, reponseC = ?, reponseD = ?, bonneReponse = ?, idQuestionnaire = ? where idquestion = ?";
      bd.instance.query(req, [info.descriptionQuestion, info.reponseA, info.reponseB, info.reponseC, info.reponseD, info.bonneReponse, info.idquestionnaire, info.id], function (error, results, fields) {
        if (error) throw error;
        gestionPage.reponse.end("<script>document.location.href='/afficherQuestion.html?modif=yes'</script>");
         });

        bd.deconexion();
    },

    gererQuestionJeu: function(questionnaire, idquestion) { //(1, 1)
        bd.connexion(); 
        let req = "select * from question q1 inner join questionnaire q2 on q1.idQuestionnaire = q2.idquestionnaire where q2.idquestionnaire = ?  limit 1 offset ?";
        bd.instance.query(req, [questionnaire /* 1 */, (idquestion - 1)/* 0 */], function (error, results, fields) {    
        if(results.length < 1) {
            gestionPage.reponse.end("<script>document.location.href='/index.html'</script>");
        }  else {
        gestionPage.objetToSupplant.idQuestionnaire = results[0].idquestionnaire;
        gestionPage.objetToSupplant.descriptionQuestionnaire = results[0].nomQuestionnaire;
        gestionPage.objetToSupplant.idQuestionBD = results[0].idquestion;
        gestionPage.objetToSupplant.QuestionNumero = idquestion;
        gestionPage.objetToSupplant.description = results[0].description;
        gestionPage.objetToSupplant.reponseA = results[0].reponseA;
        gestionPage.objetToSupplant.reponseB = results[0].reponseB;
        gestionPage.objetToSupplant.reponseC = results[0].reponseC;
        gestionPage.objetToSupplant.reponseD = results[0].reponseD;
        gestionPage.objetToSupplant.bonneReponse = results[0].bonneReponse;
        questionnaireManager.listeQuestionnaire(results[0].idquestionnaire);          
        }  

         });

        bd.deconexion();
    }
     
};

module.exports = questionnaireManager;