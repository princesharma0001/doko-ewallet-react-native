# CurrentHistory Component

A React Native component that displays transaction history with filtering capabilities and dark/light mode support.

## Features

- **Dark/Light Mode Support**: Automatically adapts to the current theme
- **Filter Tabs**: All, Pending, Completed filters
- **Transaction Cards**: Displays transaction details in a clean card layout
- **Responsive Design**: Adapts to different screen sizes
- **Theme Integration**: Uses the project's theme system

## Usage

```jsx
import CurrentHistory from '../components/CurrentHistory';

// In your component
<CurrentHistory />
```

## Props

Currently, the component doesn't accept any props as it uses sample data. In a real implementation, you would pass:

- `transactions`: Array of transaction objects
- `onFilterChange`: Callback for filter changes
- `onTransactionPress`: Callback for transaction selection

## Transaction Data Structure

```javascript
const transaction = {
  id: 1,
  type: 'Money Transfer',
  date: '2023-12-06 00:42:14',
  recipient: 'Sent to Swati',
  amount: '$62',
  shares: '3 Shares',
  fee: '$1.8',
  total: '$65',
  duration: 'Instant',
};
```

## Theme Integration

The component uses the `useTheme` hook from the project's theme context and automatically adapts to:

- Background colors
- Text colors
- Card colors
- Border colors
- Spacing and typography

## Navigation

The component is integrated into the app's navigation system and can be accessed via:

```javascript
navigation.navigate('CurrentHistory');
```

## Styling

The component uses the project's theme system for consistent styling:

- Colors from `theme.colors`
- Spacing from `theme.spacing`
- Typography from `theme.typography`
- Border radius from `theme.borderRadius`

## Future Enhancements

- Add pull-to-refresh functionality
- Implement search functionality
- Add pagination for large transaction lists
- Add transaction detail modal
- Implement real-time updates
