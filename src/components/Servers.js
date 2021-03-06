import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../actions';
import { getServers, getErrorMessage, getIsFetching } from '../reducers';
import FetchError from './FetchError';
import './Servers.css';

class ServerItem extends Component {
  render() {
    const { server } = this.props;
    return (
      <li>
        <div className="ServerItem-name">{server.name}</div>
        <div className="ServerItem-players">{server.players} players</div>
        <div className="ServerItem-description">{server.description}</div>
      </li>
    )
  }
}

class Servers extends Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { fetchServers } = this.props;
    fetchServers();
  }

  render() {
    const { isFetching, errorMessage, servers } = this.props;
    if (isFetching && servers.length === 0) {
      return (
        <div className="Servers">
          <h1>Servers</h1>
          <p className="Servers-intro">
            Loading...
          </p>
        </div>
      );
    }
    if (errorMessage && servers.length === 0) {
      return (
        <div className="Servers">
          <h1>Servers</h1>
          <FetchError
            message={errorMessage}
            onRetry={() => this.fetchData()}
          />
        </div>
      );
    }

    // Sort servers by # players (desc) and then name (asc)
    let sortedServers = servers.sort((a, b) => {
      if (a.players !== b.players) {
        return b.players - a.players;
      }
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    return (
      <div className="Servers">
        <h1>Servers</h1>
        <ul className="ul-stack Servers-list">
          {sortedServers.map((server, index) =>
            <ServerItem key={index} server={server} />
          )}
        </ul>
      </div>
    );
  }
}

Servers.propTypes = {
  errorMessage: PropTypes.string,
  servers: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchServers: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { params }) => {
  return {
    isFetching: getIsFetching(state),
    errorMessage: getErrorMessage(state),
    servers: getServers(state),
  };
};

Servers = withRouter(connect(
  mapStateToProps,
  actions
)(Servers));

export default Servers;
