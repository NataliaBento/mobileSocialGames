import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import styles from "../../assets/styles/signup.styles";
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useState } from 'react';
import {useRouter} from "expo-router";
import { useAuthStore } from '../../authStore/authStore';

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { user, isLoading, register} = useAuthStore();


  const router = useRouter();

  const handleSignUp = async () => {
    const result = await register(username, email, password);

    if (!result.success) Alert.alert("Error", result.error);
  };


  return (
   <KeyboardAvoidingView
   style={{flex: 1}}
   behavior={Platform.OS === "ios" ? "padding" : "height"}> 

    <View style={styles.container}>
    <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
        <Text style={styles.title}>Social Games</Text>
        <Text style={styles.subtitle}>Compartilhe seu jogo favorito</Text>
      </View>
      <View style={styles.formContainer}>
        {/* USERNAME INPUT */}
        <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome de Usuário</Text>
        <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline" 
          size={20}
          color={COLORS.primary}
          style={styles.inputIcon}
          />
          <TextInput 
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor={COLORS.placeholderText}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          />
        </View>
        </View>
        {/* EMAIL INPUT */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons
            name="mail-outline"
            size={20}
            color={COLORS.primary} 
            style={styles.inputIcon}
            />
            <TextInput 
            style={styles.input}
            placeholder="email@email.com"
            value={email}
            placeholderTextColor={COLORS.placeholderText}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            />
          </View>
        </View>
        {/* PASSWORD INPUT */}
        <View style={styles.inputGroup}>
        <Text style={styles.label}> Senha</Text>
        <View style={styles.inputContainer}>
          <Ionicons
          name="lock-closed-outline" 
          size={20}
          color={COLORS.primary}
          style={styles.inputIcon}
          />
          <TextInput 
          style={styles.input}
          placeholder="*****"
          placeholderTextColor={COLORS.placeholderText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          />
          <TouchableOpacity
          onPress={() => setShowPassword (!showPassword)} 
          style={styles.eyeIcon}
          >
            <Ionicons 
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        </View>
        {/* PASSWORD INPUT */}
        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="fff" />
        ) : (
          <Text style={styles.buttonText}> Cadastrar-se</Text>
        )}
        </TouchableOpacity>
        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}> Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}> Login</Text>
            </TouchableOpacity>
        </View>
      </View>
      </View>
    </View>

   </KeyboardAvoidingView>
  )
}