import React from 'react';
import cx from 'classnames';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import LaneControlBar from './LaneControlBar';
import PropTypes from '../../utils/PropTypes';
import * as panes from '../panes';


export default class CallLane extends React.Component {
    static propTypes = {
        lane: PropTypes.map.isRequired,
        call: PropTypes.map,
    };

    constructor(props) {
        super(props);

        this.state = {
            firstCall: true,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.lane.get('step') === 'done') {
            this.setState({
                firstCall: false,
            });
        }
    }

    render() {
        let lane = this.props.lane;
        let step = lane.get('step');
        let infoMode = lane.get('infoMode');
        let paneComponents = [];

        switch (step) {
            case 'assignment':
                paneComponents = [ 'assignment', 'instructions' ];
                break;
            case 'prepare':
                paneComponents = [ 'instructions', 'target', 'input' ];
                break;
            case 'call':
                paneComponents = [ 'instructions', 'target', 'input', 'report' ];
                break;
            case 'report':
                paneComponents = [ 'instructions', 'target', 'input', 'report' ];
                break;
            case 'done':
                paneComponents = [ 'report', 'stats' ];
                break;
            case 'empty':
                paneComponents = [ 'empty' ];
                break;
        }

        let panes = paneComponents.map(paneType => {
            let PaneComponent = paneComponentsByType[paneType];
            return (
                <PaneComponent step={ step } key={ paneType }
                    lane={ lane }
                    call={ this.props.call }
                    firstCall={ this.state.firstCall }/>
            );
        });

        let classes = cx(
            'CallLane',
            'CallLane-' + step + 'Step',
            'CallLane-' + infoMode + 'InfoMode',
        );

        return (
            <div className={ classes }>
                <CSSTransitionGroup
                    transitionEnterTimeout={ 500 }
                    transitionLeaveTimeout={ 500 }
                    transitionName="PaneBase"
                    component="div" className="CallLane-panes">
                    { panes }
                </CSSTransitionGroup>
                <LaneControlBar lane={ this.props.lane }/>
            </div>
        );
    }
}

const paneComponentsByType = {
    assignment: panes.AssignmentPane,
    empty: panes.QueueEmptyPane,
    instructions: panes.InstructionsPane,
    input: panes.InputPane,
    report: panes.ReportPane,
    stats: panes.StatsPane,
    target: panes.TargetPane,
};
