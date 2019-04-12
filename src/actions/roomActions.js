import {
  CREATE_ROOM,
  JOIN_ROOM,
  START_GAME,
  NEW_MEMBER,
  ADD_VOTE,
  ADD_MESSAGE,
  ADD_STORY,
  DELETE_STORY,
  EDIT_STORY,
  EDIT_HISTORY,
  USER_VOTE,
  FLIP_CARDS,
  DELETE_VOTES,
  END_GAME,
  RESET_TIMER
} from "./types";

function login(payload) {
  return dispatch => {
    if (payload.id)
      dispatch({
        type: JOIN_ROOM,
        payload: { user: payload.user, id: payload.id, hasJoined: true }
      });
    else
      dispatch({
        type: CREATE_ROOM,
        payload: { user: payload.user, hasJoined: true }
      });
    dispatch({
      type: NEW_MEMBER,
      payload: { member: payload.user, voted: false }
    });
  };
}

function startGame(payload) {
  return {
    type: START_GAME,
    payload
  };
}

function addVote(payload) {
  return { type: ADD_VOTE, payload };
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

function addMessage(payload) {
  return {
    type: ADD_MESSAGE,
    payload
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

export default {
  login,
  startGame,
  addVote,
  addStory,
  deleteStory,
  editStory,
  addMessage,
  memberVoted,
  flipCards,
  deleteVotes,
  endGame,
  resetTimer
};
