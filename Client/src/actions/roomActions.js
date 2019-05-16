import {
  LOGIN,
  LOGIN_SUCCES,
  LOGIN_FAILURE,
  CREATE_ROOM,
  JOIN_ROOM,
  START_GAME,
  NEW_MEMBER,
  ADD_VOTE,
  ADD_STORY,
  DELETE_STORY,
  EDIT_STORY,
  EDIT_HISTORY,
  USER_VOTE,
  FLIP_CARDS,
  DELETE_VOTES,
  END_GAME,
  RESET_TIMER,
  WEBSOCKET_CONNECT
} from "./types";
import { addToast } from "./toastsActions";
import * as Api from "../Api";

function createRoom(payload) {
  let { user, roomName } = payload;
  return async dispatch => {
    dispatch({ type: LOGIN });
    Api.create(user, roomName)
      .then(data => {
        const { roomId, memberId } = data;
        ({ roomName } = data);
        dispatch({
          type: WEBSOCKET_CONNECT,
          payload: `ws://localhost:2345/${roomId}`
        });
        dispatch({
          type: CREATE_ROOM,
          payload: {
            id: roomId,
            roomName,
            user
          }
        });
        dispatch({
          type: NEW_MEMBER,
          payload: { member: user, voted: false, id: memberId }
        });
        dispatch({ type: LOGIN_SUCCES });
      })
      .catch(err => {
        dispatch(addToast({ text: err.message }));
        dispatch({ type: LOGIN_FAILURE });
      });
  };
}

function joinRoom(payload) {
  const { user, roomId } = payload;
  return async dispatch => {
    dispatch({ type: LOGIN });
    Api.join(user, roomId)
      .then(data => {
        const { roomName, roomMembers } = data;
        dispatch({
          type: "WEBSOCKET_CONNECT",
          payload: `ws://localhost:2345/${roomId}`
        });
        dispatch({
          type: JOIN_ROOM,
          payload: {
            id: roomId,
            roomName,
            user,
            members: roomMembers
          }
        });
        dispatch({ type: LOGIN_SUCCES });
      })
      .catch(err => {
        if (err instanceof Error) {
          dispatch(addToast({ text: err.message }));
          dispatch({ type: LOGIN_FAILURE }); // sets isFetching back to false
        } else dispatch({ type: LOGIN_FAILURE, payload: err }); // same + renders error
      });
  };
}

function pushVote(payload) {
  return {
    type: ADD_VOTE,
    payload
  };
}

function newMember(payload) {
  return {
    type: NEW_MEMBER,
    payload
  };
}

function startGame(payload) {
  return dispatch => {
    dispatch({
      type: "WEBSOCKET_SEND",
      payload: { reason: "GAME_STARTED", data: payload }
    });
  };
}

function addVote(payload) {
  return async dispatch => {
    const { user, roomId, voted } = payload;
    Api.vote(user, roomId, voted).catch(err =>
      dispatch(addToast({ text: err.message }))
    );
  };
}

function addStory(payload) {
  return (dispatch, getState) => {
    const { gameHistory } = getState();
    if (gameHistory.activeStory === "")
      dispatch({
        type: EDIT_HISTORY,
        payload: {
          activeStory: { id: 1, text: payload.new.story }
        }
      });
    dispatch({ type: ADD_STORY, payload });
  };
}

function deleteStory(payload) {
  return {
    type: DELETE_STORY,
    payload
  };
}

function editStory(payload) {
  return (dispatch, getState) => {
    const { gameHistory } = getState();
    if (payload.id === gameHistory.activeStory.id)
      dispatch({
        type: EDIT_HISTORY,
        payload: {
          activeStory: { id: gameHistory.activeStory.id, text: payload.value }
        }
      });
    dispatch({ type: EDIT_STORY, payload });
  };
}

function editRoomName(payload) {
  return {
    type: CREATE_ROOM,
    payload: { roomName: payload.value }
  };
}

function memberVoted(payload) {
  return {
    type: USER_VOTE,
    payload
  };
}

function flipCards(payload) {
  return {
    type: FLIP_CARDS,
    payload
  };
}

function deleteVotes(payload) {
  return {
    type: DELETE_VOTES,
    payload
  };
}

function endGame(payload) {
  return {
    type: END_GAME,
    payload
  };
}

function resetTimer(payload) {
  return {
    type: RESET_TIMER,
    payload
  };
}

export {
  createRoom,
  joinRoom,
  newMember,
  startGame,
  addVote,
  pushVote,
  addStory,
  deleteStory,
  editStory,
  editRoomName,
  memberVoted,
  flipCards,
  deleteVotes,
  endGame,
  resetTimer
};
