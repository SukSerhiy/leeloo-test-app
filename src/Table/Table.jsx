import React from 'react';
import TableRows from './TableRows';
import PropTypes from 'prop-types';
import './Table.css';

const Table = props => (
  <table className='table'>
    <TableRows {...props} />
  </table>
);

Table.propTypes = {
  horizontalCellCount: PropTypes.number,
  verticalCellCount: PropTypes.number
};

export default Table;
