import axios from "axios"
import { API_HOST_PREFIX } from "./serviceHelpers";
import { onGlobalError, onGlobalSuccess } from "./serviceHelpers";

const teamGameDayService = {
    endpoint: `${API_HOST_PREFIX}/api/gamedaypositions`

}

teamGameDayService.getById = (conferenceId, teamId) => {
    const config = {
      method: "GET",
      url: `${teamGameDayService.endpoint}/${conferenceId}/${teamId}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
  };
  
  export default teamGameDayService;