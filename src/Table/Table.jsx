import React from 'react';
import Cell from './Cell';
import TableRows from './TableRows';
import PropTypes from 'prop-types';
import './Table.css';

const Table = props => {
  const { horizontalCellCount, verticalCellCount } = props;
  return (
    <table className='table'>
      <TableRows {...props} />
    </table>
  );
}

Table.propTypes = {
  horizontalCellCount: PropTypes.number,
  verticalCellCount: PropTypes.number
};

export default Table;
