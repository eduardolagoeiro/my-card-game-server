interface ISocketHandlerInput {
  auth: string;
  matchId: string;
  socket: any;
  name: string;
  position: {
    x: number;
    y: number;
  };
}

type ISocketHandler = (data: ISocketHandlerInput) => [string, any];
