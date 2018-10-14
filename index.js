//node-modules
const Discord = require("discord.js");
const ssw = require("statman-stopwatch");
const colors = require("colors");

//constructors
const client = new Discord.Client();
const sw = new ssw();

client.on('messageReactionAdd', (reaction, user) => {
  reaction.message.guild.members.get(user.id).addRole("487078437228380160");
  reaction.message.guild.channels.get("487366754239250442").send(`${user} has been released from interrogation.`);
});

client.on('messageReactionRemove', (reaction, user) => {
  reaction.message.guild.members.get(user.id).removeRole("487078437228380160");
});

client.on('raw', packet => {
  // We don't want this to run on unrelated packets
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
  // Grab the channel to check the message from
  const channel = client.channels.get(packet.d.channel_id);
  // There's no need to emit if the message is cached, because the event will fire anyway for that
  if (channel.messages.has(packet.d.message_id)) return;
  // Since we have confirmed the message is not cached, let's fetch it
  channel.fetchMessage(packet.d.message_id).then(message => {
      // Emojis can have identifiers of name:id format, so we have to account for that case as well
      const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
      // This gives us the reaction we need to emit the event properly, in top of the message object
      const reaction = message.reactions.get(emoji);
      // Check which type of event it is before emitting
      if (packet.t === 'MESSAGE_REACTION_ADD') {
          client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
      }
      if (packet.t === 'MESSAGE_REACTION_REMOVE') {
          client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
      }
  });
});

client.on("message", (message) => {
  if ((message.content==".sendmessage")&&(message.member.hasPermission("ADMINISTRATOR"))) {
    let embed = new Discord.RichEmbed()
    .setColor("#5e96f2")
    .setTitle("Welcome to the server!")
    .addField("Terms of Service", "By reacting to this message you agree to our TOS in this channel's description.")
    .addField("Enjoy your stay!", "Reacting to this message will give you access to the rest of the server.")
    message.channel.send(embed)
  }
});

sw.start();
client.on("ready", () => {
  sw.stop()
  console.log("ready..".underline)
  console.log(`${sw.read()}ms`)
  client.user.setActivity("Tag | by Acups");
});

client.login("NDg3MDA2MzcxMDUzNTY4MDAw.Dn9FrQ.q-hSzMoY8uIRlRbEg3kwKwAcr08");