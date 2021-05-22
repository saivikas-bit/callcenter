import { SharedService } from './../../shared/shared.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CreateAgent } from './create-agent.service';
import { Group } from './models/group.model';
import { Role } from './models/role.model';
import { Agent } from './models/agent.model';

interface PendingSelection {
  [key: number]: boolean;
}

@Component({
  selector: 'app-create-agent',
  templateUrl: './create-agent.component.html',
  styleUrls: ['./create-agent.component.less']
})
export class CreateAgentComponent implements OnInit {
  closeResult = '';
  public Roles: Role[];
  public pendingSelection: PendingSelection;
  public selectedRoles: Role[];
  public unselectedRoles: Role[];
  public groups: Group[] = []
  public pendingselectiongroup: PendingSelection;
  public selectedGroups: Group[];
  public unselectedGroups: Group[];
  public agents: Agent[] = [];
  public isUpdate: boolean = false;
  public FirstName = '';
  public LastName = '';
  public Mailid = '';
  public PhoneNumber = '';
  public error = '';
  public iserror: boolean = false;
  public ActiveStatus: string;

  constructor(private modalService: NgbModal, private AgentService: CreateAgent, private SharedService: SharedService) {

  }

  ngOnInit() {
    this.SharedService.pageEvent.emit({ pageName: 'CreateAgent' });
    this.getAllAgents();
    this.getRolesGroups();

  }

  public addToSelectedRoles(contact?: Role): void {
    var changeRoles = (contact)
      ? [contact]
      : this.getPendingSelectionFromCollection(this.unselectedRoles);
    this.pendingSelection = Object.create(null);
    this.unselectedRoles = this.removeRolesFromCollection(this.unselectedRoles, changeRoles);
    this.selectedRoles = changeRoles.concat(this.selectedRoles);
  }


  public removeFromSelectedRoles(contact?: Role): void {
    var changeRoles = (contact)
      ? [contact]
      : this.getPendingSelectionFromCollection(this.selectedRoles);
    this.pendingSelection = Object.create(null);
    this.selectedRoles = this.removeRolesFromCollection(this.selectedRoles, changeRoles);
    this.unselectedRoles = changeRoles.concat(this.unselectedRoles).sort(this.sortContactOperator);
  }


  public togglePendingSelection(contact: Role): void {
    this.pendingSelection[contact['id']] = !this.pendingSelection[contact['id']];
  }


  private getPendingSelectionFromCollection(collection: any[]): any[] {
    var selectionFromCollection = collection.filter(
      (contact) => {
        return (contact['id'] in this.pendingSelection);
      });
    return (selectionFromCollection);
  }


  private removeRolesFromCollection(
    collection: any[],
    RolesToRemove: any[]
  ): any[] {
    var collectionWithoutRoles = collection.filter(
      (contact) => {
        return (!RolesToRemove.includes(contact));
      });
    return (collectionWithoutRoles);
  }

  private sortContactOperator(a: Role, b: Role): number {
    return (a['Name'].localeCompare(b['Name']));
  }


  public addToSelectedGroups(contact?: Group): void {
    var changeGroups = (contact)
      ? [contact]
      : this.getPendingSelectionFromCollection(this.unselectedGroups);
    this.pendingselectiongroup = Object.create(null);
    this.unselectedGroups = this.removeRolesFromCollection(this.unselectedGroups, changeGroups);
    this.selectedGroups = changeGroups.concat(this.selectedGroups);
  }

  public removeFromSelectedGroups(contact?: Group): void {
    var changeGroups = (contact)
      ? [contact]
      : this.getPendingSelectionFromCollection(this.selectedGroups);
    this.pendingSelection = Object.create(null);
    this.selectedGroups = this.removeRolesFromCollection(this.selectedGroups, changeGroups);
    this.unselectedGroups = changeGroups.concat(this.unselectedGroups).sort(this.sortContactOperator);
  }


  public toggleSelectionGroup(contact: Group): void {
    this.pendingselectiongroup[contact['id']] = !this.pendingselectiongroup[contact['id']];
  }



  open(content) {
    this.iserror = false;
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.getRolesGroups();
    this.FirstName = '';
    this.LastName = '';
    this.PhoneNumber = '';
    this.Mailid = ''
    this.isUpdate = false;
    this.iserror = false;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  submit(form: NgForm) {
    const FirstName = form.value.firstname;
    const LastName = form.value.lastname;
    const Mailid = form.value.email;
    const PhoneNumber = form.value.number;
    const workerSid = Math.random();
    let ActiveStatus = true;
    if (this.isUpdate) {
      ActiveStatus = form.value.ActiveStatus === "active" ? true : false;
      console.log(ActiveStatus);

    }
    const Roles = this.selectedRoles.map((role) => {
      return role['id']
    })
    const Groups = this.selectedGroups.map((Group) => {
      return Group['id']
    })
    const createAgent: Object = {
      FirstName,
      LastName,
      Mailid,
      PhoneNumber,
      workerSid,
      Roles,
      Groups,
      ActiveStatus
    }
    this.createagent(createAgent);
  }


  createagent(body: Object) {
    console.log(body);

    if (this.isUpdate) {
      return this.AgentService.AgentUpdate(body).subscribe((resp) => {
        if (resp)
          this.getAllAgents();
        this.modalService.dismissAll();
        this.iserror = false;
      })
    }
    this.AgentService.createAgent(body).subscribe((resp) => {
      if ('status' in resp) {
        this.iserror = true;
        return this.error = resp['status']
      }
      if (resp)
        this.getAllAgents();
      this.modalService.dismissAll();
      this.iserror = false;
    });
  }


  getAllAgents() {
    this.AgentService.GetAllAgents().subscribe(res => {
      this.agents = res;
      console.log(this.agents);

    })
  }


  getRolesGroups() {
    this.AgentService.GetAllRoles().subscribe(res => {
      this.Roles = res;
      this.unselectedRoles = this.Roles.slice().sort(this.sortContactOperator);
      this.selectedRoles = [];
      this.pendingSelection = Object.create(null);
    });

    this.AgentService.GetAllGroups().subscribe(res => {
      this.groups = res;
      this.selectedGroups = [];
      this.unselectedGroups = this.groups
      this.pendingselectiongroup = Object.create(null);
    });
  }


  updateAgent(id: number, content) {
    console.log(id);

    this.isUpdate = true;
    this.AgentService.GetAgentbyid(id).subscribe((res) => {
      this.open(content);
      this.FirstName = res['FirstName'];
      this.PhoneNumber = res['PhoneNumber'];
      this.LastName = res['LastName'];
      this.Mailid = res['Mailid'];
      this.selectedRoles = res['SelectedRoles'];
      this.selectedGroups = res['SelectedGroups'];
      this.ActiveStatus = res['ActiveStatus'] === "true" ? 'active' : 'inactive';
      // this.ActiveStatus
      console.log(this.ActiveStatus);

      let SelectedRoleids = this.selectedRoles.map(Role => Role['id']);
      let SelectedGroupsids = this.selectedGroups.map(Group => Group['id']);
      let AllRoles;
      this.AgentService.GetAllRoles().subscribe(res => {
        AllRoles = res;
        this.unselectedRoles = AllRoles.filter(Role => !SelectedRoleids.includes(Role['id']));
      });
      let AllGroups;
      this.AgentService.GetAllGroups().subscribe(res => {
        AllGroups = res;
        this.unselectedGroups = AllGroups.filter(Role => !SelectedGroupsids.includes(Role['id']))
      });
    })

  }

}
