import axios from "axios";

import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const teamInviteEmailEndPoint = `${API_HOST_PREFIX}/api/emails/teamInviteEmail`;

const teamInviteEmail = (payload) => {
  const config = {
    method: "POST",
    url: teamInviteEmailEndPoint,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const teamInviteEmailService = { teamInviteEmail };

export default teamInviteEmailService;
