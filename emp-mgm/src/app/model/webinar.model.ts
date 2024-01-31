export class Webinar{
    uuid: string; 
    id: number;
    host_id: string;
    topic: string; //max 200
    start_time: string; //date-time
    duration: number; //minutes
    created_at: string;
    join_url?: string;
    password: string; //max 10
    settings: {
      host_video: Boolean; //true
      participant_video: Boolean; //false
      cn_meeting:Boolean;
      in_meeting:Boolean;
      join_before_host:Boolean;
      jbh_time:number;
      mute_upon_entry:Boolean;
      watermark:Boolean;
      use_pmi:Boolean;
      approval_type: number; //0
      audio: string; //both,telephony,voip
      auto_recording: string; //local,cloud,none
      enforce_login: Boolean;
      enforce_login_domains: string;
      alternative_hosts: string;
      close_registration: Boolean;
      show_share_button: Boolean;
      allow_multiple_devices: Boolean;
      registrants_confirmation_email:Boolean;
      waiting_room:Boolean;
      global_dial_in_countries: Array<string>;
      request_permission_to_unmute_participants:Boolean;
      registrants_email_notification:Boolean;
      meeting_authentication:Boolean;
      encryption_type:string;
    }
    invesScheduleID?:string;
    leadid?:string;
    account?:string;
    webinar_type?:string;
  }