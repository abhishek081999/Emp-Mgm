export class Leads {
  _id?: string;
  leadowner?: string;
  leadsource?: string;
  leaddate?: Date;
  leadownername?: string;
  leadassigndate?: Date;
  campaign_name?: string;
  deviceHeld?: string;
  name?: string;
  phone?: string;
  email?: string;
  alternatenumber?: string;
  whatsappnum?: string;
  city?: string;
  dob?: Date;
  occupation?: string;
  telegram?: string;
  gender?: string;
  state?: string;
  experience?: string;
  address?: string;
  pincode?: string;
  gstin?: string;

  level?: string;
  language?: string;

  leadstatus?: string;

  servicetype?: string;
  servicecode?: string;
  servicename?: string;
  prev_servicetype?: string;
  prev_servicecode?: string;
  prev_servicename?: string;

  comment?: string;

  updatedate?: Date;
  callbackdate?: Date;
  uploaddate?: Date;
  retarget?: boolean;

  demogiven?: boolean;
  demodate?: Date;
  demolink?: string;
  isdemoschedule?: boolean;

  creditcard?: boolean;
  ccbank?: string[];
  itrfill?: boolean;
  monthlyincome?: string;
  tats?: LeadTats[];
  isInsigniaProspect?: boolean;
  isLeadPromoted?: boolean;
  leadPromotedTo?: string;
  leadPromotedDate?: Date;
  isDematAccountOpened?: boolean;
  ivr_call_recv_time?: Date;
}

export class Leadstage {
  _id?: string;
  name?: string;
  islaststage?: boolean;
  idealtime?: number;
  maxtime?: number;
  followup?: boolean;
  status?: string[]
  order?: number;
  leadLevelID?: string;
}

export class leadLevel {
  _id?: string;
  name?: string;
  IsautoPromote?: boolean;
  autoPromoteLevel?: string;
  autoPromoteStageName?: string[];
  language?: string;
  order?: number;
  stages?: Leadstage[];
  employee?: string[]
}
export class getLeadLevel {
  _id?: string;
  levels?: leadLevel[]
  employees?: string[]
}

export class CreateEmp {
  _id?: string;
  employee?: string[]
}

export class Onboardstudent {
  _id?: string;
  totalfees?: number;
  paidamount?: number;
  couponcode?: string;
  mode?: string;

  txnid?: string;
  paymentmethod?: string;
  paymentamount?: number;
  paymentdate?: Date;
  paymentimage?: string;
  manualregcomplete?: boolean;
  regcompletetime?: Date;
  manualregdonebyid?: string;
  manualregdonebyname?: string;

  sectxnid?: string;
  secpaymentmethod?: string;
  secpaymentamount?: number;
  secpaymentdate?: Date;
  secpaymentimage?: string;
  secmanualregcomplete?: boolean;
  secregstarttime?: Date;
  secregcompletetime?: Date;
  secmanualregdonebyname?: string;
  secmanualregdonebyid?: string;

  thirdtxnid?: string;
  thirdpaymentmethod?: string;
  thirdpaymentamount?: number;
  thirdpaymentdate?: Date;
  thirdpaymentimage?: string;
  thirdmanualregcomplete?: boolean;
  thirdregstarttime?: Date;
  thirdregcompletetime?: Date;
  thirdmanualregdonebyid?: string;
  thirdmanualregdonebyname?: string;

  studentidgencomplete?: boolean;
  studentidgentime?: Date;
  telegramcomplete?: string;
  telegramtime?: Date;
  studentregdonebyid?: string;
  studentregdonebyname?: string;
  telegramregdonebyid?: string;
  telegramregdonebyname?: string;

  studentid?: string;
  leadid?: string;
  createdAt?: Date;
  comment?: string;

  below_selling_price_reason?: string;
  below_selling_price?: boolean;
  below_selling_approval_by?: string;
  below_selling_approval?: boolean;
  forthregstarttime?: Date;
  forthpaymentamount?: number;
  forthpaymentdate?: Date;
  forthpaymentimage?: string;
  forthpaymentmethod?: string;
  forthtxnid?: string;
  forthmanualregcomplete?: boolean;
  forthregcompletetime?: Date;
  forthmanualregdonebyid?: string;
  forthmanualregdonebyname?: string;
}

export class OnboardingReport {
  Staff_ID?: string;
  Staff_Name?: string;

  Student_id_gen_TAT_Maxtime?: number;
  Student_id_gen_TAT_Mintime?: number;
  Student_id_gen_TAT_Avgtime?: number;
  Student_id_gen_TAT_Ideal?: number;
  Student_id_gen_TAT_Due?: number;
  Student_id_gen_TAT_OverDue?: number;
  Student_id_gen_TAT_Count?: number;

  Telegram_joining_TAT_Maxtime?: number;
  Telegram_joining_TAT_Mintime?: number;
  Telegram_joining_TAT_Avgtime?: number;
  Telegram_joining_TAT_Ideal?: number;
  Telegram_joining_TAT_Due?: number;
  Telegram_joining_TAT_OverDue?: number;
  Telegram_joining_TAT_Count?: number;

  First_ins_TAT_Maxtime?: number;
  First_ins_TAT_Mintime?: number;
  First_ins_TAT_Avgtime?: number;
  First_ins_TAT_Ideal?: number;
  First_ins_TAT_Due?: number;
  First_ins_TAT_OverDue?: number;
  First_ins_TAT_Count?: number;

  Sec_ins_TAT_Maxtime?: number;
  Sec_ins_TAT_Mintime?: number;
  Sec_ins_TAT_Avgtime?: number;
  Sec_ins_TAT_Ideal?: number;
  Sec_ins_TAT_Due?: number;
  Sec_ins_TAT_OverDue?: number;
  Sec_ins_TAT_Count?: number;

  Third_ins_TAT_Maxtime?: number;
  Third_ins_TAT_Mintime?: number;
  Third_ins_TAT_Avgtime?: number;
  Third_ins_TAT_Ideal?: number;
  Third_ins_TAT_Due?: number;
  Third_ins_TAT_OverDue?: number;
  Third_ins_TAT_Count?: number;
  
  Forth_ins_TAT_Maxtime?: number;
  Forth_ins_TAT_Mintime?: number;
  Forth_ins_TAT_Avgtime?: number;
  Forth_ins_TAT_Ideal?: number;
  Forth_ins_TAT_Due?: number;
  Forth_ins_TAT_OverDue?: number;
  Forth_ins_TAT_Count?: number;
}

export class Leadreport {
  leadowner?: string;
  leadownername?: string;
  teamname?: string;
  teamlead?: string;
  teamleadname?: string;
  month?: string;
  assigned?: number;
  unattempted?: number;
  attempted?: number;
  raw_leads?: number;
  in_progress?: number;
  callback?: number;
  converted?: number;
  poor_lead?: number;
  convertion_rate?: number;
  seat_booked?: number;
  demo_given?: number;
  seat_booked_rate?: number;
  campaign_name?: string;
  unassigned?: number;
  date?: string;
}

export class LeadChangelog {
  _id?: string;
  leadid?: string;
  onboardid?: string;
  changes?: LeadChanges[];
}

export class LeadChanges {
  user?: string;
  date?: Date;
  change?: string;
}

export class LeadTats {
  name?: string;
  start?: Date;
  end?: Date;
  /*duration?:string;*/
}
export class FreshLeadAssignCount {
  date?: Date;
  employee_name?: string;
  fresh_lead_count?: number;
  leadOwner?: string;
  team_id?: string;
  team_lead_invid?: string;
  team_lead_name?: string;
  team_name?: string;
}
export class CampaignPerformanceReport {
  _id?: string;
  Seat_Booked?: number;
  Converted?: number;
  course?: number;
  product?: number;
  bookedamount?: number;
  insignia?: number;
  paymentreceived?: number;
  gst?: number;
  due?: number;
}