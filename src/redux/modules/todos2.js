const LOAD = 'todos2-example/todos2/LOAD';
const LOAD_SUCCESS = 'todos2-example/todos2/LOAD_SUCCESS';
const LOAD_FAIL = 'todos2-example/todos2/LOAD_FAIL';
const CLICKEVENBUTTON = 'todos2-example/todos2/CLICKEVENBUTTON';
const CLICKODDBUTTON = 'todos2-example/todos2/CLICKODDBUTTON';
const SETSORTORDER = 'todos2-example/todos2/SETSORTORDER';
const SETFILTERKEYWORD = 'todos2-example/todos2/SETFILTERKEYWORD';
const DISMISSERROR = 'todos2-example/todos2/DISMISSERROR';

const initialState = {
  loaded: false,
  origItems: [],
  items: [],
  propertyName: null,
  isAsc: null,
  filterKeyword: '',
  error: null,
  isEvenToggled: false,
  isOddToggled: false
};

export default function todos2(state = initialState, action = {}) {
  switch (action.type) {
    case CLICKEVENBUTTON: {
      let { isEvenToggled, items } = state;
      isEvenToggled = !isEvenToggled;
      const newItems = items.map(item => makeEvenColored(item, isEvenToggled ? 'green' : 'black'));
      return {
        ...state,
        items: newItems,
        isEvenToggled
      };
    }
    case CLICKODDBUTTON: {
      let { isOddToggled, items } = state;
      isOddToggled = !isOddToggled;
      const newItems = items.map(item => makeOddColored(item, isOddToggled ? 'orange' : 'black'));
      return {
        ...state,
        items: newItems,
        isOddToggled
      };
    }
    case SETSORTORDER: {
      const { items } = state;
      let { propertyName, isAsc } = action;
      const newItems = getSortedItems(items, propertyName, isAsc);
      return {
        ...state,
        items: newItems,
        propertyName,
        isAsc
      };
    }
    case SETFILTERKEYWORD: {
      const { filterKeyword } = action;
      const { origItems, propertyName, isAsc, isEvenToggled, isOddToggled } = state;
      let items = origItems.filter(item => item.title.indexOf(filterKeyword) > -1);
      items = getSortedItems(items, propertyName, isAsc)        
        .map(item => makeOddColored(item, isOddToggled ? 'orange' : 'black'))
        .map(item => makeEvenColored(item, isEvenToggled ? 'green' : 'black'));
      return {
        ...state,
        filterKeyword,
        items
      };
    }
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      const origItems = action.result;
      return {
        ...state,
        loading: false,
        loaded: true,
        origItems,
        items: origItems,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case DISMISSERROR: {
      return {
        ...state,
        error: null
      };
    }
    default:
      return state;
  }
}

function getSortedItems(items, propertyName, isAsc) {
  let result = items;
  if (propertyName != null) {
    result = items.slice();
    result.sort((a, b) => {
      if (a[propertyName] < b[propertyName]) {
        return isAsc ? 1 : -1;
      }
      if (a[propertyName] > b[propertyName]) {
        return isAsc ? -1 : 1;
      }
      return 0;
    });
  }
  return result;
}

function makeEvenColored(item, color) {
  if (item.id % 2 == 0) {
    return {
      ...item,
      color
    };
  }
  return item;
}

function makeOddColored(item, color) {
  if (item.id % 2 > 0) {
    return {
      ...item,
      color
    };
  }
  return item;
}

export function isLoaded(globalState) {
  return globalState.todos2 && globalState.todos2.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ client }) => client.get('http://jsonplaceholder.typicode.com/todos')
  };
}

export function clickEvenButton() {
  return {
    type: CLICKEVENBUTTON
  };
}

export function clickOddButton() {
  return {
    type: CLICKODDBUTTON
  };
}

export function setSortOrder(propertyName, isAsc) {
  return {
    type: SETSORTORDER,
    propertyName,
    isAsc
  };
}

export function setFilterKeyword(filterKeyword) {
  return {
    type: SETFILTERKEYWORD,
    filterKeyword
  };
}

export function dismissError() {
  return {
    type: DISMISSERROR
  };
}
