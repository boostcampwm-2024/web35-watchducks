type FilterValue = string | number | Date | unknown;

export function mapFilterCondition(
    key: string,
    value: FilterValue,
): { condition: string; param: FilterValue } {
    let type: string;

    if (typeof value === 'string') {
        type = 'String';
    } else if (typeof value === 'number') {
        type = Number.isInteger(value) ? 'Int32' : 'Float64';
    } else if (value instanceof Date) {
        type = 'DateTime64(3)';
    } else {
        // Should not occur due to `FilterValue` type restriction
        throw new Error(`Unsupported filter value type for key "${key}": ${typeof value}`);
    }

    return { condition: `${key} = {${key}:${type}}`, param: value };
}
