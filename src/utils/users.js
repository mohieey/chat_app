const users = [];

const addUser = ({ id, username, room }) => {
  //Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate the data
  if (!username || !room) return { error: "Username and room are reqiured" };

  //Check for an existing user
  const existingUser = users.find(
    (user) => user.username === username && user.room === room
  );

  //Validate username
  if (existingUser) return { error: "Username is used!" };

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

getUser = (id) => {
  return users.find((user) => user.id === id);
};

getUsersInRoom = (room) => {
  return (userInRoom = users.filter((user) => user.room === room));
};
