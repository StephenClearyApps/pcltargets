import * as React from 'react';
import { Button } from 'react-bootstrap';

import { ExtendedFramework, prefix } from '../logic/extendedFramework';
import { SelectionsState } from '../reducers';
import { actions } from '../actions';

export interface FrameworkButtonProps {
    framework: ExtendedFramework;
    selections: SelectionsState;
}

export function FrameworkButton({ framework: { nugetTarget, friendlyName }, selections }: FrameworkButtonProps) {
    const selected = selections[prefix(nugetTarget)] === nugetTarget;
    return <Button key={nugetTarget} bsStyle={selected ? "primary" : "default"} onClick={() => actions.select(nugetTarget, !selected)}>{friendlyName}</Button>;
}
