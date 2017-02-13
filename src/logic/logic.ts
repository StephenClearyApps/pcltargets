import * as _ from 'lodash';

// Note: nugetTarget is empty for the XBox framework.

import { data } from './data';

export function prefix(input: string): string {
    return input ? input.match(/[a-z ]+/i)[0].trim() : '';
}

function version(input: string): number {
    var result = input ? parseInt(input.match(/[0-9]+/)[0]) : 0;
    if (result > 100)
        return result;
    if (result > 10)
        return result * 10;
    return result * 100;
}

interface Framework {
    fullName: string;
    friendlyName: string;
    nugetTarget: string;
}

export interface Profile {
    profileName: string;
    nugetTarget: string;
    frameworks: Framework[];
    supportedByVisualStudio2015: boolean;
}

export interface ExtendedFramework {
    fullName: string;
    friendlyName: string;
    nugetTarget: string;
    prefix: string;
    version: number;
}

export interface Group {
    key: string,
    group: ExtendedFramework[];
    friendlyName: string;
}

function extendFramework(framework: Framework) : ExtendedFramework {
    return { ...framework,
        prefix: prefix(framework.nugetTarget),
        version: version(framework.nugetTarget)
    };
}

const nugetCompatibleData = data.filter(x => x.nugetTarget);

function isLegacy(p: Profile): boolean {
    return !p.supportedByVisualStudio2015 || p.frameworks.some(f => f.nugetTarget === 'win8');
}

function getFrameworks(includeLegacy: boolean): ExtendedFramework[] {
    return _(nugetCompatibleData).filter(x => includeLegacy || !isLegacy(x)).flatMap(x => x.frameworks).uniqBy(x => x.fullName).sortBy(x => x.nugetTarget).map(extendFramework).value();
}

export function getGroups(includeLegacy: boolean): Group[] {
    const frameworks = getFrameworks(includeLegacy);
    const groupedFrameworks = _(frameworks).groupBy(x => prefix(x.nugetTarget)).value();
    return _.keys(groupedFrameworks).map(x => ({
        key: x,
        group: groupedFrameworks[x].reverse(),
        friendlyName: prefix(groupedFrameworks[x][0].friendlyName)
    }));
}

export function numSelectedGroups(includeLegacy: boolean, selections: { [key: string]: string }) : number {
    return getGroups(includeLegacy).filter(x => selections[x.key]).length;
}

export function selectedFrameworks(includeLegacy: boolean, selections: { [key: string]: string }) : ExtendedFramework[] {
    return getFrameworks(includeLegacy).filter(x => selections[prefix(x.nugetTarget)] === x.nugetTarget);
}

// A profile matches if all of its frameworks are in a group represented by the selected frameworks, AND
//  if its framework version is greater than or equal to a selected framework in that group.
function profileMatch(profile: Profile, frameworks: ExtendedFramework[]) : boolean {
    for (let f of profile.frameworks.map(extendFramework)) {
        let matches = frameworks.filter(x => x.prefix === f.prefix);
        if (matches.length === 0)
            return false;
        if (!matches.some(x => f.version >= x.version))
            return false;
    }
    return true;
}

export function findAllPcls(frameworks: ExtendedFramework[]) : Profile[] {
    return data.filter(x => x.nugetTarget && profileMatch(x, frameworks));
}

export function removeSubsetPcls(profiles: Profile[]) : Profile[] {
    const result : Profile[] = [];
    for (let p of profiles) {
        let ok = true;
        for (let other of profiles.filter(x => x !== p)) {
            // If the other one has all the same framework groups with lower versions for each, than this one is a strict subset of other, and should be removed.
            const pf = p.frameworks.map(extendFramework);
            const otherf = other.frameworks.map(extendFramework);
            if (pf.every(f => otherf.some(o => f.prefix === o.prefix && o.version <= f.version))) {
                ok = false;
                break;
            }
        }
        if (ok)
            result.push(p);
    }
    return result;
}
