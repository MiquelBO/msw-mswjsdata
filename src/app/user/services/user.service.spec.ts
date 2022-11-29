import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { catchError, forkJoin, of, switchMap } from 'rxjs';

import { UserService } from './user.service';
import { worker } from '../../../mocks/browser';
import { User } from '../models/user';

describe('UserService', () => {
  let service: UserService;
  let davidUser: User;

  beforeAll(async () => {
    await worker.start();
  });

  afterAll(() => {
    worker.stop();
  });

  beforeEach((done) => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(UserService);

    service.postUser({ name: 'david' }).pipe(
      switchMap( id => 
        service.getUser(id)
      )
    ).subscribe( data => {
      davidUser = data;
      done();
    });
  });

  afterEach(() => {
    worker.resetHandlers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a user when postUser is called, and get it when getUser and getAllUsers methods are called', (done) => {
    forkJoin([
      service.getUser(davidUser.id),
      service.getAllUsers()
    ]).subscribe( ([userData, users]) => {
      expect(
        userData.name
      ).toEqual(davidUser.name);
      expect(
        users.find(user => user.id === davidUser.id)?.name
      ).toEqual(davidUser.name);

      done();
    });
  });

  it('should update a user when postUser is called', (done) => {
    let newUserName = 'david mod';

    service.putUser({
      ...davidUser,
      name: newUserName
    }).pipe(
      switchMap( _ =>
        forkJoin([
          service.getUser(davidUser.id),
          service.getAllUsers()
        ])
      )
    ).subscribe( ([userData, users]) => {
      expect(
        userData.name
      ).toEqual(newUserName);
      expect(
        users.find(user => user.id === davidUser.id)?.name
      ).toEqual(newUserName);

      done();
    });
  });

  it('should delete a user when deleteUser is called', (done) => {
    service.deleteUser(davidUser.id).pipe(
      switchMap( _ =>
        forkJoin([
          service.getUser(davidUser.id).pipe(catchError(error => of(undefined))),
          service.getAllUsers()
        ])
      )      
    ).subscribe( ([userData, users]) => {
      expect(
        userData
      ).toBeUndefined();
      expect(
        users.find(user => user.id === davidUser.id)
      ).toBeUndefined();

      done();
    }); 
  });

});
