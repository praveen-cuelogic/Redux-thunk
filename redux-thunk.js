/**

Note: Redux Thunk: Using for asynchronous functionality

Redux Thunk is middleware that allows you to return functions, 
rather than just actions, within Redux. This allows for delayed actions, 
including working with promises. One of the main use cases for this middleware is for handling actions that might not be synchronous, 
for example, using axios to send a GET request.
*/

const { redux, createStore, applyMiddleware } = require("redux");
const thunkMiddleware = require("redux-thunk").default;
const axios = require("axios");

const initialState = {
  loading: false,
  user: [],
  error: "",
};

//action type
const USER_REQUEST = "USER_REQUEST";
const USER_SUCCESS = "USER_SUCCESS";
const USER_ERROR = "USER_ERROR";

//async function
const userRequest = () => {
  return {
    type: USER_REQUEST,
  };
};

const userSuccess = (users) => {
  return {
    type: USER_SUCCESS,
    payload: users,
  };
};

const userError = (error) => {
  return {
    type: USER_ERROR,
    payload: error,
  };
};

//reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "USER_SUCCESS":
      return {
        loading: false,
        users: action.payload,
        error: "",
      };

    case "USER_ERROR":
      return {
        loading: false,
        users: [],
        error: action.payload,
      };
  }
};

const fetchUser = () => {
  return function (dispatch) {
    dispatch(userRequest);
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        //response.data
        const users = response.data.map((user) => user.name);
        dispatch(userSuccess(users)); //this will update after sccess
      })
      .catch((error) => {
        //error.message
        dispatch(userError(error.message));
      });
  };
};

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

store.subscribe(() => {
  console.log("Subscribe", store.getState());
});

store.dispatch(fetchUser());

//Don't use
//unsubscribe();
