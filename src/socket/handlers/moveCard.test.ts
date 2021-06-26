import helper from '../../test/test.helper';

const sockets = helper.init();

describe('playCard', () => {
  test.only('success', (done) => {
    helper.setDone(sockets, done);

    let player1Id: '';
    let player2Id: '';
    let matchId: '';
    let cardId: '';
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
        cardId = data.hand[0].id;
        sockets.clientSocket1?.emit('playCard', {
          auth: player1Id,
          matchId,
          position,
          cardId,
        });
      } else if (eventName === 'cardPlayed') {
        sockets.clientSocket1?.emit('moveCard', {
          auth: player1Id,
          matchId,
          position: { ...position, y: position.y + 1 },
          cardId,
        });
      } else if (eventName === 'cardMoved') {
        checkData.push(data);
      }
    });

    sockets.clientSocket2?.onAny((eventName, data) => {
      if (eventName === 'playerCreated') {
        player2Id = data.id;
        sockets.clientSocket1?.emit('newMatch', { auth: player1Id });
      } else if (eventName === 'cardMoved') {
        checkData.push(data);
      }
    });

    sockets.clientSocket1?.emit('newPlayer', { name: 'Eleanore' });

    setTimeout(() => {
      expect(checkData.length).toEqual(2);
      checkData.forEach((data) => {
        expect(data.position.x).toEqual(position.x);
        expect(data.position.y).toEqual(position.y + 1);
        expect(data.cardId).toEqual(cardId);
        expect(data.ref).toEqual('player1');
      });
      done();
    }, 100);
  });
});
