//Route
import express from 'express';
const app = express();

//WWebjs
import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wwebjs;

//.env
import 'dotenv/config';

//QR-Code
import qrcode from 'qrcode-terminal';

//Figlet
import figlet from 'figlet';
const { textSync } = figlet;

//Banner
import { set } from 'simple-banner';
import { logsSave, logsSend, logsUserError, logsUserSend } from './src/view/logs_view.js';
import { getInstaLikes } from './src/controller/get_likes_data.js';
import { getInstaPost } from './src/controller/get_post_data.js';
import { getVoucher } from './src/controller/get_voucher.js';

//Local Dependency
//.env
const private_key = process.env;

// Routing Port 
const port = private_key.EXPRESS_PORT;

app.listen(port, () => {
    console.log(`Cicero System Start listening on port >>> ${port}`)
});

// WWEB JS Client Constructor
export const client = new Client({
    authStrategy: new LocalAuth({
        clientId: private_key.APP_SESSION_NAME,
        executablePath: '/usr/bin/chromium-browser'
    }),
});


// On WWEB Client Initializing
console.log('System Initializing...');
client.initialize();

// On WWeB Authenticate Checking
client.on('authenthicated', (session)=>{
    logsSave(JSON.stringify(session));
});

// On WWEB If Authenticate Failure
client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

// On WWEB If Disconected
client.on('disconnected', (reason) => {
    console.error('Client was logged out', reason);
});

// On Pairing with QR Code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// On Reject Calls
let rejectCalls = true;
client.on('call', async (call) => {
    console.log('Call received, rejecting. GOTO Line 261 to disable', call);
    if (rejectCalls) await call.reject();
});

// On WWeb Ready
client.on('ready', () => {
    //Banner
    logsSave(textSync("CICERO -X- GONET", {
        font: "Ghost",
        horizontalLayout: "fitted",
        verticalLayout: "default",
        width: 240,
        whitespaceBreak: true,
    }));

    set("Cicero System Manajemen As A Services");
    logsSave('===============================');
    logsSave('===============================');
    logsSave('======System Fully Loaded!=====');
    logsSave('=========Enjoy the Ride========');
    logsSave('===We\'ll Take Care Everything==');
    logsSave('===============================');
    logsSave('===============================');
});

client.on('message', async (msg) => {
    try {
        if(msg.body.toLowerCase().startsWith(`${process.env.REQ_ORDER}#`)){
            const splittedMsg = msg.body.split("#"); //this Proccess Request Order by Splitting Messages

            if(splittedMsg[1].toLowerCase().includes('https://www.instagram.com/')){

                if (!splittedMsg[1].includes('/p/') 
                || !splittedMsg[1].includes('/reels/') 
                || !splittedMsg[1].includes('/video/') ){

                    const instaLink = splittedMsg[1].split('?')[0];
                    const instaUsername = instaLink.replaceAll('/profilecard/','').split('/').pop();  

                    await getInstaPost(process.env.INSTA_UNAME_CLIENT).then(
                        async response => {
                            getInstaLikes(response.data, instaUsername, msg.from).then(
                            async response => {
                                console.log(response.data)
                                if(response.data.unlikesCounter === 0){
                                    await getVoucher(instaUsername, msg.from).then(
                                        async response =>{  
                                            logsUserSend(msg.from, response.data);                                                    
                                        }).catch(
                                            error => logsUserError(msg.from, error)
                                    );
                                } else {

                                    logsUserSend(msg.from, 
`Sistem kami membaca Anda belum melakukan likes pada ${response.data.unlikesCounter} konten :
    
${response.data.linkInsta}
Silahkan Likes Konten dan Ulangi Pesan Request Voucher WiFi Corner.

Terimakasih
`
                                    );                                                    

                                }
                            }
                        ).catch(
                            error => logsUserError(msg.from, error)
                        )}
                    ).catch(
                        error => logsUserError(msg.from, error)
                    )
                } else {
                    logsUserSend(
                        msg.from, 
`Silahkan Cek Kembali, link yang Anda cantumkan, pastikan link tersebut adalah link akun profile Instagram Anda dan bukan akun Private.

Terimakasih.`
                    );
                }

            } else{
                logsUserSend(
                    msg.from,
`Silahkan Cek Kembali, link yang Anda cantumkan, pastikan link tersebut adalah link akun profile Instagram Anda dan bukan akun Private.
    
Terimakasih.`
                );
            }
        }
    } catch (error) { //Catching the Error Request
        logsSend(error, "Main Apps");
    }
});