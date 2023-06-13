import axiosInstance from "./axiosConfig";

export const createGroupChatAPI = async (group_name: string) => {
    try {
        console.log(group_name)
        const response = await axiosInstance.post("/groups", { 
            group_name : group_name
        });
        return response;
    } catch (error) {
        return null;
    }
};
