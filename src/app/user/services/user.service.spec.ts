import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { switchMap, tap } from 'rxjs';

import { UserService } from './user.service';
import { worker } from '../../../mocks/browser';

fdescribe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(UserService);
  });

  
  beforeAll(async () => {
    await worker.start();
  });

  afterEach(() => {
    worker.resetHandlers();
  });

  afterAll(() => {
    worker.stop();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should ...', (done) => {
    let initialTotalUsers = 0;

    service.getAllUsers().pipe(
      tap(users => {
        initialTotalUsers = users.length;
      }),
      // Create user david and validate
      switchMap( _ =>
        service.postUser({ name: 'david' })
      ),
      switchMap( davidId =>
        service.getUser(davidId)
      ),
      tap(davidData => {
        expect(davidData.name).toEqual('david');
      }),
      // Update user david and validate
      switchMap( davidData =>
        service.putUser({
          ...davidData,
          name: 'david mod'
        })
      ),
      switchMap( davidId =>
        service.getUser(davidId)
      ),
      tap(davidData => {
        expect(davidData.name).toEqual('david mod');
      }),
      // Create user Lluis and validate
      switchMap( _ =>
        service.postUser({ name: 'Lluis' })
      ),
      switchMap( lluisId =>
        service.getUser(lluisId)
      ),
      tap(lluisData => {
        expect(lluisData.name).toEqual('Lluis');
      }),
      // Delete user Lluis
      switchMap( lluisData =>
        service.deleteUser(lluisData.id)
      ),
      // Check total usuers
      switchMap( _ =>
        service.getAllUsers()
      ),
      tap(users => {
        expect(users.length).toEqual(initialTotalUsers + 1);
      }),
    ).subscribe( _ => {
      done();
    });
  });
});
