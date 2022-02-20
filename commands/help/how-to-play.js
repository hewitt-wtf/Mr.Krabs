const {CustomEmbed} = require("#structures");
const {formatString} = require("#utils")

module.exports = {
    name: "howtoplay",
    aliases: ['htp'],
    description: "Playing Guide",
    execute: ({bot, message, send}) => {
        message.delete()
        let embed = new CustomEmbed()
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
                    value: 'In Classic Poker, each player recieves a hand of five cards, and then decides if they wish to play. The winner depends on the Combination of cards a player can hold. It can be played so that you can exchange 1 or 2 carss form your hand once or twice, Giving you better combinations.'
                },
                {
                    name: 'Dealer:',
                    value: 'The Dealer chooses how the game will be varied, deals the cards, and controls the game.'
                },
                {
                    name: 'Blinds:',
                    value: 'In Poker, there is so called Small and Big Blinds, an amount of chips that is always placed in the pots by the players two and one spot counterclockwise from the dealer. the Big blind is the minimum amount of chips needed to enter a round of poker, and the minimum amount to raise by. the small blind is half of this.'
                },
            )
        send(embed)
    }
}