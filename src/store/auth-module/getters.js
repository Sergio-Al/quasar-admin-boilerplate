export default {
  getUserName: (state) => state.userName,
  getUserRole: (state) => state.userRole,
  getUserMail: (state) => state.userMail,
  isAuthenticated: (state) => !!state.token,
  getUserData: (state) => ({
    name: state.userName,
    mail: state.userMail,
    role: state.userRole,
  }),
};
