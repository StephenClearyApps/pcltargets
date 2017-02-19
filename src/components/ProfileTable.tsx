import * as React from 'react';
import * as _ from 'lodash';
import { Table } from 'react-bootstrap';

import { Profile, Framework, prefix } from '../logic/logic';

export interface ProfileTableProps {
    profiles: Profile[];
    nugetTargets?: string[];
}

function frameworkNugetTarget(f: Framework, nugetTargets: string[]): string {
    for (let t of nugetTargets) {
        if (prefix(f.nugetTarget) === prefix(t))
            return t;
    }
    return null;
}

function nugetTarget(p: Profile, nugetTargets: string[]): string {
    if (!nugetTargets)
        return p.nugetTarget;
    return 'portable-' + _(p.frameworks).map(x => frameworkNugetTarget(x, nugetTargets)).filter(x => x !== null).value().join('+');
}

export function ProfileTable({ profiles, nugetTargets }: ProfileTableProps) {
    return (
        <Table striped bordered condensed hover>
            <thead>
            <tr>
                <th>Profile</th>
                <th>{nugetTargets ? 'Special NuGet Target' : 'NuGet Target'}</th>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
                {profiles.map(x =>
                <tr key={x.nugetTarget}>
                    <td>{x.profileName}</td>
                    <td>{nugetTarget(x, nugetTargets)}</td>
                    <td>{x.displayName}</td>
                </tr>
                )}
            </tbody>
        </Table>
    );
}
