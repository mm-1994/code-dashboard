import { getUserInfo } from "../../src/api/user";

const serverEventHandler = (e) => {
    const message = JSON.parse(e.data)
    console.log('message=  ', message)
    setCycollects((prevCyCollects) => {
    return prevCyCollects ? (prevCyCollects).map((item) => {
    if (item.id === message['IMEI']) { return { ...item, lock_status: message["lock_status"] } }
    return item
    }) : undefined
})
}
const URL = process.env.REACT_APP_SERVER_URL+"stream?channel=";
const user=getUserInfo();
var serverEvent=new EventSource(URL+user.device_group ,{
    headers: {
        "Access-Control-Allow-Origin":"*"
    }})
console.log("INIT CONNECTYION")
serverEvent.close();

export default serverEvent