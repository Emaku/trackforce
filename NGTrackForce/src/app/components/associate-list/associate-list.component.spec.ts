import {ComponentFixture, TestBed, async} from '@angular/core/testing';

import {AssociateListComponent} from './associate-list.component';
import {AssociateService} from '../../services/associate-service/associate.service';
import {ClientService} from '../../services/client-service/client.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule} from '@angular/forms';
import {AssociateSearchByTextFilter} from '../../pipes/associate-search-by-text-filter/associate-search-by-text-filter.pipes';
import {NavbarComponent} from '../navbar/navbar.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HomeComponent} from '../home/home.component';
import {ChartsModule} from 'ng2-charts';
import {AuthenticationService} from '../../services/authentication-service/authentication.service';
import {RequestService} from '../../services/request-service/request.service';
import {User} from '../../models/user.model';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { Curriculum } from '../../models/curriculum.model';
import { Batch } from '../../models/batch.model';
import { Associate } from '../../models/associate.model';
import { MarketingStatus } from '../../models/marketing-status.model';
import { AssociateSearchByClientPipe } from '../../pipes/associate-search-by-client-pipe/client-pipe.pipe';
import { AssociateSearchByStatusPipe } from '../../pipes/associate-search-by-status-pipe/status-pipe.pipe';

describe('AssociateListComponent', () => {
  let component: AssociateListComponent;
  let fixture: ComponentFixture<AssociateListComponent>;
  const testAuthService: AuthenticationService = new AuthenticationService(null, null, null);

  // setup service mocks
   beforeAll(() => {
    let user = new User("mockUser", "mockPassword", 1, 0, 0, "mockToken");
    // user.token = "mockToken";
    // user.username = "mockUser";
    // user.role = 1;
    spyOn(testAuthService, 'getUser').and.returnValue(user);  // needed by navbar
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AssociateListComponent,
        AssociateSearchByTextFilter,
        NavbarComponent,
        HomeComponent,
        NavbarComponent,
        AssociateSearchByClientPipe,
        AssociateSearchByStatusPipe
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule,
        ChartsModule
      ],
      providers: [
        AssociateService,
        ClientService,
        RequestService,
        {provide: AuthenticationService, useValue: testAuthService}
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    let mockBatch:Batch = new Batch();
    mockBatch.id = 100;
    mockBatch.batchName = 'mockBatchName';
    
    let batches:Batch[] = [mockBatch];
    let mockUser:User = new User('mockUser', 'pass', 0, 0);


    let mockCurriculum:Curriculum = new Curriculum();
    mockCurriculum.id = 100;
    mockCurriculum.name = 'JTA'; 
    mockCurriculum.batches = batches;

    mockBatch.curriculumName = mockCurriculum;

    let associate1:Associate = new Associate('first','last',mockUser);
    let associate2:Associate = new Associate('first','last',mockUser);
    let associate3:Associate = new Associate('first','last',mockUser);
    
    let marketingStatus:MarketingStatus = new MarketingStatus(1, 'status');
    
    associate1.marketingStatus = marketingStatus;
    associate2.marketingStatus = marketingStatus;
    associate3.marketingStatus = marketingStatus;

    let mockBatch1:Batch = new Batch();
    let mockBatch2:Batch = new Batch();
    let mockBatch3:Batch = new Batch();

    let curriculum1:Curriculum = new Curriculum();
    let curriculum2:Curriculum = new Curriculum();
    let curriculum3:Curriculum = new Curriculum();

    curriculum1.name = 'mockCurriculum';
    curriculum2.name = 'mockCurriculum';
    curriculum3.name = 'mockCurriculum';

    mockBatch1.curriculumName = curriculum1;
    mockBatch2.curriculumName = curriculum2;
    mockBatch3.curriculumName = curriculum3;

    associate1.batch = mockBatch1;
    associate2.batch = mockBatch2;
    associate3.batch = mockBatch3;

    let associates:Associate[] = [associate1,associate2,associate3];

    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('currentAssociates', JSON.stringify(associates));

    fixture = TestBed.createComponent(AssociateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have a curriculums dropdown', () => {
    expect(component.curriculums).toBeTruthy();
  });

  it('can you update if role = 1 or 3 or 4', () => {
    component.canUpdate = true;
    expect(component.canUpdate).toBeTruthy();
  });

  it('searchByClient is a client if CliOrCur = "client"', () => {
    component.searchByClient = 'client name';
    expect(component.searchByClient).toBeTruthy();
  });

  it('searchByCurriculum is a curriculum if CliOrCur = "curriculum"', () => {
    component.searchByCurriculum = 'curriculum name';
    expect(component.searchByCurriculum).toBeTruthy();
  });

  it('searchByStatus is a mapping + a status if CliOrCur exists', () => {
    component.searchByStatus = 'mapping + status';
    expect(component.searchByStatus).toBeTruthy();
  });

  it('in getNAssociates() associates should be data', () => {
    component.associates = [this.associate1];
    expect(component.associates).toBeTruthy();
  });

  it('in getNAssociates() should add curriculums when associate batch and curriculum name aren\'t null', () => {
    component.curriculums.add(this.curriculum1);
    component.curriculums.add(this.curriculum2);
    component.curriculums.add(this.curriculum3); 
    expect(component.curriculums).toBeTruthy();
  })

  it('in getNAssociates() should delete "" curriculums', () => {
    expect(component.curriculums['']).toBeFalsy();
  });

  it('in getNAssociates() should delete "null" curriulums', () => {
    expect(component.curriculums['null']).toBeFalsy();
  });

  it('in getAllAssociates() should be length = 0', () => {
    component.associates = [];
    component.associates.length = 0;
    expect(component.associates.length).toEqual(0);
  });

  it('in getAllAssociates() associates should equal data', () => {
    component.associates = [this.associate1, this.associate2];
    expect(component.associates).toBeTruthy();
  });

  it('in getAllAssociates() should add curriculums when associate batch and curriculum name aren\'t null', () => {
    component.curriculums.add(this.curriculum1);
    component.curriculums.add(this.curriculum2);
    component.curriculums.add(this.curriculum3); 
    expect(component.curriculums).toBeTruthy();
  });

  it('in getAllAssociates() should delete "" curriculums', () => {
    expect(component.curriculums['']).toBeFalsy();
  });

  it('in getAllAssociates() should delete "null" curriulums', () => {
    expect(component.curriculums['null']).toBeFalsy();
  });

  it('in getAllAssociates() isDataReady should be true', () => {
    component.isDataReady = true;
    expect(component.isDataReady).toBeTruthy();
  })

  it('in getClientNames() clients should be data', () => {
    component.clients = [this.client1, this.client2];
    expect(component.clients).toBeTruthy();
  });

  it('in updateAssociates() if updateVerification is "" then make it 0', () => {
    component.updateVerification = '0';
    expect(component.updateVerification).toBeTruthy();
  });

  it('in updateAssociates() if updateStatus is "" then make it 0', () => {
    component.updateStatus = '0';
    expect(component.updateStatus).toBeTruthy();
  });

  it('in updateAssociates() if updateClient is "" then make it 0', () => {
    component.updateClient = '0';
    expect(component.updateClient).toBeTruthy();
  });

  it('in updateAssociates() updated boolean should be true', () => {
    component.updated = true;
    expect(component.updated).toBeTruthy();
  });

});
