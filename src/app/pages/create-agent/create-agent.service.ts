// import { groups } from './data';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Role } from './models/role.model';
import { Group } from './models/group.model';
import { Agent } from './models/agent.model';

@Injectable({
    providedIn: "root"
})
export class CreateAgent {
    baseApiUrl2: any = environment.baseApiUrl2;

    constructor(private http: HttpClient) {

    }

    createAgent<Observable>(body: Object) {
        return this.http.post(`${this.baseApiUrl2}agentscreate`, body);
    }
    GetAllRoles<Observable>() {
        return this.http.get<Role[]>(`${this.baseApiUrl2}Role`);
    }
    GetAllGroups<Observable>() {
        return this.http.get<Group[]>(`${this.baseApiUrl2}Group`);
    }
    GetAllAgents() {
        return this.http.get<Agent[]>(`${this.baseApiUrl2}agents`)
    }
    GetAgentbyid(id) {
        return this.http.get(`${this.baseApiUrl2}agentbyid/${id}`)
    }
    AgentUpdate(body: object) {
        return this.http.put(`${this.baseApiUrl2}updateagent`, body);
    }

}