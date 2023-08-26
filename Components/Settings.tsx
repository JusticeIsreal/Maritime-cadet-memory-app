import React from "react";
import { Box, NavLink } from "@mantine/core";
import SharedMemories from "./SharedMemories";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import Users from "./Users";

function Settings({
  setPostTriger,
  onClose,
}: {
  setPostTriger: any;
  onClose: any;
}) {
  return (
    <div className="settings">
      <Box w={240}>
        <Profile />
        <NavLink label="Update Profile" childrenOffset={28}>
          <EditProfile />
        </NavLink>
        <NavLink label="Momeries" childrenOffset={28}>
          <SharedMemories setPostTriger={setPostTriger} onClose={onClose} />
        </NavLink>
        <NavLink label="Cadets" childrenOffset={28}>
          <Users />
        </NavLink>
      </Box>
    </div>
  );
}

export default Settings;
