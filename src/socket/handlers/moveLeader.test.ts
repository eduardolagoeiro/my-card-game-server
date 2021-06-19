import helper from '../../test/test.helper';

const sockets = helper.init();

describe('moveLeader', () => {
  test('success', (done) => {
    let player1Id: '';
    let player2Id: '';
    let matchId: '';
    const position = { x: 3, y: 1 };
    const checkData: any[] = [];

    sockets.clientSocket1?.onAny((eventName, data) => {
      if (eventName === 'playerCreated') {
        player1Id = data.id;
        sockets.clientSocket2?.emit('newPlayer', { name: 'Shanny' });
      } else if (eventName === 'matchCreated') {
        matchId = data.id;
        sockets.clientSocket2?.emit('enterMatch', { auth: player2Id, matchId });
      } else if (eventName === 'matchReady') {
        sockets.clientSocket1?.emit('moveLeader', {
          auth: player1Id,
          matchId,
          position,
        });
      } else if (eventName === 'leaderMoved') {
        checkData.push(data);
      }
    });

    sockets.clientSocket2?.onAny((eventName, data) => {
      if (eventName === 'playerCreated') {
        player2Id = data.id;
        sockets.clientSocket1?.emit('newMatch', { auth: player1Id });
      } else if (eventName === 'leaderMoved') {
        checkData.push(data);
      }
    });

    sockets.clientSocket1?.emit('newPlayer', { name: 'Eleanore' });

    setTimeout(() => {
      expect(checkData.length).toEqual(2);
      checkData.forEach((data) => {
        expect(data.position.x).toEqual(position.x);
        expect(data.position.y).toEqual(position.y);
        expect(data.ref).toEqual('player1');
      });
      done();
    }, 100);
  });
});
