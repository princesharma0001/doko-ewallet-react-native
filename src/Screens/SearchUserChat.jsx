import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import NewTransferModal from '../components/NewTransferModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SearchUserChat = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Happy Birthday khaled!',
      amount: '$35',
      time: '2:00 PM',
      isOwn: true,
    }
  ]);
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const messageInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  const recipient = route?.params?.recipient || '@Sami343';

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleScroll = useCallback((event) => {
    // Optional: Handle scroll events if needed
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
      // Use a longer timeout to ensure state update is complete
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  const renderMessage = (msg) => {
    if (msg.amount) {
      // Payment message with amount
      return (
        <View key={msg.id} style={styles.messageContainer}>
          <View style={[styles.paymentBubble, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.paymentText, { color: '#E3F2FD' }]}>
              {msg.text}
            </Text>
            <Text style={[styles.amountText, { color: '#E3F2FD' }]}>
              {msg.amount}
            </Text>
            <Text style={[styles.messageTime, { color: theme.colors.text }]}>
              {msg.time}
            </Text>
          </View>
        </View>
      );
    } else {
      // Regular text message
      return (
        <View key={msg.id} style={styles.messageContainer}>
          <View style={[styles.textBubble, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.messageText, { color: theme.colors.text }]}>
              {msg.text}
            </Text>
            <Text style={[styles.messageTime, { color: theme.colors.textSecondary }]}>
              {msg.time}
            </Text>
          </View>
        </View>
      );
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle={theme.colors.background === '#FFFFFF' ? 'dark-content' : 'light-content'} backgroundColor={theme.colors.background} />

        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIcon, { color: theme.colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.recipientName, { color: theme.colors.text }]}>
            {recipient}
          </Text>
          <TouchableOpacity 
            style={[styles.addButton, ]}
            onPress={() => setShowNewTransferModal(true)}
          >
            <Image source={require("../assets/Images/AddInstant.png")} style={{resizeMode:'contain'}} />
            {/* <Text style={[styles.addButtonText, { color: theme.colors.primaryText }]}>+</Text> */}
          </TouchableOpacity>
        </View>

        {/* Messages Area */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            bounces={true}
            alwaysBounceVertical={false}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            removeClippedSubviews={false}
          >
            {messages.map(renderMessage)}
          </ScrollView>

          {/* Input Area */}
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.textSecondary }]}>
              <TextInput
                ref={messageInputRef}
                style={[styles.messageInput, { color: theme.colors.text }]}
                value={message}
                onChangeText={setMessage}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                maxLength={500}
              />
              <TouchableOpacity style={styles.attachmentButton}>
                <MaterialIcons name="attach-file" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSendMessage}
            >
              <MaterialIcons name="arrow-upward" size={20} color={"#fff"} />
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>

        {/* New Transfer Modal */}
        <NewTransferModal
          visible={showNewTransferModal}
          onClose={() => setShowNewTransferModal(false)}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  recipientName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
    minHeight: screenHeight * 0.7,
  },
  messageContainer: {
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  paymentBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
  },
  paymentText: {
    fontSize: 16,
    marginBottom: 4,
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems:'center'
    // borderTopWidth: 1,
    // borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    borderWidth: 0.5
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 80,
    textAlignVertical: 'top',
    paddingBottom: 6
  },
  attachmentButton: {
    padding: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchUserChat;
