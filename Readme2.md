# Intro

The requirement to pull data from REST API end point implies development of the full stack application. I practice with the following React boiler plate:
[React Redux Universal Hot Example](https://github.com/bertho-zero/react-redux-universal-hot-example). It gives me everything I need to develop application.

## MVVM - Model View ViewModel Design Pattern

* Model - [REST API](https://jsonplaceholder.typicode.com/)
* View Model - [Redux Store](src/redux/modules/todos2.js)
* View - [Application's View](src/containers/Todos2/Todos2.js)

## Action handlers

All the manipulations of Redux data store are performed with messages, they are generated inside action functions:

``` JavaScript
export function clickEvenButton() {
  return {
    type: CLICKEVENBUTTON
  };
}
```

Application view calls action functions to change application state. Action functions hide async REST API calls and control error state of the data store as well. 

``` JavaScript
export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ client }) => client.get('http://jsonplaceholder.typicode.com/todos')
  };
}
```

## Pure functions

View object depends only on properties it gets from class Annotation `@connect`.

```JavaScript

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

```

# Application requirements and implementation considerations
My first objective is to distribute roles between API End Point, Redux Data Store, Redux Action Handlers and actual View. The next step is to optimize sequence of data transformations:
* Setting filter:  original collection => filtered => sorted => colored
* Changing sort order: visible collection => sorted
* Coloring Ids: visible collection => colored

## It is required to load 200 data objects.
End user needs to see 200 objects, most likely it is dashboard data, so pagination and scroll are not required. 200 rows are not that many records especially for large monitors rotated 90 degree.

## Table sorting
Application requires sorting of visible data set only. So it is done for visible items only.

## Title search
Search operation may add more visible nodes, so sorting and coloring should be applied after filtering operation. This is potential space for performance improvement, but if we speak about 200 records we are going to win 5 milliseconds maximum.

## Record IDs highlighting
Application needs to highlight records based on some conditions. Since they don't effect records filtering I apply them directly on the visible collection of items.

# Testing
1. Redux store action handlers tests.
2. UI automation tests using [puppeteer](https://developers.google.com/web/tools/puppeteer)

# Running
See original [readme file](ORIGREADME.md)
