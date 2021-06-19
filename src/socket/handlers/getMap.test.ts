import helper from './test.helper';

const sockets = helper.init();

describe('getMap', () => {
  test('success', (done) => {
    let player1Id: '';
    let player2Id: '';
    let matchId: '';

    sockets.clientSocket1?.onAny((eventName, data) => {
      if (eventName === 'playerCreated') {
        player1Id = data.id;
        sockets.clientSocket2?.emit('newPlayer', { name: 'Shanny' });
      } else if (eventName === 'matchCreated') {
        matchId = data.id;
        sockets.clientSocket2?.emit('enterMatch', { auth: player2Id, matchId });
      } else if (eventName === 'matchReady') {
        sockets.clientSocket1?.emit('getMap', {
          auth: player1Id,
          matchId,
        });
      } else if (eventName === 'map') {
        expect(data.map).toBeDefined();
        done();
      }
    });

    sockets.clientSocket2?.onAny((eventName, data) => {
      if (eventName === 'playerCreated') {
        player2Id = data.id;
        sockets.clientSocket1?.emit('newMatch', { auth: player1Id });
      }
    });

    sockets.clientSocket1?.emit('newPlayer', { name: 'Eleanore' });
  });
});
