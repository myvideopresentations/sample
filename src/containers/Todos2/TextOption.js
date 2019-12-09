import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  FormGroup, FormControl
} from 'react-bootstrap';

class TextOption extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    propertyName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    isNullable: PropTypes.bool,
    debounce: PropTypes.number
  };

  static defaultProps = {
    value: '',
    isNullable: false,
    onValidate: () => null,
    debounce: 300
  };

  constructor(props, context) {
    super(props, context);

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onTimer = this.onTimer.bind(this);

    const { value } = props;
    this.state = {
      value
    };
  }

  componentWillReceiveProps({ value: newValue }) {
    const { value } = this.state;
    if (value !== newValue) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.setState({
        value: newValue,
        message: ''
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    const nextOptions = this.getUsedOptions(nextProps);
    const currentOptions = this.getUsedOptions(this.props);
    const { value } = this.state;
    const { newValue } = nextState;
    return !(_.isEqual(currentOptions, nextOptions) && value === newValue);
  }

  onTimer() {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(this.getValue(value));
  }

  onHandleChange(e) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    const { value } = e.target;
    const { debounce } = this.props;
    this.setState({
      value
    });
    this.timeout = setTimeout(this.onTimer, debounce);
  }

  getUsedOptions(props) { // eslint-disable-line class-methods-use-this
    const {
      propertyName, placeholder, isNullable
    } = props;
    return {
      propertyName,
      placeholder,
      isNullable
    };
  }

  getValue(value) {
    const { isNullable } = this.props;
    if (value === '' || value === null) {
        if (isNullable) {
            return null;
        }
        return '';
    }
    return value;
  }

  render() {
    const { propertyName, placeholder } = this.props;
    const { value } = this.state;
    return (
      <FormGroup key={propertyName}>
        <FormControl type="text" value={value || ''} placeholder={placeholder} onChange={this.onHandleChange} />
      </FormGroup>
    );
  }
}

export default TextOption;
