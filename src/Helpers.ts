// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchPropWithName(props: any[], propToSearch: string): any | null {
    for (let i = 0; i < props.length; i++) {
        if (props[i].name === propToSearch) {
            return props[i];
        }
    }

    return null;
}