import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFocus, removeFocus } from '../../actions/focusedCell';
import { 
  setCellValue,
  setFormula,
  setFormulaArguments
} from '../../actions/cellValues';
import {
  setFormulaEnteringCell,
  unsetFormulaEnteringCell
} from '../../actions/formulaEnteringCell';
import { formulaTypes } from '../../enums';
import { ErrorAlert } from '../../Alerts';
import { getCellByCoords } from '../../utils/tableUtils';
import * as operations from '../../operations';

const formulaPattern = /^=(SUM|AVARAGE|CONCAT|HYPERLINK)\(([A-Z]+\d+,\s?)*[A-Z]+\d+\)$/;

/**
 * Determines probable data type for input data
 * @param {string} value 
 */
const determineDataType = value => {
  if (+value) {
    return 'NUMBER';
  } else {
    return 'STRING';
  }
}

/**
 * Return true when all arguments has allowed data types for the operation,
 *  otherwise returns false
 * @param {array} args
 * @param {strign} formulaType
 * @return {boolean}
 */
const checkDataTypes = (args, formulaType) => {
  const dataTypes = args.map(arg => arg.dataType);
  switch(formulaType) {
    case formulaTypes.SUM:
    case formulaTypes.AVERAGE:
      if (dataTypes.every(dt => dt === 'NUMBER') || 
        dataTypes.every(dt => dt === 'MONEY_SUM')
      ) {
        return true;
      }
      break;
    case formulaTypes.CONCAT:
      return true;
    default:
      return false;
  }
}

/**
 * Gets data type of the result of the operation
 * @param {array} args 
 * @param {string} formulaType 
 */
const getOperationResultDataType = (args, formulaType) => {
  const dataTypes = args.map(arg => arg.dataType);
  switch(formulaType) {
    case formulaTypes.SUM:
    case formulaTypes.AVERAGE:
      if (dataTypes.every(dt => dt === 'NUMBER')) {
        return 'NUMBER';
      }
      if (dataTypes.every(dt => dt === 'MONEY_SUM')) {
        return 'MONEY_SUM';
      }
      break;
    case formulaTypes.CONCAT:
      return 'STRING';
    default:
      return null;
  }
}

/**
 * Returns result of executing the operation with the array of arguments
 * @param {string} formulaType 
 * @param {array} args 
 */
const executeFormula = (formulaType, args) => {
  switch(formulaType) {
    case formulaTypes.SUM:
      return operations.sum(...args);
    case formulaTypes.AVERAGE:
      return operations.avarage(...args);
    case formulaTypes.CONCAT:
      return operations.concat(...args);
    case formulaTypes.HYPERLINK:
      return operations.hyperlink(...args);
    default: 
      return null;
  }
}

/**
 * Handle error
 * @param {string} message 
 */
const handleError = (message) => {
  console.error(message);
  ErrorAlert(message);
}

class Cell extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  state = {
    value: null,
    dataType: null,
    formulaArgs: null,
    focused: false
  };

  componentDidUpdate(prevProps) {
    if (this.state.focused) {
      if (prevProps.formulaEnteringCell && this.props.formulaEnteringCell) {
        const { formulaEnteringCell: {
          xCoord,
          yCoord
        }, cellValues } = this.props;
  
        const currentCell = getCellByCoords(cellValues, xCoord, yCoord);
        const prevCurrentCell = getCellByCoords(prevProps.cellValues, xCoord, yCoord);
  
        const { formula, formula: { arguments: formulaArgs } } = currentCell;
        const { formula: { arguments: prevFormulaArgs } } = prevCurrentCell;
  
        const formulaType = formula.type;
  
        if (prevFormulaArgs.length !== formulaArgs.length) {
          const argCoords = formulaArgs.map(arg => `${arg.xCoord}${arg.yCoord}`);
          this.setState({ value: `=${formulaType}(${argCoords.join(', ')})` });
        }
      }
    }
  }

  handleCellFocus = () => {
    if (!this.props.formulaEnteringCell) {
      const { yCoord, xCoord, setFocus } = this.props;
      setFocus({ yCoord, xCoord });
      this.setState({ focused: true }, () => {
        this.inputRef.current.focus();
      });
    } else {
      const { xCoord, yCoord } = this.props.formulaEnteringCell;
      const { 
        xCoord: argXCoord, 
        yCoord: argYCoord, 
        setFormulaArguments
      } = this.props;
      
      const { cellValues } = this.props;
      const currentFormulaCell = getCellByCoords(cellValues, xCoord, yCoord);
      const { formula: { arguments: currentArguments } } = currentFormulaCell;
      if (xCoord !== argXCoord || yCoord !== argYCoord) {
        const newerArgs = currentArguments.concat({
          xCoord: argXCoord,
          yCoord: argYCoord
        });
        setFormulaArguments({
          yCoord, 
          xCoord,
          arguments: newerArgs
        });
      }
    }
  }

  handleCellBlur = () => {
    if (!this.props.formulaEnteringCell) {
      this.setState({ focused: false });
    } else if (this.state.focused) {
      this.inputRef.current.focus();
    }
  }

  handleInputChange = (event) => {
    const { value } = event.target;
    let { dataType } = this.state;
    const { xCoord, 
      yCoord, 
      setCellValue, 
      setFocus,
      setFormulaEnteringCell,
      unsetFormulaEnteringCell,
      setFormula, 
      setFormulaArguments 
    } = this.props;

    if (!dataType) {
      dataType = determineDataType(value);
    }

    setFocus({ yCoord, xCoord });
    setCellValue({ xCoord, yCoord, dataType, value });

    this.setState({ value, dataType });

    if (/^=SUM/.test(value) || 
      /^=AVARAGE/.test(value) || 
      /^=CONCAT/.test(value)
    ) {
      const typeMatch = value.match(/SUM|AVARAGE|CONCAT/);
      const type = typeMatch && typeMatch[0];

      if (!this.props.formulaEnteringCell) {
        setFormulaEnteringCell({ xCoord, yCoord, type });
        setFormula({ 
          xCoord, 
          yCoord, 
          type
        });
      }

      if (formulaPattern.test(value)) {
        const formulaCoordsArray = value.match(/[A-Z]\d/g);
        const formulaArgs = formulaCoordsArray.map(coordStr => {
          const xCoord = coordStr
            .match(/[A-Z]/g)
            .reduce((prev, curr) => prev + curr);

          const yCoord = +coordStr
            .match(/\d/g)
            .reduce((prev, curr) => prev + curr);

          return { xCoord, yCoord };
        });
        setFormulaArguments({
          yCoord, 
          xCoord,
          arguments: formulaArgs
        });
      }
    } else {
      if (this.props.formulaEnteringCell) {
        unsetFormulaEnteringCell();
      }
      setCellValue({ xCoord, yCoord, dataType, value });
    }
  }

  handleKeyPress = (e) => {
    const { 
      formulaEnteringCell, 
      cellValues, 
      xCoord, 
      yCoord, 
      setCellValue, 
      unsetFormulaEnteringCell, 
      removeFocus 
    } = this.props;
    const { value } = this.state;
    if (e.charCode === 13 && formulaEnteringCell) {
      if (formulaPattern.test(value)) {
        const currentCell = getCellByCoords(cellValues, xCoord, yCoord);
        const { formula: { arguments: formulaArgCoord, type } } = currentCell;
        const formulaArgs = formulaArgCoord.map(arg => 
          getCellByCoords(cellValues, arg.xCoord, arg.yCoord)
        ).filter(cell => cell);
        const areDataTypesValid = checkDataTypes(formulaArgs, type);
        if (areDataTypesValid) {
          const argsValues = formulaArgs.map(arg => arg.value);
          const dataType =  getOperationResultDataType(formulaArgs, type);
          const value = executeFormula(type, argsValues);
          setCellValue({ xCoord, yCoord, dataType, value });
          this.setState({ value });
        } else {
          handleError('Incorrect data types of arguments');
        }
      } else {
        handleError('Incorrect syntax for being a formula');
      }
      unsetFormulaEnteringCell();
      removeFocus();
      this.setState({ focused: false });
    }
  }

  render() {
    const { value, focused } = this.state;
    return (
      <td
        className={focused ? 'focused' : ''}
        onClick={this.handleCellFocus}
        onKeyPress={this.handleKeyPress}
      >
        {focused ? 
          <input 
            ref={this.inputRef}
            type='text'
            value={value || ''} 
            onBlur={this.handleCellBlur} 
            onChange={this.handleInputChange} 
          /> : 
          <div style={{height: '100%'}}>{value}</div>
        }
      </td>
    )
  }
}

const mapStateToProps = state => {
  const { focusedCell, cellValues, formulaEnteringCell } = state.toJS();
  return { focusedCell, cellValues, formulaEnteringCell };
};

const mapDispatchToProps = dispatch => ({
  setFocus: payload => dispatch(setFocus(payload)),
  removeFocus: payload => dispatch(removeFocus(removeFocus)),
  setCellValue: payload => dispatch(setCellValue(payload)),
  setFormula: payload => dispatch(setFormula(payload)),
  setFormulaArguments: payload => dispatch(setFormulaArguments(payload)),
  setFormulaEnteringCell: payload => dispatch(setFormulaEnteringCell(payload)),
  unsetFormulaEnteringCell: payload => dispatch(unsetFormulaEnteringCell())
});

export default connect(mapStateToProps, mapDispatchToProps)(Cell);