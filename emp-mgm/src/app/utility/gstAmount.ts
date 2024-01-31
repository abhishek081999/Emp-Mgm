import { roundOff } from "./roundOff";

export function gstAmount(value: any, decimals?: number) {
    return roundOff(Number(value) - (Number(value) / 1.18), decimals)
}