const SELECT_CATEGORY = 'SELECT_CATEGORY';
const TOGGLE_SNACKBAR = 'TOGGLE_SNACKBAR';

const init = {
  selectedCategory: '',
  snackMessage: '',
};

export default function reducer(state = init, action) {
  switch (action.type) {
    case SELECT_CATEGORY:
      return {
        ...state,
        selectedCategory: action.category,
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
export function selectCategory(category) {
  return {
    type: SELECT_CATEGORY,
    category,
  };
}

export function toggleSnackbar(snackMessage) {
  return {
    type: TOGGLE_SNACKBAR,
    snackMessage,
  };
}
