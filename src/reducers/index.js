import { combineReducers } from "redux";

import auth from "./authReducer";
import uploadFile from "./uploadFile";


export default combineReducers({
  auth,
  uploadFile
});