import { StyleSheet } from "react-native";
import colors from "../../styles/colors.style";

const styles = StyleSheet.create({
    notificationContainer: {
        backgroundColor: '#FFF',
        padding: 8,
        borderRadius: 16,
        marginBottom: 16
    },
    notificationText: {
        textAlign: "justify"
    },
    textEmphasis: {
        color: '#000',
        fontSize: 16
    },
    notificationButton: {
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    notificationButtonText: {
        color: '#FFF',
        fontFamily: 'JosefinSans-Medium',
        fontSize: 12
    },
    emptyNotificationsContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default styles;