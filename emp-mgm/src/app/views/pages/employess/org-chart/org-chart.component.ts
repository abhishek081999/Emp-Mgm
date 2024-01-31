import { Component, ElementRef, OnInit, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { OrgChart } from 'd3-org-chart';
import { Employee } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import * as d3 from "d3";

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss']
})
export class OrgChartComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('chartContainer') chartContainer: ElementRef;
  chart = new OrgChart();
  employeeList: Employee[] = [];
  userDetails


  constructor(
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService) { }

  ngOnInit(): void {
    this.userDetails = this.employeeService.getUserPayload();
    this.refresh();
  }

  refresh() {
    this.employeeService.getOrgChart().toPromise()
      .then(res => {
        this.employeeList = res as Employee[];
        this.updateChart();
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  ngAfterViewInit() {
    if (!this.chart) {
      this.chart = new OrgChart();
    }
    this.updateChart();
  }


  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    if (!this.employeeList) {
      return;
    }
    if (!this.chart) {
      return;
    }
    this.chart
      .container(this.chartContainer.nativeElement)
      .data(this.employeeList)
      .nodeWidth(d => 300)
      .nodeHeight(d => 145)
      .initialZoom(0.7)
      .childrenMargin((d) => 40)
      .compactMarginBetween((d) => 20)
      .compactMarginPair((d) => 80)
      .buttonContent(({ node, state }) => {
        return `<div style="border-radius:5px;padding:3px;font-size:14px;margin:auto auto;background-color:lightgray;border: 1px solid #darkgray"> 
        <span style="font-size:14px">${node.children
            ? `<i class="feather icon-chevron-up"></i>`
            : `<i class="feather icon-chevron-down"></i>`
          }</span> ${node.data._directSubordinates}  </div>`;
      })
      .linkUpdate(function (d, i, arr) {
        d3.select(this)
          .attr('stroke', (d) =>
            d.data._upToTheRootHighlighted ? '#0089FE' : '#D3D3D3'
          )
          .attr('stroke-width', (d) =>
            d.data._upToTheRootHighlighted ? 2 : 2
          );

        if (d.data._upToTheRootHighlighted) {
          d3.select(this).raise();
        }
      })
      .nodeContent(function (d, i, arr, state) {
        return `<div class="p-1 rounded-top" style="background-color:${d.data.dept_color};"><p class="text-white" align="center"><b>${d.data.department}</b></p></div>
        <div class="card empCard" style="border: 2px solid ${d.data.dept_color};border-radius: 0px 0.25px;">
        <div class="p-2">
          <div class="d-flex align-items-center">
            <figure class="mb-0 me-2 pr-2"><img src="${d.data.profile_image}"
                alt="user" height="80px" width="80px" class="rounded-circle">
            </figure>
            <div class="d-flex justify-content-between flex-grow-1">
              <div>
                <h5 class="text-body fw-bolder">${String(d.data.fullName).toUpperCase()}</h5>
                <p class="text-muted">${d.data.designation}</p>
                <p class="text-muted">${d.data.id}</p>
                <p class="text-muted">${d.data.team}</p>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <p class="text-muted"><i class="feather icon-user mr-2"></i> Manages:  ${d.data._directSubordinates} </p>  
            <p class="text-muted"><i class="feather icon-users mr-2"></i> Oversees: ${d.data._totalSubordinates}</p>   
          </div>
        </div>
      </div>`;
      })
      .nodeUpdate(function (d, i, arr) {
        d3.select(this)
          .select('.node-rect')
          .attr('stroke', (d) =>
            d.data._highlighted || d.data._upToTheRootHighlighted
              ? '#0089FE'
              : 'none'
          )
          .attr(
            'stroke-width',
            d.data._highlighted || d.data._upToTheRootHighlighted ? 3 : 2
          );
      })
      .onNodeClick(d=>this.hierarchy(d))
      .render();
  }

  fit() {
    this.chart.fit()
  }

  center() {
    this.chart.setHighlighted(this.userDetails.invid).setCentered(this.userDetails.invid).render();
  }

  hierarchy(id) {
    this.chart.clearHighlighting();
    this.chart.setUpToTheRootHighlighted(id).setCentered(id).render().fit();
  }

  comp = false
  compact() {
    this.chart.compact(this.comp).render().fit();
    this.comp = !this.comp;
  }

  fullscreen() {
    this.chart.fullscreen('body')
  }

  exportImg() {
    // this.chart.exportImg()
    this.chart.exportImg({ full: true })
  }

  expandAll() {
    this.chart.expandAll().fit()
  }

  colapseAll() {
    this.chart.collapseAll().fit()
  }

  zoomout() {
    this.chart.zoomOut()
  }

  zoomin() {
    this.chart.zoomIn()
  }


}
