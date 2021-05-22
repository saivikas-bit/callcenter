import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { LayoutService } from '../layout.service';
import { Router } from '@angular/router';
import { countUpTimerConfigModel, CountupTimerService, timerTexts } from 'ngx-timer';
import { interval } from 'rxjs';
declare const $: any;
declare const Twilio: any;
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  pageName: any = '';
  workerJS: any = null;
  reservation: any;
  task: any;
  configuration: any;
  worker: any;
  direction: any = null;
  connection: any = null;
  phoneNumber: any = '';
  showDailer: any = false;
  activities: any = [];
  currentStatus: any = localStorage.getItem('currentStatus') === null ? 'Offline' : localStorage.getItem('currentStatus');
  dailerScreen: any = 'nocall';
  transfer: any = {
    workers: [],
    to: null,
    isLoading: false
  };
  taskQueue: any = [];
  selectedQueue: any = '';
  isValue: number = 0;
  isCollapsed: any = true;
  mute: any = false;
  testConfig: any;
  hold: any = false;
  loginmailid: String = '';
  constructor(public sharedService: SharedService, public layoutService: LayoutService, private router: Router,
    public countupTimerService: CountupTimerService) {
    this.testConfig = new countUpTimerConfigModel();
    this.testConfig.timerClass = 'test_Timer_class';
    this.testConfig.timerTexts = new timerTexts();
    this.testConfig.timerTexts.hourText = ':'; //default - hh
    this.testConfig.timerTexts.minuteText = ':'; //default - mm
    this.testConfig.timerTexts.secondsText = ' ';
    //default - ss
  }
  logout() {
    this.toggleIsOnQueue(this.configuration.configuration.twilio.workerOfflineActivitySid);
    localStorage.clear();
    window.location.reload();
  }
  clickedButton(event) {
    let temp = event.srcElement.parentNode;
    for (let i = 0; i < temp.childNodes.length; i++) {
      console.log(event.srcElement);
      if (event.srcElement.nodeName === 'BUTTON') {
        event.srcElement.classList.add('active')
        if (temp.childNodes[i].classList.contains('active')) {
          temp.childNodes[i].classList.remove('active');
        }
      }
    }
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
      console.log(worker);

      console.log(error);
    });
  };
  complete() {
    this.workerJS.completeTask(this.task.sid, (error, task) => {
      if (error) {
        console.error(error);
        return;
      }
      this.dailerScreen = 'nocall';
      console.log(`TaskRouter Worker: Completed Task: ${task.sid}`);
    });

  }
  ngOnInit() {
    let value = JSON.parse(localStorage.getItem('userData'));
    this.loginmailid = value.email;

    this.sharedService.pageEvent.subscribe((data) => {
      if (data.pageName) {
        this.pageName = data.pageName;
      }
      if (data.togglePage) {
        this.toggle();
      }
    });
    this.layoutService.setupTwilio()
      .then((res: any) => {
        // console.log(res);
        this.activities = JSON.parse(res).configuration.twilio.activities;
        this.taskQueue = JSON.parse(res).configuration.twilio.taskQueues;
        this.worker = JSON.parse(res).worker;
        this.InitializePhone({ token: JSON.parse(res).tokens.access });
        // Twilio.Device.setup(res);
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', JSON.parse(res));
        this.configuration = JSON.parse(res);
        this.initWorker(res);
      });
  }
  toggle() {
    $('#mySidebar').toggleClass('active');
  }
  toggleMute() {
    this.mute = !this.mute;
    console.log('Phone: set mute: ' + this.mute);
    this.connection.mute(this.mute);
  };
  startTimer() {
    let cdate = new Date();
    cdate.setHours(cdate.getHours());
    this.countupTimerService.startTimer(cdate);
  }
  initWorker(res) {
    this.workerJS = new Twilio.TaskRouter.Worker(JSON.parse(res).tokens.worker);
    if (this.workerJS) {
      // this.toggleIsOnQueue(JSON.parse(res).configuration.twilio.workerAvailableActivitySid);
      this.workerJS.on('ready', (worker) => {
        console.log(`TaskRouter Worker: ${worker.sid} - "${worker.friendlyName}" is ready`);

        // this.worker = worker;
      });

      this.workerJS.on('reservation.created', (reservation) => {
        console.log('reservation created angular', reservation);
        this.dailerScreen = 'callcomming';
        this.showDailer = true;
        this.reservation = reservation;
      });
      this.workerJS.on('activity.update', (w) => {
        console.log(`TaskRouter w: activity.update, new activity is ${w.activitySid} - "${w.activityName}"`);
        this.currentStatus = w.activityName;
        localStorage.setItem('currentStatus', this.currentStatus);
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
      this.dailerScreen = 'oncall';
      this.startTimer();
      // $scope.$broadcast('DestroyReservation');
    });

    this.workerJS.on('reservation.timeout', (reservation) => {
      console.log('TaskRouter Worker: reservation.timeout');
      // this.resetWorkspace();
    });

    this.workerJS.on('reservation.rescinded', (reservation) => {
      console.log('TaskRouter Worker: reservation.rescinded');
    });

    this.workerJS.on('reservation.canceled', (reservation) => {
      this.showDailer = false;
      this.dailerScreen = 'nocall';
      console.log('TaskRouter Worker: reservation.cancelled');
      // this.resetWorkspace();
    });

    this.workerJS.on('reservation.rejected', (reservation) => {
      console.log('TaskRouter Worker: reservation.rejected');
      // this.resetWorkspace();
    });

    this.workerJS.on('task.completed', (reservation) => {
      console.log('TaskRouter Worker: task.completed');
      // this.resetWorkspace();
    });



    this.workerJS.on('token.expired', () => {
      console.log('TaskRouter Worker: token.expired');

      /* the worker token expired, the agent shoud log in again, token is generated upon log in */
      // window.location.replace('/callcenter/');
    });

    // /* the agent's browser conntected to Twilio */
    this.workerJS.on('connected', () => {
      console.log('TaskRouter Worker: WebSocket has connected');
      // this.UI.warning.worker = null;
      // this.$apply();
    });

    // /* the agent's browser lost the connection to Twilio */
    this.workerJS.on('disconnected', () => {
      console.error('TaskRouter Worker: WebSocket has disconnected');
      // this.UI.warning.worker = 'TaskRouter Worker: WebSocket has disconnected';
      // this.$apply();
    });

    this.workerJS.on('error', (error) => {
      console.error('TaskRouter Worker: an error occurred: ' + error.response + ' with message: ' + error.message);
      // this.UI.warning.worker = 'TaskRouter Worker: an error occured: ' + error.response + ' with message: ' + error.message;
      // this.$apply();
    });
  }
  InitializePhone(data) {
    console.log('tokennnnnnnnnnnnnnnnnnnnnnnnnnnnnn', data);
    Twilio.Device.setup(data.token, {
      debug: true,
      enableRingingState: true,
      codecPreferences: ['opus', 'pcmu']
    });

    Twilio.Device.on('ready', (device) => {
      // $scope.debug = 'Ready';

      // $timeout(function () {
      // 	$scope.$apply();
      // });
    });
    Twilio.Device.on('error', (error) => {
      // $scope.debug = 'error: ' + error.code + ' - ' + error.message;
      // $scope.reset();
    });

    Twilio.Device.on('connect', (connection) => {
      console.log(connection);
      this.connection = connection;
      connection.on('accept', () => {
        console.log('call accept1 ');
      });
      connection.on('pending', () => {
        console.log('call pending1 ');
      });
      connection.on('connect', () => {
        console.log('call connecting1 ');
      });
      connection.on('ringing', () => {
        console.log('call ringing1 ');
      });
      connection.on('open', () => {
        console.log('call open1 ');
      });
      connection.on('close', () => {
        console.log('call close1 ');
      });
      connection.on('disconnect', () => {
        this.dailerScreen = 'dailer';
        console.log('call person hangup the call1 ');
      });
      // $scope.debug = 'successfully established call';
      // $scope.UI.state = 'busy';
      // $scope.registerConnectionHandler($scope.connection);

      // $timeout(function () {
      // 	$scope.$apply();
      // });

    });

    Twilio.Device.on('disconnect', (connection) => {
      // $scope.debug = 'call disconnected';
      // $scope.reset();
    });

    Twilio.Device.on('offline', (device) => {
      // $scope.debug = 'offline';
      // $scope.reset();
    });

    Twilio.Device.on('incoming', (connection) => {
      // $scope.debug = 'incoming connection from ' + connection.parameters.From;
      // $scope.UI.state = 'busy';
      this.connection = connection;
      this.mute = false;
      this.hold = false;
      this.direction = 'inbound';
      this.phoneNumber = connection.parameters.From;

      connection.accept();

      connection.disconnect((disconnect) => {
        console.log('Disconnect')
      });

      // $scope.registerConnectionHandler($scope.connection);
    });
  }
  accept(reservation) {
    console.log('accept reservation with TaskRouter Worker JavaScript SDK', reservation);

    /* depending on the typ of taks that was created we handle the reservation differently */


    if (reservation.task.attributes.channel === 'phone') {
      console.log('reservation for phone arrived: ', reservation)
      reservation.conference(this.configuration.configuration.twilio.callerId, null, null, null, (error, reservation) => {

        if (error) {
          console.error(error);
          return;
        }

        this.router.navigate(['/tickets/ticket-view']);
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
  addDigit(digit) {
    if (this.phoneNumber) {
      this.phoneNumber += digit;
    } else {
      this.phoneNumber = `+${digit}`;
    }
    if (this.connection) {
      this.connection.sendDigits(digit);
    }

  };
  callPhoneNumber() {

    this.direction = 'outbound';
    let connection = Twilio.Device.connect({ phone: this.phoneNumber });
    this.connection = connection;
    this.dailerScreen = 'outgoing';
    connection.on('accept', () => {
      console.log('call accept ');
    });
    connection.on('pending', () => {
      console.log('call pending ');
    });
    connection.on('connecting', () => {
      console.log('call connecting ');
    });
    connection.on('ringing', () => {
      console.log('call ringing ');
    });
    connection.on('open', () => {
      console.log('call open ');
    });
    connection.on('close', () => {
      console.log('call close ');
    });
    connection.on('disconnect', () => {
      this.dailerScreen = 'dailer';
      console.log('call person hangup the call ');
    });
  }
  hangUp() {
    Twilio.Device.disconnectAll();
    this.complete();
  }
  hangUpOutgoingCall() {
    Twilio.Device.disconnectAll();
  }
  conferenceData() {
    if (this.direction === 'outbound') {
      this.layoutService.getConferenceData(this.connection.parameters.CallSid)
        .then(res => {
          console.log('Outbound call conference data', res);
          return res;
        });
    } else {
      return {
        conferenceSid: this.task.attributes.conference.sid,
        callSid: this.task.attributes.conference.participants.customer
      };
    }
  }
  toggleTransferPanel() {
    console.log('AAAAAAAAAAAAAAA', this.transfer);
    this.transfer.isLoading = true;
    if (this.taskQueue[0]) {
      this.transfer.workers = this.taskQueue; //assigning queue data to transfer.workers
      // this.transfer.to = this.transfer.workers[i].sid; // assigning queue name to transfer.to
      this.transfer.isLoading = false;
    } else {
      this.transfer.workers = [];
      this.transfer.to = null;
    }
  };
  getConference() {
    this.isCollapsed = !this.isCollapsed;
    const request = {
      to: this.transfer.to, // queue name selected for transferring the call
      workerSid: this.worker.sid
    };
    this.transfer.to = null;
    console.log('Call direction------------------', this.direction);
    if (this.direction === 'outbound') {
      this.layoutService.getConferenceData(this.connection.parameters.CallSid)
        .then(res => {
          console.log('Outbound call conference data', res);
          this.layoutService.transferCall(res.callSid, request)
            .then((response: any) => {
              this.transfer.isLoading = false;
              this.transfer.workers = [];
              this.transfer.to = null;
              setTimeout(() => {
                Twilio.Device.disconnectAll();
              });
              this.complete();
              this.countupTimerService.stopTimer();
              this.dailerScreen = 'nocall';
              this.showDailer = false;
            }).catch((error) => {
              console.log('Phone: transfer failed');
              console.error(error);
            });
        });
    } else {
      this.layoutService.transferCall(this.task.attributes.conference.participants.customer, request)
        .then((response: any) => {
          this.transfer.isLoading = false;
          this.transfer.workers = [];
          this.transfer.to = null;
          setTimeout(() => {
            Twilio.Device.disconnectAll();
          });
          this.complete();
          this.countupTimerService.stopTimer();
          this.dailerScreen = 'nocall';
          this.showDailer = false;
        }).catch((error) => {
          console.log('Phone: transfer failed');
          console.error(error);
        });
    }
  }
  toggleHold() {
    this.hold = !this.hold;
    let request = {
      conferenceSid: '',
      callSid: '',
      hold: this.hold
    };
    if (this.direction === 'outbound') {
      this.layoutService.getConferenceData(this.connection.parameters.CallSid)
        .then(res => {
          request = {
            conferenceSid: res.conferenceSid,
            callSid: res.callSid,
            hold: this.hold
          };
          this.layoutService.holdCall(request)
            .then(res => {
              console.log('call hold', this.hold)
            })
            .catch(err => {
              console.log('Phone: hold failed');
            });
        });
    } else {
      request = {
        conferenceSid: this.task.attributes.conference.sid,
        callSid: this.task.attributes.conference.participants.customer,
        hold: this.hold
      };
      this.layoutService.holdCall(request)
        .then(res => {
          console.log('call hold', this.hold)
        })
        .catch(err => {
          console.log('Phone: hold failed');
        });
    }
  };
}
