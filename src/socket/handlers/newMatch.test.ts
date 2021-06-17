import { Player } from '../../models/Player';
import helper from './test.helper';

const sockets = helper.init();

describe('newMatch', () => {
  test('success', (done) => {
    const p = new Player('Eleanore');

    sockets.clientSocket1?.on('matchCreated', ({ id }) => {
      expect(id).toBeDefined();
      done();
    });

    sockets.clientSocket1?.emit('newMatch', {
      auth: p.id,
    });
  });

  test('fail on PlayerNotFound', (done) => {
    sockets.clientSocket1?.on('error', (err) => {
      expect(err).toEqual('PlayerNotFound');
      done();
    });

    sockets.clientSocket1?.emit('newMatch', {
      auth: '123',
    });
  });
});
