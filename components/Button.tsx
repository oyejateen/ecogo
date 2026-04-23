import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

interface ButtonProps {
  onPress: () => void;
  title: string;
  type?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  type = 'primary',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const getButtonStyle = () => {
    switch (type) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary';
      case 'tertiary':
        return 'bg-tertiary';
      default:
        return 'bg-primary';
    }
  };

  return (
    <StyledTouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`py-3 px-6 rounded-lg items-center justify-center ${getButtonStyle()} ${
        disabled ? 'opacity-50' : 'opacity-100'
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <StyledText className="text-white font-bold text-base">{title}</StyledText>
      )}
    </StyledTouchableOpacity>
  );
};

export default Button; 