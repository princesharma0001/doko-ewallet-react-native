import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AddMoney = ({ navigation }) => {
  const { theme } = useTheme();
  const [amount, setAmount] = useState('');

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      {/* Amount Input */}
      <View style={styles.amountContainer}>
        <Text style={[styles.dollarSign, { color: theme.colors.text }]}>$</Text>
        <TextInput
          style={[styles.amountInput, { color: theme.colors.text }]}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor={theme.colors.text || '#888'}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={() => console.log("Done pressed")}

        />
      </View>

      {/* Source Selector */}
      <View style={styles.sourceContainer}>
        <TouchableOpacity style={[styles.sourceButton, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sourceText, { color: theme.colors.text }]}>
            Adding Money from Current Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Money Button (sticks at bottom) */}
      <View style={styles.bottomFixed}>
        <TouchableOpacity
          style={styles.addMoneyButton}
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
              })
            );
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.5, y: 0.5 }}
            style={styles.gradientButton}
          >
            <Text style={[styles.addMoneyText, { color: "#fff" }]}>
              Add Money
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingTop: 55
  },
  dollarSign: {
    fontSize: 48,
    fontWeight: '700',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 64,
    fontWeight: '700',
    // borderBottomWidth: 1,
    // borderColor: '#ccc',
    minWidth: 120,
    textAlign: 'center',
  },
  sourceContainer: {
    paddingHorizontal: 35,
    marginBottom: 30,
  },
  sourceButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomFixed: {
    marginTop: 'auto',
    padding: 20,
    marginBottom: 20
  },
  addMoneyButton: {
    width: '100%',
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoneyText: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default AddMoney;
