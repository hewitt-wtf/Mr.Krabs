const { CustomEmbed, Paginate } = require("#structures");
const { formatString } = require("#utils")

module.exports = {
  name: "howtoplay",
  aliases: ['htp'],
  description: "Playing Guide",
  execute: ({ bot, message, send }) => {
    message.delete()
    let embeds = []
    embeds.push(new CustomEmbed()
      .setAuthor({
        name: `How to Play:`,
        iconURL: 'https://cdn.discordapp.com/emojis/942554045862781008.webp?size=160&quality=lossless'
      })
      .addFields(
        {
          name: 'Basics:',
          value: 'Poker is a game of luck, but also Deception and reading the opponents mind. Hear is a Basic guide to how the game works'
        },
        {
          name: 'Classic Poker:',
          value: 'In Classic Poker, each player recieves a hand of five cards, and then decides if they wish to play. The winner depends on the Combination of cards a player can hold. It can be played so that you can exchange 1 or 2 cards form your hand once or twice, Giving you better combinations.'
        },
        {
          name: 'Dealer:',
          value: 'The Dealer chooses how the game will be varied, deals the cards, and controls the game.'
        },
        {
          name: 'Blinds:',
          value: 'In Poker, there is so called Small and Big Blinds, a number of chips that is always placed in the pots by the players two and one spot counterclockwise from the dealer. the Big blind is the minimum amount of chips needed to enter a round of poker, and the minimum amount to raise by. the small blind is half of this.'
        },

        { name: "Hand:", value: "Each player has a hand, size of which is determined by the game. The hand is what will ultimately decide who wins the game. The hand is created from the Standard deck of cards", },
      )
    )
    embeds.push(new CustomEmbed()
      .setColor("BLACK")
      .setAuthor({
        name: `How to Play:`,
        iconURL: 'https://cdn.discordapp.com/emojis/942552968715198614.webp?size=160&quality=lossless'
      })
      .addFields(
        { name: "Round Start:", value: "When A round starts, the dealer can make choices to modify the game rules. For basic poker, the dealer can choose 0-2 rounds of 1-2 card trades. These allow players to increase the Value of their hands.", },
        { name: "Entering the Round:", value: "Once the dealer has made his choice, starting to the right of the big blind, all players can choose to check, raise, or fold. To check means to enter the same amount that the highest current bet is. Folding means exiting out of the round. When a player folds, they forfit all Their chips in the pot. Raising means to increase the minimum bet in the pot that must be entered to continue.", },
        { name: "Trading cards:", value: "After choosing to play or not, if the dealer has specified, players can trade one or two cards from their hands with new ones from the deck. One should get to know the combinations worth the most points, and decide which cards to trade on behalf of that.", },
        { name: "Game End:", value: "The game ends when Only one player has chips left, and all other players are out." },
        { name: "All in", value: "When you are unable to add as many chips as you want, and spend the rest of your chips, you are all in. You can no longer raise or call, and the pot is sepperated. Other players can now still bet in a sepperate pot, and you can only win your current balance from all players. If you run out of chips, you are out" },
        { name: "Winning a round", value: "At the end of a round, The player who are still in compare their hands, and the winner is decided due to the combo chart. In case of a tie the pot is split between those tied, no suit takes precidence." },
      )
    )
    embeds.push(new CustomEmbed()
      .setColor("BLUE")
      .setAuthor({
        name: `How to Play:`,
        iconURL: 'https://cdn.discordapp.com/emojis/942553377324281928.webp?size=160&quality=lossless'
      })
      .addFields(
        { name: "Global Economy", value: "The Global economy can be impacted by Poker games, depending on the choice to make a game friendly or not" },
        { name: "Friendly v.s. Competitive", value: "Friendly games can be played with any chip amount, and do not impact the global economy. Competitive games require you to have the amount of chips given to enter, and you gain or lose in the global standings depending on how you play" },
      )

    )
    new Paginate(message, embeds, message.member)
  }
}