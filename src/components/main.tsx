import * as React from 'react';
import { ButtonGroup, Checkbox, Table } from 'react-bootstrap';

import { Group, Profile, getGroups, numSelectedGroups, selectedFrameworks, findAllPcls, removeSubsetPcls } from '../logic/logic';
import { State } from '../reducers';
import { actions } from '../actions';
import { FrameworkButtonGroup } from './FrameworkButtonGroup';
import { ProfileTable } from './ProfileTable';

function results({ includeLegacy, selections }: State) {
    if (numSelectedGroups(includeLegacy, selections) < 2)
        return <div>Select frameworks from at least two groups to show the target PCLs.</div>;
    const frameworks = selectedFrameworks(includeLegacy, selections);
    const fullResult = findAllPcls(frameworks);
    const result = removeSubsetPcls(fullResult);
    return (
        <div>
            <div>You should support these PCL targets:</div>
            <ProfileTable profiles={result}/>
            <div>Your library will be compatible with these PCL profiles:</div>
            <ProfileTable profiles={fullResult}/>
        </div>
    );
}

export function Main({ includeLegacy, selections }: State) {
    const frameworks = selectedFrameworks(includeLegacy, selections);
    const fullResult = findAllPcls(frameworks);
    const result = removeSubsetPcls(fullResult);

    return (
        <div>
            <Checkbox checked={includeLegacy} onChange={() => actions.setIncludeLegacy(!includeLegacy)}>Include legacy Frameworks</Checkbox>
            <p>
                <div>{getGroups(includeLegacy).map(x => <div key={x.key} className="scleft"><FrameworkButtonGroup group={x} selections={selections}/></div>)}</div>
                <div className="scclear"/>
            </p>
            <div>
                <div>You should support at least these PCL targets:</div>
                <ProfileTable profiles={result}/>
                <div>Your library will be compatible with these PCL profiles:</div>
                <ProfileTable profiles={fullResult}/>
            </div>
        </div>
    );
}