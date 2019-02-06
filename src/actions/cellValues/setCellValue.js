const addCell = payload => dispatch => {
  dispatch({
    type: 'SET_CELL_VALUE',
    payload
  });
}

export default addCell;