test('Card.init', function() {
    var C = Card();
    var card = new C.Card(C.CardKind.Club, C.CardNum.Ace);
    QUnit.equal(card.name(), 'club1', 'card Club Ace has name club1');

    var card = new C.Card(C.CardKind.Special, C.CardNum.Joker);
    QUnit.equal(card.name(), 'special15', 'card Special Joker has name special15');
});

test('Card.isComparable', function() {
    var C = Card();
    var card1 = new C.Card(C.CardKind.Club, C.CardNum.Ace);
    var card2 = new C.Card(C.CardKind.Club, C.CardNum.Two);
    QUnit.equal(card1.isComparable(card2), true, 'Club Ace is comparable with Club Two');

    var C = Card();
    var card1 = new C.Card(C.CardKind.Club, C.CardNum.Ace);
    var card2 = new C.Card(C.CardKind.Heart, C.CardNum.Two);
    QUnit.equal(card1.isComparable(card2), false, 'Club Ace is not comparable with Heart Two');
});

test('Card.compareTo', function() {
    var C = Card();
    var card1 = new C.Card(C.CardKind.Club, C.CardNum.Ace);
    var card2 = new C.Card(C.CardKind.Heart, C.CardNum.Two);
    QUnit.equal(card1.compareTo(card2) == undefined, true, 'Club Ace compares to Heart Two gets undefined');

    var C = Card();
    var card1 = new C.Card(C.CardKind.Club, C.CardNum.Ace);
    var card2 = new C.Card(C.CardKind.Club, C.CardNum.Two);
    QUnit.equal(card1.compareTo(card2) < 0, true, 'Club Ace is smaller to Club Two');

    var C = Card();
    var card1 = new C.Card(C.CardKind.Club, C.CardNum.Ace);
    var card2 = new C.Card(C.CardKind.Club, C.CardNum.Ace);
    QUnit.equal(card1.compareTo(card2) == 0, true, 'Club Ace equals to Club Ace');
});

test('Deck.init(numOfDecks : 1)', function() {
    var C = Card();
    var deck = new C.Deck();
    QUnit.equal(deck.totalNumOfCards(), 52, '1 deck contains 52 cards');
    QUnit.equal(_.all(deck.cards, function(card) {
        return card.kind != C.CardKind.Special && card.num <= C.CardNum.King;
    }), true, 'There is no jokers');
    var counts = _.countBy(deck.cards, function(card) {
        return card.kind;
    });
    QUnit.equal(counts[C.CardKind.Club], 13, '13 club cards');
    QUnit.equal(counts[C.CardKind.Diamond], 13, '13 diamond cards');
    QUnit.equal(counts[C.CardKind.Heart], 13, '13 heart cards');
    QUnit.equal(counts[C.CardKind.Spade], 13, '13 spade cards');
    var counts2 = _.countBy(deck.cards, function(card) {
        return card.num;
    });
    QUnit.equal(counts2[C.CardNum.Ace], 4, '4 Ace cards');
    QUnit.equal(counts2[C.CardNum.Two], 4, '4 Two cards');
    QUnit.equal(counts2[C.CardNum.Three], 4, '4 Three cards');
    QUnit.equal(counts2[C.CardNum.Four], 4, '4 Four cards');
    QUnit.equal(counts2[C.CardNum.Five], 4, '4 Five cards');
    QUnit.equal(counts2[C.CardNum.Six], 4, '4 Six cards');
    QUnit.equal(counts2[C.CardNum.Seven], 4, '4 Seven cards');
    QUnit.equal(counts2[C.CardNum.Eight], 4, '4 Eight cards');
    QUnit.equal(counts2[C.CardNum.Nine], 4, '4 Nine cards');
    QUnit.equal(counts2[C.CardNum.Ten], 4, '4 Ten cards');
    QUnit.equal(counts2[C.CardNum.Jack], 4, '4 Jack cards');
    QUnit.equal(counts2[C.CardNum.Queen], 4, '4 Queen cards');
    QUnit.equal(counts2[C.CardNum.King], 4, '4 King cards');
});

test('Deck.init with Jokers', function() {
    var C = Card();
    var deck = new C.Deck(1, true, true);
    QUnit.equal(deck.totalNumOfCards(), 54, '1 deck contains 52 cards and 2 jokers');
    var counts = _.countBy(deck.cards, function(card) {
        return card.kind;
    });
    QUnit.equal(counts[C.CardKind.Special], 2, '2 jokers');
    var counts2 = _.countBy(deck.cards, function(card) {
        return card.num;
    });
    QUnit.equal(counts2[C.CardNum.JokerS], 1, '1 small joker');
    QUnit.equal(counts2[C.CardNum.Joker], 1, '1 big joker');

    var C = Card();
    var deck = new C.Deck(1, true, false);
    QUnit.equal(deck.totalNumOfCards(), 54, '1 deck contains 52 cards and 2 jokers');
    var counts = _.countBy(deck.cards, function(card) {
        return card.kind;
    });
    QUnit.equal(counts[C.CardKind.Special], 2, '2 jokers');
    var counts2 = _.countBy(deck.cards, function(card) {
        return card.num;
    });
    QUnit.equal(counts2[C.CardNum.JokerS], undefined, 'there is no small joker');
    QUnit.equal(counts2[C.CardNum.Joker], 2, '2 big jokers');
});

test('Deck.utilities', function() {
    var C = Card();
    var deck = new C.Deck();
    QUnit.equal(deck.currentCard() == undefined,
        true, "call current card without getting the first card gets no card");
    QUnit.equal(deck.availableNumOfCards(), deck.totalNumOfCards(), "all cards are available");
    QUnit.equal(deck.getCard() == deck.cards[0], true, "getCard gets the first card without shuffle");
    QUnit.equal(deck.getCard().compareTo(deck.cards[1]), 0, "getCard call again gets the second card without shuffle using compareTo");
    QUnit.equal(deck.shuffle() instanceof C.Deck, true, "shuffle function returns the deck back");
    QUnit.equal(deck.availableNumOfCards(), deck.totalNumOfCards(), "after shuffle, the deck is reset");
    QUnit.equal(deck.skip(deck.totalNumOfCards()).availableNumOfCards(), 0, "skipping all cards gets no card left");
    QUnit.equal(deck.getCard() == undefined, true, "call getCard with no card available gets no card");
});