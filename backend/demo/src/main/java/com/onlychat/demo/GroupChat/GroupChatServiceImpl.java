package com.onlychat.demo.GroupChat;

import com.onlychat.demo.User.User;
import com.onlychat.demo.User.UserRespository;
import com.onlychat.demo.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class GroupChatServiceImpl implements GroupChatService{
    @Autowired
    GroupChatRespository group_chat_repo;
    @Autowired
    UserRespository user_repo;
    @Autowired
    private UserService userService;

    @Override
    public GroupChat createGroup(String group_name){
        GroupChat returnValue = new GroupChat();
        returnValue.setName(group_name);
        User user = userService.createUser();
        returnValue.setHostId(user.getId());
        returnValue.addParticipant(user);
        group_chat_repo.save(returnValue);
        return returnValue;
    }

    @Override
    public List<GroupChat> getGroups() {
        return group_chat_repo.findAll();
    }

    @Override
    public GroupChat getGroupById(String groupId) {
       return group_chat_repo.findById(groupId).orElse(null);
    }

    @Override
    public GroupChat addToGroupById(String groupId, String userId) {
        GroupChat groupChat = group_chat_repo.findById(groupId).orElse(null);
        if (groupChat != null) {
            User user = user_repo.findById(userId).orElse(null);
            if (user != null && groupChat.containsUser(user)) {
                // Add the user as a participant
                groupChat.addParticipant(user);
                group_chat_repo.save(groupChat);
            } else{
                // Create a new user
                User create_user = userService.createUser();
                groupChat.addParticipant(create_user);
                group_chat_repo.save(groupChat);
            }
        }
        return groupChat;
    }

    @Override
    public GroupChat deleteGroupById(String groupId) {
        GroupChat groupChat = group_chat_repo.findById(groupId).orElse(null);
        if (groupChat != null) {
            Set<User> users = new HashSet<>(groupChat.getParticipants());
            for (User user : users) {
                user.getGroupChats().remove(groupChat);
            }
            groupChat.getParticipants().clear();
            group_chat_repo.save(groupChat);
            group_chat_repo.deleteById(groupId);
            for (User user : users) {
                userService.deleteUserById(user.getId());
            }
            return groupChat;
        }
        return null;
    }






}
