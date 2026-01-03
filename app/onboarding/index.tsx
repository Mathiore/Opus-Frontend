import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Zap, Shield, MapPin } from 'lucide-react-native';
import { Button } from '@/components/Button';

const onboardingSteps = [
  {
    icon: Zap,
    title: 'Encontre profissionais\nperto de você',
    description:
      'Conecte-se com profissionais qualificados na sua região em segundos',
  },
  {
    icon: Shield,
    title: 'Pagamento protegido\ne seguro',
    description:
      'Seu dinheiro só é liberado quando o serviço for concluído com sucesso',
  },
  {
    icon: MapPin,
    title: 'Serviços rápidos\ne confiáveis',
    description:
      'Receba propostas em minutos e escolha o melhor profissional para você',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/login');
    }
  };

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <IconComponent size={80} color="#4A90E2" strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>

        <View style={styles.pagination}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={
            currentStep === onboardingSteps.length - 1
              ? 'Começar'
              : 'Continuar'
          }
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#4A90E2',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
  },
});
