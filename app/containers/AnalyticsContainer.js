import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Analytics from './../components/Analytics';

function mapStateToProps(state) {
  const { reports } = state;

  return {
    reports,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Analytics);
