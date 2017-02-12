import * as React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';

import { Group, ExtendedFramework, getGroups, numSelectedGroups, selectedFrameworks, findAllPcls, removeSubsetPcls, prefix } from '../logic/logic';
import { Checkbox } from './checkbox';
import { State } from '../reducers';
import { actions } from '../actions';

function framework(f: ExtendedFramework, state: State) {
    const selected = state.selections[prefix(f.nugetTarget)] === f.nugetTarget;
    return <Button key={f.nugetTarget} bsStyle={selected ? "primary" : "default"} onClick={() => actions.select(f.nugetTarget, !selected)}>{f.friendlyName}</Button>;
}

function group(g: Group, state: State) {
    return (
        <div key={g.key}>
            {g.friendlyName}
            <ButtonGroup>
                {g.group.map(x => framework(x, state))}
            </ButtonGroup>
        </div>
    );
}

function results(state: State) {
    if (numSelectedGroups(state.includeLegacy, state.selections) < 2)
        return <div>Select frameworks from at least two groups to show the target PCLs.</div>;
    const frameworks = selectedFrameworks(state.includeLegacy, state.selections);
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