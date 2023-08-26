import React from "react";
import { Box, NavLink } from "@mantine/core";
import SharedMemories from "./SharedMemories";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
// import { IconGauge, IconFingerprint } from "@tabler/icons-react";
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
        <NavLink label="Edit Profile" childrenOffset={28}>
          <EditProfile />
        </NavLink>
        <NavLink label="Your momeries" childrenOffset={28}>
          <SharedMemories setPostTriger={setPostTriger} onClose={onClose} />
        </NavLink>
        <NavLink label="Admin" childrenOffset={28}>
          <NavLink label="First child link" />
        </NavLink>
        {/* <NavLink label="Edit Profile" /> */}
      </Box>
    </div>
  );
}

export default Settings;
