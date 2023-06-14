import axiosInstance from "./axiosConfig";
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
export const getGroupChatByIdAPI = async (groupId: string) => {
    try {
        console.log(groupId)
        const response = await axiosInstance.get("/groups/" + groupId);
        return response;
    } catch (error) {
        history.push('/groups/'+groupId+'/404');
        location.reload();
        return null;
    }
};
