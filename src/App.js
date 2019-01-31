import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from './Table';
import logo from './logo.svg';
import './App.css';

const App = props => (
    <div className="App">
      <Table 
        horizontalCellCount={10}
        verticalCellCount={10}
      />
    </div>
)

export default connect()(App);
