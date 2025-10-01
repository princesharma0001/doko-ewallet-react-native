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
    Platform
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

const { width, height } = Dimensions.get('window');

const GroupSeperateChat = () => {
    const { theme, isDarkMode } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const scrollViewRef = useRef(null);
    const { currentUser, isProfileLoading, profileError } = useAppSelector((state) => state.user);
    console.log("asdgasdgasd", currentUser);


    // Get group data from route params
    const { groupData } = route.params || {};
    console.log("asdgsadg", groupData);

    // State management
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
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

    // Load auth token on component mount


    // useEffect(() => {
    //     loadMessages();

    // }, [])

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
            console.log("Sdagasdgasdgsadgsadgasdgads", response);

            if (response.success) {
                console.log("API Response Success:", response);
                console.log("Messages Data:", response.data);

                // Check if data exists and is an array
                if (!response.data || !Array.isArray(response.data)) {
                    console.log("No messages data or not an array");
                    setMessages([]);
                    return;
                }

                // Transform API data to match our message format
                const transformedMessages = response.data.map((msg, index) => {
                    console.log(`Processing message ${index}:`, msg);

                    return {
                        id: msg.id || msg._id || `msg_${index}`,
                        messageId: msg.messageId,
                        chatId: msg.chatId,
                        senderId: msg.senderId,
                        messageType: msg.messageType,
                        content: msg.content,
                        status: msg.status,
                        isEdited: msg.isEdited,
                        isDeleted: msg.isDeleted,
                        reactions: msg.reactions || [],
                        readBy: msg.readBy || [],
                        createdAt: new Date(msg.createdAt),
                        formattedTime: msg.formattedTime,
                        // For backward compatibility with existing UI
                        text: msg.messageType === 'group_payment'
                            ? `Payment: $${msg.content?.paymentData?.amount || 0} - ${msg.content?.paymentData?.description || 'No description'}`
                            : msg.content?.text || msg.content || 'Message',
                        sender: msg.senderId?.email || msg.senderId?.name || 'Unknown',
                        isOwn: msg.senderId?.id === currentUser?.id ? true : false, // You can determine this based on current user ID
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
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: message.trim(),
            sender: 'You',
            timestamp: new Date(),
            isOwn: true
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // TODO: Implement API call to send message
        console.log('Sending message:', newMessage);
    };

    const handleLeaveGroup = () => {
        Alert.alert(
            'Leave Group',
            'Are you sure you want to leave this group?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Implement API call to leave group
                        console.log('Leaving group');
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const handleAddParticipant = () => {
        setShowAddParticipant(true);
    };

    const handleRemoveParticipant = () => {
        setShowRemoveParticipant(true);
    };

    const handleSendMoney = () => {
        setShowSendMoney(true);
    };

    const handleSendPayment = async () => {
        if (!amount.trim() || !description.trim()) {
            Alert.alert('Error', 'Please enter both amount and description');
            return;
        }

        if (!authToken || !groupData?.id) {
            Alert.alert('Error', 'Missing authentication or group data');
            return;
        }

        setIsSendingPayment(true);

        try {
            const paymentData = {
                chatId: groupData.id,
                totalAmount: parseFloat(amount),
                currency: "USD", // You can make this dynamic
                description: description.trim(),
                splitType: "equal",
                participants: participants.map(p => p.userId?._id).filter(Boolean)
            };

            const response = await chatService.sendPaymentSplit(paymentData, authToken);

            if (response.success) {
                await loadMessages();
                setShowSendMoney(false);
                setAmount('');
                setDescription('');
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response?.message ?? "Payment split sent successfully!",
                    position: 'top',
                    visibilityTime: 4000,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: response.error ?? 'Failed to send payment split',
                    position: 'top',
                    visibilityTime: 4000,
                });
            }
        } catch (error) {
            console.error('Error sending payment:', error);
            Alert.alert('Error', 'Failed to send payment split');
        } finally {
            setIsSendingPayment(false);
        }
    };

    const handleApprovePayment = async (paymentId) => {
        
        if (!authToken) {
            Alert.alert('Error', 'Authentication required');
            return;
        }

        // Add to processing set
        setProcessingPayments(prev => new Set([...prev, paymentId]));

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
            // Remove from processing set
            setProcessingPayments(prev => {
                const newSet = new Set(prev);
                newSet.delete(paymentId);
                return newSet;
            });
        }
    };

    const handleRejectPayment = async (paymentId) => {
        // For now, just show a message. You can implement reject API later
        Alert.alert(
            'Reject Payment',
            'Are you sure you want to reject this payment?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Reject', 
                    style: 'destructive',
                    onPress: () => {
                        Toast.show({
                            type: 'info',
                            text1: 'Payment Rejected',
                            text2: 'Payment has been rejected',
                            position: 'top',
                            visibilityTime: 3000,
                        });
                    }
                }
            ]
        );
    };

    const renderMessage = ({ item }) => {
        console.log("Rendering message:", item);
        const isPaymentMessage = item.messageType === 'group_payment';
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
                                ${item.content.paymentData?.amount} {item.content.paymentData?.currency}
                            </Text>
                            <Text style={[
                                styles.paymentDescription,
                                { color: item.isOwn ? '#FFFFFF' : theme.colors.textSecondary }
                            ]}>
                                {item.content.paymentData?.description}
                            </Text>

                            <View style={styles.paymentStatus}>
                                <Text style={[
                                    styles.paymentStatusText,
                                    { color: item.isOwn ? '#FFFFFF' : theme.colors.textSecondary }
                                ]}>
                                    Status: {item.content.paymentData?.status}
                                </Text>
                                <Text style={[
                                    styles.paymentStatusText,
                                    { color: item.isOwn ? '#FFFFFF' : theme.colors.textSecondary, paddingVertical: 6 }
                                ]}>
                                    {(() => {
                                        const recipients = item.content.paymentData?.recipients || [];
                                        const currentUserRecipient = recipients.find(
                                            r => r?.userId?._id === currentUser?.id
                                        );

                                        if (currentUserRecipient) {

                                            // Default text if already approved/rejected
                                            return `Your share: ${Number(currentUserRecipient.amount).toFixed(2)}`;
                                        } else {
                                            return `Split among ${recipients.length} people`;
                                        }
                                    })()}
                                </Text>
                                {console.log("adgfasdgasd",item.content.paymentData.paymentId)
                                }
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {(() => {
                                        const recipients = item.content.paymentData?.recipients || [];
                                        const currentUserRecipient = recipients.find(
                                            r => r?.userId?._id === currentUser?.id
                                        );

                                        console.log("sdagsadgsad",recipients);
                                        

                                        if (currentUserRecipient) {
                                            const paymentId = item.content.paymentData?.paymentId;
                                            const isProcessing = processingPayments.has(paymentId);

                                            if (currentUserRecipient.status === "pending") {
                                                return (
                                                    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
                                                        <TouchableOpacity
                                                            style={{ 
                                                                marginRight: 10,
                                                                paddingHorizontal: 12,
                                                                paddingVertical: 6,
                                                                borderRadius: 6,
                                                                backgroundColor: isProcessing ? '#ccc' : '#4CAF50'
                                                            }}
                                                            onPress={() => handleApprovePayment(paymentId)}
                                                            disabled={isProcessing}
                                                        >
                                                            {isProcessing ? (
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
                                                                backgroundColor: isProcessing ? '#ccc' : '#F44336'
                                                            }}
                                                            onPress={() => handleRejectPayment(paymentId)}
                                                            disabled={isProcessing}
                                                        >
                                                            <Text style={{ color: "white", fontWeight: "bold" }}>
                                                                ✖ Reject
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                );
                                            }

                                            // Show status if already processed
                                            return (
                                                <Text style={{ 
                                                    color: currentUserRecipient.status === 'approved' ? 'green' : 'red',
                                                    fontWeight: 'bold',
                                                    paddingVertical: 5
                                                }}>
                                                    {currentUserRecipient.status === 'approved' ? '✓ Approved' : '✗ Rejected'} - ${Number(currentUserRecipient.amount).toFixed(2)}
                                                </Text>
                                            );
                                        } else {
                                            return `Split among ${recipients.length} people`;
                                        }
                                    })()}
                                </View>

                                {/* <Text
                                    style={[
                                        styles.paymentSplitText,
                                        { color: item.isOwn ? '#FFFFFF' : theme.colors.textSecondary }
                                    ]}
                                >
                                    {(() => {
                                        const recipients = item.content.paymentData?.recipients || [];
                                        console.log("adfasd", recipients);

                                        const currentUserRecipient = recipients.find(r => r?.userId?._id === currentUser?.id);
                                        console.log("adfgasdgsad", currentUserRecipient);

                                        if (currentUserRecipient) {
                                            // if you want to show amount for this user
                                            return `Your share: ${Number(currentUserRecipient?.amount).toFixed(2)}`;
                                        } else {
                                            // fallback show all recipients count
                                            return `Split among ${recipients.length} people`;
                                        }
                                    })()}
                                </Text> */}
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
                            {item.text}
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
                {/* <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={handleAddParticipant}
                    >
                        <Ionicons name="person-add" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={handleLeaveGroup}

                    >
                        <Ionicons name="exit" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={handleRemoveParticipant}

                    >
                        <Ionicons name="person-remove" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View> */}
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
                        style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleSendMessage}
                        disabled={!message.trim()}
                    >
                        <MaterialIcons name="arrow-upward" size={20} color={"#fff"} />
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
});

export default GroupSeperateChat;
