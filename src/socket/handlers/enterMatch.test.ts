import helper from '../../test/test.helper';

const sockets = helper.init();

describe('enterMatch', () => {
  test('success', (done) => {
    let player1Id: '';
    let player2Id: '';
    let matchId: '';
    let p1Ready = false;
    let p2Ready = false;

    sockets.clientSocket1?.onAny((eventName, data) => {
      if (eventName === 'playerCreated') {
        player1Id = data.id;
        sockets.clientSocket2?.emit('newPlayer', { name: 'Shanny' });
      } else if (eventName === 'matchCreated') {
        matchId = data.id;
        sockets.clientSocket2?.emit('enterMatch', { auth: player2Id, matchId });
      } else if (eventName === 'matchReady') {
        p1Ready = true;
      }
    });

    sockets.clientSocket2?.onAny((eventName, data) => {
      if (eventName === 'playerCreated') {
        player2Id = data.id;
        sockets.clientSocket1?.emit('newMatch', { auth: player1Id });
      } else if (eventName === 'matchReady') {
        p2Ready = true;
      }
    });

    sockets.clientSocket1?.emit('newPlayer', { name: 'Eleanore' });

    setTimeout(() => {
      expect(p1Ready).toEqual(true);
      expect(p2Ready).toEqual(true);
      done();
    }, 200);
  });
});
