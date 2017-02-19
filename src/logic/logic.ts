import * as _ from 'lodash';

import { processedData } from './processedData';
import { ExtendedFramework, prefix } from './extendedFramework';

export interface Profile {
    profileName: string;
    displayName: string;
    nugetTarget: string;
    frameworks: ExtendedFramework[];
    supportedByVisualStudio2015: boolean;
}

export interface Group {
    key: string,
    group: ExtendedFramework[];
    friendlyName: string;
}

function isLegacyFramework(f: ExtendedFramework): boolean {
    return f.nugetTarget === 'sl4' ||
        f.nugetTarget === 'win8' ||
        f.nugetTarget === 'wp71' ||
        f.nugetTarget === 'wp7';
}

function isLegacyProfile(p: Profile): boolean {
    return !p.supportedByVisualStudio2015;
}

function getFrameworks(includeLegacy: boolean): ExtendedFramework[] {
    return _(processedData).flatMap(x => x.frameworks).uniqBy(x => x.fullName).filter(x => includeLegacy || !isLegacyFramework(x)).sortBy(x => x.nugetTarget).value();
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

export function selectedFrameworks(includeLegacy: boolean, selections: { [key: string]: string }): ExtendedFramework[] {
    return getFrameworks(includeLegacy).filter(x => selections[prefix(x.nugetTarget)] === x.nugetTarget);
}

// A profile matches if all of its frameworks are in a group represented by the selected frameworks, AND
//  if its framework version is greater than or equal to a selected framework in that group.
function profileMatch(profile: Profile, frameworks: ExtendedFramework[]): boolean {
    for (let f of profile.frameworks) {
        let matches = frameworks.filter(x => x.prefix === f.prefix);
        if (matches.length === 0)
            return false;
        if (!matches.some(x => f.version >= x.version))
            return false;
    }
    return true;
}

function validProfiles(includeLegacy: boolean): Profile[] {
    return processedData.filter(x => (includeLegacy || !isLegacyProfile(x)));
}

export function findAllPcls(includeLegacy: boolean, frameworks: ExtendedFramework[]): Profile[] {
    return validProfiles(includeLegacy).filter(x => profileMatch(x, frameworks));
}

/** Determines whether 'child' is a subset of 'parent'. */
function pclIsSebset(parent: Profile, child: Profile): boolean {
    // 'child' is a subset of 'parent' if 'parent' has all the same framework groups as 'child', with lesser (or equal) versions.
    return child.frameworks.every(c => parent.frameworks.some(p => c.prefix === p.prefix && p.version <= c.version));
}

export function removeSubsetPcls(profiles: Profile[]): Profile[] {
    const result: Profile[] = [];
    for (let p of profiles) {
        let ok = true;
        for (let other of profiles.filter(x => x !== p)) {
            // If this one is a strict subset of other, then it should be removed.
            if (pclIsSebset(other, p)) {
                ok = false;
                break;
            }
        }
        if (ok)
            result.push(p);
    }
    return result;
}

export function netstandardVersion(selections: { [key: string]: string }): string {
    return _(selectedFrameworks(true, selections)).map(x => x.netStandard || 'netstandard1.0').min();
}

function combinations<T>(array: T[], k: number): T[][] {
    const ret: T[][] = [];
    for (let arrayIndex = 0; arrayIndex < array.length; ++arrayIndex) {
        if (k === 1) {
            ret.push([array[arrayIndex]]);
        } else {
            const child = combinations(array.slice(arrayIndex + 1, array.length), k - 1);
            for (let childIndex = 0; childIndex < child.length; childIndex++) {
                const next = child[childIndex];
                next.unshift(array[arrayIndex]);
                ret.push(next);
            }
        }
    }
    return ret;
}

interface ProfileSet {
    profiles: Profile[];
    frameworks: ExtendedFramework[];
}

// A profile set matches if every result profile is a subset of one of the alternative result profiles.
function profileSetMatch(alternativeResultProfiles: Profile[], resultProfiles: Profile[]): boolean {
    return resultProfiles.every(r => alternativeResultProfiles.some(a => pclIsSebset(a, r)));
}

function alternateProfileGroup(profiles: Profile[], k: number, frameworks: ExtendedFramework[], resultProfiles: Profile[]): Profile[][] {
    let ret: ProfileSet[] = [];
    for (let combination of combinations(profiles, k)) {
        const set = {
            profiles: combination,
            frameworks: _(combination).flatMap(x => x.frameworks).value()
        };
        if (!profileSetMatch(set.profiles, resultProfiles))
            continue;
        if (removeSubsetPcls(set.profiles).length !== set.profiles.length)
            continue;
        ret.push(set);
    }
    ret = _(ret).sortBy(x => _(x.frameworks).map(y => y.prefix).uniq().value().length, x => x.frameworks.length).value();
    // We could also sort by how close the versions are to the selected versions, if there's ever too many results.
    return ret.map(x => x.profiles);
}

function removeSubsetPclGroups(profiles: Profile[][]): Profile[][] {
    const result: Profile[][] = [];
    for (let g of profiles) {
        let ok = true;
        for (let other of profiles.filter(x => x !== g)) {
            // If the other one has all the same framework groups with lower versions for each, than this one is a strict subset of other, and the other should be removed.
            const pf = _(g).flatMap(x => x.frameworks).value();
            const otherf = _(other).flatMap(x => x.frameworks).value();
            if (!pf.every(f => otherf.some(o => f.prefix === o.prefix && o.version <= f.version))) {
                ok = false;
                break;
            }
        }
        if (ok)
            result.push(g);
    }
    return result;
}

export function alternateProfiles(includeLegacy: boolean, n: number, frameworks: ExtendedFramework[], resultProfiles: Profile[]): Profile[][][] {
    const profiles = validProfiles(includeLegacy);
    const ret: Profile[][][] = [];
    for (let k = 1; k < n; ++k) {
        const set = alternateProfileGroup(profiles, k, frameworks, resultProfiles);
        if (set.length !== 0)
            ret.push(removeSubsetPclGroups(set));
    }
    return ret;
}
