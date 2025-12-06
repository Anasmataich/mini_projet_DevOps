import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:5000';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:5000';

export const validateUser = async (userId, token) => {
    try {
        // Mocking validation if no service is running
        if (process.env.MOCK_SERVICES === 'true') return true;

        const response = await axios.get(`${AUTH_SERVICE_URL}/users/${userId}`, {
            headers: { Authorization: token }
        });
        return response.status === 200;
    } catch (error) {
        console.error("❌ Error validating user:", error.message);
        return false;
    }
};

export const getPaymentStatus = async (orderId) => {
    try {
        if (process.env.MOCK_SERVICES === 'true') return 'PENDING';

        const response = await axios.get(`${PAYMENT_SERVICE_URL}/payments/order/${orderId}`);
        return response.data.status;
    } catch (error) {
        console.error("❌ Error fetching payment status:", error.message);
        return null;
    }
};
