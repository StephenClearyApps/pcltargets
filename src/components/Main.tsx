import * as React from 'react';
import * as _ from 'lodash';
import { Checkbox } from 'react-bootstrap';

import { FrameworkButtonGroup } from './FrameworkButtonGroup';
import { ProfileTable } from './ProfileTable';
import { AlternateResult } from './AlternateResult';
import { Ad } from './Ad';
import { getGroups, numSelectedGroups, selectedFrameworks, findAllPcls, removeSubsetPcls, netstandardVersion, alternateProfiles } from '../logic/logic';
import { State } from '../reducers';
import { actions } from '../actions';

export function Main({ usesEnlightenment, usesVS2012, includeLegacyFrameworks, includeLegacyProfiles, selections }: State) {
    const frameworks = selectedFrameworks(includeLegacyFrameworks, selections);
    const fullResult = findAllPcls(includeLegacyProfiles, frameworks);
    const result = removeSubsetPcls(fullResult);
    const netstandard = netstandardVersion(selections);
    const alternates = usesEnlightenment ? alternateProfiles(includeLegacyProfiles, result.length, frameworks, result) : [];

    return (
        <div>
            <Checkbox checked={usesEnlightenment} onChange={() => actions.setEnlightenment(!usesEnlightenment)}>My project requires platform-specific binaries
                (using <a href="http://log.paulbetts.org/the-bait-and-switch-pcl-trick/">bait-and-switch</a> or <a href="http://blog.stephencleary.com/2012/11/portable-class-library-enlightenment.html">enlightenment</a>).</Checkbox>
            <Checkbox checked={usesVS2012} onChange={() => actions.setVS2012(!usesVS2012)}>I am willing to use VS2012 to maintain my project.</Checkbox>
            <div>
                <div>{getGroups(includeLegacyFrameworks).map(x => <div key={x.key} className="scleft"><FrameworkButtonGroup group={x} selections={selections}/></div>)}</div>
                <div className="scclear"/>
            </div>
            <h2>Results</h2>
            {result.length === 0 ? <p>Select more platforms to show PCL results.</p> :
                <div>
                    <h3>Primary PCL Targets</h3>
                    <div>You should support <a href="https://github.com/dotnet/standard">{netstandard}</a> and these PCL targets:</div>
                    <ProfileTable profiles={result}/>
                    {_(alternates).flatMap(x => x).map(x => <AlternateResult profiles={x} nugetTargets={frameworks.map(y => y.nugetTarget)}/>).value()}
                    <h3>PCL Compatibility</h3>
                    <div>Your library will be compatible with these PCL profiles:</div>
                    <ProfileTable profiles={fullResult}/>
                </div>
            }
            <p>By <a href="http://stephencleary.com">Stephen Cleary</a>. Please do <a href="https://github.com/StephenClearyApps/pcltargets/issues">report any bugs</a>. Thanks!</p>
            <Ad/>
        </div>
    );
}