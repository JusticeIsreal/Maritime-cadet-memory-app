import React from "react";
import { Box, NavLink } from "@mantine/core";
import SharedMemories from "./SharedMemories";
import Profile from "./Profile";
// import { IconGauge, IconFingerprint } from "@tabler/icons-react";
function Settings() {
  return (
    <div className="settings">
      <Box w={240}>
        <Profile />
        <NavLink label="Shared momeries" childrenOffset={28} defaultOpened>
          <SharedMemories />
        </NavLink>
        <NavLink label="Registered users" childrenOffset={28} defaultOpened>
          <NavLink label="First child link" />
          <NavLink label="Second child link" />
          <NavLink label="Third child link" />
        </NavLink>
        <NavLink label="Edit Profile" childrenOffset={28}>
          <NavLink label="First child link" />
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
