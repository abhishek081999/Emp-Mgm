import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseNameFilterPipe } from './course-name-filter.pipe';
import { CourseSearchPipe } from './course-search.pipe';
import { CourseStatusFilterPipe } from './course-status-filter.pipe';
import { DataFilterPipe } from './data-filter.pipe';
import { FormatTimePipe } from './format-time.pipe';
import { InstructorStatusFilterPipe } from './instructor-status-filter.pipe';
import { InstructornamefilterPipe } from './instructornamefilter.pipe';
import { JobsearchPipe } from './jobsearch.pipe';
import { QuizsearchPipe } from './quizsearch.pipe';
import { QuizstatusPipe } from './quizstatus.pipe';
import { SearchPipe } from './search.pipe';
import { Search1Pipe } from './search1.pipe';
import { Search2Pipe } from './search2.pipe';
import { Sort1filterPipe } from './sort1filter.pipe';
import { Sort2filterPipe } from './sort2filter.pipe';
import { SortfilterPipe } from './sortfilter.pipe';
import { StudentFilterPipe } from './student-filter.pipe';
import { TexttourlPipe } from './texttourl.pipe';
import { UrlsanitizePipe } from './urlsanitize.pipe';
import { DiscussionSlicePipe } from './discussion-slice.pipe';



@NgModule({
  declarations: [
    DataFilterPipe,
    StudentFilterPipe,
    FormatTimePipe,
    InstructorStatusFilterPipe,
    CourseStatusFilterPipe,
    CourseNameFilterPipe,
    CourseSearchPipe,
    Sort1filterPipe,
    SortfilterPipe,
    SearchPipe,
    Sort2filterPipe,
    Search1Pipe,
    Search2Pipe,
    TexttourlPipe,
    UrlsanitizePipe,
    JobsearchPipe,
    QuizsearchPipe,
    QuizstatusPipe,
    InstructornamefilterPipe,
    DiscussionSlicePipe,
  ],
  imports: [
    CommonModule
  ],
  exports:[
    DataFilterPipe,
    StudentFilterPipe,
    FormatTimePipe,
    InstructorStatusFilterPipe,
    CourseStatusFilterPipe,
    CourseNameFilterPipe,
    CourseSearchPipe,
    Sort1filterPipe,
    SortfilterPipe,
    SearchPipe,
    Sort2filterPipe,
    Search1Pipe,
    Search2Pipe,
    TexttourlPipe,
    UrlsanitizePipe,
    JobsearchPipe,
    QuizsearchPipe,
    QuizstatusPipe,
    InstructornamefilterPipe,
    DiscussionSlicePipe
  ]
})
export class PipesModule { }
