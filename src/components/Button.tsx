import React from 'react';
import { 
  ActivityIndicator, 
  GestureResponderEvent, 
  Pressable, 
  StyleSheet, 
  Text, 
  ViewStyle, 
  TextStyle,
  View,
  Image,
  ImageSourcePropType
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'gradient' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonShape = 'rounded' | 'square' | 'pill' | 'circle';

type Props = {
  // Basic Props
  title?: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  
  // Styling Props
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  // Dimensions
  width?: number | string;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Colors
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  
  // Gradient Props
  gradientColors?: string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  
  // Icon Props
  icon?: ImageSourcePropType;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  iconSize?: number;
  iconColor?: string;
  
  // Spacing
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  margin?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  
  // Border & Radius
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  
  // Shadow
  shadow?: boolean;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number; // Android
  
  // Typography
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontFamily?: string;
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  
  // Layout
  flex?: number;
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  
  // Animation
  activeOpacity?: number;
  pressScale?: number;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'none';
  
  // Custom Content
  children?: React.ReactNode;
};

export function Button({
  // Basic Props
  title,
  onPress,
  disabled = false,
  loading = false,
  
  // Styling Props
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  style,
  textStyle,
  
  // Dimensions
  width,
  height,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  
  // Colors
  backgroundColor,
  textColor,
  borderColor,
  borderWidth = 1,
  
  // Gradient Props
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 0 },
  
  // Icon Props
  icon,
  iconPosition = 'left',
  iconSize = 20,
  iconColor,
  
  // Spacing
  padding,
  paddingHorizontal,
  paddingVertical,
  margin,
  marginHorizontal,
  marginVertical,
  
  // Border & Radius
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  
  // Shadow
  shadow = false,
  shadowColor = '#000',
  shadowOffset = { width: 0, height: 2 },
  shadowOpacity = 0.25,
  shadowRadius = 3.84,
  elevation = 5,
  
  // Typography
  fontSize,
  fontWeight,
  fontFamily,
  letterSpacing,
  lineHeight,
  textAlign = 'center',
  
  // Layout
  flex,
  alignSelf,
  justifyContent = 'center',
  alignItems = 'center',
  
  // Animation
  activeOpacity = 0.8,
  pressScale = 0.98,
  
  // Accessibility
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  
  // Custom Content
  children,
}: Props) {
  const { theme } = useTheme();

  // Size configurations
  const sizeConfig: Record<ButtonSize, { 
    paddingVertical: number; 
    paddingHorizontal: number; 
    fontSize: number;
    minHeight: number;
  }> = {
    xs: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.sm, fontSize: theme.typography.sizes.xs, minHeight: 28 },
    sm: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md, fontSize: theme.typography.sizes.sm, minHeight: 36 },
    md: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg, fontSize: theme.typography.sizes.md, minHeight: 44 },
    lg: { paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.xl, fontSize: theme.typography.sizes.lg, minHeight: 52 },
    xl: { paddingVertical: theme.spacing.xl, paddingHorizontal: theme.spacing.xxl, fontSize: theme.typography.sizes.xl, minHeight: 60 },
  };

  // Variant configurations
  const variantConfig: Record<ButtonVariant, {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderWidth: number;
  }> = {
    primary: { backgroundColor: theme.colors.primary, textColor:  theme.colors.primaryText, borderColor:  theme.colors.primary, borderWidth: 1 },
    secondary: { backgroundColor:  theme.colors.card, textColor:  theme.colors.text, borderColor:  theme.colors.border, borderWidth: 1 },
    ghost: { backgroundColor: 'transparent', textColor:  theme.colors.text, borderColor: 'transparent', borderWidth: 0 },
    outline: { backgroundColor: 'transparent', textColor:  theme.colors.primary, borderColor:  theme.colors.primary, borderWidth: 1 },
    gradient: { backgroundColor: 'transparent', textColor: '#FFFFFF', borderColor: 'transparent', borderWidth: 0 },
    danger: { backgroundColor: '#FF3B30', textColor: '#FFFFFF', borderColor: '#FF3B30', borderWidth: 1 },
    success: { backgroundColor: '#34C759', textColor: '#FFFFFF', borderColor: '#34C759', borderWidth: 1 },
  };

  // Shape configurations
  const shapeConfig: Record<ButtonShape, { borderRadius: number }> = {
    rounded: { borderRadius: 12 },
    square: { borderRadius: 4 },
    pill: { borderRadius: 999 },
    circle: { borderRadius: 999 },
  };

  const sizeStyle = sizeConfig[size];
  const variantStyle = variantConfig[variant];
  const shapeStyle = shapeConfig[shape];

  // Calculate final styles
  const finalBackgroundColor = backgroundColor || variantStyle.backgroundColor;
  const finalTextColor = textColor || variantStyle.textColor;
  const finalBorderColor = borderColor || variantStyle.borderColor;
  const finalBorderWidth = borderWidth !== undefined ? borderWidth : variantStyle.borderWidth;
  const finalBorderRadius = borderRadius !== undefined ? borderRadius : shapeStyle.borderRadius;
  const finalFontSize = fontSize || sizeStyle.fontSize;
  const finalFontWeight = fontWeight || theme.typography.weights.medium;
  const finalFontFamily = fontFamily || theme.typography.fontFamily;

  // Calculate padding
  const finalPaddingVertical = paddingVertical !== undefined ? paddingVertical : (padding !== undefined ? padding : sizeStyle.paddingVertical);
  const finalPaddingHorizontal = paddingHorizontal !== undefined ? paddingHorizontal : (padding !== undefined ? padding : sizeStyle.paddingHorizontal);

  // Calculate dimensions
  const finalMinHeight = minHeight !== undefined ? minHeight : (height || sizeStyle.minHeight);
  const finalHeight = height;
  const finalWidth = width;

  // Shadow styles
  const shadowStyles = shadow ? {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  } : {};

  // Icon rendering
  const renderIcon = () => {
    if (!icon) return null;
    
    return (
      <Image
        source={icon}
        style={{
          width: iconSize,
          height: iconSize,
          tintColor: iconColor || finalTextColor,
          marginRight: iconPosition === 'left' ? 8 : 0,
          marginLeft: iconPosition === 'right' ? 8 : 0,
          marginBottom: iconPosition === 'top' ? 4 : 0,
          marginTop: iconPosition === 'bottom' ? 4 : 0,
        }}
        resizeMode="contain"
      />
    );
  };

  // Content rendering
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={finalTextColor} size="small" />;
    }

    if (children) {
      return children;
    }

    const textElement = title ? (
      <Text
        style={[
          styles.text,
          {
            color: finalTextColor,
            fontSize: finalFontSize,
            fontWeight: finalFontWeight,
            fontFamily: finalFontFamily,
            letterSpacing: letterSpacing || 0.2,
            lineHeight: lineHeight,
            textAlign: textAlign,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    ) : null;

    if (icon && title) {
      return (
        <View style={[styles.contentContainer, { flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row' }]}>
          {renderIcon()}
          {textElement}
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {icon && renderIcon()}
        {textElement}
      </View>
    );
  };

  const opacity = disabled || loading ? 0.6 : 1;

  const buttonContent = (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: variant === 'gradient' ? 'transparent' : finalBackgroundColor,
          borderColor: finalBorderColor,
          borderWidth: finalBorderWidth,
          borderRadius: finalBorderRadius,
          borderTopLeftRadius: borderTopLeftRadius,
          borderTopRightRadius: borderTopRightRadius,
          borderBottomLeftRadius: borderBottomLeftRadius,
          borderBottomRightRadius: borderBottomRightRadius,
          paddingVertical: finalPaddingVertical,
          paddingHorizontal: finalPaddingHorizontal,
          margin: margin,
          marginHorizontal: marginHorizontal,
          marginVertical: marginVertical,
          width: finalWidth,
          height: finalHeight,
          minWidth: minWidth,
          maxWidth: maxWidth,
          minHeight: finalMinHeight,
          maxHeight: maxHeight,
          flex: flex,
          alignSelf: alignSelf,
          justifyContent: justifyContent,
          alignItems: alignItems,
          opacity: pressed ? activeOpacity : opacity,
          transform: pressed ? [{ scale: pressScale }] : [{ scale: 1 }],
        },
        shadowStyles,
        style,
      ]}
      // android_ripple={{ 
      //   color: mode === 'dark' ? '#ffffff22' : '#00000011',
      //   borderless: false,
      // }}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
    >
      {renderContent()}
    </Pressable>
  );

  // Wrap with gradient if needed
  if (variant === 'gradient' && gradientColors) {
    return (
      <LinearGradient
       colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={[
          styles.gradientContainer,
          {
            borderRadius: finalBorderRadius,
            width: finalWidth,
            height: finalHeight,
            minHeight: finalMinHeight,
          },
        ]}
      >
        {buttonContent}
      </LinearGradient>
    );
  }

  return buttonContent;
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    letterSpacing: 0.2,
  },
});

export default Button;


