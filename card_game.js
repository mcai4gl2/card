$(function() {
    var C = Card();
    var Q = window.Q = Quintus()
        .include('Input,Sprites,Scenes')
        .setup('canvas');
    Q.input.keyboardControls();
    Q.input.enableMouse();
    var console = new Console('console', 15, 72);

    function getFormattedDate() {
        var date = new Date();
        var str = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return str;
    }

    Q.MousePlaceHolder = Q.Sprite.extend({
        init : function() {
            this._super();
            this.p.w = 1;
            this.p.h = 1;
            this.isDetectable = false;
            this.mouseDownPos = {x : -1, y : -1};
        },
        step : function(dt) {
            var p = this.p;
            this.p.x = Q.input.mousePosition.x;
            this.p.y = Q.input.mousePosition.y;

            if (Q.inputs["mousedown"]) {
                //console.println(getFormattedDate() + ' mouse is down (' +
                //    this.p.x + ', ' + this.p.y + ')');
                if (this.mouseDownPos.x == -1 && this.mouseDownPos.y == -1) {
                    this.mouseDownPos.x = this.p.x;
                    this.mouseDownPos.y = this.p.y;
                    var hit = Q.stage().collide(this);
                    if (hit) {
                        if (hit instanceof Q.Card) {
                            this.mouseDownPos.hit = hit;
                        }
                    }
                }
            } else {
                if (this.mouseDownPos.x != -1 && this.mouseDownPos.y != -1) {
                    var hit = Q.stage().collide(this);
                    if (hit) {
                        if (hit instanceof Q.Card && this.mouseDownPos.hit == hit) {
                            hit.trigger('clicked', this);
                        }
                    }

                    this.mouseDownPos.x = -1;
                    this.mouseDownPos.y = -1;
                    delete this.mouseDownPos.hit;
                }
            }

            this._super(dt);
        }
    });

    Q.MousePosDisplay = Q.Text.extend({
        init : function(props) {
            this._super(props);
            this.isDetectable = false;
        },
        step : function(dt) {
            this.text = '(' + Q.input.mousePosition.x + ', ' + Q.input.mousePosition.y + ')';
        }
    });

    Q.Card = Q.Sprite.extend({
        init : function(card) {
            var dx, dy, speed;
            speed = 0;
            speed = 100 + Math.floor(Math.random() * 200);
            if (Math.random() >= 0.5) dx = 1;
            else dx = -1;
            if (Math.random() >= 0.5) dy = 1;
            else dy = -1;
            this._super({sheet : card.name(), speed : speed, dx : dx, dy : dy});
            this.card = card;

            this.bind('clicked', function(mouse) {
                console.println(getFormattedDate() + ' Card '
                    + this.card.name() + ' is clicked');
                this.destroy();

                Q.stage().trigger('removeCard');
            });
        },
        step : function(dt) {
            var p = this.p;

            p.x += p.dx * p.speed * dt;
            p.y += p.dy * p.speed * dt;

            if(p.x < 0) {
                p.x = 0;
                p.dx = 1;
            } else if (p.x > Q.width - p.w) {
                p.dx = -1;
                p.x = Q.width - p.w;
            }

            if(p.y < 0) {
                p.y = 0;
                p.dy = 1;
            } else if(p.y > Q.height - p.h) {
                p.dy = -1;
                p.y = Q.height - p.h;
            }

            this._super(dt);
        }
    });

    Q.load(['cards.png','cards.json'], function(){
        Q.compileSheets('cards.png', 'cards.json');
        Q.scene('game', new Q.Scene(function(stage) {
            var deck = new C.Deck();
            stage.options.sort = function(a, b) {
                return a.p.z - b.p.z;
            };
            deck.shuffle();
            deck.skip(13 * 3);
            var zOrder = 0;
            var cardCount = 0;
            while (deck.getCard()) {
                var club1 = new Q.Card(deck.currentCard());
                club1.p.x = Math.floor(Math.random() * Q.width);
                if (club1.p.x >= (Q.width - club1.p.w)) club1.p.x = (Q.width - club1.p.w);
                club1.p.y = Math.floor(Math.random() * Q.height);
                if (club1.p.y >= (Q.height - club1.p.h)) club1.p.y = (Q.height - club1.p.h);
                club1.p.z = zOrder--;
                stage.insert(club1);
                //console.println(getFormattedDate() + ' Card '
                //    + club1.card.name() + ' is added (' + club1.p.z + ')');
                cardCount++;
            }

            stage.insert(new Q.MousePlaceHolder());
            stage.insert(new Q.MousePosDisplay({x : 40, y : 15}));

            var startTime = new Date();
            stage.bind('removeCard',function() {
                cardCount--;
                if (cardCount == 0) {
                    var endTime = new Date();
                    console.println('Game time ' + (endTime - startTime));
                    console.println('All cards are removed, restarting the game');
                    Q.stageScene('game');
                }
            });
        }));
        Q.stageScene('game');
    });
});