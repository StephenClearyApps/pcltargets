import * as React from 'react';
import { Checkbox } from 'react-bootstrap';

import { getGroups, numSelectedGroups, selectedFrameworks, findAllPcls, removeSubsetPcls } from '../logic/logic';
import { State } from '../reducers';
import { actions } from '../actions';
import { FrameworkButtonGroup } from './FrameworkButtonGroup';
import { ProfileTable } from './ProfileTable';

export function Main({ includeLegacy, selections }: State) {
    const frameworks = selectedFrameworks(includeLegacy, selections);
    const fullResult = findAllPcls(frameworks);
    const result = removeSubsetPcls(fullResult);

    return (
        <div>
            <Checkbox checked={includeLegacy} onChange={() => actions.setIncludeLegacy(!includeLegacy)}>Include legacy frameworks ("legacy" means "not supported by VS2015")</Checkbox>
            <p>
                <div>{getGroups(includeLegacy).map(x => <div key={x.key} className="scleft"><FrameworkButtonGroup group={x} selections={selections}/></div>)}</div>
                <div className="scclear"/>
            </p>
            {numSelectedGroups(includeLegacy, selections) < 2 ? <div>Select frameworks from at least two groups to show the target PCLs.</div> :
                <div>
                    <div>You should support these PCL targets:</div>
                    <ProfileTable profiles={result}/>
                    <div>Your library will be compatible with these PCL profiles:</div>
                    <ProfileTable profiles={fullResult}/>
                </div>
            }
        </div>
    );
}