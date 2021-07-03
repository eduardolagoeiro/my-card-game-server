import helper from '../../test/test.helper';

const sockets = helper.init();

describe('endTurn', () => {
  test('success', (done) => {
    let player1Id: '';
    let player2Id: '';
    let matchId: '';
    const dataArray: any[] = [];

    sockets.clientSocket1?.onAny((eventName, data) => {
      if (eventName === 'playerCreated') {
        player1Id = data.id;
        sockets.clientSocket2?.emit('newPlayer', { name: 'Shanny' });
      } else if (eventName === 'matchCreated') {
        matchId = data.id;
        sockets.clientSocket2?.emit('enterMatch', { auth: player2Id, matchId });
      } else if (eventName === 'matchReady') {
        sockets.clientSocket1?.emit('endTurn', { auth: player1Id, matchId });
      } else if (eventName === 'turnEnded') {
        dataArray.push(data);
      }
    });

    sockets.clientSocket2?.onAny((eventName, data) => {
      if (eventName === 'playerCreated') {
        player2Id = data.id;
        sockets.clientSocket1?.emit('newMatch', { auth: player1Id });
      } else if (eventName === 'turnEnded') {
        dataArray.push(data);
      }
    });

    sockets.clientSocket1?.emit('newPlayer', { name: 'Eleanore' });

    setTimeout(() => {
      expect(dataArray.length).toEqual(2);
      dataArray.forEach((data) => {
        expect(data.ref).toEqual('player1');
      });
      done();
    }, 200);
  });
});
