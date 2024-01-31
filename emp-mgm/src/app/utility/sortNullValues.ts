/**
 * 
 * @param arr Array
 * @param key Key Name
 * @param keyType Type of variable date or number
 * @param sortOrder asc or desc
 * @return Sorted Array
 */
export function sortNullValues(arr: any[], key: string, keyType: keyType, sortOrder: sortOrder) {
    const nullArray = arr.filter(e => !e[key]);
    const notNullArray = arr.filter(e => e[key]);
    const assignValue = (val, keyType) => {
        if (val === null) {
            return Infinity;
        }
        else {
            if (keyType == 'date') {
                return new Date(val).getTime();
            }
            return Number(val);
        };
    };
    const sorter = (a, b) => {
        if (sortOrder == 'asc') {
            return assignValue(a[key], keyType) - assignValue(b[key], keyType);
        } else {
            return assignValue(b[key], keyType) - assignValue(a[key], keyType);
        }
    };
    return [...notNullArray.sort(sorter),...nullArray];
}

type sortOrder = ('asc' | 'desc')
type keyType = ('number' | 'date')