// ********** MES CONSTANTES / VARIABLES **********
const galleryContainerElement = document.querySelector('.gallery');
const filtersContainerElement = document.querySelector('.filterContainer');
const galleryModalContainerElement = document.querySelector('#modalGallerie');
const editModeElement = document.querySelectorAll(".editMode");
const closeBtnElement = document.querySelector('#closeBtn');
const buttonPhotoElement = document.querySelector('#modalButton');
const deleteAllModalElement = document.querySelector(".supprime");
let inputFile = document.querySelector("#inputFile");
const showNavElement = document.querySelector(".editMode")
const postWorkForm = document.querySelector("#postWorkForm");
const imgFormElement = document.querySelector(".photoContainer");
const titleFormElement = document.querySelector("#title");
const categoryFormElement = document.querySelector("#category");
const titleError = document.getElementById("titleError");
const decoBtn = document.getElementById("deco");
const loginBtn = document.getElementById("page-connexion");
const afterImgElement = document.getElementById("beforeImg");
const valider=document.getElementById("valider");

// ******* MES TABLEAUX *******
let works = []
let categories = []

let token = sessionStorage.getItem('token') || null; 

console.log(token)

// ********** recup les API **********
const getWorks = async () => {
    works.splice(0,works.length)
    await fetch("http://localhost:5678/api/works")
    .then(response=> response.json())
    .then(worksDuserver => works.push(...worksDuserver))
}


const getCategories = async () => {
 await fetch("http://localhost:5678/api/categories")
 .then(response=> {
    return response.json()
})
 .then(categoryDuserver => categories.push(...categoryDuserver))
}

// ********** Crée les élements HTML de manière dynamique  **********
// Incorporation des images
const createWorks = (data) => {
    while (galleryContainerElement.firstChild)
        galleryContainerElement.removeChild(galleryContainerElement.firstChild) // efface l'ancienne liste des traveaux pour faire un rafraichissement ??
    data.forEach(work => {
        const figureElement = document.createElement('figure');
        const imgElement = document.createElement('img');
        const figcaptionElement = document.createElement('figcaption');

        imgElement.src = work.imageUrl
        imgElement.alt = work.title

        figcaptionElement.textContent = work.title

        figureElement.appendChild(imgElement)
        figureElement.appendChild(figcaptionElement)

        galleryContainerElement.appendChild(figureElement)
})
}

//Incorporation des filtres {name: 'Tous', id: 0},  {name: 'Objets', id: 1},  {name: 'Appartements', id: 2}
const createFilter = (donnesPourFiltreDeObjetCategory) => {
    const buttonFilterElement = document.createElement('li');
    buttonFilterElement.textContent = donnesPourFiltreDeObjetCategory.name; //tous

    buttonFilterElement.addEventListener('click', () => {
        console.log(donnesPourFiltreDeObjetCategory.id) // 0
        if (donnesPourFiltreDeObjetCategory.id === 0) { //si id est égal à 0 qui est lui meme egal à "tous" la fonction createWorks s'affiche
            return createWorks(works)
        }
        const filteredWorks = []// works.filter(work => work.categoryId === donnesPourFiltreDeObjetCategory.id)
        for (let i = 0 ;i <works.length;i++) {
            const work = works[i];
            if (work.categoryId === donnesPourFiltreDeObjetCategory.id) {
                filteredWorks.push(work); // a chaque click création new tableaux (filteredWorks)
            }
        }
        console.log(filteredWorks)
        galleryContainerElement.innerHTML = "";
        createWorks(filteredWorks)
        })

   filtersContainerElement.appendChild(buttonFilterElement)
}

//handleFilters = gère les filtres
const handleFilters = (donnesDesCategories) => {
    createFilter({name: 'Tous', id: 0}); //retrouve la fonction "createFilter"
    donnesDesCategories.forEach(categorie => {
        createFilter(categorie)
    })
}

// Si l'utilisateur est connecté
if (!token) { // tous les cas possible des tokens
    console.log(editModeElement)
    // showNavElement.style.display= "none";
    // decoBtn.style.display = "none";
    // editModeElement.style.display = "none";
    editModeElement.forEach(item => item.style.display = "none")
}



// ********** Crée la modal  **********
// *****Le bouton Edit*****

else { // token = connecion 
    document.querySelector("#bouttonEdit").innerHTML+=
 `<button onclick="editButton()"> 
    <img class="iconeEdit" src= "./assets/icons/edit.png">
    modifier
 </button>`
    loginBtn.style.display = "none";
}
// apparition de la modal
function editButton() {
    modalGallery(works);
    document.getElementById("modal").style.display="block";
    modal1=document.getElementById("modalPage1");
    modal1.style.display="block";
}

// *****Le bouton close*****
// click = déclanche la fonction closeBtn qui permet de fermer la modal
closeBtn.addEventListener('click',closeModal);
function  closeModal()
{
    document.getElementById("modal").style.display="none";
    modal1=document.getElementById("modalPage1");
    modal2=document.getElementById("modalPage2");
    modal1.style.display="none";
    modal2.style.display="none";
    galleryModalContainerElement.innerHTML = "" // vide la modal
    const imgForm = document.getElementById("newImg");
    postWorkForm.reset();
    imgForm.remove();
    afterImgElement.style.setProperty("display", "flex");
}

// *****Le bouton arrow-left*****

document.querySelector('#arrow-left').addEventListener('click', () => {
    document.querySelector('#modalPage2').style.display = 'none';
    document.querySelector('#modalPage1').style.display = 'block';
})

// Mettre les images dans la modal
function modalGallery(data)// ajout de delete
{
    while (galleryModalContainerElement.firstChild)
    galleryModalContainerElement.removeChild(galleryModalContainerElement.firstChild)
        console.log(works)
        data.forEach(work => {
            const imageContainer = document.createElement('div');
            const imageItem = document.createElement('img');
            const trashElement = document.createElement('button')
            const addArrowElement = document.createElement('div');
            const deleteParagrapheElement = document.createElement('p');

            imageContainer.classList.add('modal-image-container')
            imageItem.src = work.imageUrl;
            imageItem.classList.add("galleryImage");

            trashElement.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            trashElement.classList.add('trash');

            addArrowElement.innerHTML= '<i class="fa-sharp fa-solid fa-arrows-up-down-left-right"></i>';
            addArrowElement.classList.add('arrow');

        

            trashElement.addEventListener('click', async () => {
                const response = await deleteWork(work.id)
                await getWorks()              
                createWorks(works)
                modalGallery(works)
            })

            imageContainer.appendChild(imageItem);
            imageContainer.appendChild(trashElement);
            imageContainer.appendChild(addArrowElement);
            galleryModalContainerElement.appendChild(imageContainer);
      
        })
}
// ***** Fonction delete*****
async function deleteWork(id) {
    try {
        return await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    } catch (error) {
        console.log(error)
    }
}
// ***** Fonction qui permet de choisir la catégorie*****
function selectCategory(data)
{
    modalCategory=document.querySelector('#category');
    while (modalCategory.firstChild)
// boucle while = tanque que 
        modalCategory.removeChild(modalCategory.firstChild)
        emptyOption = document.createElement('option');
        emptyOption.value="";
        emptyOption.textContent=""
        emptyOption.disabled=true;
        emptyOption.selected=true;
        modalCategory.appendChild(emptyOption);
        data.forEach(work => {
            const optionItem = document.createElement('option');
            optionItem.value = work.id;
            optionItem.textContent = work.name;
            //imageItem.classList.add("galleryImage");
            modalCategory.appendChild(optionItem);
        })
}

// ***** affiche la modal pour new travaux *****
function modalPage(){
    modal1=document.getElementById("modalPage1");
    modal2=document.getElementById("modalPage2");
    modal1.style.display="none";
    modal2.style.display="block";
    selectCategory(categories);
}

// ********** Crée la modal 2 *********

buttonPhotoElement.addEventListener('click', modalPage);


//* token présent
if (token !== null) {
    console.log('tu peux balancer les fonctions pour ta partie admin')
    filtersContainerElement.style.display = 'none' // retire les filtres
}

/*Recupérer le donner du form*/
inputFile.addEventListener("change", updateImage);
function updateImage() {
    let imgUrl = inputFile.files[0]; //récupération des fichiers sélectionnés par l'User

    // document.querySelector('.photoContainer label').style.display = "none"
    // document.querySelector('.photoContainer p').style.display = "none"
    // document.querySelector('.photoContainer i').style.display = "none"
         
        const displayImg = document.createElement("img");
        displayImg.classList.add("sizing");
        displayImg.setAttribute("id", "newImg");
        displayImg.src = URL.createObjectURL(imgUrl);
        document.querySelector('.photoContainer').appendChild(displayImg);    

        afterImgElement.style.setProperty("display", "none");
        console.log("OK");
}

// soumission du formulaire
postWorkForm.addEventListener('submit', function(event) { event.preventDefault();
submitWork()})

inputFile.addEventListener('input', function(){enableDisableSubmit();}); // activer/Desactiver/Soummetre
titleFormElement.addEventListener('input', function(){enableDisableSubmit();});
categoryFormElement.addEventListener('input', function(){enableDisableSubmit();});

function enableDisableSubmit(){
    if (validPostForm())
    {
        valider.disabled=false;
        // valider.
    }
    else valider.disabled=true;
}

function validPostForm(){
    if ( !postWorkForm.title.value ||
         !postWorkForm.category.value || 
         !postWorkForm.inputFile.value)
    {
        return false;
    }

    valider.style.backgroundColor = '#1d6154';
    valider.style.cursor = 'pointer'
    return true;
}


async function submitWork(){
    // condition du formulaire
if (!validPostForm()){
titleError.innerHTML = "Les champs image/titre/category sont tous obligatoires";
return;
}
else {
    titleError.innerHTML = "";
}

    let newImg = inputFile.files[0]; //récupération des fichiers sélectionnés par l'User
    formBody = new FormData();

    formBody.append('image', newImg);
    formBody.append('title',titleFormElement.value);
    formBody.append('category',categoryFormElement.value);
  
    console.log(formBody);

    closeModal();
    //modal.style.display ="none";
    //modal2.style.display = "none";
    //const imgForm = document.getElementById("newImg");
    //postWorkForm.reset();
    //imgForm.remove();
    //afterImgElement.style.setProperty("display", "block");
    
    fetch('http://localhost:5678/api/works', 
        {method: 'POST',body:formBody,headers: {
            'Authorization': `Bearer ${token}`
        }})
        .then(response => response.json())
        .then(data=>{console.log(data);
            getWorks().then(rep => {createWorks(works);
                modalGallery(works);}) ;             
            
        })
        .catch(error => {console.error('Error:',error);})
}


// se deconnecter de la page
function deco(){
    const decoElement = document.querySelector("#deco");
    decoElement.addEventListener ("click" , () => {
        sessionStorage.removeItem("token");
        location.reload();
    })
}


// OK
const init = async () => {
    console.log('debut', categories)
    await getWorks() // charge la gallery de swagger dans le tableau works[]
    await getCategories() // charge la gallery de swagger dans le tableau categories[]
    console.log('après', categories)
    createWorks(works)
    handleFilters(categories)
    deco();
}
init()

