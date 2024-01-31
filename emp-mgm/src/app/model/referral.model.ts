export class Referrals {
  _id?: string;
  referal_code?: string;
  user_id?: string;
  referred_by?: string;
  join_date?: Date;
  isActive?: boolean;
  referal_link?: string;
  referred_by_name?: string;
  referred_by_invid?: string;
  user_name?: string;
  user_invid?: string;
  invescash_earned?: number;
  invescash_redeemed?: number;
  current_balance?: number;
}
export class Transaction {
  _id?: string;
  details?: string;
  txn_type?: string;
  amount?: number;
  date?: Date;
  type?: string;
  referal_id?: string;
  user_name?: string;
  user_invid?: string;
  ids?: {
    [key: number]: string;
  };
}

export class ReferralSetting {
  name: string;
  referee_joining_bonus: number;
  referrer_joining_bonus: number;
  purchases: Purchases[];
}
export class Purchases {
  min_amount: number;
  max_amount: number;
  max_invescash: number;
  referee_invescash: number;
  referee_eligible: boolean;
  referrer_invescash: number;
  referrer_eligible: boolean
}




