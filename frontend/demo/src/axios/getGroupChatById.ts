import axiosInstance from "./axiosConfig";

export const getGroupChatByIdAPI = async (groupId: string) => {
    try {
        console.log(groupId)
        const response = await axiosInstance.get("/groups/" + groupId);
        return response;
    } catch (error) {
        return null;
    }
};
