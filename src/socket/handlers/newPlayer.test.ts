import helper from './test.helper';

const sockets = helper.init();

describe('newPlayer', () => {
  test('success', (done) => {
    sockets.clientSocket1?.on('playerCreated', ({ id }) => {
      expect(id).toBeDefined();
      done();
    });

    sockets.clientSocket1?.emit('newPlayer', { name: 'Kiarra' });
  });
});
