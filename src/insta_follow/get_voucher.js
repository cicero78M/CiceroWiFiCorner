import { instaInfoAPI } from "../socmed_API/insta.js";
import { logsUserSend } from "../view/logs_view.js";
import { instaUserFollowing } from "./generate_user_following.js";

export async function getVoucher(username, from) {

    logsUserSend(from, "Silahkan Tunggu, sistem kami sedang memproses permintaan anda.")

    return new Promise(async (resolve, reject) => {

        try {

            let pages = "";
            let countData = 0;

            let isFollowing = false;
            let responseInfo ;
    
            await instaInfoAPI(username).then(
                response => {
                    responseInfo = response;
                }
            ).catch(
                error =>
                {
                    let data = {
                    data: error,
                    message : "Fail Getting Your User Name", 
                    code: 303,
                    state: false
                }
                reject (data)}
            )
            
            await instaUserFollowing(username, pages, countData, responseInfo.data.data.following_count).then(
                async response =>{
                    if(response.data){
                        isFollowing = true;
                    }
                }
            );

            if(isFollowing){

                let responseData = {
                    data: 
`Hi, Selamat Siang ${responseInfo.data.data.full_name}

Sistem Kami sudah membaca bahwa kamu sudah Follow Akun Instagram @lumajang_kab,

Berikut Login dan Password yang bisa kamu gunakan untuk mengakses Wifi Corner Pemkab Lumajang :

User : Username
Password : xxxxxx`,
                    code: 200,
                    state: true
                }
        
                resolve (responseData);     
            } else {
                let responseData = {
                    data: 
`Hi, Selamat Siang ${responseInfo.data.data.full_name}

Sistem Kami membaca bahwa kamu belum Follow Akun Instagram @lumajang_kab,

Silahkan Follow Akun Instagram Kami untuk mendapatkan Akses *GRATIS* ke WiFi Corner Pemkab Lumajang.

Dapatkan Info Terkini via Whatsapp dari Pemkab Lumajang dengan menggunakan WiFi Corner Pemkab Lumajang. 

https://www.instagram.com/lumajang_kab

Terimakasih`,

                    code: 200,
                    state: true
                }
        
                resolve (responseData);    
            }
    
        } catch (error) {
            console.log(error)
            let data = {
                data: error,
                message : "Fail Getting Voucher", 
                code: 303,
                state: false
            }
            reject (data);
        }
        
    });
}