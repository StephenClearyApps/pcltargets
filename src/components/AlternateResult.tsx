import * as React from 'react';

import { ProfileTable } from './ProfileTable';
import { Profile, alternateProfiles } from '../logic/logic';

export interface AlternateResultProps {
    profiles: Profile[];
    nugetTargets: string[];
}

export function AlternateResult({ profiles, nugetTargets }: AlternateResultProps) {
    return (
        <div>
            <h3>Alternative PCL Targets</h3>
            <p>
                Alternative targets can be used to reduce the number of PCLs in your solution; however, they can only be used if your core PCL code is compatible with the reduced API set of the alternative PCLs.
                Also, be sure to note that the nuget target is <i>not</i> necessarily the normal nuget target for the alternative PCLs.
            </p>
            <ProfileTable profiles={profiles} nugetTargets={nugetTargets} />
        </div>
    );
}
