import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FreshLeadAssignCount, LeadChangelog, Leads, Leadstage, OnboardingReport, Onboardstudent } from '../model/leads.model';
import { Regstucount } from '../model/regstucount.model';
import { StateDistricts } from '../model/statedistrict.model';
import { DemoSchedule, DemoScheduleDisp } from '../model/demoschedule.model';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  leadid: string = ''

  constructor(private http: HttpClient) { }

  getallLead() {
    return this.http.get('/api/v2/allleads');
  }

  leadDashboard(staff?) {
    let params = new HttpParams();
    if (staff) {
      params = params.append('staff', staff);
    }
    return this.http.get('/api/v2/leads/lead-dashboard', { params: params });
  }
  getFreshLeadAssignCount(startdate, enddate, team, leadOwner) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate);
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (team) {
      params = params.append('team', team);
    }
    if (leadOwner) {
      params = params.append('leadOwner', leadOwner);
    }
    return this.http.get('/api/v2/fresh-assign-count', { params: params });
  }
  displayLeads(statusFilter, employeeFilter, toDateFilter, fromDateFilter, campaignFilter, stageFilter, sourceFilter, leaduploadToDate, leaduploadFromDate, leadLang, LeadLevel, current_batch, prev_batch,) {
    let params = new HttpParams();
    if (statusFilter && statusFilter.length > 0) {
      statusFilter.forEach(e => params = params.append('status[]', e))
      // params = params.append('status[]', statusFilter);

    } if (employeeFilter && employeeFilter.length > 0) {
      // params = params.append('staff[]', employeeFilter);
      employeeFilter.forEach(e => params = params.append('staff[]', e))

    } if (toDateFilter) {
      params = params.append('assign_end', toDateFilter);
    } if (fromDateFilter) {
      params = params.append('assign_start', fromDateFilter);
    } if (campaignFilter) {
      params = params.append('campaign', campaignFilter);
    } if (stageFilter) {
      params = params.append('stage', stageFilter);
    } if (sourceFilter) {
      params = params.append('source', sourceFilter);
    } if (leaduploadToDate) {
      params = params.append('upload_end', leaduploadToDate);
    } if (leaduploadFromDate) {
      params = params.append('upload_start', leaduploadFromDate);
    } if (leadLang) {
      params = params.append('language', leadLang);
    } if (LeadLevel) {
      params = params.append('level', LeadLevel);
    } if (current_batch) {
      params = params.append('current_batch', current_batch);
    } if (prev_batch) {
      params = params.append('prev_batch', prev_batch);
    }
    return this.http.get('/api/v2/displayleads', { params: params });
  }

  displayspecificLeads(statusFilter, employeeFilter, toDateFilter, fromDateFilter, campaignFilter, stageFilter, sourceFilter, leaduploadToDate, leaduploadFromDate, leadLang, LeadLevel, current_batch, prev_batch, id) {
    let params = new HttpParams();
    if (statusFilter && statusFilter.length > 0) {
      statusFilter.forEach(e => params = params.append('status[]', e))
      // params = params.append('status[]', statusFilter);

    } if (employeeFilter && employeeFilter.length > 0) {
      // params = params.append('staff[]', employeeFilter);
      employeeFilter.forEach(e => params = params.append('staff[]', e))

    } if (toDateFilter) {
      params = params.append('assign_end', toDateFilter);
    } if (fromDateFilter) {
      params = params.append('assign_start', fromDateFilter);
    } if (campaignFilter) {
      params = params.append('campaign', campaignFilter);
    } if (stageFilter) {
      params = params.append('stage', stageFilter);
    } if (sourceFilter) {
      params = params.append('source', sourceFilter);
    } if (leaduploadToDate) {
      params = params.append('upload_end', leaduploadToDate);
    } if (leaduploadFromDate) {
      params = params.append('upload_start', leaduploadFromDate);
    } if (leadLang) {
      params = params.append('language', leadLang);
    } if (LeadLevel) {
      params = params.append('level', LeadLevel);
    } if (current_batch) {
      params = params.append('current_batch', current_batch);
    } if (prev_batch) {
      params = params.append('prev_batch', prev_batch);
    }
    return this.http.get('/api/v2/displayleads/' + id, { params: params });
  }

  leadhistory(phone, email, whatsapp, telegram, alternatenumber) {
    let params = new HttpParams();
    if (email) {
      params = params.append('email', email);
    }
    if (phone) {
      params = params.append('phone', phone);
    }
    if (whatsapp) {
      params = params.append('whatsapp', whatsapp);
    }
    if (telegram) {
      params = params.append('telegram', telegram);
    }
    if (alternatenumber) {
      params = params.append('alternatenumber', alternatenumber);
    }
    return this.http.get('/api/v2/leads/history', { params: params });
  }

  displayLeadstats(start, end, language, level, team) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    if (language) {
      params = params.append('language', language);
    }
    if (level) {
      params = params.append('level', level);
    }
    if (team) {
      params = params.append('team', team);
    }
    return this.http.get('/api/v2/leads/tat-report', { params: params });
  }

  displayindiLeadreports(leadowner, language, level) {
    let params = new HttpParams();
    if (leadowner) {
      params = params.append('leadowner', leadowner);
    }
    if (language) {
      params = params.append('language', language);
    } if (level) {
      params = params.append('level', level);
    }
    return this.http.get('/api/v2/displayindileadsreports', { params: params });
  }

  displayteamsLeadreports(team, language, level) {
    let params = new HttpParams();
    if (team) {
      params = params.append('team', team);
    }
    if (language) {
      params = params.append('language', language);
    } if (level) {
      params = params.append('level', level);
    }
    return this.http.get('/api/v2/displayteamsleadsreports', { params: params });
  }

  displayteammemsLeadreports(team, language, level) {
    let params = new HttpParams();
    if (team) {
      params = params.append('team', team);
    }
    if (language) {
      params = params.append('language', language);
    } if (level) {
      params = params.append('level', level);
    }
    return this.http.get('/api/v2/displayteammemsleadsreports', { params: params });
  }

  displaycampagnLeadreports(campaign, language, level) {
    let params = new HttpParams();
    if (campaign) {
      params = params.append('campaign', campaign);
    }
    if (language) {
      params = params.append('language', language);
    } if (level) {
      params = params.append('level', level);
    }
    return this.http.get('/api/v2/displaycampagnLeadreports', { params: params });
  }

  displaycampagndailyLeadreports(campaign, language, level, start, end) {
    let params = new HttpParams();
    if (campaign) {
      params = params.append('campaign', campaign);
    }
    if (language) {
      params = params.append('language', language);
    } if (level) {
      params = params.append('level', level);
    }
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    return this.http.get('/api/v2/leads/report/campaign/daily', { params: params });
  }

  displaycampagnperformancereports(language, level, campaign, start, end) {
    let params = new HttpParams();
    if (language) {
      params = params.append('language', language);
    } if (level) {
      params = params.append('level', level);
    }
    if (campaign) {
      params = params.append('campaign', campaign);
    }
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    return this.http.get('/api/v2/leads/report/campaign/performance', { params: params });
  }

  displaycampagnmemsLeadreports(campaign, language, level, start, end) {
    let params = new HttpParams();
    if (campaign) {
      params = params.append('campaign', campaign);
    }
    if (language) {
      params = params.append('language', language);
    }
    if (level) {
      params = params.append('level', level);
    }
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    return this.http.get('/api/v2/displaycampagnmemsLeadreports', { params: params });
  }

  displaydailyLeadreports(start, end, lang, level) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    if (lang) {
      params = params.append('language', lang);
    } if (level) {
      params = params.append('level', level);
    }
    return this.http.get('/api/v2/displaydailyLeadreports', { params: params });
  }

  getleadbyid(id) {
    return this.http.get('/api/v2/getleadbyid/' + id);
  }

  uploadLeads(leads: Leads[], level, language) {

    return this.http.post('/api/v2/leads/uploads', { leads: leads, level: level, language: language });
  }

  leadAssign(data) {
    return this.http.patch('/api/v2/leads/assign', data);
  }

  leadPromote(data) {
    return this.http.post('/api/v2/leads/promote', data);
  }

  bulkdelete(ids: string[]) {
    return this.http.post('/api/v2/bulkdeleteleads', ids);
  }

  leadupdate(lead, isStageChanged) {
    let params = new HttpParams();
    if (isStageChanged) {
      params = params.append('isStageChanged', isStageChanged);
    }
    return this.http.patch('/api/v2/updateleads/' + lead._id, lead, { params: params });
  }

  postleadstage(leadstage: Leadstage) {
    return this.http.post<Leadstage>('/api/v2/leadstage', leadstage);
  }

  getleadstatuscount() {
    return this.http.get<Regstucount[]>('/api/v2/getleadstatuscount');
  }

  getleadstage() {
    return this.http.get<Leadstage[]>('/api/v2/leadstage');
  }

  getCampaignList() {
    return this.http.get<string[]>('/api/v2/leads/campaign-list');
  }

  getDispOnboardData(q) {
    let params = new HttpParams();
    if (q) {
      params = params.append('q', q);
    }
    return this.http.get<Onboardstudent[]>('/api/v2/disponboardstudent', { params: params });
  }

  getOnboardData() {
    return this.http.get<Onboardstudent[]>('/api/v2/onboardstudent');
  }

  postOnboardData(data: Onboardstudent, type) {
    return this.http.post<Onboardstudent>('/api/v2/onboardstudent?type=' + type, data);
  }

  onboardingtatreport(start, end, staff) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    if (staff) {
      params = params.append('staff', staff);
    }
    return this.http.get<OnboardingReport[]>('/api/v2/onboardingtatreport', { params: params });
  }

  getleadchangelogs(id) {
    return this.http.get<{
      all: LeadChangelog,
      flowonly: LeadChangelog
    }>('/api/v2/leadchangelogs/' + id);
  }

  postleadchangelogs(data: LeadChangelog[]) {
    return this.http.post('/api/v2/leadchangelogs', data);
  }

  getleadsource() {
    return this.http.get('/api/v2/leadsource');
  }

  postleadsource(data) {
    return this.http.post('/api/v2/leadsource', data);
  }

  getoccupations() {
    return this.http.get('/api/v2/occupations');
  }

  postoccupations(data) {
    return this.http.post('/api/v2/occupations', data);
  }

  getstatewisedistrict() {
    return this.http.get<StateDistricts[]>('/api/v2/getstatewisedistrict');
  }
  getleadsettings() {
    return this.http.get('/api/v2/leadsettings');
  }

  postleadsettings(data) {
    return this.http.post('/api/v2/leadsettings', data);
  }

  getallschedule(user) {
    return this.http.get<DemoScheduleDisp[]>('/api/v2/demoschedule?q=' + user);
  }

  createschedule(data) {
    return this.http.post('/api/v2/demoschedule', data);
  }
  updateschedule(data) {
    return this.http.patch('/api/v2/demoschedule', data);
  }
  deleteschedule(id, webid) {
    return this.http.delete(`/api/v2/demoschedule/${id}/${webid}`);
  }
  getbanks() {
    return this.http.get<string[]>('/api/v2/getbanks');
  }
  updatestageorder(data) {
    return this.http.patch('/api/v2/updatestageorder', data)
  }

  getCurrentTime() {
    return this.http.get('/api/v2/getcurrenttime');
  }

  getLevel() {
    return this.http.get('/api/v2/leads/levels');
  }
  createEmpUnderLevel(data) {
    return this.http.post('/api/v2/leads/levels/employee', data);
  }
  postLevel(data) {
    return this.http.post('/api/v2/leads/levels', data);
  }
  updatelevelorder(data) {
    return this.http.patch('/api/v2/leads/levels/orders', data)

  }

  leadStatusChange(data) {
    return this.http.patch('/api/v2/leads/status', data)
  }

  getLeadUploadLog(campaign, level, lang, start, end, type) {
    let params = new HttpParams();
    if (campaign) {
      params = params.append('campaign', campaign);
    }
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    if (lang) {
      params = params.append('language', lang);
    }
    if (level) {
      params = params.append('level', level);
    }
    if (type) {
      params = params.append('type', type);
    }
    return this.http.get('/api/v2/leads/lead-upload-log', { params: params });
  }

  getLeadTatLog(start, end, stage, leadowner: string[], language, level, team) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    if (stage) {
      params = params.append('stage', stage);
    }
    if (leadowner && Array.isArray(leadowner) && leadowner.length > 0) {
      leadowner.forEach(e => params = params.append('leadowner[]', e))
    }
    if (language) {
      params = params.append('language', language);
    }
    if (level) {
      params = params.append('level', level);
    }
    if (team) {
      params = params.append('team', team);
    }
    return this.http.get('/api/v2/leads/lead-tat-logs', { params: params });
  }


  leadlookup(searchLead) {
    let params = new HttpParams();
    if (searchLead) {
      params = params.append('searchLead', searchLead);
    }
    return this.http.get('/api/v2/leads/lookup', { params: params });
  }
}
