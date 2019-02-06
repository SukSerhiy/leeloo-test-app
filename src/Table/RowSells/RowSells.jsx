import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Cell from '../Cell';

const getXCoord = code => {
  return String.fromCharCode(65 + code);
}

const RowCells = props => {
  const { count, coord } = props;
  const cells = new Array(count).fill(null, 0, count - 1);
  return (
    <Fragment>
      {cells.map((c, key) => (<Cell 
        key={key} 
        yCoord={coord} 
        xCoord={getXCoord(key)} 
      />))}
    </Fragment>
  )
}

RowCells.propTypes = {
  count: PropTypes.number.isRequired
};

export default RowCells;