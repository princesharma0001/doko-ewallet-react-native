import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBar from '../components/BottomBar';

const { width, height } = Dimensions.get('window');

const DAppSection = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample dApp data
  const dApps = [
    {
      id: 1,
      name: 'Uniswap',
      category: 'DEFI',
      description: 'Swap tokens and provide liquidity',
      icon: '🦄', // Using emoji for simplicity, in real app you'd use actual icons
      isFavorite: false,
      url: 'https://app.uniswap.org',
    },
    {
      id: 2,
      name: 'OpenSea',
      category: 'NFT',
      description: 'NFT Marketplace',
      icon: '🌊',
      isFavorite: true,
      url: 'https://opensea.io',
    },
    {
      id: 3,
      name: 'Aave',
      category: 'DEFI',
      description: 'Lending and borrowing protocol',
      icon: '👻',
      isFavorite: false,
      url: 'https://app.aave.com',
    },
    {
      id: 4,
      name: 'Compound',
      category: 'DEFI',
      description: 'Earn interest on your crypto',
      icon: '🏦',
      isFavorite: false,
      url: 'https://app.compound.finance',
    },
    {
      id: 5,
      name: 'CryptoPunks',
      category: 'NFT',
      description: '10,000 unique collectible characters',
      icon: '👤',
      isFavorite: true,
      url: 'https://cryptopunks.app',
    },
    {
      id: 6,
      name: 'Axie Infinity',
      category: 'GAMES',
      description: 'Play-to-earn blockchain game',
      icon: '🎮',
      isFavorite: false,
      url: 'https://axieinfinity.com',
    },
  ];

  const categories = ['All', 'DeFi', 'NFTs', 'Games'];


  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleDAppPress = (dApp) => {
    Alert.alert(
      'Open dApp',
      `Would you like to open ${dApp.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => console.log(`Opening ${dApp.url}`) },
      ]
    );
  };

  const handleAddCustomDApp = () => {
    Alert.alert(
      'Add Custom dApp',
      'This feature will allow you to add custom dApps to your browser.',
      [{ text: 'OK' }]
    );
  };

  const handleFavoriteToggle = (dAppId) => {
    // In a real app, you'd update the state or make an API call
    console.log(`Toggling favorite for dApp ${dAppId}`);
  };

  const filteredDApps = dApps.filter(dApp => {
    const matchesSearch = dApp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dApp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' ||
      dApp.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const renderDAppHeader = () => (
    <View style={styles.dAppHeader}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
        <Text style={[styles.dAppTitle, { color: theme.colors.text, fontSize: theme.typography.sizes.xxl }]}>
          dApp Browser
        </Text>
        <Text style={[styles.dAppSubtitle, { color: theme.colors.textSecondary }]}>
          Browse and interact with decentralized applications directly from the platform.
        </Text>
      </View>

    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search"
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );

  const renderCategoryFilters = () => (
    <View style={styles.categoryContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            {
              backgroundColor: selectedCategory === category ? '#FFFFFF' : theme.colors.surface,
            },
          ]}
          onPress={() => handleCategorySelect(category)}
        >
          <Text
            style={[
              styles.categoryButtonText,
              {
                color: selectedCategory === category ? '#000000' : theme.colors.text,
              },
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDAppCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.dAppCard, { backgroundColor: theme.colors.surface }]}
      // onPress={() => handleDAppPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.dAppCardContent}>
        <View style={styles.dAppIconContainer}>
          <Text style={styles.dAppIcon}>{item.icon}</Text>
        </View>

        <View style={styles.dAppInfo}>
          <View style={styles.dAppHeader}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.dAppName, { color: theme.colors.text }]}>
                {item.name}
              </Text>

            </View>

            {/* <TouchableOpacity
              onPress={() => handleFavoriteToggle(item.id)}
              style={styles.favoriteButton}
            >
              <Ionicons
                name={item.isFavorite ? 'star' : 'star-outline'}
                size={20}
                color="#FFD700"
              />
            </TouchableOpacity> */}
          </View>

          <Text style={[styles.dAppCategory, { color: theme.colors.textSecondary }]}>
            {item.category}
          </Text>

          <Text style={[styles.dAppDescription, { color: theme.colors.text }]}>
            {item.description}
          </Text>
        </View>

        <View style={styles.dAppAction}>
          <Ionicons name="open-outline" size={24} color={theme.colors.text} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDAppList = () => (
    <View style={styles.dAppListContainer}>
      <FlatList
        data={filteredDApps}
        renderItem={renderDAppCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.dAppListContent}
      />
    </View>
  );

  const renderAddCustomButton = () => (
    <View style={styles.addCustomContainer}>
      <TouchableOpacity
        style={[styles.addCustomButton, { borderColor: theme.colors.primary }]}
        onPress={handleAddCustomDApp}
        activeOpacity={0.7}
      >
        <Text style={[styles.addCustomButtonText, { color: theme.colors.primary }]}>
          + Add Custom dApp
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderDAppHeader()}
        {renderSearchBar()}
        {renderCategoryFilters()}
        {renderDAppList()}
        {renderAddCustomButton()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dAppHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  dAppTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  dAppSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'System',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dAppListContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  dAppListContent: {
    gap: 12,
  },
  dAppCard: {
    borderRadius: 12,
    padding: 12,
  },
  dAppCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dAppIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dAppIcon: {
    fontSize: 24,
  },
  dAppInfo: {
    flex: 1,
  },
  dAppHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginBottom: 4,
  },
  dAppName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  dAppCategory: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  dAppDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  dAppAction: {
    padding: 8,
  },
  addCustomContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  addCustomButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCustomButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DAppSection;
