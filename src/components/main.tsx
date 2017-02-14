import * as React from 'react';
import { Checkbox } from 'react-bootstrap';

import { FrameworkButtonGroup } from './FrameworkButtonGroup';
import { ProfileTable } from './ProfileTable';
import { Ad } from './Ad';
import { getGroups, numSelectedGroups, selectedFrameworks, findAllPcls, removeSubsetPcls } from '../logic/logic';
import { State } from '../reducers';
import { actions } from '../actions';

export function Main({ includeLegacyFrameworks, includeLegacyProfiles, selections }: State) {
    const frameworks = selectedFrameworks(includeLegacyFrameworks, selections);
    const fullResult = findAllPcls(includeLegacyProfiles, frameworks);
    const result = removeSubsetPcls(fullResult);

    return (
        <div>
            <Checkbox checked={includeLegacyFrameworks} onChange={() => actions.setIncludeLegacyFrameworks(!includeLegacyFrameworks)}>Include legacy platform versions
                ("legacy" means <a href="https://www.visualstudio.com/en-us/productinfo/vs2015-compatibility-vs">not directly supported by VS2015</a>).<br/>
                E.g., Windows 8.0: you cannot create a Windows 8.0 library on VS2015, but you can create a PCL library that includes support for Windows 8.0.</Checkbox>
            <Checkbox checked={includeLegacyProfiles} onChange={() => actions.setIncludeLegacyProfiles(!includeLegacyProfiles)}>Include legacy PCL profiles
                ("legacy" means <a href="https://visualstudio.uservoice.com/forums/121579-visual-studio/suggestions/4504987-support-portable-class-libraries-in-vs-2013-for-al">not supported by VS2015 or VS2013</a>).<br/>
                E.g., you cannot create a PCL Profile2 on VS2015 (or VS2013).<br/>
                Only check this box if you are willing to use VS2012 to maintain your project.</Checkbox>
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