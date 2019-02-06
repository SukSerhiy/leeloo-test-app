import { Map, List } from 'immutable';

/**
 * Gets cell from array of cells by coords
 * @param {Immutable.Map} state 
 * @param {strign} xCoord 
 * @param {number} yCoord 
 * @return {Immutable.Map} 
 */
const getCellByIndex = (state, xCoord, yCoord) => (
  state.findIndex(item => 
    item.get('xCoord') === xCoord && 
    item.get('yCoord') === yCoord
  )
);

export default (state = [], action) => {
  switch (action.type) {
    case 'SET_CELL_VALUE': {
      const { xCoord, yCoord, value, dataType } = action.payload;
      const cellIndex = getCellByIndex(state, xCoord, yCoord);
      if (cellIndex !== -1) {
        return state.update(
          cellIndex, 
          () => (
            state
            .get(cellIndex)
            .set('value', value)
            .set('dataType', dataType)
          )
        )
      } else {
        return state.push(Map(action.payload));
      }
    }
    case 'SET_FORMULA': {
      const { xCoord, yCoord, type } = action.payload;
      const cellIndex = getCellByIndex(state, xCoord, yCoord);
      return state.update(
        cellIndex,
        () => (
          state.get(cellIndex)
            .set('formula', Map({
                type,
                arguments: List([])
              })
            )
        )
      )
    }
    case 'SET_FORMULA_ARGUMENTS': {
      const { xCoord, yCoord, arguments: args } = action.payload;
      const cellIndex = getCellByIndex(state, xCoord, yCoord);
      return state.update(
        cellIndex,
        () => 
        state
          .get(cellIndex)
          .setIn(
            ['formula', 'arguments'], 
            args
          )
      );
    }
    default:
      return state;
  }
}