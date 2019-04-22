import {
  CREATE_ROOM,
  START_GAME,
  USER_VOTE,
  NEW_MEMBER,
  DELETE_VOTES,
  RESET_TIMER,
  JOIN_ROOM
} from "../actions/types";

const initialState = {
  room: {}
};

export default function(state = initialState, action) {
  if (action.type === CREATE_ROOM) {
    return { ...state, ...action.payload };
  }
  if (action.type === START_GAME) {
    return { ...state, ...action.payload };
  }
  if (action.type === NEW_MEMBER) {
    return {
      ...state,
      user: action.payload.member,
      members: [...state.members, action.payload]
    };
  }

  if (action.type === JOIN_ROOM) {
    return {
      ...state,
      ...action.payload
    };
  }

  if (action.type === USER_VOTE) {
    const { user } = action.payload;
    const { voted } = action.payload;
    return {
      ...state,
      members: state.members.map(e => (e.member === user ? { ...e, voted } : e))
    };
  }
  if (action.type === DELETE_VOTES) {
    return {
      ...state,
      members: state.members.map(e => ({ ...e, voted: false }))
    };
  }

  if (action.type === RESET_TIMER) {
    return {
      ...state,
      gameStart: new Date()
    };
  }

  return state;
}
