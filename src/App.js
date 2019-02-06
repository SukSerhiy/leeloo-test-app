import React from 'react';
import { connect } from 'react-redux';
import Table from './Table';
import CellState from './CellState';
import SAlert from './SAlert';
import './App.css';
import 'element-theme-default';

const App = props => (
    <div className="App">
      <CellState />
      <Table 
        horizontalCellCount={10}
        verticalCellCount={10}
      />
      <SAlert />
    </div>
)

export default connect()(App);
