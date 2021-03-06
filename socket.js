import io from 'socket.io-client';
import store from './store';
import { addResponse, addLiveQuestion } from './reducers'

const socket = io("http://172.16.21.170:8080");
// exp://localhost:19002

socket.on('connect', () => {
  console.log('I am now connected to the server!');

  socket.on('new-liveResponse', liveResponse => {
    store.dispatch(addResponse(liveResponse));
  });

  socket.on('new-liveQuestion', liveQuestion => {
    store.dispatch(addLiveQuestion(liveQuestion));
  });

});

export default socket;
