import React, { Component } from 'react';
import { Input, Select } from 'element-react';
import { connect } from 'react-redux';
import { dataTypes } from '../enums';
import { setCellValue } from '../actions/cellValues';
import './style.css';

const getSelectOptions = (_enum) => (
  _enum.map((item, idx) => (
    <Select.Option 
      key={idx} 
      label={item.value}
      value={item.key}
    />
  )
))

class CellState extends Component {
  state = {
    dataTypesEnum: dataTypes,
    value: null,
    cellDataType: null
  }

  componentDidUpdate(prevProps, prevState) {
    
  }

  onSelectChange = value => {
    const focusedCell = { ...this.props.focusedCell, dataType: value };
    const { setCellValue } = this.props;
    setCellValue(focusedCell);
    this.setState({ cellDataType: value });
  }

  render() {
    const focusedCell = this.props.focusedCell;
    const { xCoord, yCoord, dataType, value } = focusedCell || {};
    const coordsStr = focusedCell ? `[${xCoord}, ${yCoord}]` : null;
    const { cellDataType, dataTypesEnum } = this.state;
    return <div className='cell-state'>
      <div className='cell-coords'>
        <span>{coordsStr}</span>
      </div>
      <div className='cell-value'>
        <Input value={value} />
      </div>
      <div className='cell-data-type'></div>
      <Select 
        placeholder='Data type' 
        value={cellDataType}
        onChange={this.onSelectChange}
      >
        {getSelectOptions(dataTypesEnum)}
      </Select>
    </div>
  }
}

const mapStateToProps = state => {
  const { focusedCell } = state.toJS();
  return { focusedCell };
};

const mapDispatchToProps = dispatch => ({
  setCellValue: payload => dispatch(setCellValue(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(CellState);