import { child, get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase/FirebaseConfig";
import { Alert } from "react-native";

const dbRef = ref(getDatabase(app));

export const SaveNewChat = async (loggedInUserId, chatData) => {
  const newChatData = {
    users: [...chatData],
    createdBy: loggedInUserId,
    updatedBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const newChat = await push(child(dbRef, "Chats"), newChatData);
  // console.log(newChat.key)

  let chatUsers = newChatData.users;
  for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    await push(child(dbRef, `UsersChats/${userId}`), newChat.key);
  }
  return newChat.key;
};

export const saveMessage = async (chatId, senderId, messageText) => {
    // console.log("save message chat id"+chatId);
    // console.log(senderId)
    // console.log(messageText)
  const messageRef = child(dbRef, `Messages/${chatId}`);
  const messageData = {
    sentBy: senderId,
    sentAt: new Date().toISOString(),
    text: messageText,
  };
  await push(messageRef, messageData);

  const chatRef = child(dbRef, `Chats/${chatId}`);
  await update(chatRef, {
    updatedBy: senderId,
    updatedAt: new Date().toISOString(),
    latestMessageText: messageText,
  });
};

export const starMessage = async (userId,chatId,messageId) => {
   try {
      const  starMessageRef = child(dbRef,`StarredMessages/${userId}/${chatId}/${messageId}`);
      const snapshot = await get(starMessageRef);
      if(snapshot.exists()){
        // UN-STAR MESSAGE
        await remove(starMessageRef)
        return Alert.alert(`Un-Starred😵`);
      }else{
        //  STAR MESSAGE
        const starredMessageData = {
            messageId,
            chatId,
            starredAt : new Date().toISOString(),
        };
        await set(starMessageRef,starredMessageData);
        return Alert.alert(`Starred🤩`);
       
      }
   } catch (error) {
      console.log(error)
   }
};