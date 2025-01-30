import { instaLikesAPI } from "../socmed_API/insta.js";

export async function getInstaLikes(todayItems, uname) {
    
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