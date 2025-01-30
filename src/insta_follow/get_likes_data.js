import { instaLikesAPI } from "../socmed_API/insta.js";
import { logsUserSend } from "../view/logs_view.js";

export async function getInstaLikes(todayItems, uname, from) {
    
    return new Promise(async (resolve, reject) => {
      
      try { 
        let likesChecker = true;

        for (let i=0; i < todayItems.length; i++){
            
            await instaLikesAPI(todayItems[i]).then(
                async response =>{

                    console.log(response);
                    let usernames = new Array;
      
                    const likesItems = await response.data.data.items;

                    likesItems.forEach(item => {
                        usernames.push(item.username)
                    });

                    if (!usernames.includes(uname)){

                        likesChecker = false;

                        logsUserSend(from,

`Hi, ${uname}

Sistem Kami membaca bahwa Anda belum melakukan Likes pada konten :

https://instagram.com/p/${todayItems[i]}

Silahkan likes pada 3 konten terakhir, dan kirim kembali pesan permintaan Voucer WiFi Corner.

`
                        );
                    } else {
                        console.log("Contains Uname")
                    }

                    if(!likesChecker){
                        let data = {
                            data: false,
                            state: false,
                            code: 200
                        };
                        
                        resolve (data);
                    }

                } 
            ).catch(
                async error =>{
                    let data = {
                        data: error,
                        message : "Error Get Insta Likes",
                        state: false,
                        code: 303
                    };
                    
                    reject (data);
                }
            );
            
        }

        
        if(likesChecker){
            let data = {
                data: true,
                state: false,
                code: 200
            };
            
            resolve (data);
        }

      } catch (error) {
        let data = {
          data: error,
          message : "Error Get Insta Likes",
          state: false,
          code: 303
        };
        reject (data);
      }
    }
  );
}