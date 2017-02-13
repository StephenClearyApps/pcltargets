import * as React from 'react';
import { Table } from 'react-bootstrap';

import { Profile } from '../logic/logic';

export interface ProfileTableProps {
    profiles: Profile[];
}

export function ProfileTable({ profiles }: ProfileTableProps) {
    return (
        <Table striped bordered condensed hover>
            <thead>
            <tr>
                <th>Profile</th>
                <th>NuGet Target</th>
                <th>Frameworks</th>
            </tr>
            </thead>
            <tbody>
                {profiles.map(x =>
                <tr>
                    <td>{x.profileName}</td>
                    <td>{x.nugetTarget}</td>
                    <td>{x.frameworks.map(y => y.friendlyName).join(', ')}</td>
                </tr>
                )}
            </tbody>
        </Table>
    );
}
