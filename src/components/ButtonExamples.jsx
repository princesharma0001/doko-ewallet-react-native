import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from './Button';
import { useTheme } from '../theme';

const ButtonExamples = () => {
  const { colors, spacing } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Buttons</Text>
        
        <Button title="Primary Button" variant="primary" />
        <Button title="Secondary Button" variant="secondary" />
        <Button title="Ghost Button" variant="ghost" />
        <Button title="Outline Button" variant="outline" />
        <Button title="Danger Button" variant="danger" />
        <Button title="Success Button" variant="success" />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sizes</Text>
        
        <Button title="Extra Small" size="xs" />
        <Button title="Small" size="sm" />
        <Button title="Medium" size="md" />
        <Button title="Large" size="lg" />
        <Button title="Extra Large" size="xl" />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Shapes</Text>
        
        <Button title="Rounded" shape="rounded" />
        <Button title="Square" shape="square" />
        <Button title="Pill" shape="pill" />
        <Button title="Circle" shape="circle" width={60} height={60} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Custom Dimensions</Text>
        
        <Button title="Full Width" width="100%" />
        <Button title="Custom Height" height={60} />
        <Button title="Min Width" minWidth={200} />
        <Button title="Max Width" maxWidth={150} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Custom Colors</Text>
        
        <Button 
          title="Custom Background" 
          backgroundColor="#FF6B6B" 
          textColor="#FFFFFF" 
        />
        <Button 
          title="Custom Border" 
          borderColor="#4ECDC4" 
          borderWidth={2}
          textColor="#4ECDC4"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Gradient Buttons</Text>
        
        <Button 
          title="Gradient Button" 
          variant="gradient"
          gradientColors={['#667eea', '#764ba2']}
        />
        <Button 
          title="Custom Gradient" 
          variant="gradient"
          gradientColors={['#f093fb', '#f5576c']}
          gradientStart={{ x: 0, y: 0 }}
          gradientEnd={{ x: 1, y: 1 }}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Custom Spacing</Text>
        
        <Button title="Custom Padding" padding={20} />
        <Button title="Custom Margin" margin={10} />
        <Button 
          title="Custom Padding H/V" 
          paddingHorizontal={30} 
          paddingVertical={15} 
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Typography</Text>
        
        <Button 
          title="Custom Font Size" 
          fontSize={20} 
        />
        <Button 
          title="Bold Text" 
          fontWeight="bold" 
        />
        <Button 
          title="Custom Letter Spacing" 
          letterSpacing={2} 
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Shadows & Effects</Text>
        
        <Button 
          title="With Shadow" 
          shadow={true}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={5}
          elevation={8}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>States</Text>
        
        <Button title="Loading Button" loading={true} />
        <Button title="Disabled Button" disabled={true} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Custom Content</Text>
        
        <Button>
          <View style={styles.customContent}>
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Custom</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Content</Text>
          </View>
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Layout Examples</Text>
        
        <View style={styles.row}>
          <Button title="Flex 1" flex={1} marginHorizontal={5} />
          <Button title="Flex 2" flex={2} marginHorizontal={5} />
        </View>
        
        <Button title="Align Self Start" alignSelf="flex-start" />
        <Button title="Align Self End" alignSelf="flex-end" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  customContent: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
});

export default ButtonExamples;
