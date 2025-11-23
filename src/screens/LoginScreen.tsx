import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { FormField } from '../components/FormField';
import { lightTheme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { loginUser } from '../store/slices/authSlice';
import type { AuthStackParamList } from '../navigation/types';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required')
});

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(state => state.auth);
  const [showInfo, setShowInfo] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Welcome back 👋</Text>
        <Text style={styles.subtitle}>Enter your credentials to continue.</Text>

        {showInfo && (
          <TouchableOpacity style={styles.infoBox} onPress={() => setShowInfo(false)}>
            <Text style={styles.infoText}>
              Use dummy credentials like emilys@dummy.com (password: emilyspass) or create a new
              account via Register.
            </Text>
          </TouchableOpacity>
        )}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async values => {
            await dispatch(loginUser(values));
          }}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View>
              <FormField
                label="Email"
                placeholder="emilys@dummy.com"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email ? errors.email : undefined}
              />
              <FormField
                label="Password"
                placeholder="•••••••"
                secure
                value={values.password}
                onChangeText={handleChange('password')}
                error={touched.password ? errors.password : undefined}
              />

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                <Text style={styles.buttonText}>
                  {status === 'loading' ? 'Signing in...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>No account yet?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightTheme.background
  },
  keyboard: {
    flex: 1
  },
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 12
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: lightTheme.text
  },
  subtitle: {
    fontSize: 15,
    color: lightTheme.secondaryText,
    marginBottom: 16
  },
  infoBox: {
    backgroundColor: `${lightTheme.accent}15`,
    borderRadius: 12,
    padding: 14
  },
  infoText: {
    color: lightTheme.secondaryText,
    fontSize: 13
  },
  button: {
    backgroundColor: lightTheme.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6
  },
  footerText: {
    color: lightTheme.secondaryText
  },
  link: {
    color: lightTheme.accent,
    fontWeight: '600'
  },
  errorText: {
    color: '#ef4444',
    marginTop: 4
  }
});
