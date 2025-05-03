import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

interface UserInfoProps {
  userName: string | null;
  userAvatarUrl: string | null | undefined;
}

const UserInfo: React.FC<UserInfoProps> = ({ userName, userAvatarUrl }) => {
  return (
    <Box display="flex" alignItems="center">
      <Typography variant="subtitle2">{userName}</Typography>
      {userAvatarUrl ? (
        <Avatar src={userAvatarUrl} sx={{ ml: 1 }} />
      ) : (
        <Avatar sx={{ ml: 1 }}>{userName?.charAt(0)}</Avatar>
      )}
    </Box>
  );
};

export default UserInfo;
