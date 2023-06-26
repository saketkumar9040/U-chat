import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/images/navigatorBackground2.jpg";
import { useSelector } from "react-redux";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";

const ChatListScreen = ({ navigation, route }) => {

  const [isLoading,setIsLoading]=useState(true);

  const selectedUser = route?.params?.selectedUser;
  // console.log(JSON.stringify(selectedUser))

  const userLoggedIn = useSelector((state) => state.auth.userData);
  // console.log(userLoggedIn);

  const storedUser = useSelector((state) => state?.users?.storedUser);
  // console.log("stored user "+JSON.stringify(storedUser))

  const userChats = useSelector((state) => state.chats.chatsData);
  // console.log(Object.values(userChats));
  let chatData = Object.values(userChats);
  // console.log(chatData)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              marginRight: 20,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("NewChatScreen")}
          >
            <FontAwesome name="search" size={26} color="#fff" />
          </TouchableOpacity>
        );
      },
      headerLeft: () => {
        return (
          <View
            style={{
              flexDirection: "row",
              marginLeft: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 23,
                fontFamily: "BoldItalic",
                color: "#fff",
                letterSpacing: 2,
                paddingRight: 10,
              }}
            >
              U-CHAT
            </Text>
            <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
          </View>
        );
      },
    });
  }, []);

  useEffect(() => {
    //  console.log(selectedUser);
    if (!selectedUser) {
      return;
    }
    const chatUsers = [selectedUser, userLoggedIn];

    navigation.navigate("ChatScreen", { chatUsers: chatUsers });
  }, [selectedUser]);

  return (
    <ScrollView style={styles.container}>
      {
        storedUser =={} || storedUser == null ? (
          <View style={styles.activityContainer}>
          <ActivityIndicator
               size={80}
               color="#fff"
          />
        </View>
        ):(
          <FlatList
          style={styles.chatUserContainer}
          data={chatData}
          renderItem={(e) => {
            // console.log(e.item.createdAt);
            let date = new Date(e.item.createdAt);
            let displayDate =  date.getHours() > 12
                ? date.getHours()-12
                : date.getHours()
                console.log(date);
            const otherUsersId = e.item.users.find(
              (uid) => uid !== userLoggedIn.uid
            );
            const otherUser = storedUser[otherUsersId];
            return (
              <TouchableOpacity
                style={styles.searchResultContainer}
                // onPress={() => {
                //   userPressed(userData);
                // }}
              >
                <Image
                  source={{ uri: otherUser?.ProfilePicURL }}
                  style={styles.searchUserImage}
                  resizeMode="contain"
                />
                <View style={styles.searchUserTextContainer}>
                  <Text style={styles.searchUserName}>
                    {otherUser?.name.toUpperCase()}
                  </Text>
                  <Text style={styles.searchUserTapToChat}>{otherUser?.about}</Text>
                </View>
                <View  style={styles.timeContainer}>
                  <Text style={styles.dateText}> {displayDate}:{date.getMinutes()} {date.getHours()>12?"PM":"AM"}</Text> 
                </View>
              </TouchableOpacity>
            );
          }}
        />
        )
      }
    </ScrollView>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffbf00",
  },
  activityContainer:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
  },
  chatUserContainer: {
    //  paddingHorizontal:10,
  },
  searchResultContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  searchUserImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#6f4e37",
    backgroundColor: "#6f4e37",
    marginRight: 5,
  },
  searchUserTextContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  searchUserTapToChat: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "Medium",
  },
  searchUserName: {
    fontSize: 22,
    color: "#6f4e37",
    fontFamily: "BoldItalic",
  },
  timeContainer: {
     position:"absolute",
     right:20,
     top:20,
  },
  dateText:{
    fontSize:17,
    fontFamily:"Bold",
    color: "#6f4e37",
  }
});
