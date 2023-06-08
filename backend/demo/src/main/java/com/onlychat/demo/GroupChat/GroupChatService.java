package com.onlychat.demo.GroupChat;

import java.util.List;

public interface GroupChatService {
    GroupChat createGroup(String group_name);
    List<GroupChat> getGroups();
    GroupChat getGroupById(String groupId);
    GroupChat addToGroupById(String groupId, String userID);
    GroupChat deleteGroupById(String groupId);

}
