import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { FormField } from '../components/FormField';
import { lightTheme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { registerUser } from '../store/slices/authSlice';
import type { AuthStackParamList } from '../navigation/types';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(state => state.auth);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Sign up with your email address.</Text>
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={RegisterSchema}
          onSubmit={async ({ name, email, password }) => {
            await dispatch(registerUser({ name, email, password }));
          }}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View>
              <FormField
                label="Full name"
                placeholder="Emily Stone"
                value={values.name}
                onChangeText={handleChange('name')}
                error={touched.name ? errors.name : undefined}
              />
              <FormField
                label="Email"
                placeholder="you@email.com"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email ? errors.email : undefined}
              />
              <FormField
                label="Password"
                placeholder="Create a password"
                secure
                value={values.password}
                onChangeText={handleChange('password')}
                error={touched.password ? errors.password : undefined}
              />
              <FormField
                label="Confirm password"
                placeholder="Repeat your password"
                secure
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
              />

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                <Text style={styles.buttonText}>
                  {status === 'loading' ? 'Creating account...' : 'Register'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login</Text>
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
    gap: 16
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: lightTheme.text
  },
  subtitle: {
    fontSize: 15,
    color: lightTheme.secondaryText,
    marginBottom: 8
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
    fontSize: 16,
    fontWeight: '600'
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
