const knex = require("./config.js");

const getRoomMembers = async roomId => {
  return await knex("members")
    .select(["name as member", "id"])
    .innerJoin("roomsMembers", "members.id", "roomsMembers.userId")
    .where({ roomId });
};

const checkUserUniquenessWithinRoom = async (user, roomMembers) => {
  return roomMembers.find(m => {
    const userToCompare = `^${m.member}$`;
    return new RegExp(userToCompare, "i").test(user);
  });
};

const checkRoomAvailability = async id => {
  const [roomId] = await knex("rooms")
    .select()
    .where({ id });
  return roomId;
};

const getRoomName = async roomId => {
  return await knex("rooms")
    .select("name as roomName")
    .where({ id: roomId })
    .first();
};

async function createRoom(owner, roomName) {
  let memberId, roomId;
  await knex.transaction(async trx => {
    [memberId] = await knex("members")
      .transacting(trx)
      .insert({ name: owner });
    [roomId] = await knex("rooms")
      .transacting(trx)
      .insert({ name: roomName });
    await knex("roomsMembers")
      .transacting(trx)
      .insert({ userId: memberId, roomId });
  });
  return { roomId, memberId, roomName };
}

const addUserToRoom = async (user, roomId, roomMembers) => {
  let userId;
  await knex.transaction(async trx => {
    [userId] = await knex("members")
      .transacting(trx)
      .insert({ name: user });
    await knex("roomsMembers")
      .transacting(trx)
      .insert({ userId, roomId });
  });

  roomMembers.push({ member: user, id: userId });
  const { roomName } = await getRoomName(roomId);

  return { user, userId, roomId, roomMembers, roomName };
};

const addMemberVote = async (user, roomId, vote) => {
  const [{ id }] = await knex("members")
    .select("id")
    .innerJoin("roomsMembers", "members.id", "roomsMembers.userId")
    .where({ name: user, roomId });
  await knex("members")
    .update({ vote })
    .where({ id });
  return id;
};

module.exports = {
  getRoomMembers,
  checkUserUniquenessWithinRoom,
  checkRoomAvailability,
  getRoomName,
  createRoom,
  addUserToRoom,
  addMemberVote
};