export default {
  setUserData(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.userName = payload.userName;
    state.userRole = payload.userRole;
  },
  setUserDataToModify(state, payload) {
    state.userName = payload.userName;
    state.userMail = payload.userMail;
    state.userRole = payload.userRole;
  },
};
