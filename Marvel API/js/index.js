const privateKey = "ae51d642cfe284e27c7ad30c0691674ed1749318";
const publicKey = "52f39101d102949490f418fd6eda2d1a";
let inputValue = document.getElementById("form1");
let timeout = null;
let marvelHerosDiv = document.querySelector(".marvelHerosDiv");
let paginationNumberDiv = document.querySelector(".page-numbers");


inputValue.addEventListener("input", function(){
    clearTimeout(timeout);

    timeout = setTimeout(function(){
        var ts = new Date().getTime();
        var hash = md5(ts + privateKey + publicKey).toString();
        marvelHerosDiv.innerHTML = "";
        paginationNumberDiv.innerHTML = "";
        //tamplate literals
        //fetch("https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=" + inputValue.value + "&ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash)
        fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${inputValue.value}&limit=99&ts=${ts}&apikey=${publicKey}&hash=${hash}`)
        .then(res => res.json())
        .then(res => marvelResult(res.data.results))
    }, 500);
});



function marvelResult(hero){
    let resultsPerPage = 12;
    let currentPage = 1;
    //kreiranje page-ova sa herojima
    function displayHeros (heros, divWrapper, herosPerPage, page){
        divWrapper.innerHTML = "";
        //ako je page 1, onda ce page biti = page - 1, to je 0
        page--;

        //za prvu stranu ce biti prikazano prvih 12 rezultata, 12 * 0 = 0
        let start = herosPerPage * page;
        let end = start + herosPerPage;

        //definisanje odakle dokle ce biti prikazani rezultati array[index]
        let paginatedItems = heros.slice(start, end);

        //adding divs with data
        for (let i = 0; i < paginatedItems.length; i++){
            var holderDiv = document.createElement("div");
            var heroImg = document.createElement("img");
            var heroName = document.createElement("p");
            var likeButton = document.createElement("button");
            marvelHerosDiv.appendChild(holderDiv);
            holderDiv.appendChild(heroImg);
            holderDiv.appendChild(heroName);
            holderDiv.appendChild(likeButton);
            holderDiv.className = "col-lg-3 col-md-4 col-sm-6 col-12 d-flex flex-column justify-content-center";
            heroImg.src = paginatedItems[i].thumbnail.path + "/portrait_incredible." + paginatedItems[i].thumbnail.extension;
            heroName.textContent = paginatedItems[i].name;
        }
    }


    // funkcija za kreiranje number buttona na stranici
    function setupPageNumbers(heros, numberWrapper, herosPerPage, page){
        numberWrapper.innerHTML = "";
        
        let leftBtn = document.createElement("button");
        let rightBtn = document.createElement("button");

        //funkcija za strelicu levo i desno
        function showPage(n){
            currentPage += n;

            if(currentPage > 0 && currentPage <= Math.ceil(heros.length / herosPerPage)){
            let btnActive = document.querySelector(".active");
            btnActive.classList.remove("active");
            let allBtn = document.querySelectorAll(".allBtn");
            allBtn[currentPage - 1].classList.add("active");
            console.log(currentPage);
            }

            displayHeros(heros, marvelHerosDiv, resultsPerPage, currentPage);
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

        //strelica za levo
        numberWrapper.appendChild(leftBtn);
        leftBtn.textContent = "<";
        leftBtn.addEventListener("click", function(){
            showPage(-1);   
        });

        //dodavanje buttona za sve strane
        let pageCount = Math.ceil(heros.length / herosPerPage);
        for (let i = 1; i < pageCount + 1; i++){
            let btn = paginationButton(i, heros);
            numberWrapper.appendChild(btn);
            btn.classList.add("allBtn");
        }
        let allBtn = document.querySelectorAll(".allBtn");
        

        //strelica za desno
        numberWrapper.appendChild(rightBtn);
        rightBtn.textContent = ">";
        rightBtn.addEventListener("click", function(){
            showPage(1);
        });

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
    
    
    //funkcija za buttone, dodavanje event listenera i class-a
    function paginationButton(page, heros){
        let buttonPage = document.createElement("button");
        buttonPage.innerText = page;

        if(currentPage == page) buttonPage.classList.add("active");

        buttonPage.addEventListener("click", function(){
            currentPage = page;
            console.log(currentPage);
            displayHeros(heros, marvelHerosDiv, resultsPerPage, page);

            let activeBtn = document.querySelector(".active");
            activeBtn.classList.remove("active");

            buttonPage.classList.add("active");
        });
        return buttonPage;
    }
    }


    



    displayHeros(hero, marvelHerosDiv, resultsPerPage, currentPage);
    setupPageNumbers(hero, paginationNumberDiv, resultsPerPage, currentPage);

    /* hero.forEach((element, index) => {
        var holderDiv = document.createElement("div");
        var heroImg = document.createElement("img");
        var heroName = document.createElement("p");
        var likeButton = document.createElement("button");
        marvelHerosDiv.appendChild(holderDiv);
        holderDiv.appendChild(heroImg);
        holderDiv.appendChild(heroName);
        holderDiv.appendChild(likeButton);
        holderDiv.className = "col-lg-3 col-md-4 col-sm-6 col-12 d-flex flex-column justify-content-center";
        heroImg.src = hero[index].thumbnail.path + "/portrait_incredible." + hero[index].thumbnail.extension;
        heroName.textContent = hero[index].name;

    }); */
    
}

