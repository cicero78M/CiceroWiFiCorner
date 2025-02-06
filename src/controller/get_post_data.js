import { instaPostAPI } from "../module/insta.js";

export async function getInstaPost(instaAccount) {

  let lastCode = new Array; 
  let postItems = new Array;

  return new Promise(async (resolve, reject) => {

    try {
        await instaPostAPI(instaAccount).then( async response =>{
        
            postItems = await response.data.data.items;
            
            for (let i = 0; i < 2; i++) {
                lastCode.push(postItems[i].code);
            }

            let data = {
                data: lastCode,
                state: true,
                code: 200
            };
            resolve (data);
    
        }).catch(error =>{
            let data = {
                data: error,
                message: "Get Insta Post API Error",

                state: false,
                code: 303
            };
            reject (data);
        });

    } catch (error) {
      let data = {
        data: error,
        message: "Get Insta Post Error",
        state: false,
        code: 303
      };
      reject (data);
    }   
  });
}