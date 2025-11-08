const getHistory = (userEmail, serviceId) => {
    try {
        const key = `history_${userEmail}_${serviceId}`;
        const historyJson = localStorage.getItem(key);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error("Error getting history:", error);
        return [];
    }
};

const addHistoryItem = (userEmail, serviceId, item) => {
    try {
        const key = `history_${userEmail}_${serviceId}`;
        const history = getHistory(userEmail, serviceId);
        const newItem = { ...item, id: new Date().toISOString() };
        const newHistory = [newItem, ...history].slice(0, 100); // Keep last 100 items
        localStorage.setItem(key, JSON.stringify(newHistory));
        return newHistory;
    } catch (error) {
        console.error("Error adding history item:", error);
        return getHistory(userEmail, serviceId);
    }
};

const clearHistory = (userEmail, serviceId) => {
    try {
        const key = `history_${userEmail}_${serviceId}`;
        localStorage.removeItem(key);
        return [];
    } catch (error) {
        console.error("Error clearing history:", error);
        return [];
    }
};

export { getHistory, addHistoryItem, clearHistory };
