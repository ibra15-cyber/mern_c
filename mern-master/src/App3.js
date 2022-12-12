import React, {useState} from 'react'
import './blackjack.css'

let sum = 0;
let cardList = []
let listString = ''
let secondString = ''
const App = () => {
    const [message, setMessage] = useState();
    // const [sum, setSum] = useState(0)
    let [cardString, setCardString] = useState('')
    const [isAlive, setIsAlive] = useState(false)
    const [hasBlackJack, setHasBlackJack] = useState(false)
    // let [cardList, setCardList] = useState([])
    let msg;
    


    function startGame(){
        let firstCard = getRandomCard()
        let secondCard = getRandomCard()
        sum = firstCard + secondCard

        cardList.push(firstCard)
        cardList.push(secondCard)
        console.log((cardList))
        let cardStr = firstCard + ", " + secondCard
        setCardString(cardStr)
        // setSum(firstCard + secondCard)
        for (let i=0; i< 2; i++){
            listString += cardList[i] + ', '
        }
        console.log("listString: ", listString)
        console.log("first card: " , firstCard)
        console.log("second card: " ,secondCard)
        console.log("first sum", sum)
        
        setIsAlive(true) //starting the game
        renderGame()
    }


    const renderGame = () => {
        console.log("sum in render before : " , sum)
        if (sum < 21) {
            msg = "Do you wish to draw another card"
            setMessage(msg)
        }
        if (sum === 21) {
            msg = "yes you won"
            setMessage(msg)
            setHasBlackJack(true)
            setIsAlive(false)
        }
        if (sum > 21){
            setIsAlive(false)
            msg = "we are logging you out; you lost"
            setMessage(msg)
            
        }
        // listString = []

    }


        function newCard(){
            console.log("is alive: " , isAlive)
            console.log("is hasBalckjack: " , hasBlackJack)
            if (isAlive && !hasBlackJack) { //we we havent passed 21 and havent won continue to generate new card  
                let newcard = getRandomCard()
                sum = sum + newcard
                console.log("new card : ", newcard)
                cardList.push(newcard)
                setCardString(cardString + ', ' + newcard)
                // for (let i=0; i< cardList.length; i++){
                //     secondString = cardList[i] + ', '
                // }

                // listString = listString +', ' +  newcard
                console.log("listString", secondString)
                            
                renderGame()     
            }
        }
    
    
    
   

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
    


    return (
        <React.Fragment>
            <div className="outer">
                <h1 className="">BlackJack</h1>
                <p id='message-el'>{message}</p>
                <p>Cards: {cardString}</p>
                <p >Sum: {sum}</p> {/*** this too will work {`${sum}`} */}
                <button onClick={startGame}>START GAME</button>
                <button onClick={newCard}>NEW GAME</button>
                < p> Per: $145</p>
            </div>
        </React.Fragment>

    )
    
}

export default App

//2 problems remongin gthe undefine
// and making new game work 
//apperance of message a bit late to the calculation for both buttons
//sum i think is getting to render late; only after i click a second time, that must be 
//cardString is working using string 
//listString has some issues ie after clicking start game the second time it still has the old values displaying3