# Intro

The requirement to pull data from REST API end point implies development of the full stack application. I practice with the following React boiler plate:
[React Redux Universal Hot Example](https://github.com/bertho-zero/react-redux-universal-hot-example). It gives me everything I need to develop application.

## MVVM - Model View ViewModel Design Pattern

* Model - [REST API](api/services/todos/index.js)
* View Model - [Redux Store](src/redux/modules/todos.js)
* View - [Application's View](src/containers/Todos/Todos.js)

## Action handlers

All the manipulations of Redux data store are performed with messages, they are generates inside action functions:

``` JavaScript
export function clickEvenButton() {
  return {
    type: CLICKEVENBUTTON
  };
}
```

Application view calls this action functions to change application state. Action functions hide async REST API calls and control error state of the data store as well. 

``` JavaScript
export function deleteLastFilterKeyword() {
  return {
    types: [DELETELASTFILTERKEYWORD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (helpers, _dispatch, getState) => {
      const { client } = helpers;
      const { todos } = getState();
      const { filterKeywords, propertyName, isAsc } = todos;
      return client.post('/load-todos', { filterKeywords, propertyName, isAsc });
    }
  };
}
```

## Pure functions

View object depends only on properties it gets from class Annotation `@connect`.

```JavaScript

@connect(
  state => ({
    items: state.todos.items,
    propertyName: state.todos.propertyName,
    isAsc: state.todos.isAsc,
    filterKeywords: state.todos.filterKeywords,
    filterKeyword: state.todos.filterKeyword,
    keywords: state.todos.keywords,
    error: state.todos.error
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
      deleteLastFilterKeyword,
      dismissError
    },
    dispatch
  )
)

```

# Application requirements and implementation considerations
My objective is to distribute roles between API End Point, Redux Data Store, Redux Action Handlers and actual View. 

## It is required to load 200 data objects.
End user needs to see 200 objects, most likely it is more than enough for the purpose of this application. So pagination or dynamic loading on scroll are not that important. 200 rows are not that many records especially for large monitors rotated 90 degree.

## Table sorting
Application requires sorting by multiple columns, so REST API should support indexed search by those columns. On the UI I created 2 explicit toggle buttons to sort in both directions: `asc` or `desc`. If user clicks on active sorting toggle one more time, then application disables sorting and returns data without sorting.

## Title search
Application requires search by string title. This is the most interesting problem, since trivial search by substring implies full data set scan in order to select records matching search string. Search by `like` or substring is considered as precise search, it guarantees that it will find substring regardless of its position in the `title`. On the other hand if we implement full text search, based on lexical analysis, we may have false negatives in our search results, in other words we can miss some records matching our search conditions. This is unacceptable for accounting application, so in order to avoid this I consider regular keyword search is a good alternative. I created another end point `/load-keywords` which lets application to search keywords in `titles` starting with `filterKeyword`. So basically I transform substring search into keyword search, it is precise search it has no false negatives. It does not change much user experience, user has to type in first characters of the searched keyword and application will accept it only if it exists in the database.

## Record IDs highlighting
Application needs to highlight records based on some conditions. Since those conditions don't effect records filtering I apply them on the client side. I put them into application state since highlighting plays logical role, they are part of the application's behavior and they have nothing to do with application styling.

## Resume
I put search and sorting functionality to the end point since it affects filtering conditions at the source of data. Users may see different sets of records depending on their permissions and roles. Server is better suited for search across huge records dataset, it can implement keywords to records relations and use union search to find matching records in database and efficiently cut top 200 records.

# Testing
1. REST API tests
2. Redux store action handlers tests.
3. UI automation tests using [puppeteer](https://developers.google.com/web/tools/puppeteer)
