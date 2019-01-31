import React, { Component } from 'react';

class Cell extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  state = {
    value: null,
    focused: false
  };

  handleCellFocus = () => {
    this.setState({ focused: true }, () => {
      this.inputRef.current.focus();
    });
  }

  handleCellBlur = () => {
    //this.setState({ focused: false });
  }

  handleInputChange = (event) => {
    this.setState({value: event.target.value});
  }

  render() {
    const { value, focused } = this.state;
    const { yCoord, xCoord } = this.props;
    return (
      <td
        className={focused ? 'focused' : ''}
        onClick={this.handleCellFocus}
      >
        {focused ? 
          <input 
            ref={this.inputRef}
            type="text" 
            autofocus
            value={value} 
            onBlur={this.handleCellBlur} 
            onChange={this.handleInputChange} 
          /> : 
          <span>{value}</span>
        }
      </td>
    )
  }
}

export default Cell;