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
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
  }, function (error) {
  });

export default interceptor