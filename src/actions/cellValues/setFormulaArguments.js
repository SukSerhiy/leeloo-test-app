const setFormulaArguments = payload => dispatch => {
  dispatch({
    type: 'SET_FORMULA_ARGUMENTS',
    payload
  });
}

export default setFormulaArguments;