import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Reports from './../components/Reports';
import * as reportsActions from './../redux/modules/reports';

function mapStateToProps(state) {
  const {
    reports,
  } = state;
  const now = new Date().toLocaleDateString().replace(/\//g, '-');

  return {
    activity: reports[now],
    reports,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(reportsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
