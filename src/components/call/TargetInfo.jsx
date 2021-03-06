import React from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';
import { FormattedMessage as Msg, FormattedRelative } from 'react-intl';

import PropTypes from '../../utils/PropTypes';
import { selectedAssignment } from '../../store/assignments';
import Avatar from '../misc/Avatar';
import TagList from '../misc/TagList';

const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class TargetInfo extends React.Component {
    static propTypes = {
        target: PropTypes.map.isRequired,
        showFullInfo: PropTypes.bool,
    };

    render() {
        let target = this.props.target;
        let callInfo, tagList;

        if (this.props.showFullInfo) {
            let lastCall = target.get('call_log').first();
            let lastCallLabel = null;

            if (lastCall) {
                let lastCallDate = (
                    <FormattedRelative
                        updateInterval={ 0 }
                        value={ new Date(lastCall.get('allocation_time')) }
                        />
                );

                if (lastCall.get('state') === 1) {
                    lastCallLabel = (
                        <Msg id="controlBar.targetInfo.lastSuccessful"
                            values={{ date: lastCallDate }}/>
                    );
                }
                else {
                    lastCallLabel = (
                        <Msg id="controlBar.targetInfo.lastFailure"
                            values={{ date: lastCallDate }}/>
                    );
                }
            }
            else {
                lastCallLabel = (
                    <Msg id="controlBar.targetInfo.lastNever"/>
                );
            }

            callInfo = [
                <span key="number" className="TargetInfo-number">
                    { target.get('phone') }
                </span>,
                <div key="lastCall" className="TargetInfo-lastCall">
                    { lastCallLabel }
                </div>
            ];

            tagList = (
                <TagList tags={ target.get('tags') }/>
            );
        }

        let classes = cx('TargetInfo', {
            'TargetInfo-showFull': this.props.showFullInfo,
        });

        return (
            <CSSTransitionGroup
                transitionAppear={ true }
                transitionAppearTimeout={ 1500 }
                transitionEnterTimeout={ 1500 }
                transitionLeaveTimeout={ 1500 }
                transitionName="TargetInfo"
                component="div" className={ classes }>
                <Avatar key="avatar"
                    personId={ target.get('id') }
                    orgId={ this.props.assignment.get('organization_id') }
                    mask={ true }/>
                <h1 className="TargetInfo-name">{ target.get('name') }</h1>
                { callInfo }
                { tagList }
            </CSSTransitionGroup>
        );
    }
};
