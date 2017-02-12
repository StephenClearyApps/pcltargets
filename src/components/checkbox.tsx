import * as React from 'react';

export interface CheckboxProps {
    label: string;
    isChecked: boolean;
    onChange: () => void;
}

export function Checkbox({label, isChecked, onChange}: CheckboxProps) {
    return (
        <div className="checkbox">
            <label>
                <input type="checkbox" value={label} checked={isChecked || false} onChange={onChange}/>
                {label}
            </label>
        </div>
    );
}
