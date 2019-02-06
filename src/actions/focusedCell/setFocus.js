const setFocus = payload => dispatch => {
  dispatch({
    type: 'SET_FOCUS',
    payload: payload
  });
}

export default setFocus;