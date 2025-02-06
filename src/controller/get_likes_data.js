import { instaLikesAPI } from "../module/insta.js";

export async function getInstaLikes(todayItems, uname) {
    
    return new Promise(async (resolve, reject) => {
      
      try { 
        let linkInsta = "";
        let unlikesCounter = 0;

        for (let i=0; i < todayItems.length; i++){
            
            await instaLikesAPI(todayItems[i]).then(
                async response =>{

                    let usernames = new Array;
      
                    const likesItems = await response.data.data.items;

                    likesItems.forEach(item => {
                        usernames.push(item.username)
                    });

                    if (!usernames.includes(uname)){

                        unlikesCounter++;
                        linkInsta = linkInsta.concat(`
https://instagram.com/p/${todayItems[i]}`);

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

        let data = {
            data: {
                unlikesCounter : unlikesCounter,
                linkInsta : linkInsta,
            },
            state: false,
            code: 200
        };
        
        resolve (data);
        

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