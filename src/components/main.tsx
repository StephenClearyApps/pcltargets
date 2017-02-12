import * as React from 'react';
import { connect } from 'react-redux';

import { Group, getGroups, numSelectedGroups, selectedFrameworks, findAllPcls, removeSubsetPcls } from '../logic/logic';
import { Checkbox } from './checkbox';
import { State } from '../reducers';
import { actions } from '../actions';

function group(g: Group, state: State) {
    return (
        <div key={g.key}>
            {g.friendlyName}
            {g.group.map(x => <Checkbox key={x.nugetTarget} label={x.friendlyName} isChecked={state.form[x.nugetTarget]} onChange={() => actions.setFormValue(x.nugetTarget, !state.form[x.nugetTarget])} />)}
        </div>
    );
}

function results(state: State) {
    if (numSelectedGroups(state.includeLegacy, state.form) < 2)
        return <div>Select frameworks from at least two groups to show the target PCLs.</div>;
    const frameworks = selectedFrameworks(state.includeLegacy, state.form);
    const profiles = findAllPcls(frameworks);
    const result = removeSubsetPcls(profiles);
    return (
        <div>
            You should support these PCL targets:
            {result.map(x => <div key={x.profileName}>{x.profileName} ({x.nugetTarget})</div>)}
            <div>Your library will be compatible with these PCL profiles:</div>
            {profiles.map(x => <div key={x.profileName}>{x.profileName} ({x.nugetTarget})</div>)}
        </div>
    );
}

function MainComponent(props: State) {
    return (
        <div>
            <Checkbox label="Include legacy profiles" isChecked={props.includeLegacy} onChange={() => actions.setIncludeLegacy(!props.includeLegacy)}/>
            {getGroups(props.includeLegacy).map(x => group(x, props))}
            {results(props)}
        </div>
    );
}

export const Main = connect(x => x)(MainComponent);