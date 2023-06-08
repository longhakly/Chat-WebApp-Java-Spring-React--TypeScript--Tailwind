package com.onlychat.demo.GroupChat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onlychat.demo.User.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groups")
public class GroupChatController {

    @Autowired
    private GroupChatService groupChatService;

    @PostMapping
    public ResponseEntity<GroupChat> createGroup(@RequestBody String requestJsonData) throws JsonProcessingException  {
        JsonNode jsonNode = objectMapper.readTree(requestJsonData);
        String group_name = jsonNode.get("group_name").asText();
        GroupChat groupchat = groupChatService.createGroup(group_name);
        return new ResponseEntity<>(groupchat, HttpStatus.CREATED);
    }

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<GroupChat>> getGroups() {
        List<GroupChat> groupChatList = groupChatService.getGroups();
        return new ResponseEntity<>(groupChatList, HttpStatus.OK);
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupChat> getGroupById(@PathVariable String groupId) {
//        Check user authentication later
        GroupChat groupchat = groupChatService.getGroupById(groupId);
        if (groupchat != null) {
            return new ResponseEntity<>(groupchat, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("add/{groupId}")
    public ResponseEntity<GroupChat> addToGroupById(@PathVariable String groupId, @RequestBody String requestJsonData) throws JsonProcessingException {
        JsonNode jsonNode = objectMapper.readTree(requestJsonData);
        String userId = jsonNode.get("user_id").asText();
        GroupChat add_to_groupchat = groupChatService.addToGroupById(groupId, userId);
        if (add_to_groupchat != null) {
            return new ResponseEntity<>(add_to_groupchat, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<GroupChat> deleteGroupById(@PathVariable String groupId) {
//        Check user authentication later
        GroupChat groupchat = groupChatService.deleteGroupById(groupId);
        if (groupchat != null) {
            return new ResponseEntity<>(groupchat, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
