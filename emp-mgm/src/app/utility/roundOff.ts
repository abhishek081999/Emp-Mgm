export function roundOff(value: any ,decimals?: number){
    decimals = decimals?decimals:2
    return Number(Math.round(Number(Number(value)+'e'+decimals))+'e-'+decimals);
}