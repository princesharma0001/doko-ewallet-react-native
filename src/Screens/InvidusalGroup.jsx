import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Image,
    Dimensions,
    TextInput,
    FlatList,
    Alert,
    Modal,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { chatService } from '../services/apiService';
import { useAppSelector } from '../hooks/redux';
import Toast from 'react-native-toast-message';
import UserProfileModal from '../components/UserProfileModal';

const { width, height } = Dimensions.get('window');

const InvidusalGroup = () => {
    const { theme, isDarkMode } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const scrollViewRef = useRef(null);
    const { currentUser, isProfileLoading, profileError } = useAppSelector((state) => state.user);
    console.log("asdgasdgasd", currentUser);


    // Get group data from route params
    const { groupData } = route.params || {};
    console.log("asdgsgsadgdsa", groupData);
    const [showUserProfileModal, setShowUserProfileModal] = useState("");
    console.log("sdgsdagdsa",showUserProfileModal);
    

    // State management
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    console.log("Sadgasdg", messages);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [showAddParticipant, setShowAddParticipant] = useState(false);
    const [showRemoveParticipant, setShowRemoveParticipant] = useState(false);
    const [showSendMoney, setShowSendMoney] = useState(false);
    const [participants, setParticipants] = useState(groupData?.participants || []);
    console.log("ADsgasgasd", participants);

    const [groupName, setGroupName] = useState(groupData?.name || 'Group Chat');

    // Send money modal states
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isSendingPayment, setIsSendingPayment] = useState(false);

    // Payment approval states
    const [processingPayments, setProcessingPayments] = useState(new Set());
    const [approvingPayments, setApprovingPayments] = useState(new Set());
    const [rejectingPayments, setRejectingPayments] = useState(new Set());

    // Rejection modal states
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [currentRejectPaymentId, setCurrentRejectPaymentId] = useState(null);


    const loadAuthToken = async () => {
        try {
            const token = await AsyncStorage.getItem('dokoToken');
            setAuthToken(token);
        } catch (error) {
            console.error('Error loading auth token:', error);
        }
    };

    useEffect(() => {
        loadAuthToken();
        loadMessages();

        // Add a test message for debugging
        const testMessage = {
            id: 'test_1',
            text: 'Test message to verify rendering',
            sender: 'Test User',
            timestamp: new Date(),
            isOwn: false,
            messageType: 'text'
        };
        console.log("Adding test message:", testMessage);
        setMessages([testMessage]);
    }, []);

    const loadMessages = async () => {
        console.log("Adgdasgasdgdsa", authToken);

        // if (!authToken || !groupData?.id) {
        //     console.log('Missing auth token or group data');
        //     return;
        // }

        // setIsLoading(true);
        // setError(null);
        const token = await AsyncStorage.getItem('dokoToken');

        try {
            const response = await chatService.getMessageList(groupData?.id, token);
            console.log("sddssddssdd", response);

            if (response.success) {
                console.log("inidifis", response);
                console.log("Messages Data:", response.data);

                // Check if data exists and is an array
                if (!response.data || !Array.isArray(response.data)) {
                    console.log("No messages data or not an array");
                    setMessages([]);
                    return;
                }

                // Transform API data to match our message format
                const transformedMessages = response.data?.map((msg, index) => {
                    console.log(`Processing message ${index}:`, msg);

                    return {
                        id: msg?.id || msg._id || `msg_${index}`,
                        messageId: msg?.messageId,
                        chatId: msg?.chatId,
                        senderId: msg?.senderId,
                        messageType: msg?.messageType,
                        content: msg?.content,
                        status: msg.status,
                        isEdited: msg.isEdited,
                        isDeleted: msg.isDeleted,
                        reactions: msg.reactions || [],
                        readBy: msg.readBy || [],
                        createdAt: new Date(msg.createdAt),
                        formattedTime: msg.formattedTime,
                        // For backward compatibility with existing UI
                        text: (msg.messageType === 'group_payment' || msg.messageType === 'payment')
                            ? `Payment: $${msg.content?.paymentData?.amount || 0} - ${msg.content?.paymentData?.description || 'No description'}`
                            : getMessageText(msg),
                        sender: msg.senderId?.firstName && msg.senderId?.lastName
                            ? `${msg.senderId.firstName} ${msg.senderId.lastName}`.trim()
                            : msg.senderId?.email || msg.senderId?.username || 'Unknown',
                        isOwn: (msg.senderId?.id === currentUser?.id || msg.senderId?._id === currentUser?.id) ? true : false, // You can determine this based on current user ID
                        timestamp: new Date(msg.createdAt)
                    };
                });

                console.log("Transformed Messages:", transformedMessages);
                setMessages(transformedMessages);
            } else {
                console.log("Asdgsadgasdg", response);

                // setError(response.error || 'Failed to load messages');
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            // setError('Failed to load messages');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || isSendingMessage) return;

        setIsSendingMessage(true);

        try {
            // Get auth token
            const authToken = await AsyncStorage.getItem('dokoToken');
            if (!authToken) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Authentication required',
                });
                return;
            }

            // Prepare message data for API
            const messageData = {
                chatId: groupData?.id,
                content: message.trim(),
                messageType: 'text',
            };

            console.log('Sending message with data:', messageData);

            // Call send message API
            const response = await chatService.sendMessage(messageData, authToken);

            if (response.success) {
                // Create new message object from API response
                const newMessage = {
                    id: response.data._id || response.data.id,
                    text: message.trim(),
                    sender: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : currentUser?.email || 'You',
                    timestamp: new Date(response.data.createdAt),
                    isOwn: true,
                    messageType: response.data.messageType,
                    status: response.data.status,
                    messageId: response.data.messageId
                };

                // Add message to local state
                setMessages(prev => [...prev, newMessage]);
                setMessage('');

                // Scroll to bottom
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);

                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Message sent successfully',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: response.error || 'Failed to send message',
                });
            }
        } catch (error) {
            console.error('Send message error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An unexpected error occurred',
            });
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleSendMoney = () => {
        setShowSendMoney(true);
    };

    const handleSendPayment = async () => {
        try {
            if (!amount.trim() || !description.trim()) {
                Alert.alert('Error', 'Please enter both amount and description');
                return;
            }

            if (!authToken || !groupData?.id) {
                Alert.alert('Error', 'Missing authentication or group data');
                return;
            }

            // Validate amount is a valid number
            const amountValue = parseFloat(amount);
            if (isNaN(amountValue) || amountValue <= 0) {
                Alert.alert('Error', 'Please enter a valid amount');
                return;
            }

            setIsSendingPayment(true);

            const paymentData = {
                chatId: groupData.id,
                amount: amountValue,
                currency: "NPR", // You can make this dynamic
                description: description.trim(),
                recipientId: groupData?.recipientId
            };

            console.log('Sending payment with data:', paymentData);
            const response = await chatService.seprarentPayment(paymentData, authToken);

            if (response && response.success) {
                await loadMessages();
                setShowSendMoney(false);
                setAmount('');
                setDescription('');
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response?.message ?? "Payment sent successfully!",
                    position: 'top',
                    visibilityTime: 4000,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: response?.error ?? 'Failed to send payment',
                    position: 'top',
                    visibilityTime: 4000,
                });
            }
        } catch (error) {
            console.error('Error sending payment:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to send payment. Please try again.',
                position: 'top',
                visibilityTime: 4000,
            });
        } finally {
            setIsSendingPayment(false);
        }
    };

    const handleApprovePayment = async (paymentId) => {
        console.log("Sadgasdgasdg", paymentId);


        if (!authToken) {
            Alert.alert('Error', 'Authentication required');
            return;
        }

        // Add to both processing sets - this will show loading on all buttons
        setProcessingPayments(prev => new Set([...prev, paymentId]));
        setApprovingPayments(prev => new Set([...prev, paymentId]));

        try {
            const response = await chatService.acceptPayment(paymentId, authToken);

            if (response.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response?.message ?? 'Payment approved successfully!',
                    position: 'top',
                    visibilityTime: 4000,
                });

                // Reload messages to update payment status
                await loadMessages();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: response.error ?? 'Failed to approve payment',
                    position: 'top',
                    visibilityTime: 4000,
                });
            }
        } catch (error) {
            console.error('Error approving payment:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to approve payment',
                position: 'top',
                visibilityTime: 4000,
            });
        } finally {
            // Remove from both processing sets
            setProcessingPayments(prev => {
                const newSet = new Set(prev);
                newSet.delete(paymentId);
                return newSet;
            });
            setApprovingPayments(prev => {
                const newSet = new Set(prev);
                newSet.delete(paymentId);
                return newSet;
            });
        }
    };

    const handleRejectPayment = (paymentId) => {
        setCurrentRejectPaymentId(paymentId);
        setRejectReason('');
        setShowRejectModal(true);
    };

    const handleConfirmReject = async () => {
        if (!rejectReason.trim()) {
            Alert.alert('Error', 'Please enter a reason for rejecting the payment');
            return;
        }

        if (!authToken || !currentRejectPaymentId) {
            Alert.alert('Error', 'Missing authentication or payment data');
            return;
        }

        // Add to rejecting set - this will show loading on reject button
        setRejectingPayments(prev => new Set([...prev, currentRejectPaymentId]));

        try {
            const response = await chatService.declinePayment(currentRejectPaymentId, rejectReason.trim(), authToken);

            if (response.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response?.message ?? 'Payment declined successfully!',
                    position: 'top',
                    visibilityTime: 4000,
                });

                // Reload messages to update payment status
                await loadMessages();

                // Close modal
                setShowRejectModal(false);
                setRejectReason('');
                setCurrentRejectPaymentId(null);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: response.error ?? 'Failed to decline payment',
                    position: 'top',
                    visibilityTime: 4000,
                });
            }
        } catch (error) {
            console.error('Error declining payment:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to decline payment',
                position: 'top',
                visibilityTime: 4000,
            });
        } finally {
            // Remove from rejecting set
            setRejectingPayments(prev => {
                const newSet = new Set(prev);
                newSet.delete(currentRejectPaymentId);
                return newSet;
            });
        }
    };

    const handleCancelReject = () => {
        setShowRejectModal(false);
        setRejectReason('');
        setCurrentRejectPaymentId(null);
    };

    // Helper function to safely extract text content from messages
    const getMessageText = (message) => {
        if (typeof message === 'string') {
            return message;
        }
        if (typeof message === 'object' && message !== null) {
            if (message.text) {
                return typeof message.text === 'string' ? message.text : 'Message';
            }
            if (message.content) {
                if (typeof message.content === 'string') {
                    return message.content;
                }
                if (typeof message.content === 'object' && message.content.text) {
                    return typeof message.content.text === 'string' ? message.content.text : 'Message';
                }
            }
        }
        return 'Message';
    };

    const renderMessage = ({ item }) => {
        try {
            console.log("Rendering message:", item);

            // Add null safety checks
            if (!item) {
                console.warn("Item is null or undefined");
                return null;
            }

            const isPaymentMessage = item.messageType === 'group_payment' || item.messageType === 'payment';
            console.log("Is payment message:", isPaymentMessage);

            return (
                <View style={[
                    styles.messageContainer,
                    item.isOwn ? styles.ownMessage : styles.otherMessage
                ]}>
                    {isPaymentMessage ? (
                        <View style={[
                            styles.paymentBubble,
                            { backgroundColor: item.isOwn ? theme.colors.primary : theme.colors.surface }
                        ]}>
                            <View style={styles.paymentHeader}>
                                <Ionicons
                                    name="cash"
                                    size={20}
                                    color={item.isOwn ? '#FFFFFF' : theme.colors.primary}
                                />
                                <Text style={[
                                    styles.paymentTitle,
                                    { color: item.isOwn ? '#FFFFFF' : theme.colors.text }
                                ]}>
                                    Payment Request
                                </Text>
                            </View>

                            <View style={styles.paymentContent}>
                                <Text style={[
                                    styles.paymentAmount,
                                    { color: item.isOwn ? '#FFFFFF' : theme.colors.text }
                                ]}>
                                    ${item.content?.paymentData?.amount || 0} {item.content?.paymentData?.currency || 'USD'}
                                </Text>
                                <Text style={[
                                    styles.paymentDescription,
                                    { color: item.isOwn ? '#FFFFFF' : theme.colors.textSecondary }
                                ]}>
                                    {item.content?.paymentData?.description || 'No description'}
                                </Text>

                                <View style={styles.paymentStatus}>
                                    {(item?.senderId?.id === currentUser?.id || item?.senderId?._id === currentUser?.id) && item.content?.paymentData?.recipients && (
                                        item.content.paymentData.recipients.map((recipient, index) => (
                                            <Text
                                                key={index}
                                                style={[
                                                    styles.paymentStatusText,
                                                    { color: item.isOwn ? '#FFFFFF' : theme.colors.textSecondary }
                                                ]}
                                            >
                                                {recipient?.userId?.firstName || 'Unknown'}: {recipient?.status || 'Unknown'}
                                            </Text>
                                        ))
                                    )}



                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        {(() => {
                                            const recipients = item.content?.paymentData?.recipients || [];
                                            const currentUserRecipient = recipients.find(
                                                r => r?.userId?._id === currentUser?.id || r?.userId?.id === currentUser?.id
                                            );

                                            if (currentUserRecipient) {
                                                const paymentId = item.content?.paymentData?.paymentId;
                                                const isProcessing = processingPayments.has(paymentId);
                                                const isApproving = approvingPayments.has(paymentId);
                                                const isRejecting = rejectingPayments.has(paymentId);

                                                if (currentUserRecipient.status === "pending") {
                                                    return (
                                                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
                                                            <TouchableOpacity
                                                                style={{
                                                                    marginRight: 10,
                                                                    paddingHorizontal: 12,
                                                                    paddingVertical: 6,
                                                                    borderRadius: 6,
                                                                    backgroundColor: (isProcessing || isApproving) ? '#ccc' : '#4CAF50'
                                                                }}
                                                                onPress={() => handleApprovePayment(paymentId)}
                                                                disabled={isProcessing || isApproving}
                                                            >
                                                                {(isProcessing || isApproving) ? (
                                                                    <Text style={{ color: "white", fontWeight: "bold" }}>
                                                                        Processing...
                                                                    </Text>
                                                                ) : (
                                                                    <Text style={{ color: "white", fontWeight: "bold" }}>
                                                                        ✔ Approve
                                                                    </Text>
                                                                )}
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                style={{
                                                                    paddingHorizontal: 12,
                                                                    paddingVertical: 6,
                                                                    borderRadius: 6,
                                                                    backgroundColor: (isProcessing || isRejecting) ? '#ccc' : '#F44336'
                                                                }}
                                                                onPress={() => handleRejectPayment(paymentId)}
                                                                disabled={isProcessing || isRejecting}
                                                            >
                                                                {isRejecting ? (
                                                                    <Text style={{ color: "white", fontWeight: "bold" }}>
                                                                        Processing...
                                                                    </Text>
                                                                ) : (
                                                                    <Text style={{ color: "white", fontWeight: "bold" }}>
                                                                        ✖ Reject
                                                                    </Text>
                                                                )}
                                                            </TouchableOpacity>
                                                        </View>
                                                    );
                                                }
                                            } else {
                                                // return (
                                                //     <Text style={{ color: theme.colors.textSecondary, paddingVertical: 5 }}>
                                                //         Split among {recipients.length} people
                                                //     </Text>
                                                // );
                                            }
                                        })()}
                                    </View>
                                </View>
                            </View>

                            <Text style={[
                                styles.messageTime,
                                { color: item.isOwn ? '#FFFFFF' : theme.colors.textSecondary }
                            ]}>
                                {item.formattedTime || item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    ) : (
                        <View style={[
                            styles.messageBubble,
                            { backgroundColor: item.isOwn ? theme.colors.primary : theme.colors.surface }
                        ]}>
                            <Text style={[
                                styles.messageText,
                                { color: item.isOwn ? '#FFFFFF' : theme.colors.text }
                            ]}>
                                {getMessageText(item)}
                            </Text>
                            <Text style={[
                                styles.messageTime,
                                { color: item.isOwn ? '#FFFFFF' : theme.colors.textSecondary }
                            ]}>
                                {item.formattedTime || item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    )}
                </View>
            );
        } catch (error) {
            console.error("Error rendering message:", error);
            return (
                <View style={styles.messageContainer}>
                    <Text style={{ color: 'red', padding: 10 }}>
                        Error rendering message
                    </Text>
                </View>
            );
        }
    };


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />

            {/* Header */}
            <View style={[styles.header,]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <View style={styles.groupInfo}>
                        <Text style={[styles.groupName, { color: theme.colors.text }]}>
                            {groupName}
                        </Text>
                        <Text style={[styles.participantCount, { color: theme.colors.textSecondary }]}>
                            {participants.length} participants
                        </Text>
                    </View>
                </View>
                <View style={styles.headerRight}>

                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setShowUserProfileModal(true)}

                    >
                        <Ionicons name="settings-sharp" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Messages */}
            {messages.length > 0 ? (
                <FlatList
                    ref={scrollViewRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    style={styles.messagesList}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyMessagesContainer}>
                    <Text style={[styles.emptyMessagesText, { color: theme.colors.textSecondary }]}>
                        {isLoading ? 'Loading messages...' : 'No messages yet'}
                    </Text>
                </View>
            )}

            {/* Action Buttons */}
            {/* <View style={[styles.actionButtons, { backgroundColor: theme.colors.surface }]}>



                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                    onPress={handleSendMoney}
                >
                    <Ionicons name="cash" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Send Money</Text>
                </TouchableOpacity>
            </View> */}

            {/* Message Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.inputContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.textSecondary }]}
            >
                <View style={styles.inputRow}>
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: theme.colors.primary, marginRight: 8 }]}
                        onPress={handleSendMoney}
                    >
                        <Ionicons name="cash" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.messageInput, {
                            color: theme.colors.text,
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.textSecondary
                        }]}
                        placeholder="Type a message..."
                        placeholderTextColor={theme.colors.textSecondary}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            {
                                backgroundColor: (!message.trim() || isSendingMessage) ? theme.colors.textSecondary : theme.colors.primary,
                                opacity: (!message.trim() || isSendingMessage) ? 0.6 : 1
                            }
                        ]}
                        onPress={handleSendMessage}
                        disabled={!message.trim() || isSendingMessage}
                    >
                        {isSendingMessage ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <MaterialIcons name="arrow-upward" size={20} color={"#fff"} />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>



            {/* Send Money Modal */}
            <Modal
                visible={showSendMoney}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                    <View style={[styles.modalHeader, { backgroundColor: theme.colors.surface }]}>
                        <TouchableOpacity
                            onPress={() => {
                                setShowSendMoney(false);
                                setAmount('');
                                setDescription('');
                            }}
                        >
                            <Text style={[styles.modalCancel, { color: theme.colors.primary }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                            Send Money
                        </Text>
                        <TouchableOpacity
                            onPress={handleSendPayment}
                            disabled={isSendingPayment || !amount.trim() || !description.trim()}
                        >
                            <Text style={[
                                styles.modalDone,
                                {
                                    color: (isSendingPayment || !amount.trim() || !description.trim())
                                        ? theme.colors.textSecondary
                                        : theme.colors.primary
                                }
                            ]}>
                                {isSendingPayment ? 'Sending...' : 'Send'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalContent}>
                        <View style={styles.paymentForm}>
                            <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                                Amount
                            </Text>
                            <View style={[styles.amountContainer, { backgroundColor: theme.colors.surface }]}>
                                <Text style={[styles.currencySymbol, { color: theme.colors.text }]}>
                                    $
                                </Text>
                                <TextInput
                                    style={[styles.amountInput, { color: theme.colors.text }]}
                                    placeholder="0.00"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                    returnKeyType="next"
                                />
                            </View>

                            <Text style={[styles.formLabel, { color: theme.colors.text, marginTop: 20 }]}>
                                Description
                            </Text>
                            <TextInput
                                style={[
                                    styles.descriptionInput,
                                    {
                                        color: theme.colors.text,
                                        backgroundColor: theme.colors.surface,
                                        borderColor: theme.colors.textSecondary
                                    }
                                ]}
                                placeholder="What's this payment for?"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />

                            <View style={styles.participantInfo}>
                                <Text style={[styles.participantInfoText, { color: theme.colors.textSecondary }]}>
                                    This payment will be split equally among {participants.length} participants
                                </Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

            {/* Reject Payment Modal */}
            <Modal
                visible={showRejectModal}
                animationType="slide"
                presentationStyle="pageSheet"
                transparent={true}
            >
                <View style={styles.rejectModalOverlay}>
                    <View style={[styles.rejectModalContainer, { backgroundColor: theme.colors.background }]}>
                        <View style={[styles.rejectModalHeader, { backgroundColor: theme.colors.surface }]}>
                            <Text style={[styles.rejectModalTitle, { color: theme.colors.text }]}>
                                Reject Payment
                            </Text>
                            <TouchableOpacity
                                onPress={handleCancelReject}
                                style={styles.rejectModalCloseButton}
                            >
                                <Ionicons name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.rejectModalContent}>
                            <Text style={[styles.rejectModalDescription, { color: theme.colors.text }]}>
                                Please provide a reason for rejecting this payment:
                            </Text>

                            <TextInput
                                style={[
                                    styles.rejectReasonInput,
                                    {
                                        color: theme.colors.text,
                                        backgroundColor: theme.colors.surface,
                                        borderColor: theme.colors.textSecondary
                                    }
                                ]}
                                placeholder="Enter reason for rejection..."
                                placeholderTextColor={theme.colors.textSecondary}
                                value={rejectReason}
                                onChangeText={setRejectReason}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                maxLength={200}
                            />

                            <Text style={[styles.rejectModalCharCount, { color: theme.colors.textSecondary }]}>
                                {rejectReason.length}/200 characters
                            </Text>
                        </View>

                        <View style={[styles.rejectModalActions, { backgroundColor: theme.colors.surface }]}>
                            <TouchableOpacity
                                style={[styles.rejectModalButton, styles.rejectModalCancelButton]}
                                onPress={handleCancelReject}
                            >
                                <Text style={[styles.rejectModalButtonText, { color: theme.colors.text }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.rejectModalButton,
                                    styles.rejectModalConfirmButton,
                                    {
                                        backgroundColor: rejectReason.trim() ? '#F44336' : '#ccc',
                                        opacity: rejectReason.trim() ? 1 : 0.6
                                    }
                                ]}
                                onPress={handleConfirmReject}
                                disabled={!rejectReason.trim()}
                            >
                                <Text style={styles.rejectModalConfirmButtonText}>
                                    Reject Payment
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <UserProfileModal
                visible={showUserProfileModal}
                onClose={() => setShowUserProfileModal(false)}
                groupData={groupData}
            // onActionPress={handleProfileAction}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    groupInfo: {
        flex: 1,
    },
    groupName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    participantCount: {
        fontSize: 14,
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        padding: 8,
        marginLeft: 8,
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 12,
    },
    ownMessage: {
        alignItems: 'flex-end',
    },
    otherMessage: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    messageTime: {
        fontSize: 12,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginHorizontal: 4,
        borderRadius: 8,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    inputContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 15
    },
    messageInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    modalCancel: {
        fontSize: 16,
        fontWeight: '500',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalDone: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalContent: {
        flex: 1,
        padding: 16,
    },
    modalDescription: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    participantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    participantAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    participantAvatarText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    participantDetails: {
        flex: 1,
    },
    participantName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    participantStatus: {
        fontSize: 14,
    },
    removeButton: {
        padding: 8,
    },
    paymentForm: {
        flex: 1,
    },
    formLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        padding: 0,
    },
    descriptionInput: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        fontSize: 16,
        minHeight: 80,
    },
    participantInfo: {
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    participantInfoText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    paymentBubble: {
        maxWidth: '85%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    paymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    paymentContent: {
        marginBottom: 8,
    },
    paymentAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    paymentDescription: {
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 18,
    },
    paymentStatus: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        paddingTop: 8,
    },
    paymentStatusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    paymentSplitText: {
        fontSize: 12,
        marginTop: 2,
    },
    emptyMessagesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyMessagesText: {
        fontSize: 16,
        textAlign: 'center',
    },
    // Reject Modal Styles
    rejectModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    rejectModalContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        overflow: 'hidden',
    },
    rejectModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    rejectModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rejectModalCloseButton: {
        padding: 4,
    },
    rejectModalContent: {
        padding: 20,
    },
    rejectModalDescription: {
        fontSize: 16,
        marginBottom: 16,
        lineHeight: 22,
    },
    rejectReasonInput: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    rejectModalCharCount: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: 8,
    },
    rejectModalActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        gap: 12,
    },
    rejectModalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    rejectModalCancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    rejectModalConfirmButton: {
        // backgroundColor will be set dynamically
    },
    rejectModalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    rejectModalConfirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});

export default InvidusalGroup;
