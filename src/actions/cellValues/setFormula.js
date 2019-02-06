const setFormula = payload => dispatch => {
  dispatch({
    type: 'SET_FORMULA',
    payload
  });
}

export default setFormula;