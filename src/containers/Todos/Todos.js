import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import Select from 'react-select';

import {
  Button, Table, Glyphicon, Navbar, FormGroup, Form
} from 'react-bootstrap';
import {
  isLoaded,
  load,
  clickEvenButton,
  clickOddButton,
  setSortOrder,
  setFilterKeyword,
  addFilterKeyword,
  deleteFilterKeyword,
  deleteLastFilterKeyword
} from 'redux/modules/todos';

/* eslint-disable max-len */
@provideHooks({
  fetch: ({ store: { dispatch, getState } }) => !isLoaded(getState()) ? dispatch(load()).catch(() => null) : Promise.resolve()
})
@connect(
  state => ({
    items: state.todos.items,
    propertyName: state.todos.propertyName,
    isAsc: state.todos.isAsc,
    filterKeywords: state.todos.filterKeywords,
    filterKeyword: state.todos.filterKeyword,
    keywords: state.todos.keywords,
  }),
  dispatch => bindActionCreators(
    {
      load,
      clickEvenButton,
      clickOddButton,
      setSortOrder,
      setFilterKeyword,
      addFilterKeyword,
      deleteFilterKeyword,
      deleteLastFilterKeyword
    },
    dispatch
  )
)
class Todos extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    clickEvenButton: PropTypes.func.isRequired,
    clickOddButton: PropTypes.func.isRequired,
    setSortOrder: PropTypes.func.isRequired,
    setFilterKeyword: PropTypes.func.isRequired,
    deleteFilterKeyword: PropTypes.func.isRequired,
    deleteLastFilterKeyword: PropTypes.func.isRequired,
    addFilterKeyword: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.number,
        id: PropTypes.number,
        title: PropTypes.string,
        completed: PropTypes.bool,
        color: PropTypes.string
      })).isRequired,
    filterKeywords: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        value: PropTypes.string
      })).isRequired,
    filterKeyword: PropTypes.string,
    keywords: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        value: PropTypes.string
      })).isRequired,
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
      filterKeywords,
      filterKeyword,
      keywords,
      load,
      clickEvenButton,
      clickOddButton,
      setSortOrder,
      setFilterKeyword,
      deleteFilterKeyword,
      deleteLastFilterKeyword,
      addFilterKeyword
    } = this.props;

    return (
      <div className="container">
        <h1>Todos</h1>
        <Helmet title="Todos" />
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>Title keywords</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Navbar.Form>
              <Form inline onSubmit={e => { e.preventDefault(); }}>
                {filterKeywords.map(({ id, value }) => (
                  <React.Fragment key={id}>
                    <Button key={id} bsSize="small" onClick={() => deleteFilterKeyword(id)}>
                      <Glyphicon glyph="remove" />&nbsp;{value}
                    </Button>
                    &nbsp;
                  </React.Fragment>
                ))}
                <FormGroup>
                  <Select
                    className={styles.cursor_search}
                    inputValue={filterKeyword}
                    value={null}
                    onInputChange={value => setFilterKeyword(value)}
                    getOptionValue={({ id }) => id}
                    getOptionLabel={({ value }) => value}
                    onChange={({ id, value }) => addFilterKeyword(id, value)}
                    options={keywords}
                    placeholder="Type to select ..."
                    onKeyDown={event => {
                      switch (event.keyCode) {
                        case 8: /* Backspace */
                          if (filterKeyword == "" && filterKeywords.length > 0) {
                            deleteLastFilterKeyword();
                          }
                          break;
                        default:
                          break;
                      }
                    }}
                  />
                </FormGroup>{' '}
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
              <th key="userId" className={styles.table_header}>User Id
                &nbsp;
                <Glyphicon key="up" glyph="chevron-up" className={this.isActiveSortIcon("userId", true) ? styles.glyph_active : styles.glyph_inactive} onClick={() => setSortOrder("userId", true)} />
                &nbsp;
                <Glyphicon key="down" glyph="chevron-down" className={this.isActiveSortIcon("userId", false) ? styles.glyph_active : styles.glyph_inactive} onClick={() => setSortOrder("userId", false)} />
              </th>
              <th key="Id" className={styles.table_header}>Id
                &nbsp;
                <Glyphicon key="up" glyph="chevron-up" className={this.isActiveSortIcon("id", true) ? styles.glyph_active : styles.glyph_inactive} onClick={() => setSortOrder("id", true)} />
                &nbsp;
                <Glyphicon key="down" glyph="chevron-down" className={this.isActiveSortIcon("id", false) ? styles.glyph_active : styles.glyph_inactive} onClick={() => setSortOrder("id", false)} />
              </th>
              <th key="title" className={styles.table_header}>Title
                &nbsp;
                <Glyphicon key="up" glyph="chevron-up" className={this.isActiveSortIcon("title", true) ? styles.glyph_active : styles.glyph_inactive} onClick={() => setSortOrder("title", true)} />
                &nbsp;
                <Glyphicon key="down" glyph="chevron-down" className={this.isActiveSortIcon("title", false) ? styles.glyph_active : styles.glyph_inactive} onClick={() => setSortOrder("title", false)} />
              </th>
              <th key="completed" className={styles.table_header}>Completed
                &nbsp;
                <Glyphicon key="up" glyph="chevron-up" className={this.isActiveSortIcon("completed", true) ? styles.glyph_active : styles.glyph_inactive} onClick={() => setSortOrder("completed", true)} />
                &nbsp;
                <Glyphicon key="down" glyph="chevron-down" className={this.isActiveSortIcon("completed", false) ? styles.glyph_active : styles.glyph_inactive} onClick={() => setSortOrder("completed", false)} />
              </th>
              <th key="actions"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ userId, id, title, completed, color }) => (
              <tr key={id}>
                <td>{userId}</td>
                <td style={{ color }}>{id}</td>
                <td>{title}</td>
                <td>{completed.toString()}</td>
                <td className={styles.table_header}>
                  <Button bsSize="small" bsStyle="primary" onClick={clickOddButton}>Toggle Odd</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}


export default Todos;
