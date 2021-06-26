import * as Client from 'socket.io-client';
import server from '../server';

export default {
  init() {
    const data: {
      clientSocket1: Client.Socket | null;
      clientSocket2: Client.Socket | null;
    } = {
      clientSocket1: null,
      clientSocket2: null,
    };
    let httpServerAddr;

    function getClient() {
      httpServerAddr = server.httpServer.address();

      if (typeof httpServerAddr === 'string' || httpServerAddr === null) {
        throw new Error('AddresNotFound');
      }
      return Client.io(`http://127.0.0.1:${httpServerAddr.port}`, {
        reconnectionDelay: 0,
        forceNew: true,
        reconnectionDelayMax: 0,
        transportOptions: ['websocket'],
      });
    }

    beforeAll(async () => {
      await server.init();
      data.clientSocket1 = getClient();
      data.clientSocket2 = getClient();
    });

    afterAll(async () => {
      await server.close();
    });

    beforeEach((done) => {
      if (!data.clientSocket1?.connected) {
        data.clientSocket1?.connect();
      }
      if (!data.clientSocket2?.connected) {
        data.clientSocket2?.connect();
      }
      setTimeout(() => {
        done();
      }, 100);
    });

    afterEach((done) => {
      if (data.clientSocket1?.connected) {
        data.clientSocket1?.disconnect();
      }
      if (data.clientSocket2?.connected) {
        data.clientSocket2?.disconnect();
      }
      setTimeout(() => {
        done();
      }, 100);
    });

    return data;
  },
  setDone(
    data: {
      clientSocket1: Client.Socket | null;
      clientSocket2: Client.Socket | null;
    } = {
      clientSocket1: null,
      clientSocket2: null,
    },
    done: any
  ) {
    data.clientSocket1?.on('error', done);
    data.clientSocket2?.on('error', done);
  },
};
