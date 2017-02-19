import * as _ from 'lodash';

import { data } from './data';
import { extendFramework } from './extendedFramework';

// Note: nugetTarget is empty for the XBox framework.
export const processedData = data
    .filter(p => p.nugetTarget)
    .map(p => ({
        ...p,
        frameworks: p.frameworks.map(extendFramework)
    }));
