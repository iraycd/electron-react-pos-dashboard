const SELECT_GROUP = 'SELECT_GROUP';
const SELECT_FILTER = 'SELECT_FILTER';
const TOGGLE_SNACKBAR = 'TOGGLE_SNACKBAR';

const init = {
  selectedGroup: '',
  selectedFilter: 'All',
  snackMessage: '',
  searchText: ''
};

export default function reducer(state = init, action) {
  switch (action.type) {
    case SELECT_GROUP:
      return {
        ...state,
        selectedGroup: action.group,
      };
    case SELECT_FILTER:
      return {
        ...state,
        selectedFilter: action.filter,
      };
    case TOGGLE_SNACKBAR:
      return {
        ...state,
        snackMessage: action.snackMessage,
      };
    default:
      return state;
  }
}

// Actions
export function selectFilter(e, i, filter) {
  return {
    type: SELECT_FILTER,
    filter,
  };
}

export function selectGroup(group) {
  return {
    type: SELECT_GROUP,
    group,
  };
}

export function toggleSnackbar(snackMessage) {
  return {
    type: TOGGLE_SNACKBAR,
    snackMessage,
  };
}
