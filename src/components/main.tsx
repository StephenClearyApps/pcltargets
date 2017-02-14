import * as React from 'react';
import { Checkbox } from 'react-bootstrap';

import { FrameworkButtonGroup } from './FrameworkButtonGroup';
import { ProfileTable } from './ProfileTable';
import { Ad } from './Ad';
import { getGroups, numSelectedGroups, selectedFrameworks, findAllPcls, removeSubsetPcls } from '../logic/logic';
import { State } from '../reducers';
import { actions } from '../actions';

export function Main({ includeLegacyFrameworks, selections }: State) {
    const frameworks = selectedFrameworks(includeLegacyFrameworks, selections);
    const fullResult = findAllPcls(false, frameworks);
    const result = removeSubsetPcls(fullResult);

    return (
        <div>
            <Checkbox checked={includeLegacyFrameworks} onChange={() => actions.setIncludeLegacyFrameworks(!includeLegacyFrameworks)}>Include legacy platform versions ("legacy" means <a href="https://www.visualstudio.com/en-us/productinfo/vs2015-compatibility-vs">not supported by VS2015</a>)</Checkbox>
            <div>
                <div>{getGroups(includeLegacyFrameworks).map(x => <div key={x.key} className="scleft"><FrameworkButtonGroup group={x} selections={selections}/></div>)}</div>
                <div className="scclear"/>
            </div>
            <h2>Results:</h2>
            {numSelectedGroups(includeLegacyFrameworks, selections) < 2 ? <p>Select platforms from at least two groups to show the target PCLs.</p> :
                <div>
                    <div>You should support these PCL targets:</div>
                    <ProfileTable profiles={result}/>
                    <div>Your library will be compatible with these PCL profiles:</div>
                    <ProfileTable profiles={fullResult}/>
                </div>
            }
            <p>By <a href="http://stephencleary.com">Stephen Cleary</a>. Please do <a href="https://github.com/StephenClearyApps/pcltargets/issues">report any bugs</a>. Thanks!</p>
            <Ad/>
        </div>
    );
}