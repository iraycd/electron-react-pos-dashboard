import { hashHistory } from 'react-router';

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';

const init = {
  email: '',
  loginErr: '',
};

export default function reducer(state = init, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        email: 'email'
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loginErr: action.err.message
      };
    default:
      return state;
  }
}

export function verifyCreds(email, password) {
  return (dispatch, _, { auth }) => {
    auth().signInWithEmailAndPassword(email, password)
    .then(authData => {
      hashHistory.push('/dashboard');
      dispatch({ type: LOGIN_SUCCESS, authData });
    })
    .catch(err => dispatch({ type: LOGIN_ERROR, err }));
  };
}
