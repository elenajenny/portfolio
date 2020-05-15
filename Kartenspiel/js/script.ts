/***********************************************************ELENA JENNY MAYER 263 066 *****************************************************/



/******************************* Zuerst müssen die Variablen deklariert werden *******************************/

/* als erstes wird das Karten Interface deklariert
die Eigenschaften der Karte werden hier definiert:
- die Bonuskarten
- die Wertigkeit der Karten
- die Farben 
 */
interface card {
    bonusProperty: string;     /* zusätzlich habe ich noch Bonuskarten eingebaut  */
    valuecard: number;
    colorcard: string;    
}

/* dann habe ich Arrays erstelle: für den Spieler, den Computer, das Deck und den Kartenstapel
auf diese wird später noch oft darauf zugegriffen daher werden sie hier am Anfang definiert  */ 
let playerhandArray: card[] = [];                           
let comphandArray: card[] = [];
let tableArray: card[] = [];
let stackofcardsArray: card[] = [];

/* zwei zusätzliche Variablen, welche angeben, ob der Spieler dran ist und ob die Karten des Computers sichtbar sind */
let playerTurn: boolean = true;       
let computerVisbility: boolean = false;                    

/* onload */
window.onload = function (): void {

    /* zeigen die Spielregeln an 
    - ein EventListener wenn man auf den Spielregeln Button drückt
    - ein EventListener wenn man auf eine Fläche auf dem Overlay drückt, dass dieser dann wieder verschwindet
    - ein EventListener wenn man auf das Kartendeck drückt, dass dann der Spieler beginnt mit dem Spiel
    */
    document.querySelector("#rulesButton").addEventListener("click", function(): void {switchOverlay(false); } , false);         
    document.querySelector("#overlay").addEventListener("click", function(): void {switchOverlay(true); } , false);   
    document.querySelector("#topDeckCard").addEventListener("click", function(): void {drawCard(playerTurn); } , false);           

    /* am Anfang wird das Deck erstellt, gemischelt, die Karten werden an Computer und Spieler ausgeteilt und die HTML geupdated. */
    generateNewtable();
    shuffleDeck();
    dealCards();
    updateHTML();

    console.log("Karten gemischt und ausgeteilt*");
};


/******************************* SETUP-FUNKTIONEN *******************************/


/******************************* Generiert alle Karten und schreibt sie ins tableArray *******************************/
function generateNewtable(): void {

    let newvaluecard: number;            
    let newcolorcard: string;
    let newbonusProperty: string = "none";  

    /* Schleifen mit Karten mit den Wertigkeiten 1-9 und 4 verschiedenen Farben */
    for (let i: number = 1; i <= 9; i++) {
        for (let j: number = 0; j < 4; j++) {

            newvaluecard = i;
            switch (j) {
                case 0: newcolorcard = "red"; break;
                case 1: newcolorcard = "blue"; break;
                case 2: newcolorcard = "yellow"; break;
                case 3: newcolorcard = "green"; break;
            }
            let newCard: card = {                                         
                bonusProperty: "none",
                valuecard: newvaluecard,
                colorcard: newcolorcard
            };
            tableArray.push(newCard);
        }                                  
    }

    /* Schleife die die 4 Bonuskarten (zwei mal "+4", zwei mal "+2") erzeugen. */
    for (let k: number = 0; k < 4; k++) {
        switch (k) {
            case 0: case 1: newbonusProperty = "Plus 2"; break;
            case 2: case 3: newbonusProperty = "Plus 4"; break;
        }
        let newCard: card = {                                         
            bonusProperty: newbonusProperty,
            valuecard: 0,
            colorcard: "allColors"
        };
        tableArray.push(newCard);
    }        
    console.log("Neues Deck wurde generiert.");
}


/******************************* Mischt das Deck *******************************/
function shuffleDeck(): void {
    tableArray.sort(function( a, b) { /* .sort sortiert immer je nach positivem oder negativem Parameter. */
        return 0.5 - Math.random();          /* gibt der .sort Methode eine zufällig positive oder negative Zahl. */
    });
    console.log("Das Deck wurde gemischt.");
    console.log(tableArray);
}

/* Funktion deal Cards mit einer for-Schleife verteilt 5 Karten an jeweils den Spieler und den Computer und legt 
eine Karte auf den Ziehstapel */

function dealCards() {

    for (let i: number = 0; i < 5; i++) {
        comphandArray.push(tableArray[0]);
        tableArray.splice(0, 1);
        playerhandArray.push(tableArray[0]);
        tableArray.splice(0, 1);
    }
    
    stackofcardsArray.push(tableArray[0]);
    tableArray.splice(0, 1);

    console.log("Karten wurden ausgeteilt.");
    console.log(comphandArray);
    console.log(playerhandArray);
    console.log(tableArray);
    console.log(stackofcardsArray);
}



/******************************* HTML *******************************/

/******************************* Erstellt die HTML einer Karte auf der Player Seite *******************************/
/*Paramter sind gleich die Kartennummern*/

function generatePlayerHandHTML(CardNr: number) {

    /* erstellt den Karten - Div mit einem Eventlistener  */
    let cardDiv: HTMLElement = document.createElement("div");              
    cardDiv.setAttribute("id", "playerCard" + (CardNr + 1));                  
    cardDiv.setAttribute("class", "card");    
    cardDiv.addEventListener("click", function (): void { playCard(CardNr, playerTurn); }, false); 
    document.querySelector("#playerHand").appendChild(cardDiv);                        
   
    /* ermittelt was auf der Karte stehen soll */
    let tempvaluecard: string = playerhandArray[CardNr].valuecard + "";
    switch (playerhandArray[CardNr].bonusProperty) {
        case "Plus 2": tempvaluecard = "+2"; break;
        case "Plus 4": tempvaluecard = "+4"; break;
    }

    /* erstellt den p - Tag mit der Wertigkeit und der Farbe */
    let valuecardP1: HTMLElement = document.createElement("p");               
    valuecardP1.innerHTML = tempvaluecard + ""; 
    valuecardP1.setAttribute("class", playerhandArray[CardNr].colorcard);
    cardDiv.appendChild(valuecardP1);  

    let valuecardP2: HTMLElement = document.createElement("p");               
    valuecardP2.innerHTML = tempvaluecard + ""; 
    valuecardP2.setAttribute("class", playerhandArray[CardNr].colorcard);
    cardDiv.appendChild(valuecardP2);            
}

/* Erstellt die HTML einer Karte auf der Computer Seite  */
/*Paramter sind gleich die Kartennummern*/

function generateCompHandHTML(CardNr: number): void {

    if (!computerVisbility) {      /* wenn die Karten verdeckt sind */

        let cardDiv: HTMLElement = document.createElement("div");              
        cardDiv.setAttribute("id", "compCard" + (CardNr + 1));                  
        cardDiv.setAttribute("class", "hiddenCard");     
        document.querySelector("#compHand").appendChild(cardDiv);  

    } else {                  /* wenn die Karten nicht verdeckt sind */

        /* erstellt den Karten - Div mit einem Eventlistener */
        let cardDiv: HTMLElement = document.createElement("div");              
        cardDiv.setAttribute("id", "compCard" + (CardNr + 1));                  
        cardDiv.setAttribute("class", "card");     
        document.querySelector("#compHand").appendChild(cardDiv);   
        
        /* ermittelt was auf der Karte stehen soll. */
        let tempvaluecard: string = comphandArray[CardNr].valuecard + "";
        switch (comphandArray[CardNr].bonusProperty) {
            case "Plus 2": tempvaluecard = "+2"; break;
            case "Plus 4": tempvaluecard = "+4"; break;
        }
        
        /* erstellt den p - Tag mit der Wertigkeit und der Farbe */
        let valuecardP1: HTMLElement = document.createElement("p");               
        valuecardP1.innerHTML = tempvaluecard + ""; 
        valuecardP1.setAttribute("class", comphandArray[CardNr].colorcard);
        cardDiv.appendChild(valuecardP1);  

        let valuecardP2: HTMLElement = document.createElement("p");               
        valuecardP2.innerHTML = tempvaluecard + ""; 
        valuecardP2.setAttribute("class", comphandArray[CardNr].colorcard);
        cardDiv.appendChild(valuecardP2);   
    }
}

/******************************* Erstellt die HTML einer Karte auf dem Ablage-Stapel *******************************/
/*Paramter sind gleich die Kartennummern*/

function generateDiscardPileHTML(CardNr: number) {

    /* erstellt den Karten - Div */
    let cardDiv: HTMLElement = document.createElement("div");              
    cardDiv.setAttribute("id", "discardPile" + (CardNr + 1));                  
    cardDiv.setAttribute("class", "card");     
    cardDiv.style.left = 30 + (CardNr * 0.5) + "%";                           /* Jede neue Karte wird leicht nach rechts Verschoben. */
    cardDiv.style.transform = "rotate(" + (Math.random() * 31 - 20) + "deg)";    /* Karten bekommen eine zufällige Rotation, um einen hingeworfenen Kartenstapel zu simulieren. */
    document.querySelector("#playArea").appendChild(cardDiv);    

    /* ermittelt was auf der Karte steht */
    let tempvaluecard: string = stackofcardsArray[CardNr].valuecard + "";
    switch (stackofcardsArray[CardNr].bonusProperty) {
        case "Plus 2": tempvaluecard = "+2"; break;
        case "Plus 4": tempvaluecard = "+4"; break;
    }
    
    /* erstellt den p - Tag mit der Wertigkeit und der Farbe */
    let valuecardP1: HTMLElement = document.createElement("p");               
    valuecardP1.innerHTML = tempvaluecard + ""; 
    valuecardP1.setAttribute("class", stackofcardsArray[CardNr].colorcard);
    cardDiv.appendChild(valuecardP1);  

    let valuecardP2: HTMLElement = document.createElement("p");               
    valuecardP2.innerHTML = tempvaluecard + ""; 
    valuecardP2.setAttribute("class", stackofcardsArray[CardNr].colorcard);
    cardDiv.appendChild(valuecardP2);   
}

/******************************* ruft HTML-Funktionen auf bis alle Karten dargestellt werden mithilfe einer for-Schleife *******************************/
function generateAllHTML() {
    for (let i: number = 0; i < comphandArray.length; i++) {
        generateCompHandHTML(i);
    }
    for (let j: number = 0; j < playerhandArray.length; j++) {
        generatePlayerHandHTML(j);
    }
    for (let k: number = 0; k < stackofcardsArray.length; k++) {
        generateDiscardPileHTML(k);
    }
}

/******************************* Löscht alle erzeugten HTML-Elemente *******************************/
function clearAllHTML() {

    /* Löscht alle HTML-Elemente auf der Player-Hand. */
    let divToEmpty: HTMLElement = document.querySelector("#playerHand");
    let children: HTMLCollection = divToEmpty.children;
    let childCount: number = children.length;
    for (let i: number = 0; i < childCount; i++) {                           
        if (divToEmpty.firstElementChild != null)                          
        divToEmpty.removeChild(divToEmpty.firstElementChild);       
    }
    
    /* Löscht alle HTML-Elemente auf der Computer-Hand. */
    divToEmpty = document.querySelector("#compHand");
    children = divToEmpty.children;
    childCount = children.length;
    for (let i: number = 0; i < childCount; i++) {                           
        if (divToEmpty.firstElementChild != null)                          
        divToEmpty.removeChild(divToEmpty.firstElementChild);       
    }
     
    /* Löscht alle HTML-Elemente des Ablage-Stapels. */
    divToEmpty = document.querySelector("#playArea");
    children = divToEmpty.children;
    childCount = children.length;
    for (let i: number = 0; i < childCount; i++) {                           
        if (divToEmpty.firstElementChild != null)                          
        divToEmpty.removeChild(divToEmpty.firstElementChild);       
    }
}

/******************************* Updated das komplette HTML *******************************/
function updateHTML() {
    clearAllHTML();
    generateAllHTML();
}


/******************************* Spielablauf *******************************/

/******************************* Spielt die geclickte Karte wenn sie gültig ist *******************************/
/*Parameter 1 ist die Kartennummer | Parameter2 = Welcher Spieler eine Karte spielen will */
function playCard (playedCardNr: number, tempplayerTurn: boolean) {                                              

    if (tempplayerTurn == true) { /*Wenn der Spieler eine Karte spielen will. */

        if ((playerhandArray[playedCardNr].valuecard == stackofcardsArray[stackofcardsArray.length - 1].valuecard) ||  /* richtiger Wert? */
        (playerhandArray[playedCardNr].colorcard == stackofcardsArray[stackofcardsArray.length - 1].colorcard) ||    /* richtige Farbe? */
        (stackofcardsArray[stackofcardsArray.length - 1].bonusProperty != "none") ||                                /* ist die zuletzt gelegte Karte eine Sonderkarte? */
        (playerhandArray[playedCardNr].bonusProperty != "none")) {                                              /* ist die geklickte Karte eine Sonderkarte? */

            /* Karte wird gespielt. */
            stackofcardsArray.push(playerhandArray[playedCardNr]);
            playerhandArray.splice(playedCardNr, 1);
            console.log("Player hat Karte: " + stackofcardsArray[stackofcardsArray.length - 1].valuecard + " " + stackofcardsArray[stackofcardsArray.length - 1].colorcard + " gespielt.");
            updateHTML();

            /* Bonusfunktion wird ausgeführt */
            usebonusProperty(stackofcardsArray[stackofcardsArray.length - 1], playerTurn);
                        
            /* Wenn der Spieler keine Karten mehr auf der Hand hat, wird das Spiel beendet. */
            if (playerhandArray.length < 1) {endGame(true); }

            /* Sonst ist der Computer dran. + Kleine Zeitverzögerung, um den Spielverlauf besser nachvollziehen zu können. */
            else {setTimeout(computersTurn, 350); }    

        } else {console.log("Karte darf nicht gespielt werden."); }

    } else {                     /* Wenn der Computer eine Karte spielen will. */

        if ((comphandArray[playedCardNr].valuecard == stackofcardsArray[stackofcardsArray.length - 1].valuecard) ||
        (comphandArray[playedCardNr].colorcard == stackofcardsArray[stackofcardsArray.length - 1].colorcard) ||
        (stackofcardsArray[stackofcardsArray.length - 1].bonusProperty != "none") ||
        (comphandArray[playedCardNr].bonusProperty != "none")) { 
            
            /* Karte wird gespielt. */
            stackofcardsArray.push(comphandArray[playedCardNr]);
            comphandArray.splice(playedCardNr, 1);
            console.log("Computer hat Karte: " + stackofcardsArray[stackofcardsArray.length - 1].valuecard + " " + stackofcardsArray[stackofcardsArray.length - 1].colorcard + " gespielt.");
            updateHTML();
 
            /* Bonusfunktion wird ausgeführt */
            usebonusProperty(stackofcardsArray[stackofcardsArray.length - 1], playerTurn);

            /* Wenn der Computer keine Karten mehr auf der Hand hat, wird das Spiel beendet. */
            if (comphandArray.length < 1) {endGame(false); }

            /* Sonst is der Spieler dran */
            else {playerTurn = true; }

        } else {console.log("Karte darf nicht gespielt werden."); }
    }
}

/******************************* Ziehe eine Karte *******************************/
/* Parameter = Welcher Spieler möchte eine Karte ziehen */
function drawCard(tempplayerTurn: boolean) {

    /* Wenn das Deck leer ist, wird der Ablagestapel zum neuen Deck */
    if (tableArray.length < 1) {
        refillDeck();
    }

    /* Der Spieler der am Zug ist, zieht eine Karte. Dann ist der Andere dran. */
    if (tempplayerTurn == true) {                    
        playerhandArray.push(tableArray[0]);
        tableArray.splice(0, 1);
        console.log("Spieler hat Karte: " + playerhandArray[playerhandArray.length - 1].valuecard + " " + playerhandArray[playerhandArray.length - 1].colorcard + " gezogen.");
        updateHTML();

        setTimeout(computersTurn, 350);
    } else{
        comphandArray.push(tableArray[0]);
        tableArray.splice(0, 1);
        console.log(" hat Karte: " + comphandArray[comphandArray.length - 1].valuecard + " " + comphandArray[comphandArray.length - 1].colorcard + " gezogen.");
        updateHTML();

        playerTurn = true;
    }
}

/******************************* Der Spielzug des Computers *******************************/
function computersTurn() {
    console.log("****************************************");
    playerTurn = false;
 
    /* Jede Karte auf der Computer-Hand wird zu spielen versucht. */
    for (let i: number = 0; (i < comphandArray.length) && (playerTurn == false); i++) { 
        playCard(i, playerTurn);
    }

    /* Falls keine Karte gespielt wurde und der Computer immernoch am Zug ist, zieht er eine Karte. */
    if (playerTurn == false) { 
        drawCard(playerTurn);
    }
    playerTurn = true;

    console.log("****************************************");
}





/******************************* Extrafunktionen *******************************/


/******************************* Das Spiel wird beendet und ein neues Spiel wird begonnen *******************************/
/* Parameter= Wurde das Spiel gewonnen oder Verloren? */

function endGame(wonTheGame: boolean) {
    console.log("Spiel wurde beendet.");

    /* Je nachdem ob man gewonnen oder verloren hat, taucht eine Nachrticht auf Glückwunsch oder Verloren */
    if (wonTheGame) { 
        alert("CONGRATULATIONS / GLÜCKWUNSCH!!\nWINNER!!\n\nAGAIN?");
    } else {
        alert("LOSER.\n\nAGAIN?");
    }

    /* Leert alle Arrays und startet eine neue Runde. */
    while (comphandArray.length > 0) {comphandArray.pop(); }
    while (playerhandArray.length > 0) {playerhandArray.pop(); }
    while (tableArray.length > 0) {tableArray.pop(); }
    while (stackofcardsArray.length > 0) {stackofcardsArray.pop(); }
    console.log("Arrays wurden geleert.");
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

    generateNewtable();
    shuffleDeck();
    dealCards();
    updateHTML();
    playerTurn = true;
}

/******************************* Der Ablagestapel wird zum Deck und wird gemischelt *******************************/
function refillDeck() {
   
    /* Die oberste Karte des Ablagestapels wird zwischgespeichert */
    let topCard: card = stackofcardsArray[stackofcardsArray.length - 1];
    stackofcardsArray.pop();

    /* Alle Karten des Ablagestapels werden in das Deck geadded und aus dem Ziehstapel gelöscht */
    while (stackofcardsArray.length > 0) {
        tableArray.push(stackofcardsArray[stackofcardsArray.length - 1] )
        stackofcardsArray.pop();
    }
    stackofcardsArray.push(topCard);
    console.log("Ablagestapel wurde zum neuen Deck");

    shuffleDeck();
    updateHTML();
}

/******************************* Die Sonderfunktion einer Karte wird benutzt *******************************/
/* Parameter1= Die Karte die genutzt wird | Parameter2= Welcher Spieler am Zug ist */
function usebonusProperty(tempCard: card, tempplayerTurn: boolean) {

    if (tempplayerTurn) {      /* Wenn Spieler am Zug ist */
        switch (tempCard.bonusProperty) {

            /* Bei "Plus 2" zieht der Computer 2 Karten. */
            case "Plus 2":
                for (let i: number = 0; i < 2; i++) {
                    if (tableArray.length < 1) {refillDeck(); }
                    comphandArray.push(tableArray[0]);
                    tableArray.splice(0, 1);
                }
                console.log("Computer musste 2 Karten ziehen.");
                break;

            /* Bei "Plus 4" zieht der Computer 4 Karten. */
            case "Plus 4":
                for (let i: number = 0; i < 4; i++) {
                    if (tableArray.length < 1) {refillDeck(); }
                    comphandArray.push(tableArray[0]);
                    tableArray.splice(0, 1);
                }
                console.log("Computer musste 4 Karten ziehen.");
                break;
        }

    } else {                 /* Wenn der Computer am Zug ist */
        switch (tempCard.bonusProperty) {
            case "Plus 2":
                for (let i: number = 0; i < 2; i++) {
                    if (tableArray.length < 1) {refillDeck(); } 
                    playerhandArray.push(tableArray[0]);
                    tableArray.splice(0, 1);
                }
                console.log("Player musste 2 Karten ziehen.");
                break;
            case "Plus 4":
                for (let i: number = 0; i < 4; i++) {
                    if (tableArray.length < 1) {refillDeck(); }
                    playerhandArray.push(tableArray[0]);
                    tableArray.splice(0, 1);
                }
                console.log("Player musste 4 Karten ziehen.");
                break;
        }
    }
    updateHTML();
}

/******************************* Dreht die Karten des Computers um *******************************/
function flipCompHand() {
    computerVisbility = !computerVisbility;
    console.log("Die Karten des Computers wurden umgedreht.");
    updateHTML();
}

/******************************* Schaltet das Overlay mit den Spielregeln an oder aus *******************************/
/* Parameter= Zeigt ob das Overlay momentan sichtbar ist. */
function switchOverlay(visible: boolean) {
    if (visible) 
    document.querySelector("#overlay").style.display = "none"; 
    else        
    document.querySelector("#overlay").style.display = "block";
    console.log("Das Spielregeln-Overlay wurde an/ausgeschalten");
}