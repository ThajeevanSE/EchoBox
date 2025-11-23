import { Feather } from '@expo/vector-icons';
import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { lightTheme } from '../constants/theme';
import { useState } from 'react';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  secure?: boolean;
}

export const FormField = ({ label, error, secure, ...inputProps }: FormFieldProps) => {
  const [hidden, setHidden] = useState(Boolean(secure));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error ? styles.inputError : undefined]}>
        <TextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor={lightTheme.secondaryText}
          secureTextEntry={hidden}
          autoCapitalize="none"
        />
        {secure && (
          <TouchableOpacity onPress={() => setHidden(prev => !prev)}>
            <Feather
              name={hidden ? 'eye-off' : 'eye'}
              size={18}
              color={lightTheme.secondaryText}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: lightTheme.text,
    marginBottom: 8
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: lightTheme.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: lightTheme.card
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: lightTheme.text
  },
  inputError: {
    borderColor: '#f87171'
  },
  errorText: {
    marginTop: 6,
    color: '#ef4444',
    fontSize: 12
  }
});
