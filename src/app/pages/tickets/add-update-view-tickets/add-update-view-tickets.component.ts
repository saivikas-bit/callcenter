import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { TicketsService } from '../tickets.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { TicketHistory } from './models/tickethistory.model';
declare let $: any;

@Component({
  selector: 'app-add-update-view-tickets',
  templateUrl: './add-update-view-tickets.component.html',
  styleUrls: ['./add-update-view-tickets.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddUpdateViewTicketsComponent implements OnInit {
  @ViewChild('f', { static: true }) form: NgForm;
  tickethistory: TicketHistory[] = [];
  isUpdate: boolean = false;
  assignedto: any = [];
  selectedassigned: any = [];
  dropdownSettings: IDropdownSettings = {};
  closeDropdownSelection = false;
  disabled = false;
  assignmentgroup: Array<String> = [];
  priority: any = [];
  urgency: any = []
  selectedurgency: any = [];
  selectedpriority: any = [];
  selectedgroup: any[] = [];
  createdDate: any;
  updatedDate: any;
  followupdate: any;
  statusselected: any = [];
  status: any[] = ['open', 'inprogress', 'hold', 'closed'];
  detial: any;
  desc: any;
  latestupdate: any;
  ReportedBy: any;
  urlid: any;
  ticketid: any;
  updatedby: any;
  constructor(public sharedService: SharedService, public ticketsService: TicketsService, public datepipe: DatePipe, public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      if (res['id']) {
        this.urlid = res['id'];
        this.isUpdate = true;
        this.prefillfeild(res['id']);
      }
    })
    if (!this.isUpdate) {
      this.ticketsService.getticketid().subscribe((res) => {
        this.ticketid = res['ticketnumber'];
      })
    }
    let value = JSON.parse(localStorage.getItem('userData'));
    this.updatedby = value['firstName']
    if (!this.isUpdate) {
      this.selectedassigned.push(value['email']);
      this.selectedgroup.push('Support_team1');
      this.selectedpriority.push('priority3');
      this.selectedurgency.push('low');
      this.statusselected.push('open')
      const now = moment();
      this.createdDate = this.datepipe.transform(now, 'medium').toString();
      this.updatedDate = this.createdDate
    }
    const now = moment().add(2, 'days').toDate();
    this.followupdate = { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
    this.sharedService.pageEvent.emit({ pageName: 'Add ticket', togglePage: true });
    this.dropdownSettings = {
      singleSelection: true,
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    }
    this.ticketsService.getUsersList().subscribe((res: any[]) => {
      this.assignedto = res.map((item) => {
        return item['Mailid'];
      })
      this.assignedto.push(value['email'])

    })
    console.log(this.selectedassigned);
    this.ticketsService.getallgroups().subscribe((res: any[]) => {
      this.assignmentgroup = res.map((item) => {
        return item['Name'];
      })
    })
    this.ticketsService.getpriorityList().subscribe((res: any[]) => {
      this.priority = res.map((item) => {
        return item['Name'];
      })
    })
    this.ticketsService.geturgencyList().subscribe((res: any[]) => {
      this.urgency = res.map((item) => {
        return item['Name'];
      })
    })

  }
  prefillfeild(id) {
    return this.ticketsService.getTicketByID(id).subscribe((res) => {
      console.log(res);

      setTimeout(() => {
        this.form.form.patchValue({
          assignedto: [res['Assignedto']],
          assignmentgroup: [res['AssignmentGroup']],
          status: [res['RequestStatus']],
          priority: [res['Priority']],
          urgency: [res['Urgency']]
        })
        let datecreate = res['CreatedDate'];
        let dateupdated = res['UpdatedDate']
        this.createdDate = this.datepipe.transform(datecreate, 'medium').toString();
        this.updatedDate = this.datepipe.transform(dateupdated, 'medium').toString();
        this.detial = res['RequestDetail'];
        this.desc = res['RequestDescription'];
        this.latestupdate = res['LatestUpdate'];
        this.ReportedBy = res['ReportedBy']
        this.ticketid = res['RequestId']
        this.ticketsService.gettickethistory(this.ticketid).subscribe(res => {
          // console.log(res)
          this.tickethistory = res;

        })
      }, 3);
    })
  }
  toggleClass() {
    $('#chatDiv').toggleClass('toggleChat');
    $('#chatSideBar').toggleClass('toggleSideBar');
    this.sharedService.pageEvent.emit({ togglePage: true });
  }

  submit(value) {
    const ticket: Object = {
      ticketid: this.ticketid,
      reportedby: value.reportedby,
      assignedto: value.assignedto[0],
      priority: value.priority[0],
      group: value.assignmentgroup[0],
      urgency: value.urgency[0],
      detail: this.detial,
      desc: this.desc,
      latestupdate: value.latestupdate,
      status: value.status[0],
      updatedby: this.updatedby
    }
    if (this.isUpdate) {
      console.log(ticket);

      return this.ticketsService.updateTicket(ticket, this.urlid).subscribe(res => {
        this.router.navigate(['/dashboard/dashboard-view'])
      })

    }
    console.log(ticket);

    this.ticketsService.createTicket(ticket).subscribe((res) => {
      this.router.navigate(['/dashboard/dashboard-view'])
    })
  }
  toggleCloseDropdownSelection() {
    this.closeDropdownSelection = !this.closeDropdownSelection;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { closeDropDownOnSelection: this.closeDropdownSelection });
  }
  onuserselect(event) {
    this.ticketsService.getgroupsusers(event).subscribe(res => {
      this.assignmentgroup = res.map(group => group['Name'])
    })

  }
  ongroupselect(event) {
    this.ticketsService.getusersgroups(event).subscribe(res => {
      this.assignedto = res.map(user => user['Mailid']);
    })
  }
}
