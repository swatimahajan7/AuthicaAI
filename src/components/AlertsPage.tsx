import { useEffect, useRef, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { type NotificationItem } from "./NotificationsList";

interface AlertsPageProps {
    notifications: NotificationItem[];
    selectedNotification: NotificationItem | null;
    markNotificationAsRead: (id: number) => void;
    clearSelectedNotification?: () => void;
}

const AlertsPage = ({
    notifications,
    selectedNotification,
    markNotificationAsRead,
    clearSelectedNotification,
}: AlertsPageProps) => {
    const [expandedId, setExpandedId] = useState<number | false>(false);
    const refs = useRef<Record<number, HTMLDivElement | null>>({});

    useEffect(() => {
        if (selectedNotification) {
            setExpandedId(selectedNotification.id);
            markNotificationAsRead(selectedNotification.id);

            setTimeout(() => {
                refs.current[selectedNotification.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);

            clearSelectedNotification?.();
        } else if (!expandedId && notifications.length > 0) {
            setExpandedId(notifications[0].id);
            markNotificationAsRead(notifications[0].id);
        }
    }, [selectedNotification, notifications]);

    const handleAccordionChange = (id: number, isExpanded: boolean) => {
        setExpandedId(isExpanded ? id : false);
        if (isExpanded) markNotificationAsRead(id);
    };

    return (
        <div style={{ padding: 20 }}>
            {notifications.map((notif) => (
                <Accordion
                    key={notif.id}
                    expanded={expandedId === notif.id}
                    onChange={(_, isExpanded) => handleAccordionChange(notif.id, isExpanded)}
                    ref={(el) => {
                        refs.current[notif.id] = el;
                    }}
                    sx={{
                        mb: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        "&:before": { display: "none" }
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            backgroundColor: expandedId === notif.id ? "#f5f5f5" : "#fafafa",
                            borderBottom: "1px solid #ddd"
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {notif.message}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ backgroundColor: "#fff" }}>
                        <Divider sx={{ mb: 1 }} />
                        <Typography><strong>Device:</strong> {notif.details.device}</Typography>
                        <Typography><strong>Location:</strong> {notif.details.location.city}, {notif.details.location.country}</Typography>
                        <Typography><strong>Coordinates:</strong> {notif.details.location.coordinates.lat}, {notif.details.location.coordinates.lon}</Typography>
                        <Typography><strong>IP Address:</strong> {notif.details.ip}</Typography>
                        <Typography><strong>Login Time:</strong> {new Date(notif.details.loginTime).toLocaleString()}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default AlertsPage;
