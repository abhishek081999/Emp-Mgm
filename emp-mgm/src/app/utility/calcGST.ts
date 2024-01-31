import { roundOff } from "./roundOff";

export function calcGST(num: string | number, type: keyType) {
  const withGSTAmount = num ? Number(num) : 0;
  if (Number.isNaN(withGSTAmount) || withGSTAmount == 0) {
    return 0;
  }
  const netAmount = calcNetAmount(withGSTAmount);
  const gst = roundOff(withGSTAmount - netAmount);
  if (type == 'cgst' || type == 'sgst') {
    return roundOff(gst / 2);
  } else if (type == 'igst' || type == 'gst') {
    return gst;
  } else {
    return 0;
  }
}

export function calcNetAmount(num: string | number) {
  const withGSTAmount = num ? Number(num) : 0;
  if (Number.isNaN(withGSTAmount) || withGSTAmount == 0) {
    return 0;
  }
  return roundOff(withGSTAmount / 1.18);
}

type keyType = ('gst' | 'igst' | 'cgst' | 'sgst')