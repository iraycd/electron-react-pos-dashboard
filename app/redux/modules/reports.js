const FETCH_REPORTS = 'FETCH_REPORTS';
const REPORTS_RETRIEVED = 'REPORTS_RETRIEVED';
const NEW_REPORT = 'NEW_REPORT';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case REPORTS_RETRIEVED:
      return {
        ...action.reports
      };
    case NEW_REPORT:
      return {
        ...state,
        [action.dayMonth]: {
          ...state[action.dayMonth],
          [action.timestamp]: action.newReport
        }
      };
    default:
      return state;
  }
}

export function fetchAllReports() {
  return (dispatch, getState, { ref }) => {
    dispatch({ type: FETCH_REPORTS });
    ref.child('reports').once('value')
    .then(snap => dispatch({ type: REPORTS_RETRIEVED, reports: snap.val() }))
    .then(() => {
      ref.child('.info/serverTimeOffset').on('value', (fbTime) => {
        const date = new Date();
        const dayMonth = date.toLocaleDateString().replace(/\//g, '-');
        const now = Date.now() + fbTime.val();
        const query = ref.child(`reports/${dayMonth}`).orderByKey().startAt(now.toString());

        query.on('child_added', (snap) => {
          const newReport = snap.val();
          const timestamp = snap.key;

          dispatch({ type: NEW_REPORT, newReport, dayMonth, timestamp });
        });
      });
    });
  };
}
