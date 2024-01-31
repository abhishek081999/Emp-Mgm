import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Coupon } from '../model/coupon.model';
import { Course, ClassTimings } from '../model/course.model';
import { Review } from '../model/review.model';
import { Reviewcount } from '../model/reviewcount.model';
import { Banner } from '../model/banner.model';
import { Webinar } from '../model/webinar.model';
import { MentorshipSlotLists } from '../model/one-to-one-mentorship.model';

@Injectable({
  providedIn: 'root'
})
export class courseService {



  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  classschedule: ClassTimings[] = []


  constructor(private http: HttpClient) { }

  //course

  postFile(file: FormData) {
    return this.http.post('/api/v2/uploadfile', file, {
      reportProgress: true,
      observe: 'events'
    });
  }

  postCourse(course: Course) {
    return this.http.post<Course>('/api/v2/newcourse', course);
  }

  getClassSchedule(start, end, code, instructor) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    if (code) {
      params = params.append('code', code);
    }
    if (instructor) {
      params = params.append('instructor', instructor);
    }
    return this.http.get<any[]>('/api/v2/course-upcoming-batch', { params: params });
  }

  getAllCourse() {
    return this.http.get<Course[]>('/api/v2/getallcourses');
  }

  getCoursebycode(code) {
    return this.http.get<Course>('/api/v2/getcourse/' + code);
  }

  getCoursebyId(id) {
    return this.http.get<Course>('/api/v2/getcoursebyid/' + id);
  }

  getCoursebyInstructor(id) {
    return this.http.get<Course[]>('/api/v2/getcoursebyinstructor/' + id);
  }

  updateCourse(course: Course, id) {
    return this.http.patch<Course>('/api/v2/updatecourse/' + id, course);
  }

  deleteCourse(id) {
    return this.http.delete<any>('/api/v2/deletecourse/' + id);
  }

  updateCourseFeature(course, id) {
    return this.http.patch<any>('/api/v2/course/approve/' + id, course);
  }

  getcategorynames() {
    return this.http.get('/api/v2/getcategorynames');
  }

  postponedate(details) {
    return this.http.patch('/api/v2/postponedate', details);
  }

  setcoursesc(sc) {
    this.classschedule = sc;
  }

  getcoursesc() {
    return this.classschedule;
  }

  postschedule(schedule) {
    return this.http.post('/api/v2/course-schedule', schedule);
  }

  getclasstimings() {
    return this.http.get<MentorshipSlotLists>('/api/v2/course-schedule/list');
  }

  GetBookedCourseScheduleEvents(id) {
    let params = new HttpParams();
    if (id) {
      params = params.append('course_id', id);
    }
    return this.http.get('/api/v2/course-schedule/booked', { params: params });
  }

  getcourseschedule(cid) {
    return this.http.get('/api/v2/course-schedule/course/' + cid);
  }

  getallschedule() {
    return this.http.get('/api/v2/course-schedule');
  }

  getschedule(id) {
    return this.http.get('/api/v2/course-schedule/schedule/' + id);
  }

  updateSchedule(schedule) {
    return this.http.patch('/api/v2/course-schedule', schedule);
  }


  deleteSchedule(id) {
    return this.http.delete('/api/v2/course-schedule/' + id);
  }

  addHoliday(holiday) {
    return this.http.post('/api/v2/postHoliday', holiday);
  }

  getHoliday() {
    return this.http.get('/api/v2/getHoliday');
  }

  deleteHoliday(id) {
    return this.http.delete('/api/v2/deleteHoliday/' + id);
  }

  // -------> API Postpone Schedules
  postponeSchedule(Pschedule) {     //-----> Post for API Postpone Schedules

    return this.http.post('/api/v2/postpone-schedule', Pschedule);
  }

  getPostponeSchedule(startdate, enddate, course: string, instructor: string, status: string) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); // --> Get API Postpone Schedules
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (course) {
      params = params.append('course', course);
    }
    if (instructor) {
      params = params.append('instructor', instructor);
    }
    if (status) {
      params = params.append('status', status);
    }
    return this.http.get('/api/v2/postpone-schedule', { params: params });
  }

  deletepostponeschedule(id) {        //----> Detele API Postpone Schedules

    return this.http.delete('/api/v2/postpone-schedule/' + id);
  }

  approvelpostponeschedule(data) {
    return this.http.patch<any>('/api/v2/postpone-schedule/approved', data);
  }



  //review

  addcoursereview(review: Review) {
    return this.http.post<Review>('/api/v2/addcoursereviewf', review);
  }

  getreviewscount() {
    return this.http.get<Reviewcount[]>('/api/v2/getreviewcounts');
  }

  getreviewscountteacher() {
    return this.http.get<Reviewcount[]>('/api/v2/getreviewcountsteacher');
  }

  getallreviews() {
    return this.http.get<Review[]>('/api/v2/getallreviews');
  }

  approvereview(id) {
    return this.http.patch<any>('/api/v2/approvereview/' + id, id);
  }

  deletereview(id) {
    return this.http.delete<any>('/api/v2/deletecoursereview/' + id);
  }


  //coupon

  getcouponbyid(id) {
    return this.http.get<Coupon>('/api/v2/getcouponbyid/' + id);
  }

  updatecouponbyid(id, coupon) {
    return this.http.patch<Coupon>('/api/v2/updatecouponbyid/' + id, coupon);
  }

  getallcoupons() {
    return this.http.get<Coupon[]>('/api/v2/getcoupons');
  }

  addcoupon(coupon) {
    return this.http.post('/api/v2/addcoupon', coupon);
  }

  deletecoupon(couponid) {
    return this.http.delete('/api/v2/deletecoupon/' + couponid);
  }

  bulkcouponapprove(coupon) {
    return this.http.post('/api/v2/bulkcouponapprove', coupon);
  }

  updatecoupon(coupon) {
    return this.http.patch('/api/v2/updatecoupon', coupon);
  }


  //webinar

  createwebinar(webinar, type) {
    return this.http.post('/api/v2/createwebinar', webinar, { params: { type: type } });
  }

  getallWebinar() {
    return this.http.get<Webinar[]>('/api/v2/getallwebinar');
  }

  getmywebinar(id) {
    return this.http.get('/api/v2/getmywebinar/' + id);
  }

  updatewebinar(webinar, type) {
    return this.http.patch('/api/v2/updatewebinar', webinar, { params: { type: type } });
  }

  deletewebinar(id, type) {
    return this.http.delete('/api/v2/deletewebinar/' + id, { params: { type: type } });
  }

  deletewebi(id) {
    return this.http.delete('/api/v2/deletewebi/' + id);
  }


  //ad banner

  newAdBanner(ban) {
    return this.http.post<Banner>('/api/v2/adbanner', ban);
  }

  removeAdBanner(id) {
    return this.http.delete<any>('/api/v2/adbanner/' + id);
  }

  getAdBanner() {
    return this.http.get<Banner[]>('/api/v2/adbanner');
  }

  editBanner(banner: Banner) {
    return this.http.patch<Banner>('/api/v2/adbanner', banner);
  }

  calenderschedules() {
    return this.http.get('/api/v2/calender-schedules')
  }

  courseregcount(id) {
    return this.http.get('/api/v2/course-reg-count/' + id)
  }

  instructorschedule( instructor ) {
  let params = new HttpParams();
  // if (startdate) {
  //   params = params.append('startdate', startdate); 
  // }
  // if (enddate) {
  //   params = params.append('enddate', enddate);
  // }
  if (instructor) {
    params = params.append('instructor', instructor);
  }
  return this.http.get<any>('/api/v2/instructor-schedule', { params: params });
}
}
