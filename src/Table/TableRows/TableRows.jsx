import React from 'react';
import PropTypes from 'prop-types';
import RowSells from '../RowSells';

const TableRows = props => {
  const { verticalCellCount, horizontalCellCount } = props;
  const rows = new Array(verticalCellCount).fill(null, 0, verticalCellCount - 1);
  return (
    <tbody>
      {rows.map((r, key) => <tr key={key}>
        <RowSells 
          count={horizontalCellCount} 
          coord={key}
        />
      </tr>)}
    </tbody>
  )
}

TableRows.propTypes = {
  verticalCellCount: PropTypes.number.isRequired,
  horizontalCellCount: PropTypes.number.isRequired
};

export default TableRows;