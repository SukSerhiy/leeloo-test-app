import React, { Component } from 'react';
import { Input, Select } from 'element-react';
import { connect } from 'react-redux';
import { dataTypes } from '../enums';
import { setCellValue } from '../actions/cellValues';
import { getCellByCoords } from '../utils/tableUtils';
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
    inputValue: null,
    cellDataType: null
  }

  componentDidUpdate() {
    const { focusedCell, cellValues } = this.props;
    const { inputValue, cellDataType } = this.state;
    if (focusedCell) {
      const { xCoord, yCoord } = focusedCell;
      const cell = getCellByCoords(cellValues, xCoord, yCoord);
      if (cell) {
        const { dataType } = cell;
        let newState = {};
        if (cell.formula) {
          const { formula: { type, arguments: args } } = cell;
          const coordsStr = args.map(arg => `${arg.xCoord}${arg.yCoord}`).join(', ');
          const formulaStr = `${type}(${coordsStr})`;
          if (this.state.inputValue !== formulaStr) {
            newState = { 
              ...newState, 
              inputValue: formulaStr 
            }
          }
        } else {
          const { value } = cell;
          if (value !== inputValue) {
            newState = { 
              ...newState, 
              inputValue: value 
            }
          }
        }

        if (dataType !== cellDataType) {
          newState = { 
            ...newState, 
            cellDataType: dataType 
          }
        }

        if (Object.keys(newState).length > 0) {
          this.setState(newState);
        }
      } else {
        if (this.state.inputValue || this.state.cellDataType)
        this.setState({ 
          inputValue: null, 
          cellDataType: null 
        });
      }
    }
  }

  onSelectChange = value => {
    const { inputValue } = this.state;
    const { focusedCell: { xCoord, yCoord }, setCellValue } = this.props;
    setCellValue({ xCoord, yCoord, dataType: value, value: inputValue })
    this.setState({ cellDataType: value });
  }

  onInputChange = value => {
    this.setState({ inputValue: value });
  }

  render() {
    const { focusedCell } = this.props;
    const { xCoord, yCoord } = focusedCell || {};
    const coordsStr = focusedCell ? `[${xCoord}, ${yCoord}]` : null;
    const { cellDataType, inputValue, dataTypesEnum } = this.state;
    return <div className='cell-state'>
      <div className='cell-coords'>
        <span>{coordsStr}</span>
      </div>
      <div className='cell-value'>
        <Input 
          value={inputValue}
          disabled={!focusedCell}
          onChange={this.onInputChange}
        />
      </div>
      <div className='cell-data-type'></div>
      <Select 
        placeholder='Data type' 
        disabled={!focusedCell}
        value={cellDataType}
        onChange={this.onSelectChange}
      >
        {getSelectOptions(dataTypesEnum)}
      </Select>
    </div>
  }
}

const mapStateToProps = state => {
  const { focusedCell, cellValues } = state.toJS();
  return { focusedCell, cellValues };
};

const mapDispatchToProps = dispatch => ({
  setCellValue: payload => dispatch(setCellValue(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CellState);