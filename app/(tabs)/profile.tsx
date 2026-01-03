import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useApp();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    danger = false,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
  }) => (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.menuItemIcon,
            danger && styles.menuItemIconDanger,
          ]}
        >
          <Icon size={20} color={danger ? '#FF3B30' : '#4A90E2'} />
        </View>
        <View style={styles.menuItemText}>
          <Text
            style={[
              styles.menuItemTitle,
              danger && styles.menuItemTitleDanger,
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <ChevronRight size={20} color="#999999" />
    </Pressable>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Usuário não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={User}
              title="Dados pessoais"
              subtitle="Nome, telefone, email"
              onPress={() => {}}
            />
            <MenuItem
              icon={MapPin}
              title="Endereços"
              subtitle="2 endereços salvos"
              onPress={() => {}}
            />
            <MenuItem
              icon={CreditCard}
              title="Métodos de pagamento"
              subtitle="1 cartão cadastrado"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={Bell}
              title="Notificações"
              subtitle="Gerenciar notificações"
              onPress={() => {}}
            />
            <MenuItem
              icon={Settings}
              title="Configurações"
              subtitle="Ajustes do aplicativo"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={HelpCircle}
              title="Ajuda"
              subtitle="Central de ajuda e FAQ"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={LogOut}
              title="Sair"
              onPress={handleLogout}
              danger
            />
          </View>
        </View>

        <Text style={styles.version}>Versão 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemIconDanger: {
    backgroundColor: '#FFEBEE',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  menuItemTitleDanger: {
    color: '#FF3B30',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  version: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 100,
  },
});
