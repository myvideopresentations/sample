import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import TextOption from './TextOption';

import {
  Button, Table, Glyphicon, Navbar, FormGroup, Form, Alert, FormControl
} from 'react-bootstrap';
import {
  isLoaded,
  load,
  clickEvenButton,
  clickOddButton,
  setSortOrder,
  setFilterKeyword,
  dismissError
} from 'redux/modules/todos2';

/* eslint-disable max-len */
@provideHooks({
  fetch: ({ store: { dispatch, getState } }) => !isLoaded(getState()) ? dispatch(load()).catch(() => null) : Promise.resolve()
})
@connect(
  state => ({
    items: state.todos2.items,
    propertyName: state.todos2.propertyName,
    isAsc: state.todos2.isAsc,
    filterKeyword: state.todos2.filterKeyword,
    error: state.todos2.error
  }),
  dispatch => bindActionCreators(
    {
      load,
      clickEvenButton,
      clickOddButton,
      setSortOrder,
      setFilterKeyword,
      dismissError
    },
    dispatch
  )
)
class Todos2 extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    clickEvenButton: PropTypes.func.isRequired,
    clickOddButton: PropTypes.func.isRequired,
    setSortOrder: PropTypes.func.isRequired,
    setFilterKeyword: PropTypes.func.isRequired,
    dismissError: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.number,
        id: PropTypes.number,
        title: PropTypes.string,
        completed: PropTypes.bool,
        color: PropTypes.string
      })
    ).isRequired,
    filterKeyword: PropTypes.string,
    propertyName: PropTypes.string,
    isAsc: PropTypes.bool
  };

  isActiveSortIcon(propertyName, isAsc) {
    const { propertyName: activePropertyName, isAsc: activeIsAsc } = this.props;

    return activePropertyName === propertyName && isAsc === activeIsAsc;
  }

  render() {
    const styles = require('./Todos.scss');
    const {
      items,
      filterKeyword,
      error,
      load,
      clickEvenButton,
      clickOddButton,
      setSortOrder,
      setFilterKeyword,
      dismissError
    } = this.props;

    return (
      <div className="container">
        <h1>Todos 2</h1>
        <Helmet title="Todos2" />
        {error != null ? (
          <Alert bsStyle="danger">
            <h4>Oh snap! We cannot get data from server!</h4>
            <p>This error indicates that your request failed to get data from server.</p>
            <p>
              <Button onClick={dismissError}>Hide Alert</Button>
            </p>
          </Alert>
        ) : null}
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Navbar.Form>
              <Form
                inline
                onSubmit={e => {
                  e.preventDefault();
                }}
              >
                <TextOption
                  className={styles.cursor_search}
                  value={filterKeyword}
                  placeholder="Title"
                  propertyName="title"
                  onChange={value => setFilterKeyword(value)}
                />
                {' '}
                <FormGroup>
                  <Button onClick={clickEvenButton}>Toggle Even</Button>
                </FormGroup>
              </Form>
            </Navbar.Form>
          </Navbar.Collapse>
        </Navbar>
        <Table striped>
          <thead>
            <tr>
              <th key="userId" className={styles.table_header}>
                User Id &nbsp;
                <Glyphicon
                  key="up"
                  glyph="chevron-up"
                  className={this.isActiveSortIcon('userId', true) ? styles.glyph_active : styles.glyph_inactive}
                  onClick={() => setSortOrder('userId', true)}
                />
                &nbsp;
                <Glyphicon
                  key="down"
                  glyph="chevron-down"
                  className={this.isActiveSortIcon('userId', false) ? styles.glyph_active : styles.glyph_inactive}
                  onClick={() => setSortOrder('userId', false)}
                />
              </th>
              <th key="Id" className={styles.table_header}>
                Id &nbsp;
                <Glyphicon
                  key="up"
                  glyph="chevron-up"
                  className={this.isActiveSortIcon('id', true) ? styles.glyph_active : styles.glyph_inactive}
                  onClick={() => setSortOrder('id', true)}
                />
                &nbsp;
                <Glyphicon
                  key="down"
                  glyph="chevron-down"
                  className={this.isActiveSortIcon('id', false) ? styles.glyph_active : styles.glyph_inactive}
                  onClick={() => setSortOrder('id', false)}
                />
              </th>
              <th key="title" className={styles.table_header}>
                Title &nbsp;
                <Glyphicon
                  key="up"
                  glyph="chevron-up"
                  className={this.isActiveSortIcon('title', true) ? styles.glyph_active : styles.glyph_inactive}
                  onClick={() => setSortOrder('title', true)}
                />
                &nbsp;
                <Glyphicon
                  key="down"
                  glyph="chevron-down"
                  className={this.isActiveSortIcon('title', false) ? styles.glyph_active : styles.glyph_inactive}
                  onClick={() => setSortOrder('title', false)}
                />
              </th>
              <th key="completed" className={styles.table_header}>
                Completed &nbsp;
                <Glyphicon
                  key="up"
                  glyph="chevron-up"
                  className={this.isActiveSortIcon('completed', true) ? styles.glyph_active : styles.glyph_inactive}
                  onClick={() => setSortOrder('completed', true)}
                />
                &nbsp;
                <Glyphicon
                  key="down"
                  glyph="chevron-down"
                  className={this.isActiveSortIcon('completed', false) ? styles.glyph_active : styles.glyph_inactive}
                  onClick={() => setSortOrder('completed', false)}
                />
              </th>
              <th key="actions" />
            </tr>
          </thead>
          <tbody>
            {items.map(({
              userId, id, title, completed, color
            }) => (
              <tr key={id}>
                <td>{userId}</td>
                <td style={{ color }}>{id}</td>
                <td>{title}</td>
                <td>{completed.toString()}</td>
                <td className={styles.table_header}>
                  <Button bsSize="small" bsStyle="primary" onClick={clickOddButton}>
                    Toggle Odd
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Todos2;
