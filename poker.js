const path = require("path");
const { CustomEmbed } = require("#structures");
const { MessageButton, MessageActionRow } = require("discord.js");
let allGames = [];

function arraySort(array) {
  array.sort(function(a, b) {
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
    this.img = path.join(process.cwd(), "Cards", `${this.num}${this.suit.charAt(0).toUpperCase()}` + ".png");
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
      "Ace"
    ];
    this.name = allNames[value - 2] + " of " + suit;
  }
}

class Player {
  constructor(chips, id) {
    this.hand = [];
    this.bank = chips;
    this.id = id;
    this.combos;
    this.inPot = 0;
  }

  deal(cards, deck) {
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
  constructor(startingChips, increments, channel, players, friendly = false) {
    this.players = players.map((p, i) => new Player(startingChips, p));
    this.channel = channel;
    this.baseChips = startingChips;
    this.baseSB = Math.ceil(this.baseChips / 2000) * 10;
    this.increments = increments;
    this.timePassed;
    this.pos = 0;
    setInterval(() => {
      this.sb *= 2;
    }, increments * 60 * 1000);
    this.startEmbed = new CustomEmbed()
      .setTitle("New Game!")
      .setDescription("Total Chips per player: " + this.baseChips + "\nTime Increments: " + this.increments + " minutes\nfirst dealer is <@!" + this.players[0].id + ">");
    this.channel.send({
      embeds: [this.startEmbed]
    });
    console.log("sus");

    this.roundRun();


  }

  async roundRun() {
    let embed1 = new CustomEmbed()
      .setDescription("Dealer is <@!" + this.players[this.pos].id + ">\nDealer choose how many rounds of draws and how many draws per round")
      .setFooter({ text: "Rounds of draws:" });
    let button1 = new MessageButton()
      .setCustomId(`zero`)
      .setLabel("0")
      .setStyle("DANGER");
    let button2 = new MessageButton()
      .setCustomId(`1r`)
      .setLabel("1")
      .setStyle("SUCCESS");
    let button3 = new MessageButton()
      .setCustomId(`2r`)
      .setLabel("2")
      .setStyle("SUCCESS");


    let filter = i => i.user.id === this.players[this.pos].id;

    let drawMsg = await this.channel.send({
      embeds: [embed1], components: [
        new MessageActionRow().setComponents([button1, button2, button3])
      ]
    });

    let i = await drawMsg.awaitMessageComponent({ filter, time: 60000 });
    console.log(i.customId);
    let draw = i.customId === "zero" ? 0 : Number(i.customId.charAt(0));
    await i.reply({
      content: `You selected: \`${draw}\``,
      ephemeral: true
    });
    this.subrounds = draw;
    let embed2 = new CustomEmbed()
      .setFooter({ text: "Draws per round:" });
    let button4 = new MessageButton()
      .setCustomId(`1d`)
      .setLabel("1")
      .setStyle("SUCCESS");
    let button5 = new MessageButton()
      .setCustomId("2d")
      .setLabel("2")
      .setStyle("SUCCESS");
    if (this.subrounds !== 0) {
      let filter2 = i => i.user.id === this.players[this.pos].id;

      let drawMsg2 = await this.channel.send({
        embeds: [embed2], components: [
          new MessageActionRow().setComponents([button4, button5])
        ]
      });

      let i2 = await drawMsg2.awaitMessageComponent({ filter: filter2, time: 60000 });
      let draw2 = i2.customId.charAt(0);
      console.log(draw2);
      await i2.reply({
        content: `You selected: \`${draw2}\``,
        ephemeral: true
      });
      this.draws = Number(draw2);
    } else {
      this.draws = 0;
    }
    let round = new Round(
      this.players,
      this.subrounds,
      this.draws,
      this.sb,
      this.pos,
      this.channel
    );
    // round.winFind(this.players.hand);


    if (this.pos < this.players.length - 1) this.pos++;
    else {
      this.pos = 0;
    }
  }
}

class Round {
  constructor(players, subrounds, draws, sb, dealer, channel) {

    (async () => {
      this.players = players;
      this.channel = channel;
      this.dealer = dealer;
      this.sb = sb;
      this.minb = sb * 2;
      this.deck = new Deck();
      this.pot = sb * 3;
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].inPot = 0;
      }
      if (this.players.length > this.dealer + 2) {
        this.players[this.dealer + 1].inPot = this.sb;
        this.players[this.dealer + 1].bank -= this.sb;
        this.players[this.dealer + 2].inPot = this.sb * 2;
        this.players[this.dealer + 2].bank -= this.sb * 2;
      } else if (this.players.length > this.dealer + 1) {
        this.players[this.dealer + 1].inPot = this.sb;
        this.players[this.dealer + 1].bank -= this.sb;
        this.players[0].inPot = this.sb * 2;
        this.players[0].bank -= this.sb * 2;
      } else {
        this.players[0].inPot = this.sb;
        this.players[0].bank -= this.sb;
        this.players[1].inPot = this.sb * 2;
        this.players[1].bank -= this.sb * 2;
      }
      this.deck.shuffleDeck();
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].hand = [];
        this.players[i].deal(5, this.deck.deck);
      }
      let checkhand = new CustomEmbed()
        .setColor("FUCHSIA")
        .setDescription("Use /hand to check your hand at any time");
      await this.channel.send({ embeds: [checkhand] });
      let i1 = 0;
      let j1 = this.dealer + 3;
      if (this.players.length === 2) {
        if (this.dealer === 0) {
          j1 = 0;
        } else {
          j1 = 1;
        }
      }
      if (j1 >= this.players.length) j1 = 0 + j1 - this.players.length;
      let l = this.players.length;
      while (i1 < l) {
        await this.move(j1);
      }
      this.draws = draws;
      this.subrounds = subrounds;
      for (let i = 0; i < this.subrounds; i++) {
        if (this.players.length < 2) i = this.subrounds;
        this.subroundRun();
      }
      for(let i =0; i<this.players.length; i++){
        this.players[i].highestFind();
      }
      this.winners = this.winFind()
      this.payout = this.pot / this.winners.length;
      for (let i = 0; i < this.winners.length; i++) {
      	this.winners[i].bank += payout;
      }
    })();

  }

  async move(j1) {
    let p = this.players[j1];
    let filter = i => i.user.id === this.players[this.pos].id;
    let embed = new CustomEmbed()
      .setDescription("<@" + p.id + ">, it is your turn. please choose to fold, call, or raise. You can use /hand to check your hand.");
    let buttons = [
      new MessageButton()
        .setLabel("Fold")
        .setCustomId("dude-fold")
        .setStyle("DANGER"),
      new MessageButton()
        .setLabel("Call")
        .setCustomId("dude-call")
        .setStyle("SUCCESS"),
      new MessageButton()
        .setLabel("Raise")
        .setCustomId("dude-raise")
        .setStyle("PRIMARY")
    ];
    let msg = await this.channel.send({
      embeds: [embed],
      components: [new MessageActionRow().setComponents(buttons)]
    });
    let interaction = await msg.awaitMessageComponent({ filter, time: 10 * 1000 });
    let option = interaction.customId.split("-")[1];

    switch (option) {
      case "fold":
        this.players.splice(j1, 1);
        if (j1 === this.players.length) {
          j1 = 0;
        }
        if (j1 <= this.dealer) {
          this.dealer--;
          if (this.dealer === -1) {
            this.dealer = this.players.length - 1;
          }
        } else if (j1 < this.players.length - 1) {
          j1++;
        } else {
          j1 = 0;
        }
        i1++;
        break;
      case "call":
        if (p.bank >= this.minb) {
          this.pot += this.minb - p.inPot;
          p.bank -= this.minb - p.inPot;
          p.inPot += this.minb - p.inPot;
        } else {

        }
        break;
      case "raise":
        break;
    }
  }

  async subRoundRun() {
    let p;
    let i2 = 0;
    let j2 = this.dealer + 1;
    if (j1 === this.players.length) j1 = 0;
    while (i2 < this.players.length) {
      p = this.players[j2];
      //use input in trade hands funcion of player
      //send embed with buttons to trade specific cards
      if (j2 < this.players.length - 1) {
        j2++;
      } else {
        j2 = 0;
      }
      i2++;
    }
    i2 = 0;
    j2 = 0;
    let subl = this.players.length;
    while (i2 < subl) {
      p = this.players[j2];

      let embed = new CustomEmbed()
        .setDescription("Do something");
      let buttons = [
        new MessageButton()
          .setLabel("Fold")
          .setCustomId("dude-fold")
          .setStyle("DANGER"),
        new MessageButton()
          .setLabel("Call")
          .setCustomId("dude-call")
          .setStyle("DANGER"),
        new MessageButton()
          .setLabel("Raise")
          .setCustomId("dude-raise")
          .setStyle("DANGER")
      ];

      let msg = await this.channel.send({
        embeds: [embed],
        components: [newMessageActionRow().setComponents(buttons)]
      });
      let filter = i => i.user.id === this.players[this.pos].id;

      let interaction = await msgawaitMessageComponent({ filter, time: 10 * 1000 });
      let option = interaction.customId.split("-")[1];

      switch (option) {
        case "fold":
          break;
        case "call":
          break;
        case "raise":
          break;
      }

      //send embed with buttons that give input, fold, call
      //if folded, do not increase j1 unless = this.players.length
      if (j2 < this.players.length - 1) {
        j2++;
      } else {
        j2 = 0;
      }
      if (this.players.length < 2) return;
      i2++;
    }
  }

  winFind() {
    let allTied = [this.players[0]];
    let highest = allTied[0].combos.type;
    for (let i = 1; i < this.players.length; i++) {
      highest = allTied[0].combos.type;
      if (this.players[i].combos.type < highest) {
        allTied = [this.players[i]];
      } else if (this.players[i].combos.type === highest) {
        allTied.push(this.players[i]);
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
            j = 0;
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
          j = -1;
        }
      }
      return allWin;
    }
  }
}

class Deck {
  constructor() {
    this.deck = [];
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
        return { truth: false };
      }
      if (array[i].num + 1 != array[i + 1].num) {
        return { truth: false };
      }
    }
    return { truth: true, val: array[array.length - 1].num };
  }

  ofKind4(array) {
    for (let i = 0; i < 2; i++) {
      if (array[i].num === array[i + 3].num) {

        return {
          truth: true,
          val: array[array.length - (2 - i)].num
        };
      }
    }
    return { truth: false };
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
      return { truth: true, val3: arrayA1[0].num };
    } else {
      return { truth: false };
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
          val: array[i].num
        };
      }
    }
    return { truth: false };
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
      highL: arrayA
    };
    return returner;
  }
}

module.exports = { allGames, Card, Player, Game, Highest, Checker };