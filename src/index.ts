import dotenv from 'dotenv';
import { client, rpcClient } from './bot/main';
import { app } from './server';
dotenv.config()

app.listen(process.env.PORT, () => {
    console.log(`Listening at http://localhost:${process.env.PORT}`);
});

// client.login(process.env.DISCORD_TOKEN);
rpcClient.login({clientId: 796155176594702336}).catch(console.error);