const unsetFormulaEntering = () => dispatch => {
  dispatch({
    type: 'UNSET_FORMULA_ENTERING_CELL',
  });
}

export default unsetFormulaEntering;