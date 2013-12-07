var Card = function(opts) {
    var C = {};

    C._normalizeArg = function(arg) {
        if (_.isString(arg)) {
            arg = arg.replace(/\s+/g,'').split(",");
        }
        if (!_.isArray(arg)) {
            arg = [arg];
        }
        return arg;
    };

    C.extend = function(obj) {
        _(C).extend(obj);
        return C;
    };

    C.CardKind = {
        "Spade" : "spade",
        "Heart" : "heart",
        "Diamond" : "diamond",
        "Club" : "club",
        "Special" : "special"
    };

    C.CardNum = {
        "Ace" : 1,
        "Two" : 2,
        "Three" : 3,
        "Four" : 4,
        "Five" : 5,
        "Six" : 6,
        "Seven" : 7,
        "Eight" : 8,
        "Nine" : 9,
        "Ten" : 10,
        "Jack" : 11,
        "Queen" : 12,
        "King" : 13,
        "JokerS" : 14,
        "Joker" : 15
    };

    C.Card = Class.extend({
        init : function(kind, num) {
            this.kind = kind;
            this.num = num;
        },
        name : function() {
            return this.kind + this.num;
        },
        isComparable : function(card) {
           return this.kind == card.kind;
        },
        compareTo : function (card) {
            if (this.isComparable(card)) {
                return this.num - card.num;
            }
        }
    });

    C.Deck = Class.extend({
        init : function(numOfDecks, includeJokers, jokersAreDifferent, cards) {
            this.numOfDecks = numOfDecks == undefined ? 1 : numOfDecks;
            this.includeJokers = includeJokers == undefined ? false : includeJokers;
            this.jokersAreDifferent = jokersAreDifferent == undefined ? false : jokersAreDifferent;
            this.cards = [];

            this.setup(cards);
        },
        setup : function(cards) {
            if (cards == undefined) {
                var kinds = _.filter(C.CardKind, function(kind) {return kind != C.CardKind.Special; });
                var nums = _.filter(C.CardNum, function(num) {return num <= C.CardNum.King; });
                for (var i = 1; i <= this.numOfDecks; i++) {
                    for (var kind in kinds) {
                        for (var num in nums) {
                            this.cards.push(new C.Card(kinds[kind], nums[num]));
                        }
                    }

                    if (this.includeJokers) {
                        if (this.jokersAreDifferent) {
                            this.cards.push(new C.Card(C.CardKind.Special, C.CardNum.JokerS));
                            this.cards.push(new C.Card(C.CardKind.Special, C.CardNum.Joker));
                        } else {
                            this.cards.push(new C.Card(C.CardKind.Special, C.CardNum.Joker));
                            this.cards.push(new C.Card(C.CardKind.Special, C.CardNum.Joker));
                        }
                    }
                }
            }
            else {
                this.cards = cards;
            }

            var cardIndexes = new Array();
            var currentIndex = -1;

            for (var i = 0; i < this.totalNumOfCards(); i++) {
                cardIndexes[i] = i;
            }

            this.currentCard = function() {
                return this.cards[cardIndexes[currentIndex]];
            };

            this.shuffle = function() {
                cardIndexes = _.shuffle(cardIndexes);
                currentIndex = -1;
                return this;
            };

            this.availableNumOfCards = function() {
                return this.totalNumOfCards() - currentIndex - 1;
            };

            this.getCard = function() {
                if (this.availableNumOfCards() > 0) {
                    currentIndex++;
                    return this.currentCard();
                }
            };

            this.skip = function(num) {
                if (this.availableNumOfCards() >= num) {
                    currentIndex += num;
                }
                return this;
            }
        },
        totalNumOfCards : function() {
            return this.cards.length;
        }
    });

    return C;
};