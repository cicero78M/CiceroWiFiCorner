import { instaPostAPI } from "../module/insta.js";

export async function getInstaPost(instaAccount) {

  let lastCode = new Array; 
  let postItems = new Array;

  return new Promise(async (resolve, reject) => {

    try {
        await instaPostAPI(instaAccount).then( async response =>{
        
            postItems = await response.data.data.items;
            
            for (let i = 0; i < postItems.length; i++) {
              if (!postItems[i].is_pinned){

                lastCode.push(postItems[i].code);
                if (lastCode.length > 1 && lastCode.length < 2){
                  break;
                }
              }
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