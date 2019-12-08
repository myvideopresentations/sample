const LOAD = 'todos-example/todos/LOAD';
const LOAD_SUCCESS = 'todos-example/todos/LOAD_SUCCESS';
const LOAD_FAIL = 'todos-example/todos/LOAD_FAIL';
const CLICKEVENBUTTON = 'todos-example/todos/CLICKEVENBUTTON';
const CLICKODDBUTTON = 'todos-example/todos/CLICKODDBUTTON';
const SETSORTORDER = 'todos-example/todos/SETSORTORDER';
const SETFILTERKEYWORD = 'todos-example/todos/SETFILTERKEYWORD';
const SETFILTERKEYWORD_SUCCESS = 'todos-example/todos/SETFILTERKEYWORD_SUCCESS';
const SETFILTERKEYWORD_FAIL = 'todos-example/todos/SETFILTERKEYWORD_FAIL';
const DELETEFILTERKEYWORD = 'todos-example/todos/DELETEFILTERKEYWORD';
const DELETELASTFILTERKEYWORD = 'todos-example/todos/DELETELASTFILTERKEYWORD';
const ADDFILTERKEYWORD = 'todos-example/todos/ADDFILTERKEYWORD';
const DISMISSERROR = 'todos-example/todos/DISMISSERROR';

const initialState = {
  loaded: false,
  items: [],
  propertyName: null,
  isAsc: null,
  filterKeywords: [],
  filterKeyword: '',
  keywords: [],
  error: null,
  isEvenToggled: false,
  isOddToggled: false
};

export default function todos(state = initialState, action = {}) {
  switch (action.type) {
    case CLICKEVENBUTTON: {
      let { items, isEvenToggled } = state;
      isEvenToggled = !isEvenToggled;
      items = items.map(item => makeEvenColored(item, isEvenToggled ? 'green' : 'black'));
      return {
        ...state,
        items,
        isEvenToggled
      };
    }
    case CLICKODDBUTTON: {
      let { items, isOddToggled } = state;
      isOddToggled = !isOddToggled;
      items = items.map(item => makeOddColored(item, isOddToggled ? 'orange' : 'black'));
      return {
        ...state,
        items,
        isOddToggled
      };
    }
    case SETSORTORDER: {
      const { propertyName: activePropertyName, isAsc: activeIsAsc } = state;
      let { propertyName, isAsc } = action;
      if (activePropertyName === propertyName && isAsc === activeIsAsc) {
        propertyName = null;
        isAsc = null;
      }
      return {
        ...state,
        propertyName,
        isAsc
      };
    }
    case SETFILTERKEYWORD: {
      const { filterKeyword } = action;
      return {
        ...state,
        filterKeyword
      };
    }
    case SETFILTERKEYWORD_SUCCESS:
      const { keywords } = action.result;
      const { filterKeywords } = state;
      const hash = filterKeywords.reduce((agg, item) => {
        agg[item.id] = true;
        return agg;
      }, {});
      const newKeywords = keywords.filter(item => hash[item.id] == null);
      return {
        ...state,
        keywordsLoading: false,
        keywordsLoaded: true,
        keywords: newKeywords,
        error: null
      };
    case SETFILTERKEYWORD_FAIL:
      return {
        ...state,
        keywordsLoading: false,
        keywordsLoaded: false,
        error: action.error
      };
    case ADDFILTERKEYWORD: {
      const { filterKeywords } = state;
      const { id, value } = action;
      return {
        ...state,
        filterKeywords: [...filterKeywords, { id, value }],
        filterKeyword: '',
        keywords: []
      };
    }
    case DELETEFILTERKEYWORD: {
      const { filterKeywords } = state;
      const { id } = action;
      const newFilterKeywords = filterKeywords.filter(item => item.id != id);
      return {
        ...state,
        filterKeywords: newFilterKeywords
      };
    }
    case DELETELASTFILTERKEYWORD: {
      const { filterKeywords } = state;
      const newFilterKeywords = filterKeywords.slice(0, filterKeywords.length - 1);
      return {
        ...state,
        filterKeywords: newFilterKeywords
      };
    }
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      const { items } = action.result;
      const { isEvenToggled, isOddToggled } = state;
      const newItems = items
        .map(item => makeOddColored(item, isOddToggled ? 'orange' : 'black'))
        .map(item => makeEvenColored(item, isEvenToggled ? 'green' : 'black'));
      return {
        ...state,
        loading: false,
        loaded: true,
        items: newItems,
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
  return globalState.todos && globalState.todos.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ client }) => client.get('/load-todos')
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
    types: [SETSORTORDER, LOAD_SUCCESS, LOAD_FAIL],
    promise: (helpers, _dispatch, getState) => {
      const { client } = helpers;
      const { todos } = getState();
      const { filterKeywords, propertyName, isAsc } = todos;
      return client.post('/load-todos', { filterKeywords, propertyName, isAsc });
    },
    propertyName,
    isAsc
  };
}

export function setFilterKeyword(filterKeyword) {
  return {
    types: [SETFILTERKEYWORD, SETFILTERKEYWORD_SUCCESS, SETFILTERKEYWORD_FAIL],
    promise: ({ client }) => client.get(`/load-keywords?filterKeyword=${filterKeyword}`),
    filterKeyword
  };
}

export function deleteFilterKeyword(id) {
  return {
    types: [DELETEFILTERKEYWORD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (helpers, _dispatch, getState) => {
      const { client } = helpers;
      const { todos } = getState();
      const { filterKeywords, propertyName, isAsc } = todos;
      return client.post('/load-todos', { filterKeywords, propertyName, isAsc });
    },
    id
  };
}

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

export function addFilterKeyword(id, value) {
  return {
    types: [ADDFILTERKEYWORD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (helpers, _dispatch, getState) => {
      const { client } = helpers;
      const { todos } = getState();
      const { filterKeywords, propertyName, isAsc } = todos;
      return client.post('/load-todos', { filterKeywords, propertyName, isAsc });
    },
    id,
    value
  };
}

export function dismissError() {
  return {
    type: DISMISSERROR
  };
}
