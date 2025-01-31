import { instaFollowingAPI } from "../module/insta.js";
import { logsSave } from "../view/logs_view.js";

export async function instaUserFollowing(username, pages, countData, totalData) {
    let stateFoll = false;

    logsSave("Execute insta user following");

    return new Promise(async(resolve, reject) => {

        forLoopGenerateFollowing(username, pages, countData, totalData);

        async function forLoopGenerateFollowing(username, pages, countData, totalData) {
            try {

                let dataFollowing = [];

                await instaFollowingAPI(username, pages).then(
                    async response => {

                        dataFollowing = response.data.data.items;

                        let pagination = response.data.pagination_token;
                        let count = response.data.data.count ;

                        for (let i = 0; i < dataFollowing.length; i++){
                            if (dataFollowing[i].username === process.env.INSTA_UNAME_CLIENT){
                                stateFoll = true;
                            }
                        }
    
                        let totalValue = countData + count;    
                        if (stateFoll === false){
                            if (pagination != ""){
                                if(totalData > totalValue){
                                    setTimeout(async () => {
                                        forLoopGenerateFollowing(username, pagination, totalValue, totalData);
                                    }, 2000);
                                } else {
                                    let data =  {
                                        data: false,
                                        code: 200,
                                        state: true
                                    }                
                                    resolve (data);   
                                } 
                            } 
                        } else {
                            
                            let data =  {
                                data: true,
                                code: 200,
                                state: true
                            }                
                            resolve (data);
                        }         
                    }
                );
            } catch (error) {
                let data = {
                    data: error,
                    message: `Error Checking Following to ${process.env.INSTA_UNAME_CLIENT}`,
                    code: 303,
                    state: false
                }
                reject (data);   
            } 
           
        }
    });    
}