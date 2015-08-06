// Github:   url
// By:       Pat Elwer
// Contact:  https://app.roll20.net/users/8948/pat

// used by jslint tool:  http://www.jslint.com/
/*jslint
   for, fudge, this, white
*/
/*global
   Campaign, sendChat, getObj, getAttrByName
*/

var DealInit = DealInit || (function() {
    'use strict';

    var version = '0.2',
        lastUpdate = '[Last Update: Aug 6, 2015, 10pm]',
        jokerLastRound = 0,
        deck      = {},
        hand      = {},
        discards  = {},
        initEdges = [],
     
     divStart =  '<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">'
        +'<div style="font-weight: bold; border-bottom: 1px solid black;">',
     divEnd = '</div>',


//-----------------------------------------------------------------------------
// Card constructor function.
//-----------------------------------------------------------------------------
Card = function(cardRank, shortName,longName) {

  this.cardRank = cardRank;   //0-53 for init sorting, higher # = higher initiative 
  this.shortName = shortName; // short name for display in turn order e.g. JH 
  this.longName = longName;   // long name for human readable messages e.g Jack of Hearts
  
},



//=============================================================================
// Stack Object
//=============================================================================

//-----------------------------------------------------------------------------
// Stack constructor function.
//-----------------------------------------------------------------------------

Stack = function() {

  // Create an empty array of cards.

  this.cards = [];

  this.makeDeck  = stackMakeDeck;
  this.shuffle   = stackShuffle;
  this.deal      = stackDeal;
  this.draw      = stackDraw;
  this.addCard   = stackAddCard;
  this.combine   = stackCombine;
  this.cardCount = stackCardCount;
},

//-----------------------------------------------------------------------------
// stackMakeDeck(n): Initializes a stack using 1 deck of cards.
//-----------------------------------------------------------------------------
stackMakeDeck = function() {

    // create array of cards to hold the deck
    this.cards = [];

    // fill card deck array with cards: cardRank, shortName,longName)
    this.cards[0]  = new Card( 0,"2C","2 of Clubs" );
    this.cards[1]  = new Card( 1,"2D","2 of Diamonds" );
    this.cards[2]  = new Card( 2,"2H","2 of Hearts" );
    this.cards[3]  = new Card( 3,"2S","2 of Spades" );
    this.cards[4]  = new Card( 4,"3C","3 of Clubs" );
    this.cards[5]  = new Card( 5,"3D","3 of Diamonds" );
    this.cards[6]  = new Card( 6,"3H","3 of Hearts" );
    this.cards[7]  = new Card( 7,"3S","3 of Spades" );
    this.cards[8]  = new Card( 8,"4C","4 of Clubs" );
    this.cards[9]  = new Card( 9,"4D","4 of Diamonds" );
    this.cards[10] = new Card(10,"4H","4 of Hearts" );
    this.cards[11] = new Card(11,"4S","4 of Spades" );
    this.cards[12] = new Card(12,"5C","5 of Clubs" );
    this.cards[13] = new Card(13,"5D","5 of Diamonds" );
    this.cards[14] = new Card(14,"5H","5 of Hearts" );
    this.cards[15] = new Card(15,"5S","5 of Spades" );
    this.cards[16] = new Card(16,"6C","6 of Clubs" );
    this.cards[17] = new Card(17,"6D","6 of Diamonds" );
    this.cards[18] = new Card(18,"6H","6 of Hearts" );
    this.cards[19] = new Card(19,"6S","6 of Spades" );
    this.cards[20] = new Card(20,"7C","7 of Clubs" );
    this.cards[21] = new Card(21,"7D","7 of Diamonds" );
    this.cards[22] = new Card(22,"7H","7 of Hearts" );
    this.cards[23] = new Card(23,"7S","7 of Spades" );
    this.cards[24] = new Card(24,"8C","8 of Clubs" );
    this.cards[25] = new Card(25,"8D","8 of Diamonds" );
    this.cards[26] = new Card(26,"8H","8 of Hearts" );
    this.cards[27] = new Card(27,"8S","8 of Spades" );
    this.cards[28] = new Card(28,"9C","9 of Clubs" );
    this.cards[29] = new Card(29,"9D","9 of Diamonds" );
    this.cards[30] = new Card(30,"9H","9 of Hearts" );
    this.cards[31] = new Card(31,"9S","9 of Spades" );
    this.cards[32] = new Card(32,"10C","10 of Clubs" );
    this.cards[33] = new Card(33,"10D","10 of Diamonds" );
    this.cards[34] = new Card(34,"10H","10 of Hearts" );
    this.cards[35] = new Card(35,"10S","10 of Spades" );
    this.cards[36] = new Card(36,"JC","Jack of Clubs" );
    this.cards[37] = new Card(37,"JD","Jack of Diamonds" );
    this.cards[38] = new Card(38,"JH","Jack of Hearts" );
    this.cards[39] = new Card(39,"JS","Jack of Spades" );
    this.cards[40] = new Card(40,"QC","Queen of Clubs" );
    this.cards[41] = new Card(41,"QD","Queen of Diamonds" );
    this.cards[42] = new Card(42,"QH","Queen of Hearts" );
    this.cards[43] = new Card(43,"QS","Queen of Spades" );
    this.cards[44] = new Card(44,"KC","King of Clubs" );
    this.cards[45] = new Card(45,"KD","King of Diamonds" );
    this.cards[46] = new Card(46,"KH","King of Hearts" );
    this.cards[47] = new Card(47,"KS","King of Spades" );
    this.cards[48] = new Card(48,"AC","Ace of Clubs" );
    this.cards[49] = new Card(49,"AD","Ace of Diamonds" );
    this.cards[50] = new Card(50,"AH","Ace of Hearts" );
    this.cards[51] = new Card(51,"AS","Ace of Spades" );
    this.cards[52] = new Card(52,"BJo","Black Joker" );
    this.cards[53] = new Card(53,"RJo","Red Joker" );

},

//-----------------------------------------------------------------------------
// stackShuffle(n): Shuffles a stack of cards 'n' times. 
//-----------------------------------------------------------------------------

stackShuffle = function(n) {

  var i, j, k;
  var temp;

  // Shuffle the stack 'n' times.

  for (i = 0; i < n; i+=1) {
    for (j = 0; j < this.cards.length; j+=1) {
      k = Math.floor(Math.random() * this.cards.length);
      temp = this.cards[j];
      this.cards[j] = this.cards[k];
      this.cards[k] = temp;
    }
  }
},

//-----------------------------------------------------------------------------
// stackDeal(): Removes the first card in the stack and returns it.
//-----------------------------------------------------------------------------

stackDeal = function() {

  if (this.cards.length > 0) {
    return this.cards.shift();
  }
  else {
    return null;
  }

  },

//-----------------------------------------------------------------------------
// stackDraw(n): Removes the specified card from the stack and returns it.
//-----------------------------------------------------------------------------

stackDraw = function(n) {

  var card;

  if (n >= 0 && n < this.cards.length) {
    card = this.cards[n];
    this.cards.splice(n, 1);
  }
  else {
    card = null;
  }
  return card;
},

//-----------------------------------------------------------------------------
// stackAdd(card): Adds the given card to the stack.
//-----------------------------------------------------------------------------

stackAddCard = function(card) {

  this.cards.push(card);
},

//-----------------------------------------------------------------------------
// stackCombine(stack): Adds the cards in the given stack to the current one.
// The given stack is emptied.
//-----------------------------------------------------------------------------

stackCombine = function(stack) {

  this.cards = this.cards.concat(stack.cards);
  stack.cards = [];
},

//-----------------------------------------------------------------------------
// stackCardCount(): Returns the number of cards currently in the stack.
//-----------------------------------------------------------------------------

stackCardCount = function() {

  return this.cards.length;
},


createDeck = function(id) {

  deck     = new Stack();
  hand     = new Stack();
  discards = new Stack();

  deck.makeDeck();
  shuffle();
  var  who=getObj('player',id).get('_displayname').split(' ')[0];
  sendChat('','/w '+who+" Deck reset and shuffled." );
  jokerLastRound = 0;
},

shuffle = function() {

  if (deck === null) { return; }

  deck.shuffle(1);

},


        // Turn Order: from API guide
        // [
        //     {
        //      "id":"36CA8D77-CF43-48D1-8682-FA2F5DFD495F", //The ID of the Graphic object. If this is set, the turn order list will automatically pull the name and icon for the list based on the graphic on the tabletop.
        //      "pr":"0", //The current value for the item in the list. Can be a number or text.
        //      "custom":"" //Custom title for the item. Will be ignored if ID is set to a value other than "-1".
        //     },
        //     {
        //      "id":"-1", //For custom items, the ID MUST be set to "-1" (note that this is a STRING not a NUMBER.
        //      "pr":"12",
        //      "custom":"Test Custom" //The name to be displayed for custom items.
        //     }
        // ]
        //
        // initEdges :
        // [
        //     {  // token that represents a character
        //      "id":"36CA8D77-CF43-48D1-8682-FA2F5DFD495F", //The ID of the Graphic object. If this is set, the turn order list will automatically pull the name and icon for the list based on the graphic on the tabletop.
        //      "edges":"LH,Qu", // or "0" The current value for the item in the list. Can be a number or text.
        //      "name":"Prospero" //Custom title for the item. Will be ignored if ID is set to a value other than "-1".
        //     },
        //     {   // custom item
        //      "id":"-1", //For custom items, the ID MUST be set to "-1" (note that this is a STRING not a NUMBER.
        //      "edges":"SKIP",  // set edges skip to not deal it a card
        //      "name":"Custom Name" //The name to be displayed for custom items.
        //     }
        //     {   // token that doesn't represent a character
        //      "id":"36CA8D77-CF43-48D1-8682-FA2F5DFD495F", //The ID of the Graphic object.
        //      "edges":"0",  // set edges 0 - one card only
        //      "name":"Token name" //The name to be displayed for custom items.
        //     }
        // ]
        //
        // Card = function(cardRank, shortName,longName) {
        //
        //  this.cardRank = cardRank;   //0-53 for init sorting, higher # = higher initiative 
        //  this.shortName = shortName; // short name for display in turn order e.g. JH 
        //  this.longName = longName;   // long name for human readable messages e.g Jack of Hearts
  
deal = function(id) {

  var i;
  var  who=getObj('player',id).get('_displayname').split(' ')[0];
  var sendto = "";
  var turnorder = getTurnOrder();
  
  // build deck if needed
  if (!deck.cards) { 
    sendChat('','/w '+who+" Deck not built - creating and shuffling deck." );
    createDeck(id);
    shuffle();
  }

  // move hand (current turn order) to discard pile
  if (hand.cards) { discards.combine(hand); }

  // shuffle if deck is empty
  if (deck.cardCount() === 0 ) {
    sendChat('','/em  Out of Cards - reshuffling discard pile.' );
    deck.combine(discards);
    shuffle();
  }

  // shuffle if there was a joker lat round
  if (jokerLastRound === 1 ) {
    sendChat('', '/em ' + divStart + '<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">'
            +'Joker Last Round!'+'</div>Reshuffling discard pile...'+ divEnd );
    discards.combine(hand);
    deck.combine(discards);
    shuffle();
    jokerLastRound = 0;
  }
    // deal
    // handle init edges
    var nextcard = {};
    for (i = 0; i < turnorder.length; i+=1) {
        sendto = "/em "; // send messages to everyone by default
        if (initEdges[i].toktype === 'npc') { sendto = "/w gm ";}

        // put it in turn order if getting a card
        // turn order and initEdges are in the same array order - counting on this!
        if (initEdges[i].edges === "SKIP" ) {
            turnorder[i].pr   = "-1";
            turnorder[i].rank = "-1";
            
        }
        else { 
            // sendChat('','/w '+who+" Deck Card Count: " + deck.cardCount() );
            if (deck.cardCount() === 0 ) {
                sendChat('','/em Out of Action Cards - reshuffling discard pile.' );
                deck.combine(discards);
                shuffle();
            }
            // draw a card
            nextcard =  deck.deal();
            // assign card short name to turn order priority
            turnorder[i].pr = nextcard.shortName;        
            turnorder[i].rank = nextcard.cardRank;        
            // store it in hand
            hand.addCard(nextcard); 
            // check for extra card edges - below from PEG forums
            // As stated under Quick, "Characters with both the Level Headed and Quick Edges draw their additional card and 
            // take the best as usual. If that card is a Five or less, the Quick Edge may be used to draw a replacement 
            // until it’s Six or higher." 
            // Meaning they draw 2 cards for Level Headed (or 3 for the Improved version), and then take the higher of 
            // those cards. If that card is still a 5 or less, then they can draw a single new card until they get one of 6 or better. 
            //
            // Level Headed
            if (initEdges[i].edges.indexOf('LH') !== -1 ) {
                if (deck.cardCount() === 0 ) {
                    sendChat('','/em Out of Cards - reshuffling discard pile.' );
                    deck.combine(discards);
                    shuffle();
                }

                // draw a card
                nextcard =  deck.deal();

                sendChat('',sendto + '<u>'+initEdges[i].name+'</u> has <b>Level Headed edge</b>.  Cards are ' + turnorder[i].pr + ' and ' + nextcard.shortName );

                if ( nextcard.cardRank > turnorder[i].rank ) {
                    turnorder[i].pr = nextcard.shortName;        
                    turnorder[i].rank = nextcard.cardRank;        
                }
                // store it in hand
                hand.addCard(nextcard); 
            } // end Level Headed
            // Improved Level Headed
            if (initEdges[i].edges.indexOf('ILH') !== -1 ) {
                if (deck.cardCount() === 0 ) {
                    sendChat('','/em Out of Cards - reshuffling discard pile.' );
                    deck.combine(discards);
                    shuffle();
                }
                // draw a card
                nextcard =  deck.deal();
                sendChat('',sendto + '<u>'+initEdges[i].name+'</u> has <b>Improved Level Headed edge</b>.  Cards are ' + turnorder[i].pr + ' and ' + nextcard.shortName );
                if ( nextcard.cardRank > turnorder[i].rank ) {
                    turnorder[i].pr = nextcard.shortName;        
                    turnorder[i].rank = nextcard.cardRank;        
                }
                // store it in hand
                hand.addCard(nextcard); 
            } // end Improved Level Headed
            // quick
            if (initEdges[i].edges.indexOf('Qui') !== -1 ) {
                // loop until they have a 6 or better
                while (turnorder[i].rank < 16 ) {
                    if (deck.cardCount() === 0 ) {
                        sendChat('','/em Out of Cards - reshuffling discard pile.' );
                        deck.combine(discards);
                        shuffle();
                    }
                    // draw a card
                    nextcard =  deck.deal();
                    sendChat('',sendto + '<u>'+initEdges[i].name+'</u> has <b>Quick edge</b>.  Cards are ' + turnorder[i].pr + ' and ' + nextcard.shortName );
                    if ( nextcard.cardRank > turnorder[i].rank ) {
                        turnorder[i].pr = nextcard.shortName;        
                        turnorder[i].rank = nextcard.cardRank;        
                    }
                    // store it in hand
                    hand.addCard(nextcard); 
                }
            }
        }
        // check for jokers
        if(turnorder[i].rank > 51){ 
            jokerLastRound = 1; 
            if (initEdges[i].edges.indexOf('WCE') !== -1 ) {
                // send message to chat regarding wild card edge activation  - should only send this to the "controlled by" list
                sendChat('', sendto + divStart + '<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">'
                    +initEdges[i].name+'</div>You have a Joker!  Your <b>Wild Card edge</b> activates!'+ divEnd );
            }
        }
    } // end for i ....

    // sort turnorder
    var sortedturnorder = _.sortBy(turnorder, 'rank').reverse();
    // push updated turn order into interface
    Campaign().set("turnorder", JSON.stringify(sortedturnorder));
},  // end deal

discard = function() {

  if (!hand.cards) {return;}

  discards.combine(hand);

},

reset = function() {

  if (!discards.cards) {return;}

  discards.combine(hand);
  deck.combine(discards);

},

display = function(id) {

  var s, i;
    var  who=getObj('player',id).get('_displayname').split(' ')[0];
     

  if (!deck.cards) {
      sendChat('','/w '+who+'  Deck not built!  Run: !deal-init --reset');
      return;
      
  } 
  
  s = "";
  for (i = 0; i < deck.cardCount(); i+=1) {
    s += deck.cards[i].cardRank + ',' + deck.cards[i].shortName + ',' + deck.cards[i].longName + "<p>";
  }
  sendChat('','/w '+who+' ' + divStart + '<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">'
		+'DealInit: Deck Cards</div>'+ s + divEnd );

  s = "";
  for (i = 0; i < hand.cardCount(); i+=1) {
    s += hand.cards[i].cardRank + ',' + hand.cards[i].shortName + ',' + hand.cards[i].longName + "<p>";
  }
  sendChat('','/w '+who+' ' + divStart + '<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">'
    	+'DealInit: Turn Order</div>'+ s + divEnd );

  s = "";
  for (i = 0; i < discards.cardCount(); i+=1) {
    s += discards.cards[i].cardRank + ',' + discards.cards[i].shortName + ',' + discards.cards[i].longName + "<p>";
  }
  sendChat('','/w '+who+' ' + divStart + '<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">'
    	+'DealInit: Discards</div>'+ s + divEnd );
},

// See code from turn marker - create object called TurnOrder with methods


// turn order data structure from API guide
// [
//     {
//      "id":"36CA8D77-CF43-48D1-8682-FA2F5DFD495F", //The ID of the Graphic object. If this is set, the turn order list will automatically pull the name and icon for the list based on the graphic on the tabletop.
//      "pr":"0", //The current value for the item in the list. Can be a number or text.
//      "custom":"" //Custom title for the item. Will be ignored if ID is set to a value other than "-1".
//     },
//     {
//      "id":"-1", //For custom items, the ID MUST be set to "-1" (note that this is a STRING not a NUMBER.
//      "pr":"12",
//      "custom":"Test Custom" //The name to be displayed for custom items.
//     }
// ]

        // To work with the turn order, you will want to use JSON.parse() to get an object representing the 
        // current turn order state (NOTE: Check to make sure it's not an empty string "" first...if it is, 
        // initialize it yourself with an empty array).
    getTurnOrder = function() {
    	var to=Campaign().get("turnorder");
		to=(''===to ? '[]' : to); 
        return JSON.parse(to);
    },


        // To modify the turn order, edit the current turn order object and then use 
        // JSON.stringify() to change the attribute on the Campaign. Note that the 
        // ordering for the turn order in the list is the same as the order of the array, 
        // so for example push() adds an item onto the end of the list, unshift() adds to the beginning, etc.
        //
        // initEdges :
        // [
        //     {  // token that represents a character
        //      "id":"36CA8D77-CF43-48D1-8682-FA2F5DFD495F", //The ID of the Graphic object. If this is set, the turn order list will automatically pull the name and icon for the list based on the graphic on the tabletop.
        //      "edges":"LH,Qu", // or "0" The current value for the item in the list. Can be a number or text.
        //      "name":"Prospero" //Custom title for the item. Will be ignored if ID is set to a value other than "-1".
        //      "toktype": "pc // Token Type "pc" or "npc", used to control who see which messages
        //     },
        //     {   // custom item
        //      "id":"-1", //For custom items, the ID MUST be set to "-1" (note that this is a STRING not a NUMBER.
        //      "edges":"SKIP",  // set edges skip to not deal it a card
        //      "name":"Custom Name" //The name to be displayed for custom items.
        //      "toktype": "npc // Token Type "pc" or "npc"
        //     }
        //     {   // token that doesn't represent a character
        //      "id":"36CA8D77-CF43-48D1-8682-FA2F5DFD495F", //The ID of the Graphic object.
        //      "edges":"0",  // set edges 0 - one card only
        //      "name":"Token name" //The name to be displayed for custom items.
        //      "toktype": "npc // Token Type "pc" or "npc"
        //     }
        // ]
    getInitiativeEdges = function (id) {
    
        var char_edges = "";
        var char_name = "";
        var turnorder = getTurnOrder();
        var i;
        var s = "";
        var  who=getObj('player',id).get('_displayname').split(' ')[0];
        if (!turnorder.length) {
            sendChat('','/w '+who+' ' +divStart + '<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">'
                +'DealInit: Turn Order is Empty - Bailing Out! </div>'+  divEnd );
            return;
        } 
        // else {
            // for (i = 0; i < turnorder.length; i+=1) {
            //     s += turnorder[i].id + ',' + turnorder[i].pr + ',' + turnorder[i].custom + "<p>";
            // }
            // sendChat('','/w '+who+' ' +divStart + '<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">'
            //            +'DealInit: Current Turn Order </div>'+ s + divEnd );
        // }

        var token_obj = {};
        var char_obj = {};
        var toid, controler, tokentype;

        // get associated character from each token in turn order
        for (i = 0; i < turnorder.length; i+=1) {
             // sendChat('',divStart + 'DealInit: TO ID: '+ turnorder[i].id + divEnd );
             toid = turnorder[i].id;
            

            // if the turn order item is a "custom item", mark it as a skip for dealing init
            if ( toid === "-1") { 
                initEdges[i] = { id : toid, edges : "SKIP", name: turnorder[i].custom, toktype:"npc" };
                
            }
            // if the turn order item is a "token that doesn't represent a character", set InitEdges to 0
            else if (!getObj("character", getObj("graphic", toid).get("represents")) ) {
                // from the graphic id, get the token object
                token_obj  = getObj("graphic", toid);
                // determine who controls the token
                controler  =  token_obj.get("controlledby");
                if (controler === '' || playerIsGM(controler) ){
                    tokentype = 'npc';
                }
                else {
                    tokentype = 'pc';                    
                }
                
                char_name = getObj("graphic", toid).get("name"); 
                // handle the turn marder token
                if (char_name.indexOf('Round') !== -1 ) { char_edges = "SKIP"; } else {char_edges = "0";}
                initEdges[i] = { id: toid, edges : char_edges, name: char_name , toktype: tokentype  };
              
                // sendChat('','Player type : '+tokentype+ '<br>Name: '+ initEdges[i].name);
            }
            // turn order item is a "token that represents a character", look for init edges 
            else if ( getObj("character", getObj("graphic", toid).get("represents")) ) {
                
                
                // from the graphic id, get the token object
                token_obj = getObj("graphic", toid);
                // determine who controls the token
                controler  =  token_obj.get("controlledby");
                // sendChat('','controlled by: '+controler);
                if (controler === '' || playerIsGM(controler) ){
                    tokentype = 'npc';
                }
                else {
                    tokentype = 'pc';                    
                }
                // from the token object, get the character that it reperesents
                char_obj    = getObj("character", token_obj.get("represents"));
                // get the name of the character
                char_name  = char_obj.get("name"); 
               
                char_edges = "0"; 
                if (char_obj !== "") {
                    // the get "current" value of InitEdges, if any
                    char_edges = getAttrByName(char_obj.id, "InitEdges");
                    if ( !char_edges ) { char_edges = "0";}  // turn marker gets here
                    // sendChat('', 'looking for round in name: ' + char_name + ' index: ' + char_name.indexOf('Round'));
                    if (char_name.indexOf('Round') !== -1 ) { char_edges = "SKIP"; }
        		}
                initEdges[i] = { id : toid, edges : char_edges, name: char_name, toktype: tokentype  };
                
            }
            else {
                // turn marker script uses a token in turn order that doesn't follow the rules, I initialize the obj to make it safe
                initEdges[i] = { id : toid, edges : "SKIP", name: "unknown",  toktype:"npc" };
            }
            // sendChat('','/w '+who+' ' +divStart + 'DealInit: Character <p>Name: '+ initEdges[i].name  + '<p>Edges: '+ initEdges[i].edges+ '<p>ID: '+ initEdges[i].id + '<p>Token Type: '+ initEdges[i].toktype + divEnd );
        }  // next i
        // log(initEdges);
    
    },




    // every time we deal, we need to
    // o pull turn order tokens
    // o get names, ids, and init edges  
    // o deal cards to hand, accounting for init edges and end of deck and jokers
    // o no cards to custom items in init - set to -1 init to put them at the bottom
    // o on recall and shuffle, don't destroy hand unless new scene/combat (createDeck)
    // o sort the hand high to low
    // o write the hand to turn order
    dealInitiative =function(id) {
        // log('-=> DealInit: Calling [getInitiativeEdges] function <=- ');
         // pulls turn order tokens and fills initEdges object with names,ids,edges
        getInitiativeEdges(id);
        // log('-=> DealInit: back from [getInitiativeEdges] function <=- ');
        deal(id);
    },


    showHelp = function(id) {
		
  var  who=getObj('player',id).get('_displayname').split(' ')[0];
        sendChat('',
			'/w '+who+' '
+'<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">'
	+'<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">'
		+'DealInit v'+version
	+'</div>'
	+'<div style="padding-left:10px;margin-bottom:3px;">'
		+'<p>DealInit supports Savage Worlds style card based Inititive by dealing cards to Turn Order and sorting the order by suit. </p>'
        +'<p>It does not, however, utilize the Roll20 deck system.  Instead it manages an array of cards that are reshuffled when the deck runs out or a joker is drawn.</p>'
        +'<p>It also checks Token Attributes for Any SW Inititative Edges and handles them appropriately.</p>'
        +'<p>Initiative Edges must be stored in a comma separated list in an Attribute named InitEdges. (e.g.  Qu,LH)</p'
        +'<p>The Edge shorthand is as follows:</p>'
        +'<p><b>Qui</b> = Quick</p>'
        +'<p><b>LH</b> = Level Headed</p>'
        +'<p><b>ILH</b> = Improved Level Headed</p>'
        +'<p><b>WCE</b> = Any Joker Activated Wild Card Edge</p>'
	+'</div>'
	+'<b>Commands</b>'
	+'<div style="padding-left:10px;">'
		+'<b><span style="font-family: serif;">!deal-init '+'[ <i>--help</i> ] [<i>--reset</i> ] [<i>--show</i> ]' +'</span></b>'
		+'<div style="padding-left: 10px;padding-right:20px">'
			+'<ul>'
    			+'<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'
					+'<b><span style="font-family: serif;">'+'(<i>no args</i>)'+'</span></b> '+' Deals cards to turn order and sorts by suit.'
				+'</li> '
    			+'<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'
					+'<b><span style="font-family: serif;">'+'--help'+'</span></b> '+' Displays this help.'
				+'</li> '
    			+'<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'
					+'<b><span style="font-family: serif;">'+'--reset'+'</span></b> '+' Reset the deck and shuffle.  Use at the start of a new scene or encounter.'
				+'</li> '
    			+'<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">'
					+'<b><span style="font-family: serif;">'+'--show'+'</span></b> '+' Show the current contents of the deck, discard pile, and turn order.'
				+'</li> '
    		+'</ul>'
    	+'</div>'
    +'</div>'
+'</div>'
    		);
	},

    // possible args
    // !deal-init 
    // --help - show help (showHelp)
    // (no args) - deal cards to items in turn order and sort turn order by suit (dealInitiative)
    // --reset - creates and shuffles the deck, use at the start of combat/scene (init)
    // --show - show the cards in turnorder, discard, draw piles (showCards)
    
    handleInput = function(msg_orig) {

        
        var msg = _.clone(msg_orig);
        var args = [];
        


        if (msg.type !== "api") {
			return;
		}



        args = msg.content
            .replace(/<br\/>\n/g, ' ')
            .replace(/(\{\{(.*?)\}\})/g," $2 ")
            .split(/\s+--/);
            


        // bail out if api call is not to deal-init
        if (args.shift() !== "!deal-init") {
            // log('-=> DealInit: Not calling [deal-init] exiting... <=- ');
    		return;
		}

        // print help
        if (args[0] === "help") {
            // log('-=> DealInit: Calling [showHelp] function <=- ');
            showHelp(msg.playerid);
            return;
		}

        
        // reset the deck and shuffle 
        if (args[0] === "reset") {
        	// log('-=> DealInit: Calling [createDeck] function <=- ');
            createDeck(msg.playerid);
            return;
		}
        // print out the contents of turn order, discard, and draw piles
        if (args[0] === "show") {
            // log('-=> DealInit: Calling [display] function <=- ');
            display(msg.playerid);
            return;
		}


        // log('-=> DealInit: Calling [dealInitiative] function <=- ');
        dealInitiative(msg.playerid);
        // log('-=> DealInit: Back from [dealInitiative] function <=- ');
    	return;
        
    }, // end handle input

    checkInstall = function() {
		log('-=> DealInit v'+version+' <=- ' + lastUpdate);
	},

	registerEventHandlers = function() {
		on('chat:message', handleInput);
	};

	return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};
}()); // end DealInit



on("ready",function(){
    'use strict';

	DealInit.CheckInstall();
	DealInit.RegisterEventHandlers();
});

