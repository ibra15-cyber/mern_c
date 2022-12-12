import React, {useState} from 'react'
import './blackjack.css'


let hasBlackJack = false //to be replaced by usestate
// // let isAlive = true 
let isAlive = false //to be replaced
// let message = ''

// let messageEl = document.getElementById('message-el')
// let sumEl = document.getElementById('sum')

// // let cardsStr = cardsList[0] + ", " + cardsList[1] // the for loop replaces this
// // let cardsEl = document.getElementById('cards')
// let cardsEl = document.querySelector('#cards')

// //implenting objectsbg
// let player = {
//     name : "Per",
//     chips : 145 
// }

// let playerEl = document.getElementById('player-el')
// playerEl.textContent = player.name + ": $" + player.chips


const renderGame = () => {
    // console.log("render sum: ", sum)
    // sumEl.textContent = sum // means add {{sum}} to that place

    //render our two cards when we click start game
    //add the next when we click new card and display all item 
    // cardsEl.textContent = cardsList {cardsList}

    // cardsEl.textContent = cardsStr
    if (sum <= 20) {
        console.log("do you wish to draw another card")
        msg = "Do you wish to draw another card"
        setMessage(msg)
        // messageEl.textContent = message
        return message && sum
    }else if (sum === 21) {
        console.log('yes you won')
        msg = "yes you won"
        hasBlackJack = true
        setMessage(msg)
        // messageEl.textContent = message
        return message ;
    }else {
        console.log("you are out")
        isAlive = false
        msg = "we are logging you out; you lost"
        setMessage(msg)
        // console.log(message)
        // messageEl.textContent = message
        return message
    }




console.log("is blackjacket :" , hasBlackJack)
console.log("is he alive: ", isAlive)
}




function newCard(){
    if (isAlive && !hasBlackJack) { //we we havent passed 21 and havent won continue to generate new card
        let newcard = getRandomCard()
        // sum += newcard //update sum and recall the fn 
        setSum( newcard + sum)
        console.log(sum)
        cardsList.push(newcard)
        
        // if we dont want to iterate our list and wish to forward the complete list 
        // we can catch it in render card, thos is part is redundant
        //becasue after pusing our card has a new value, so calling render adds it
        for (let i in cardsList) {
            // cardsEl.textContent += cardsList[i] + ' '
            cds += cardsList[i] + ' '
            setCards(cds)

        }
        renderGame()
    }
    
}

// //start game calling renderGame, initialize the game; will stop working wehen isalive changes
function startGame(){
    
    let firstCard = getRandomCard()
    let secondCard = getRandomCard() 
    cardsList = [firstCard, secondCard]
    setSum(firstCard + secondCard)
    console.log("first card: " , firstCard)
    console.log("second card: " ,secondCard)
    // console.log("sum", sum)
    // cardListComp();
    for (let item in cardsList){
        
        if (item !== 'undefined' && item !== 'NaN')
            cds += cardsList[item] + " "
            // cds.pop()
        setCards(cds)
    }

    console.log(cards)
    
    isAlive = true //starting the game
    renderGame() 
}

// //generates our random nums for the 3 variables
function getRandomCard() {
    let rand = Math.floor(Math.random() * 13) + 1 //0 - 0.999 ie 0 - 12 + 1  means start from one when you get 0
    // let rand = Math.round (Math.random() * 13) //0 - 0.99 0-12.999 round
    if( rand === 1){
        // console.log(rand)
        return 11
    } else if (rand === 11 || rand === 12 || rand === 13){
        // console.log(rand)

        return 10

    }
    // console.log(rand)

    return rand //else return rand
}

function cardListComp(){
    for (let item in cardsList){
        card = cardsList[item] + " "
        card += card
        console.log(card)
        return card;
    }
}


    return (
        <React.Fragment>
            <div className="outer">
                <h1 className="">BlackJack</h1>
                <p id='message-el'>{message}</p>
                <p>Cards: {cards}</p>
                <p >Sum: {sum}</p>
                <button onClick={startGame}>START GAME</button>
                <button onClick={newCard}>NEW GAME</button>
                < p> Per: $145</p>
            </div>
        </React.Fragment>

    )

export default App;