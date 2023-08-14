// ********** Les variables 
const formElement = document.getElementById("form");

//********* Je récupère l'URL du login 
const getUserLogin = async (e) => {
    e.preventDefault(); //stop le rechargement de la page
    url_api="http://localhost:5678/api/users/login";
    data={
        "email": formElement.email.value, // valeur de email 
        "password": formElement.password.value
      }
      // form de type submit preventDefault bloque le rechargement de la page 
    settings = { //paramètre
            method:'POST',
            headers:{'Content-Type':'application/json'}, // "dit" au backend que on renvoie du json
            body:JSON.stringify(data) // objet JS convertie en objet chaine de caractere
            }

    await fetch(url_api, settings)
    .then(reponse => reponse.json())
    .then(reponse => {
        console.log(reponse);
        if (reponse['token']) {
                console.log("connected")
                sessionStorage.setItem('token', reponse.token)  //stocke la session storage dans le navigateur (reponse.token) valeur du token
                window.location.assign('/')
        }
        else 
        {
            document.getElementById("errorMessage")
            .innerHTML ="Le mot de passe ou l'e-mail est erroné"
            console.log('error connecting')
        }

    })
    .catch(error=>{
        document.getElementById ("errorMessage")
            .innerHTML ="Le mot de passe ou l'e-mail est erroné"

    })
    

}
formElement.addEventListener('submit',getUserLogin)



  