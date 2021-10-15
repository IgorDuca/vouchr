class CardAlgorithm {
    public giveCardValue (cardName: String, playerId: String): any {
      function giveSuitPiority(suit: String) {
        if(suit === 'D') return 4
        if(suit === 'S') return 3
        if(suit === 'H') return 2
        if(suit === 'C') return 1
      }

      function giveCardPriority(value: String) {
        if(value === '3') return 1
        if(value === '2') return 2
        if(value === 'A') return 3
        if(value === 'K') return 4
        if(value === 'J') return 5
        if(value === 'Q') return 6
        if(value === '7') return 7
        if(value === '6') return 8
        if(value === '5') return 9
        if(value === '4') return 10
        
      }
  
      const targetCard = cardName
  
      const cardValue = targetCard.split('')[0]
      const cardSuit = targetCard.split('')[1]
  
      var CardValuePriority = giveCardPriority(cardValue)
      var CardSuitPriority = giveSuitPiority(cardSuit)
  
      const response = {
        value: cardValue,
        suit: cardSuit,
        valuePriority: CardValuePriority,
        suitPriority: CardSuitPriority,
        playerId: playerId
      }
  
      return response
    }
  }
  
  export default new CardAlgorithm()
  