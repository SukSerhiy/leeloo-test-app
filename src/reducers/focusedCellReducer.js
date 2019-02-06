export default (state = null, action) => {
  switch (action.type) {
    case 'SET_FOCUS':
      return action.payload;
    case 'REMOVE_FOCUS':
      return null;
    default:
      return state;
  }
}