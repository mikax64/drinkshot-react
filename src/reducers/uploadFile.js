
const initialState = {
  fileSelected: null
};

export default (state = initialState, action) => 
{

  switch (action.type) {
    case "FILE":
      return { fileSelected: action.payload }

    default:
      return state;
  }

}








