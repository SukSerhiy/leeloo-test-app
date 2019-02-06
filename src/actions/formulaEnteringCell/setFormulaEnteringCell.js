const setFormulaEntering = payload => dispatch => {
  dispatch({
    type: 'SET_FORMULA_ENTERING_CELL',
    payload
  });
}

export default setFormulaEntering;