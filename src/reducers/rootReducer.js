import { combineReducers } from 'redux-immutable';
import simpleReducer from './simpleReducer';
import focusedCellReducer from './focusedCellReducer';
import cellValuesReducer from './cellValuesReducer';
import formulaEnteringCellReducer from './formulaEnteringCellReducer';

export default combineReducers({
  simpleReducer,
  focusedCell: focusedCellReducer,
  cellValues: cellValuesReducer,
  formulaEnteringCell: formulaEnteringCellReducer
});