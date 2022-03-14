const { CustomEmbed, Paginate } = require("#structures");
const { formatString } = require("#utils");

module.exports = {
    name: "combos",
    aliases: ["com"],
    description: "Possible Combos in poker",
    execute: ({ bot, message, send }) => {
        message.delete();
        let embed = new CustomEmbed()
            .setAuthor({
                name: `Combos:`,
                iconURL: "https://cdn.discordapp.com/emojis/942554045862781008.webp?size=160&quality=lossless"
            })
            .addFields(
                {
                    name: "Card Order:",
                    value: "Ordered from 2 to 10, followed by Jack, Queen, King,Ace\n<:2clubs:942893769190154351><:3clubs:942893823468666950><:4clubs:942893861632630804><:5clubs:942893899939188826><:6clubs:942893951977922650><:7clubs:942894001261006909><:8clubs:942894043527020665><:9clubs:942894086367641700><:10clubs:942894134891540552><:11clubs:942894187987234847><:12clubs:942894255041552444><:13clubs:942894297496293376><:1clubs:942566716922298439>"
                },
                {
                    name: "Card Suits:",
                    value: "four suits: Clubs, Spades, Hearts, Diamonds:\n<:1clubs:942566716922298439><:1spades:942888350552064100><:1hearts:942892101413269547><:1diamonds:942892184871534653>"
                },
                { name: "High Card:", value: "Highest Card in Hand\n <:1clubs:942566716922298439>" },
                {
                    name: "Royal Flush:",
                    value: "Highest Combo in poker, stemming from Having a straight flush from 10-Ace of one suit\n<:10clubs:942894134891540552><:11clubs:942894187987234847><:12clubs:942894255041552444><:13clubs:942894297496293376><:1clubs:942566716922298439>"
                },
                {
                    name: "Straight Flush:",
                    value: "Having 5 consequitive cards of the same suit, in case of tie highest card wins.\n<:8clubs:942894043527020665><:9clubs:942894086367641700><:10clubs:942894134891540552><:11clubs:942894187987234847><:12clubs:942894255041552444>"
                },
                {
                    name: "4 of a Kind",
                    value: "4 of the same value, in case of tie highest four of kind wins, then highest left over card.\n<:1spades:942888350552064100><:1diamonds:942892184871534653><:1clubs:942566716922298439><:1hearts:942892101413269547>"
                }
            );
        let embed2 = new CustomEmbed()
            .addFields(
                {
                    name: "Full House",
                    value: "3 of 1 card value, 2 of another. higher 3 of a kind takes presidence in tie, then pair.\n<:1spades:942888350552064100><:1diamonds:942892184871534653><:1hearts:942892101413269547><:13clubs:942894297496293376><:13diamonds:942894394770620497>"
                },
                {
                    name: "Flush",
                    value: "All 5 cards of the same suit, highest card wins ties.\n<:3clubs:942893823468666950><:7clubs:942894001261006909><:8clubs:942894043527020665><:13clubs:942894297496293376><:1clubs:942566716922298439>"
                },
                {
                    name: "Straight",
                    value: "5 consecutive cards, highest card wins ties.\n<:10clubs:942894134891540552><:11clubs:942894187987234847><:12clubs:942894255041552444><:13diamonds:942894394770620497><:1hearts:942892101413269547>"
                },
                {
                    name: "Three of a Kind",
                    value: "3 cards of the same value, value of these takes presidence.\n<:1spades:942888350552064100><:1hearts:942892101413269547><:1diamonds:942892184871534653>"
                },
                {
                    name: "Two pairs",
                    value: "2 pairs of 2 cards of the same value, In case of tie, higher pair, then lower pair, then left over card.\n<:1spades:942888350552064100><:1diamonds:942892184871534653><:13clubs:942894297496293376><:13diamonds:942894394770620497>"
                },
                {
                    name: "1 Pair",
                    value: "1 pair of 2 cards with the same value, In case of tie, pair, then then left over cards.\n<:13clubs:942894297496293376><:13diamonds:942894394770620497>"
                }
            );

        new Paginate(message, [embed, embed2], message.member);


    }
};