const POST = "POST";
const DELETE = "DELETE";
const PUT = "PUT";

export default function fetchMethod(method, url, payload, receivedFetch) {
  const fetch = receivedFetch || window.fetch;
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        resolve(data);
      } else {
        reject(data.error.map(e => new Error(e.message)));
      }
    } catch (error) {
      reject(new Error("Check your internet connection"));
    }
  });
}

const vote = (user, storyId, roomId, value) =>
  fetchMethod(POST, "/api/vote", { user, storyId, roomId, value });

const join = (user, roomId) =>
  fetchMethod(POST, "/api/room/join", { user, roomId });

const create = (user, roomName) =>
  fetchMethod(POST, "/api/room/create", { user, roomName });

const start = (date, roomId, storyId) =>
  fetchMethod(POST, "/api/story/start", { date, roomId, storyId });

const clearVotes = (roomId, storyId) =>
  fetchMethod(DELETE, `/api/votes/${roomId}`, { storyId });

const flip = roomId => fetchMethod(PUT, `/api/room/forceflip/${roomId}`, {});

const end = (date, roomId, storyId) =>
  fetchMethod(POST, "api/story/end", { date, roomId, storyId });

const updateRoomName = (roomId, roomName) =>
  fetchMethod(PUT, `/api/room/rename/${roomId}`, { roomName });

const addStory = (story, roomId, active) =>
  fetchMethod(POST, "/api/story/add", { story, roomId, active });

const editStory = (story, storyId, roomId) =>
  fetchMethod(PUT, "/api/story/rename", { story, storyId, roomId });

const resetTimer = (roomId, storyId) =>
  fetchMethod(PUT, "/api/story/reset", { roomId, storyId });

const next = (endedStoryId, roomId) =>
  fetchMethod(PUT, "/api/story/next", { endedStoryId, roomId });

export {
  vote,
  join,
  create,
  start,
  end,
  next,
  clearVotes,
  flip,
  updateRoomName,
  addStory,
  editStory,
  resetTimer
};
