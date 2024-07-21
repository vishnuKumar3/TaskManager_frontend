import axios from "axios"
const interceptor = axios.create()

function getCookie(keyName) {
    let name = keyName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

interceptor.interceptors.request.use(function (config) {
    const accessToken = getCookie("accessToken")
    console.log("access-token",accessToken)
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    config.headers["Access-Control-Allow-Origin"] = "*";;
    config.headers["access-control-allow-credentials"] = true;
    return config;
  }, function (error) {
    console.log("Error occurred - ",error)
  });

export default interceptor