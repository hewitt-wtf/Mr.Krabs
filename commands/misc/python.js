const { CustomEmbed } = require("#structures");
const { formatString } = require("#utils");
module.exports = {
    name: "holy",
    description: "An excellent Quote from an excellent group of people",
    execute: ({ bot, message, send }) => {
        message.delete();
        let quotes = [

            "I have a great Friend in Rome by the name Biggus Dickus",

            "She Turned me into a Newt.\nA newt? \n... I got better.",

            "Its just a Scratch.\nA scratch? Your Arms off.",

            "The Knights Who Say 'Ni' demand a sacrifice\nKnights of 'Ni', we are but simple travellers\nWho seek the enchanter who lives beyond these woods\nNi! (Ni! Ni! Ni! Ni! Ni!)\nOw! Ow! Ow! Agh!\nWe shall say 'Ni' again to you if you do not appease us\nWell, what is it you want?\nWe want...\nA shrubbery!",

            "And Saint Attila raised the hand grenade up on high, saying, 'O Lord, bless this thy hand grenade, that with it thou mayst blow thine enemies to tiny bits, in thy mercy.' And the Lord did grin. And the people did feast upon the lambs, and sloths, and carp, and anchovies, and orangutans, and breakfast cereals, and fruit bats, and large chulapas. And the Lord spoke, saying, 'First shalt thou take out the Holy Pin. Then shalt thou count to three, no more, no less. Three shall be the number thou shalt count, and the number of the counting shall be three. Four shalt thou not count, neither count thou two, excepting that thou then proceed to three. Five is right out. Once the number three, being the third number, be reached, then lobbest thou thy Holy Hand Grenade of Antioch towards thy foe, who, being naughty in My sight, shall snuff it.'"
        ];
        let images = [
            "https://cdn.discordapp.com/attachments/942544616593432606/952339155986317382/biggus.png",

            "https://cdn.discordapp.com/attachments/942544616593432606/952339300282957874/mqdefault.png",

            "https://cdn.discordapp.com/attachments/942544616593432606/952338968689659984/Z.png",

            "https://cdn.discordapp.com/attachments/942544616593432606/952339482085048350/TheKnightsWhoSayNI.png",

            "https://cdn.discordapp.com/attachments/942544616593432606/952339393002217512/9k.png"

        ];
        let pos = Math.floor(Math.random() * 5);
        let embed = new CustomEmbed()
            .setTitle("To Quote Monty Python:")
            .setColor("GOLD")
            .setImage(images[pos])
            .setDescription(quotes[pos]);
        send({ embeds: [embed] });
    }
};