import React from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export type NotificationItem = {
    id: number;
    message: string;
    read: boolean;
    title: string;
    details: {
        device: string;
        location: {
            city: string;
            country: string;
            coordinates: {
                lat: number;
                lon: number;
            };
        };
        ip: string;
        loginTime: string;
    };
};

interface NotificationsListProps {
    notifications: NotificationItem[];
    onItemClick: (id: number) => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
    notifications,
    onItemClick,
}) => {
    return (
        <Box sx={{ width: 350, maxHeight: 400, overflowY: "auto", p: 1 }}>
            <Typography variant="h6" sx={{ px: 1, mb: 1 }}>
                Notifications
            </Typography>
            <List disablePadding>
                {notifications.map((notification) => (
                    <ListItem
                        key={notification.id}
                        component="button"
                        onClick={() => onItemClick(notification.id)}
                        sx={{
                            bgcolor: notification.read ? "background.paper" : "#f0f0f0ff",
                            borderRadius: 1,
                            mb: 0.5,
                            alignItems: "flex-start",
                            border: "none",
                            textAlign: "left",
                            width: "100%",
                            padding: 1,
                            cursor: "pointer",
                        }}
                    >
                        <ListItemText
                            primary={
                                <Typography variant="body2" color="text.primary">
                                    {notification.message}
                                </Typography>
                            }
                        />
                        {!notification.read && (
                            <FiberManualRecordIcon
                                color="primary"
                                sx={{ fontSize: 10, mt: 0.5, ml: 1 }}
                            />
                        )}
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: "pointer", fontWeight: 500 }}
                >
                    See all recent activity
                </Typography>
            </Box>
        </Box>
    );
};
