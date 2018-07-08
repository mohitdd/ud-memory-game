const cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let timeCount = 0;
let timerCont = document.querySelector("#timer");
let gameStarted = false;
let openCards = [];
let moves = 0;
let solvedCount = 0;
let remaningArr = [];
let timerPtr;
const fragment = document.createDocumentFragment();

//function to start the timer.
function timer() {
    timeCount++;
    timerPtr = setTimeout(timer, 1000);
    timerCont.textContent = timeCount + " Seconds";
}

//function to create the cards.
function createCards(cardList) {
    var temp_card = document.createElement("li");
    temp_card.setAttribute("class", "card");
    temp_card.innerHTML = `<i class="fa ${cardList}"></i>`;
    fragment.appendChild(temp_card);
    //document.querySelector("ul.deck").innerHTML +=`<li class ="card"><i class="fa ${cardList}"></i></li>`;
}

//function to populate the cards on container.
function populateCards() {
    shuffle(cardList.concat(cardList)).forEach(createCards);
    document.querySelector("ul.deck").appendChild(fragment);
}

//function to end the game.swal function is from https://sweetalert.js.org/
function endGame() {
    clearTimeout(timerPtr);
    swal({
            title: "Congratulations! You Won!",
            text: `with ${moves} Moves and ${document.querySelectorAll(".fa-star").length} star!
                                Do you want to play Again?`,
            icon: "success",
            buttons: ["No", "Yes"],
        })
        .then((willrestart) => {
            if (willrestart) {
                resetGame();
            }
        });
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//function to lock the matching cards.
function lockcards() {
    openCards[0].classList.add('match');
    openCards[1].classList.add('match');
}

//function to reduce the stars as per moves.
function reduceStar() {
    var starArr = document.querySelectorAll('.fa-star');
    starArr[(starArr.length) - 1].setAttribute("class", "fa fa-star-o");
}

function incrementMove() {
    moves++;
    document.querySelector(".moves").textContent = moves;
    if (moves === 14 || moves === 20) {
        reduceStar();
    }
}

function displayCard(toModify) {
    toModify.classList.add("open", "show");
}

//function to shake the cards on match/unmatch
function shakeCards(typeShake) {
    openCards.forEach(function(card) {
        card.classList.add("animated", typeShake);
    });
}

function rem() {
    remaningArr[0].classList.remove("open", "show", "animated", 'shake');
    remaningArr[1].classList.remove("open", "show", 'shake', 'animated');
    remaningArr.splice(0, 2);
}

function checkOpenCards() {
    if (openCards[0].firstElementChild.classList.value === openCards[1].firstElementChild.classList.value) {
        solvedCount++;
        shakeCards('tada');
        lockcards();
    } else {
        remaningArr.push(openCards[0]);
        remaningArr.push(openCards[1]);
        shakeCards('shake');
        setTimeout(rem, 1000);
    }

    openCards.splice(0, 2);
    incrementMove();
    if (solvedCount === 8) {
        setTimeout(endGame, 1000);
    }
}

function cardClick(event) {
    if (gameStarted === false) {
        if (event.target.classList.contains("card")) {
            gameStarted = true;
            timer();
            openCards.push(event.target);
            displayCard(event.target);
        }
    } else {
        if (event.target.classList.contains("match") || event.target.classList.contains("show") || event.target.nodeName !== "LI") {
            return;
        } else {
            if (openCards.length < 2) {

                displayCard(event.target);
                openCards.push(event.target);
            }
            if (openCards.length === 2) {
                checkOpenCards();
            }
        }
    }
}

function initStars() {
    document.querySelector(".stars").innerHTML = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>`
}

function initGame() {
    populateCards();
    initStars();
    document.querySelector(".container ul.deck").addEventListener('click', cardClick);
    document.querySelector(".restart").addEventListener('click', resetGame);
}

function resetGame() {
    clearTimeout(timerPtr);
    timeCount = 0;
    gameStarted = false;
    openCards = [];
    moves = 0;
    solvedCount = 0;
    remaningArr = [];
    timerCont.textContent = timeCount + ' Seconds';
    document.querySelector(".moves").textContent = moves;
    document.querySelector(".stars").innerHTML = "";
    document.querySelector("ul.deck").innerHTML = "";
    populateCards();
    initStars();
}

initGame();
