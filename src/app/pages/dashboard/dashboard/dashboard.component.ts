import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import * as io from 'socket.io-client';
import { SharedService } from 'src/app/shared/shared.service';
import { Ticket } from '../models/ticket.model';
declare const Twilio: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tickSummary: any = {};
  ticketsList: any = [];
  tickets: Ticket[] = [];
  connection: any = null;
  phoneNumber: any = '+44 1227 641187';
  private url = 'http://localhost:3000';
  private socket;
  callData: any;
  workerJS: any = null;
  reservation: any;
  task: any;
  configuration: any;
  worker: any;
  direction: any = null;
  constructor(public dashBoardService: DashboardService, public sharedService: SharedService) {
  }
  toggleIsOnQueue(activitySid) {
    // const activitySid = this.configuration.configuration.twilio.workerAvailableActivitySid;

    console.log(`toogle to activitySid ${activitySid}`);
    let payload = {
      'ActivitySid': activitySid
    };

    // if (isOnQueue) {
    //     payload.RejectPendingReservations = true;
    // }
    this.workerJS.update(payload, function (error, worker) {
      console.log(error);
    });
  };
  complete() {
    this.workerJS.completeTask(this.task.sid, function (error, task) {
      if (error) {
        console.error(error);
        return;
      }

      console.log(`TaskRouter Worker: Completed Task: ${task.sid}`);
    });

  };
  ngOnInit() {
    this.dashBoardService.getAllTickets().subscribe(res => {
      this.tickets = res;
    })
    this.sharedService.pageEvent.emit({ pageName: 'Dashboard' });
    // this.getTicketsSummary();
    // this.getTickets(0, 10, 'id');
    // this.dashBoardService.setupTwilio()
    //   .then((res: any) => {
    //     this.InitializePhone({ token: JSON.parse(res).tokens.access });
    //     // Twilio.Device.setup(res);
    //     console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', JSON.parse(res));
    //     this.configuration = JSON.parse(res);
    //     this.initWorker(res);
    //   });

    // this.socket = io.connect(this.url);
    // this.socket.on('callComming', (data) => {
    //   this.callData = data;
    //   console.log('Call is comming', this.callData);
    // });
    // Twilio.Device.incoming(function (conn) {
    //   console.log('Incoming connection from ' + conn.parameters.From);
    //   // accept the incoming connection and start two-way audio
    //   conn.accept();
    // });
  }


  initWorker(res) {
    this.workerJS = new Twilio.TaskRouter.Worker(JSON.parse(res).tokens.worker);
    if (this.workerJS) {
      this.workerJS.on('ready', (worker) => {
        console.log(`TaskRouter Worker: ${worker.sid} - "${worker.friendlyName}" is ready`);

        // $scope.worker = worker;
      });

      this.workerJS.on('reservation.created', (reservation) => {
        alert('TaskRouter Worker: reservation.created');
        console.log(reservation);
        this.reservation = reservation;
        // $scope.$broadcast('InitializeReservation', { reservation: reservation });
      });
      this.workerJS.on('activity.update', (w) => {
        console.log(`TaskRouter w: activity.update, new activity is ${w.activitySid} - "${w.activityName}"`);

        this.worker = w;
        // this.$apply();
      });
      // this.toggleIsOnQueue();
    }
    this.workerJS.on('reservation.accepted', (reservation) => {
      console.log('TaskRouter Worker: reservation.accepted');
      console.log(reservation);

      this.task = reservation.task;

      /* check if the customer name is a phone number */
      var pattern = /(.*)(\+[0-9]{8,20})(.*)$/;

      if (pattern.test(this.task.attributes.name) === true) {
        this.task.attributes.nameIsPhoneNumber = true;
      }

      // $scope.$broadcast('DestroyReservation');
    });

    this.workerJS.on('reservation.timeout', (reservation) => {
      console.log('TaskRouter Worker: reservation.timeout');
      // this.resetWorkspace();
    });

    // this.workerJS.on('reservation.rescinded', function (reservation) {
    //   console.log('TaskRouter Worker: reservation.rescinded');
    //   this.resetWorkspace();
    // });

    this.workerJS.on('reservation.canceled', function (reservation) {
      console.log('TaskRouter Worker: reservation.cancelled');
      // this.resetWorkspace();
    });

    this.workerJS.on('reservation.rejected', function (reservation) {
      console.log('TaskRouter Worker: reservation.rejected');
      // this.resetWorkspace();
    });

    this.workerJS.on('task.completed', function (reservation) {
      console.log('TaskRouter Worker: task.completed');
      // this.resetWorkspace();
    });



    // this.workerJS.on('token.expired', function () {
    //   console.log('TaskRouter Worker: token.expired');

    //   /* the worker token expired, the agent shoud log in again, token is generated upon log in */
    //   // window.location.replace('/callcenter/');
    // });

    // /* the agent's browser conntected to Twilio */
    this.workerJS.on('connected', function () {
      console.log('TaskRouter Worker: WebSocket has connected');
      // this.UI.warning.worker = null;
      // this.$apply();
    });

    // /* the agent's browser lost the connection to Twilio */
    // this.workerJS.on('disconnected', function () {
    //   console.error('TaskRouter Worker: WebSocket has disconnected');
    //   // this.UI.warning.worker = 'TaskRouter Worker: WebSocket has disconnected';
    //   // this.$apply();
    // });

    // this.workerJS.on('error', function (error) {
    //   console.error('TaskRouter Worker: an error occurred: ' + error.response + ' with message: ' + error.message);
    //   // this.UI.warning.worker = 'TaskRouter Worker: an error occured: ' + error.response + ' with message: ' + error.message;
    //   // this.$apply();
    // });
  }
  InitializePhone(data) {
    console.log('tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnn', data);
    Twilio.Device.setup(data.token, {
      debug: true,
      codecPreferences: ['opus', 'pcmu']
    });

    Twilio.Device.ready((device) => {
      // $scope.debug = 'Ready';

      // $timeout(function () {
      // 	$scope.$apply();
      // });
    });

    Twilio.Device.error((error) => {
      // $scope.debug = 'error: ' + error.code + ' - ' + error.message;
      // $scope.reset();
    });

    Twilio.Device.connect((connection) => {
      this.connection = connection;
      // $scope.debug = 'successfully established call';
      // $scope.UI.state = 'busy';

      // $scope.registerConnectionHandler($scope.connection);

      // $timeout(function () {
      // 	$scope.$apply();
      // });

    });

    Twilio.Device.disconnect(function (connection) {
      // $scope.debug = 'call disconnected';
      // $scope.reset();
    });

    Twilio.Device.offline(function (device) {
      // $scope.debug = 'offline';
      // $scope.reset();
    });

    Twilio.Device.incoming((connection) => {
      // $scope.debug = 'incoming connection from ' + connection.parameters.From;
      // $scope.UI.state = 'busy';
      this.connection = connection;
      this.direction = 'inbound';
      this.phoneNumber = connection.parameters.From;

      connection.accept();

      connection.disconnect(function (connection) {
        // $scope.debug = 'call has ended';
        // $scope.reset();
      });

      // $scope.registerConnectionHandler($scope.connection);
    });
  }
  accept(reservation) {
    console.log('accept reservation with TaskRouter Worker JavaScript SDK', reservation);

    /* depending on the typ of taks that was created we handle the reservation differently */


    if (reservation.task.attributes.channel === 'phone') {
      console.log('reservation for phone arrived: ', reservation)
      reservation.conference(this.configuration.configuration.twilio.callerId, null, null, null, function (error, reservation) {

        if (error) {
          console.error(error);
          return;
        }

      }, { 'EndConferenceOnExit': true, 'EndConferenceOnCustomerExit': true, 'ConferenceRecord': this.configuration.configuration.twilio.voice.recording });

    }

    /* we accept the reservation and initiate a call to the customer's phone number */
    // if (reservation.task.attributes.channel === 'callback') {

    // 	reservation.accept(

    // 		function (error, reservation) {

    // 			if (error) {
    // 				console.error(error);
    // 				return;
    // 			}

    // 			$rootScope.$broadcast('CallPhoneNumber', { phoneNumber: reservation.task.attributes.phone });

    // 		});
    // }
  }
  getTickets(page, pageSize, sortBy) {
    this.dashBoardService.getTickets(page, pageSize, sortBy)
      .then(res => {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', res);
        this.ticketsList = res;
      })
      .catch((err) => { });
  }
  answerCall() {
    console.log('getTicketsSummary tickets------->>>>>>', this.callData.data.CallSid);
    this.dashBoardService.answerCall(this.callData.data.CallSid)
      .then(res => {
        console.log('After accept the call', res);
      }).catch((err) => {

      });
  }
  Phonecall() {
    if (this.connection == null) {
      console.log('connection is null. Initiating the call');
      const params = { To: this.phoneNumber, IsRecord: false };
      this.connection = Twilio.Device.connect(params);
      console.log('Connection after on call---------->>>>>>', this.connection);
    } else {
      this.connection = null;
      Twilio.Device.disconnectAll();
    }
  }
  getTicketsSummary() {
    this.dashBoardService.getTicketsSummary()
      .then(res => {
        this.tickSummary = res;
        console.log('getTicketsSummary tickets------->>>>>>', res);

      })
      .catch((err) => { });
  }
}
