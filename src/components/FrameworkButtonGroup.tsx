import * as React from 'react';
import { ButtonGroup } from 'react-bootstrap';

import { Group } from '../logic/logic';
import { SelectionsState } from '../reducers';
import { FrameworkButton } from './FrameworkButton';

export interface FrameworkButtonGroupProps {
    group: Group;
    selections: SelectionsState;
}

export function FrameworkButtonGroup({ group, selections }: FrameworkButtonGroupProps) {
    return (
        <div>
            <div className='lead' style={{ marginBottom:0, marginTop:10 }}>{group.friendlyName}</div>
            <ButtonGroup vertical>
                {group.group.map(x => <FrameworkButton key={x.nugetTarget} framework={x} selections={selections}/>)}
            </ButtonGroup>
        </div>
    );
}
