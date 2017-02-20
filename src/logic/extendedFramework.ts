export interface Framework {
    fullName: string;
    friendlyName: string;
    nugetTarget: string;
    netStandard: string;
}

export interface ExtendedFramework extends Framework {
    prefix: string;
    version: number;
}

export function prefix(input: string): string {
    return input ? input.match(/[a-z ]+/i)[0].trim() : '';
}

export function version(input: string): number {
    var result = input ? parseInt(input.match(/[0-9]+/)[0]) : 0;
    if (result > 100)
        return result;
    if (result > 10)
        return result * 10;
    return result * 100;
}

export function extendFramework(framework: Framework): ExtendedFramework {
    return {
        ...framework,
        prefix: prefix(framework.nugetTarget),
        version: version(framework.nugetTarget)
    };
}
