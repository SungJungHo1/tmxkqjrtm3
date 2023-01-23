import axios from "axios";

export const push_Event = (name_Text : string,source_Text : string)=>{

    const access_token = 'EAAUGm9aE0gsBAABVEXhzXIZA7bELVYZC9IP9IUMRhEpbijfC3XqloCqj4cXAsspRY95dftSsGEXlZCOJAZC3ZCIF0ImY4TJKVGlQhIuUI4U6oo6gHW7iLV16NQq9bj2zdO0TxlITXdfr7shUICOyV98psimrqaNrV96BoDue016Yc1umDK8Bs'
        var unixTimestamp = Date.now();
        let SetTime = parseInt(`${unixTimestamp/1000}`)
        const datas=
      {
        data: [
          {
            event_name : name_Text,
            event_time : SetTime,
            action_source : "physical_store",
            user_data : {
              em : [
                ""
              ],
              ph : [
                ""
              ]
            },
            custom_data : {
              currency : "",
              value : ""
            }
          }
        ]
      }
        
        axios //"U812329a68632f4237dea561c6ba1d413"
        .post(`https://graph.facebook.com/v15.0/838075867387118/events?access_token=${access_token}`,datas).then((res) =>{
            console.log(res)
        }
    
        )
}
    