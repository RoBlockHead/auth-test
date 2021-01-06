import Discord from 'discord.js';
import DiscordRPC from 'discord-rpc';

export const client: Discord.Client = new Discord.Client();
export const rpcClient = new DiscordRPC.Client({ transport: 'websocket' });
DiscordRPC.register(796155176594702336)
client.on('ready', () => {
    // console.log(`Logged in as ${client.user.tag}`)
});

rpcClient.on('ready', () => {
    console.log(`Logged in as ${rpcClient.application.name}`);
    console.log(`Authed for user ${rpcClient.user.username}`);
    rpcClient.setActiviy({
        details: "yeet"
    })
    setInterval
    
});

