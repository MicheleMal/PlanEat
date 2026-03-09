import Notification from "./Notification";

export default function NotificationContainer({ notifications, remove }) {
    return (
        <div className="fixed top-6 right-6 flex flex-col gap-3 z-1000">
            {notifications.map((n) => (
                <Notification
                    key={n.id}
                    message={n.message}
                    type={n.type}
                    onClose={() => remove(n.id)}
                />
            ))}
        </div>
    );
}
