import * as React from 'react';
import { Checkbox } from 'react-bootstrap';

import { FrameworkButtonGroup } from './FrameworkButtonGroup';
import { ProfileTable } from './ProfileTable';
import { Ad } from './Ad';
import { getGroups, numSelectedGroups, selectedFrameworks, findAllPcls, removeSubsetPcls } from '../logic/logic';
import { State } from '../reducers';
import { actions } from '../actions';

export function Main({ includeLegacy, selections }: State) {
    const frameworks = selectedFrameworks(includeLegacy, selections);
    const fullResult = findAllPcls(frameworks);
    const result = removeSubsetPcls(fullResult);

    return (
        <div>
            <Checkbox checked={includeLegacy} onChange={() => actions.setIncludeLegacy(!includeLegacy)}>Include legacy platforms ("legacy" means "not supported by VS2015")</Checkbox>
            <div>
                <div>{getGroups(includeLegacy).map(x => <div key={x.key} className="scleft"><FrameworkButtonGroup group={x} selections={selections}/></div>)}</div>
                <div className="scclear"/>
            </div>
            <Ad/>
            {numSelectedGroups(includeLegacy, selections) < 2 ? <p>Select platforms from at least two groups to show the target PCLs.</p> :
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