const privateKey = "ae51d642cfe284e27c7ad30c0691674ed1749318";
const publicKey = "52f39101d102949490f418fd6eda2d1a";
let inputValue = document.getElementById("form1");
let timeout = null;
let marvelHerosDiv = document.querySelector(".marvelHerosDiv");
let paginationNumberDiv = document.querySelector(".page-numbers");
let resultsPerPage = 12;
let currentPage;

window.onload = function() {
    likedFunction() 
    settingButtonsOnLoad()
}

inputValue.addEventListener("input", function(){
    clearTimeout(timeout);
    timeout = setTimeout(function(){
        if(inputValue.value !== ""){
        var ts = new Date().getTime();
        var hash = md5(ts + privateKey + publicKey).toString();
        marvelHerosDiv.innerHTML = "";
        paginationNumberDiv.innerHTML = "";
        loader();
        fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${inputValue.value}&limit=99&ts=${ts}&apikey=${publicKey}&hash=${hash}`)
        .then(res => res.json())
        .then(res => marvelResult(res.data.results))
    } else{
        marvelHerosDiv.innerHTML = "";
        paginationNumberDiv.innerHTML = "";
        likedFunction();
        settingButtonsOnLoad();
    }
}, 500);
});


function noResult(){
   let noResultText = document.createElement("p");
   marvelHerosDiv.appendChild(noResultText);
   noResultText.textContent = `Heros that starts with ${inputValue.value}, doesn't exist`;
   noResultText.className = "no-result-p"
}
function marvelResult(hero){
    if (hero.length < 1) {
        noResult()
        document.querySelector("#loader").style.display = "none";
        document.querySelectorAll(".marvelHerosDiv")[0].style.visibility = "visible";
    } else {
    currentPage = 1;
    displayHeros(hero, marvelHerosDiv, resultsPerPage, currentPage);
    setupPageNumbers(hero, paginationNumberDiv, resultsPerPage, currentPage);
    settingButtons();
    document.querySelector("#loader").style.display = "none";
    document.querySelectorAll(".marvelHerosDiv")[0].style.visibility = "visible";
    }
}   

//showing items
function displayHeros (heros, divWrapper, herosPerPage, page){
    divWrapper.innerHTML = "";
    page--;
    let start = herosPerPage * page;
    let end = start + herosPerPage;
    let paginatedItems = heros.slice(start, end);

    //adding divs with data
    for (let i = 0; i < paginatedItems.length; i++){
        if(localStorage.hasOwnProperty(paginatedItems[i].name)){
            let holderDiv = document.createElement("div");
            let heroImg = document.createElement("img");
            let heroName = document.createElement("p");
            let likeButton = document.createElement("button");
            let heroFromStorage = localStorage.getItem(paginatedItems[i].name)
            heroFromStorage = JSON.parse(heroFromStorage);
            marvelHerosDiv.appendChild(holderDiv);
            holderDiv.appendChild(heroImg);
            holderDiv.appendChild(heroName);
            holderDiv.appendChild(likeButton);
            holderDiv.className = "col-lg-3 col-md-4 col-sm-6 col-12 d-flex flex-column justify-content-center heroDiv";
            heroImg.src = heroFromStorage.img;
            heroName.textContent = heroFromStorage.name;
            likeButton.className = "btn btn-danger likeBtn liked";
            likeButton.textContent = heroFromStorage.liked;
        } else {
        let holderDiv = document.createElement("div");
        let heroImg = document.createElement("img");
        let heroName = document.createElement("p");
        let likeButton = document.createElement("button");
        marvelHerosDiv.appendChild(holderDiv);
        holderDiv.appendChild(heroImg);
        holderDiv.appendChild(heroName);
        holderDiv.appendChild(likeButton);
        holderDiv.className = "col-lg-3 col-md-4 col-sm-6 col-12 d-flex flex-column justify-content-center heroDiv";
        heroImg.src = paginatedItems[i].thumbnail.path + "/portrait_incredible." + paginatedItems[i].thumbnail.extension;
        heroName.textContent = paginatedItems[i].name;
        likeButton.className = "btn btn-danger likeBtn";
        likeButton.textContent = "Like";
        }
    }
}

//paggnation
function setupPageNumbers(heros, numberWrapper, herosPerPage, page){
    numberWrapper.innerHTML = "";
    if(Math.ceil(heros.length / herosPerPage) > 1){
    let leftBtn = document.createElement("button");
    let rightBtn = document.createElement("button");

    function showPage(n){
        currentPage += n;

        if(currentPage > 0 && currentPage <= Math.ceil(heros.length / herosPerPage)){
        let btnActive = document.querySelector(".active");
        btnActive.classList.remove("active");
        let allBtn = document.querySelectorAll(".allBtn");
        allBtn[currentPage - 1].classList.add("active");
        }
        
        displayHeros(heros, marvelHerosDiv, resultsPerPage, currentPage);
        settingButtons();
        
        if (currentPage == 1) {
            leftBtn.classList.add("hide");
            rightBtn.classList.remove("hide");
        } else if (currentPage > 1 && currentPage < Math.ceil(heros.length / herosPerPage)){
            leftBtn.classList.remove("hide");
            rightBtn.classList.remove("hide");
        } else if (currentPage == Math.ceil(heros.length / herosPerPage)){
            rightBtn.classList.add("hide");
            leftBtn.classList.remove("hide");
        }
    }

    numberWrapper.appendChild(leftBtn);
    leftBtn.textContent = "<";
    leftBtn.addEventListener("click", function(){
        showPage(-1);   
    });

    let pageCount = Math.ceil(heros.length / herosPerPage);
    for (let i = 1; i < pageCount + 1; i++){
        let btn = paginationButton(i, heros);
        numberWrapper.appendChild(btn);
        btn.classList.add("allBtn");
    }
    
    numberWrapper.appendChild(rightBtn);
    rightBtn.textContent = ">";
    rightBtn.addEventListener("click", function(){
        showPage(1);
    });

    let allBtn = document.querySelectorAll(".allBtn");
    if (page == 1) leftBtn.classList.add("hide");  

    allBtn[0].addEventListener("click", function(){
        leftBtn.classList.add("hide");
        rightBtn.classList.remove("hide");
        
    });

    allBtn[allBtn.length - 1].addEventListener("click", function(){
        rightBtn.classList.add("hide");
        leftBtn.classList.remove("hide");
    });

    for(let i = 1; i < allBtn.length - 2; i++){
        allBtn[i].addEventListener("click", function(){
                leftBtn.classList.remove("hide");
                rightBtn.classList.remove("hide");
        });
    };

function paginationButton(page, heros){
    let buttonPage = document.createElement("button");
    buttonPage.innerText = page;

    if(currentPage == page) buttonPage.classList.add("active");

    buttonPage.addEventListener("click", function(){
        currentPage = page;
        displayHeros(heros, marvelHerosDiv, resultsPerPage, page);
        settingButtons();
        let activeBtn = document.querySelector(".active");
        activeBtn.classList.remove("active");

        buttonPage.classList.add("active");
    });
    return buttonPage;
};
}}

//like button
function settingButtons(){
    let herosDiv = document.querySelectorAll(".heroDiv");
    herosDiv.forEach((item,index) => {
        let likeBtn = herosDiv[index].getElementsByTagName("button")[0];
        let heroObj = {};
        heroObj.img = herosDiv[index].getElementsByTagName("img")[0].src;
        heroObj.name = herosDiv[index].getElementsByTagName("p")[0].textContent;
        likeBtn.addEventListener("click", function(){
            if(likeBtn.textContent === "Liked"){
                likeBtn.textContent = "Like";
                likeBtn.classList.remove("liked");
                localStorage.removeItem(heroObj.name);
            } else {
            likeBtn.classList.add("liked");
            likeBtn.textContent = "Liked";
            heroObj.liked = likeBtn.textContent;
            let heroObjConverted = JSON.stringify(heroObj);
            localStorage.setItem(heroObj.name, heroObjConverted);
        }
        });
    });
}

function likedFunction() {
    if(localStorage.length !== 0){
        for(let i = 0; i < localStorage.length; i++){
            let hero = localStorage.getItem(localStorage.key(i));
            hero = JSON.parse(hero);
            let holderDiv = document.createElement("div");
            let heroImg = document.createElement("img");
            let heroName = document.createElement("p");
            let likeButton = document.createElement("button");
            marvelHerosDiv.appendChild(holderDiv);
            holderDiv.appendChild(heroImg);
            holderDiv.appendChild(heroName);
            holderDiv.appendChild(likeButton);
            holderDiv.className = "col-lg-3 col-md-4 col-sm-6 col-12 d-flex flex-column justify-content-center heroDiv";
            heroImg.src = hero.img;
            heroName.textContent = hero.name;
            likeButton.className = "btn btn-danger likeBtn liked";
            likeButton.textContent = hero.liked;
        }
    }
}

function settingButtonsOnLoad(){
    let herosDiv = document.querySelectorAll(".heroDiv");

    for(let i = 0; i < herosDiv.length; i++) {
        let likeBtn = herosDiv[i].getElementsByTagName("button")[0];
        let heroObj = {};
        heroObj.img = herosDiv[i].getElementsByTagName("img")[0].src;
        heroObj.name = herosDiv[i].getElementsByTagName("p")[0].textContent;
        
        likeBtn.addEventListener("click", function(){
                herosDiv[i].setAttribute("style", "display: none !important;")
                likeBtn.classList.remove("liked");
                localStorage.removeItem(heroObj.name);
            });
    };
}

function loader(){
    document.querySelectorAll(".marvelHerosDiv")[0].style.visibility = "hidden";
    document.querySelector("#loader").style.visibility = "visible";
    document.querySelector("#loader").style.display = "block";
}
