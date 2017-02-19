import * as React from 'react';
import { Table } from 'react-bootstrap';

import { Profile } from '../logic/logic';

export interface ProfileTableProps {
    profiles: Profile[];
    nugetTarget?: string;
}

export function ProfileTable({ profiles, nugetTarget }: ProfileTableProps) {
    return (
        <Table striped bordered condensed hover>
            <thead>
            <tr>
                <th>Profile</th>
                <th>NuGet Target</th>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
                {profiles.map(x =>
                <tr key={x.nugetTarget}>
                    <td>{x.profileName}</td>
                    <td>{nugetTarget || x.nugetTarget}</td>
                    <td>{x.displayName}</td>
                </tr>
                )}
            </tbody>
        </Table>
    );
}
