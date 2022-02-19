let allGames = [];

function arraySort(array) {
    array.sort(function (a, b) {
        return a.num - b.num;
    });
}

function blindCalc(startBlind, incre, timePassed) {
    let increaser = ceil(timePassed / incre);
    return startBlind * increaser;
}

class Card {
    constructor(value, suit) {
        this.num = value;
        this.suit = suit;
        this.img = 'images/cards/' + this.num + this.suit.charAt(1) + '.png';
        let allNames = [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "Jack",
            "Queen",
            "King",
            "Ace",
        ];
        this.name = allNames[value - 2] + " of " + suit;
    }
}

class Player {
    constructor(chips) {
        this.hand = [];
        this.bank = chips;
        this.position;
        this.userId;
        this.combos;
    }

    deal(cards) {
        for (let i = 0; i < cards; i++) {
            this.hand.push(deck[i]);
            deck.splice(i, 1);
        }
        arraySort(this.hand);
    }

    highestFind() {
        let check = new Checker();
        let array = this.hand;
        let kind4 = check.ofKind4(array);
        let full = check.fullHouse(array);
        let flush1 = check.flush(array);
        let straight1 = check.straight(array);
        let kind3 = check.ofKind3(array);
        let kind2 = check.ofKind2(array);
        if (check.royalFlush(array)) return new Highest(0);
        else if (check.straightFlush(array).truth)
            return new Highest(
                1,
                array[array.length - 1],
                check.straightFlush(array).val
            );
        else if (kind4.truth) return new Highest(2, kind4.val);
        else if (full.truth) return new Highest(3, full.val3);
        else if (flush1.truth) return new Highest(4, array[array.length - 1].num);
        else if (straight1.truth) return new Highest(5, array[array.length - 1].num);
        else if (kind3.truth) return new Highest(6, kind3.val);
        else if (kind2.truth && kind2.arr.length === 4)
            return new Highest(
                7,
                kind2.highL[0].num,
                kind2.arr[kind2.arr.length - 1].num,
                kind2.arr[kind2.arr.length - 3].num
            );
        else if (kind2.truth)
            return new Highest(8, kind2.highL, kind2.arr[kind2.arr.length - 1].num);
        else return new Highest(9, array);
    }

    trades(removePositions) {
        for (let i = 0; i < removePositions.length; i++) {
            this.hand.splice(removePositions[i], 1);
        }
        for (let i = 0; i < removePositions.length; i++) {
            this.hand.push(deck[i]);
            deck.splice(i, 1);
        }
        arraySort(this.hand);
    }
}

class Game {
    constructor(numPlayers, startingChips, increments) {
        this.players = [];
        for (let i = 0; i < numPlayers; i++) {
            this.players.push(new Player(startingChips));
        }
        this.subrounds;
        this.draws;
        this.baseChips = startingChips;
        this.baseSB = ceil(this.baseChips / 2000) * 10;
        this.increments = increments;
        this.timePassed;
    }

    roundSetup(subrounds, draws, playAmount) {
        this.subrounds = subrounds;
        this.draws = draws;
        this.playAmount = blindCalc(
            this.basePlayAmount,
            this.increments,
            this.timePassed
        );
    }

    roundRun() {
        let round = new Round(
            this.players,
            this.subrounds,
            this.draws,
            this.playAmount,
            this.dealer
        );
        this.round.winFind(this.players);
    }
}

class Round {
    constructor(players, subrounds, draws, playAmount, dealer) {
        this.dealer;
        this.sb;
        this.bb;
        this.playAmount = playAmount;
        this.deck = [];
        new Deck(this.deck);
        for (let i = 0; i < 2; i++) {
            this.deck.shuffleDeck();
        }
        for (let i = 0; i < players.length; i++) {
            players[i].hand = [];
            players[i].deal(5);
        }
        this.draws = draws;
        this.subrounds = subrounds;
        this.pot;
    }

    subRoundRun() {
    }

    winFind(hands) {
        let allTied = [hands[0]];
        let highest = allTied[0].combos.type;
        for (let i = 1; i < hands.length; i++) {
            highest = allTied[0].combos.type;
            if (hands[i].combos.type < highest) {
                allTied = [hands[i]];
            } else if (hands[i].combos.type === highest) {
                allTied.push(hands[i]);
            }
        }
        if (allTied.length === 1 || allTied[0].combos.type === 0) {
            return allTied;
        } else if (allTied[0].combos.type === 1) {
            let allWin = [allTied[0]];
            let highest = allTied[0].combos.high;
            for (let i = 1; i < allTied.length; i++) {
                highest = allTied[0].combos.high;
                if (allTied[i].combos.high > highest) {
                    allWin = [allTied[i]];
                } else if (allTied[i].combos.high === highest) {
                    allWin.push(allTied[i]);
                }
            }
            return allWin;
        } else if (allTied[0].combos.type === 2) {
            let allWin = [allTied[0]];
            let highest = allTied[0].combos.high;
            for (let i = 1; i < allTied.length; i++) {
                highest = allWin[0].combos.high;
                if (allTied[i].combos.high > highest) {
                    allWin = [allTied[i]];
                } else if (allTied[i].combos.high === highest) {
                    allWin.push(allTied[i]);
                }
            }
            return allWin;
        } else if (allTied[0].combos.type === 3) {
            let allWin = [allTied[0]];
            let highest = allTied[0].combos.high;
            for (let i = 1; i < allTied.length; i++) {
                highest = allWin[0].combos.high;
                if (allTied[i].combos.high > highest) {
                    allWin = [allTied[i]];
                } else if (allTied[i].combos.high === highest) {
                    allWin.push(allTied[i]);
                }
            }
            return allWin;
        } else if (allTied[0].combos.type === 4 || allTied[0].combos.type === 5) {
            let allWin = [allTied[0]];
            let highest = allTied[0].combos.high;
            for (let i = 1; i < allTied.length; i++) {
                highest = allTied[0].combos.high;
                if (allTied[i].combos.high > highest) {
                    allWin = [allTied[i]];
                } else if (allTied[i].combos.high === highest) {
                    allWin.push(allTied[i]);
                }
            }
            return allWin;
        } else if (allTied[0].combos.type === 6) {
            let allWin = [allTied[0]];
            let highest = allTied[0].combos.high;
            for (let i = 1; i < allTied.length; i++) {
                highest = allWin[0].combos.high;
                if (allTied[i].combos.high > highest) {
                    allWin = [allTied[i]];
                } else if (allTied[i].combos.high === highest) {
                    allWin.push(allTied[i]);
                }
            }
            return allWin;
        } else if (allTied[0].combos.type === 7) {
            let allWin = [allTied[0]];
            let highest = allTied[0].combos.c1;
            for (let i = 1; i < allTied.length; i++) {
                highest = allWin[0].combos.c1;
                if (allTied[i].combos.c1 > highest) {
                    allWin = [allTied[i]];
                } else if (allTied[i].combos.c1 === highest) {
                    allWin.push(allTied[i]);
                }
            }
            if (allWin.length > 1) {
                let allWin1 = [allWin[0]];
                let highest = allWin[0].combos.c2;
                for (let i = 1; i < allWin.length; i++) {
                    highest = allWin1[0].combos.c2;
                    if (allWin[i].combos.c2 > highest) {
                        allWin1 = [allWin[i]];
                    } else if (allWin[i].combos.c2 === highest) {
                        allWin1.push(allWin[i]);
                    }
                }
                if (allWin1.length > 1) {
                    let allWin2 = [allWin1[0]];
                    let highest = allWin1[0].combos.high;
                    for (let i = 1; i < allWin1.length; i++) {
                        highest = allWin2[0].combos.high;
                        if (allWin1[i].combos.high > highest) {
                            allWin2 = [allWin1[i]];
                        } else if (allWin1[i].combos.high === highest) {
                            allWin2.push(allWin1[i]);
                        }
                    }
                    return allWin2;
                } else return allWin1;
            } else return allWin;
        } else if (allTied[0].combos.type === 8) {
            let allWin = [allTied[0]];
            let highest = allTied[0].combos.c1;
            for (let i = 1; i < allTied.length; i++) {
                highest = allWin[0].combos.c1;
                if (allTied[i].combos.c1 > highest) {
                    allWin = [allTied[i]];
                } else if (allTied[i].combos.c1 === highest) {
                    allWin.push(allTied[i]);
                }
            }
            if (allWin.length > 1) {
                let allWin1 = [allWin[0]];
                let highest = allWin[0].combos.high[high.length - 1];
                let j = high.length - 1;
                while (j > -1) {
                    for (let i = 1; i < allWin.length; i++) {
                        highest = allWin1[0].combos.high[j];
                        if (allWin[i].combos.high[j] > highest) {
                            allWin1 = [allWin[i]];
                        } else if (allWin[i].combos.high[j] === highest) {
                            allWin1.push(allWin[i]);
                        }
                    }
                    if (allWin1.length > 1) {
                        j--;
                    } else {
                        j = 0
                    }
                }
                return allWin1;
            } else return allWin;
        } else if (allTied.combos.type === 9) {
            let allWin = [allTied[0]];
            let highest = allWin[0].combos.high[high.length - 1].num;
            let j = high.length - 1;
            while (j > -1) {
                for (let i = 1; i < allTied.length; i++) {
                    highest = allWin[0].combos.high[j].num;
                    if (allTied[i].combos.high[j].num > highest) {
                        allWin = [allTied[i]];
                    } else if (allTied[i].combos.high[j].num === highest) {
                        allWin.push(allTied[i]);
                    }
                }
                if (allWin.length > 1) {
                    j--;
                } else {
                    j = -1
                }
            }
            return allWin;
        }
    }
}

class Deck {
    constructor(deck) {
        this.deck = deck
        let suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
        for (let i = 0; i < 4; i++) {
            for (let j = 2; j < 15; j++) {
                this.deck.push(new Card(j, suits[i]));
            }
        }
    }

    shuffleDeck() {
        for (let i = 0; i < this.deck.length; i++) {
            let j = Math.floor(Math.random() * this.deck.length);
            let temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    };
}

class SubRound {
    constructor(players) {
        this.dealer;
        this.players = players;
    }
}


class Highest {
    constructor(type, highCard, combo1, combo2) {
        this.type = type;
        if (highCard) {
            this.high = highCard.num;
        }
        if (combo1) {
            this.c1 = combo1.val;
        }
        if (combo2) {
            this.c2 = combo2.val;
        }
    }
}

class Checker {
    royalFlush(array) {
        if (array[0].num > 9) {
            for (let i = 0; i < array.length - 1; i++) {
                if (array[i].suit != array[i + 1].suit) {
                    return false;
                }
                if (array[i].num + 1 != array[i + 1].num) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    straightFlush(array) {
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i].suit != array[i + 1].suit) {
                return {truth: false};
            }
            if (array[i].num + 1 != array[i + 1].num) {
                return {truth: false};
            }
        }
        return {truth: true, val: array[array.length - 1].num};
    }

    ofKind4(array) {
        for (let i = 0; i < 2; i++) {
            if (array[i].num === array[i + 3].num) {

                return {
                    truth: true,
                    val: array[array.length - (2 - i)].num,
                };
            }
        }
        return {truth: false};
    }

    fullHouse(array) {
        let arrayA = [];
        for (let i = 0; i < array.length; i++) arrayA[i] = array[i].num;
        let checkA = false;
        let arrayA1;

        for (let i = 0; i < array.length - 2; i++) {
            if (array[i].num === array[i + 2].num) {
                arrayA1 = arrayA;
                if (i < 2) {
                    arrayA1.splice(3, 2);
                } else {
                    arrayA1.splice(0, 2);
                }
                arrayA.splice(i, 3);
                checkA = true;
            }
        }

        if (arrayA[0] === arrayA[1] && checkA) {
            return {truth: true, val3: arrayA1[0].num};
        } else {
            return {truth: false};
        }
    }

    flush(array) {
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i].suit != array[i + 1].suit) {
                return false;
            }
        }
        return true;
    }

    straight(array) {
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i].num + 1 != array[i + 1].num) {
                return false;
            }
        }
        return true;
    }

    ofKind3(array) {
        for (let i = 0; i < array.length - 2; i++) {
            if (array[i].num === array[i + 2].num) {
                return {
                    truth: true,
                    val: array[i].num,
                };
            }
        }
        return {truth: false};
    }

    ofKind2(array) {
        let arrayA = [];
        for (let i = 0; i < array.length; i++) arrayA[i] = array[i];
        let arrayB = [];
        let truth = false;
        for (let i = 0; i < arrayA.length - 1; i++) {
            if (arrayA[i].num === arrayA[i + 1].num) {
                arrayB.push(arrayA[i], arrayA[i + 1]);
                arrayA.splice(i, 2);
                i = 0;
                truth = true;
            }
        }
        let returner = {
            truth: truth,
            arr: arrayB,
            highL: arrayA,
        };
        return returner;
    }
}
