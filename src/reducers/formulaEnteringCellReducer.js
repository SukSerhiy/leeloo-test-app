import { Map } from 'immutable';

export default (state = null, action) => {
  switch (action.type) {
    case 'SET_FORMULA_ENTERING_CELL':
      const { xCoord, yCoord } = action.payload; 
      return Map({ xCoord, yCoord });
    case 'UNSET_FORMULA_ENTERING_CELL': 
      return null;
    default:
      return state;
  }
}