import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CategoryChip } from '@/components/CategoryChip';
import { MapView } from '@/components/MapView';
import { useApp } from '@/context/AppContext';

export default function PublishServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { categories, createOrder } = useApp();

  const [step, setStep] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    (params.categoryId as string) || ''
  );
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('2');
  const [observations, setObservations] = useState('');

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handlePublish = () => {
    const newOrder = createOrder({
      categoryId: selectedCategoryId,
      categoryName: selectedCategory?.name || '',
      description,
      address,
      latitude: -23.5505,
      longitude: -46.6333,
      date: new Date(),
      duration: parseInt(duration),
      observations,
      status: 'published',
    });

    router.replace(`/orders/${newOrder.id}`);
  };

  const isStep1Valid = selectedCategoryId && description.length > 10;
  const isStep2Valid = address.length > 5;
  const isStep3Valid = date && time && duration;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </Pressable>
        <Text style={styles.headerTitle}>Publicar Serviço</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            style={[
              styles.progressStep,
              s <= step && styles.progressStepActive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>
              Qual serviço você precisa?
            </Text>
            <Text style={styles.stepSubtitle}>
              Selecione a categoria e descreva o que precisa
            </Text>

            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <CategoryChip
                  key={category.id}
                  name={category.name}
                  icon={category.icon}
                  selected={selectedCategoryId === category.id}
                  onPress={() => setSelectedCategoryId(category.id)}
                />
              ))}
            </View>

            <Text style={styles.label}>Descrição do serviço</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Descreva detalhadamente o serviço que você precisa..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Onde será o serviço?</Text>
            <Text style={styles.stepSubtitle}>
              Selecione a localização no mapa
            </Text>

            <View style={styles.mapWrapper}>
              <MapView centerPin />
            </View>

            <Input
              label="Endereço"
              placeholder="Rua, número, bairro"
              value={address}
              onChangeText={setAddress}
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Quando você precisa?</Text>
            <Text style={styles.stepSubtitle}>
              Informe data, horário e duração estimada
            </Text>

            <Input
              label="Data"
              placeholder="DD/MM/AAAA"
              value={date}
              onChangeText={setDate}
            />

            <Input
              label="Horário"
              placeholder="HH:MM"
              value={time}
              onChangeText={setTime}
            />

            <Input
              label="Duração estimada (horas)"
              placeholder="Ex: 2"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Fotos (opcional)</Text>
            <Pressable style={styles.photoButton}>
              <Camera size={32} color="#4A90E2" />
              <Text style={styles.photoButtonText}>Adicionar fotos</Text>
            </Pressable>

            <Input
              label="Observações (opcional)"
              placeholder="Alguma informação adicional?"
              value={observations}
              onChangeText={setObservations}
            />
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Revise seu pedido</Text>
            <Text style={styles.stepSubtitle}>
              Confira se está tudo correto antes de publicar
            </Text>

            <View style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Categoria</Text>
                <Text style={styles.reviewValue}>
                  {selectedCategory?.name}
                </Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Descrição</Text>
                <Text style={styles.reviewValue}>{description}</Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Endereço</Text>
                <Text style={styles.reviewValue}>{address}</Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Data e horário</Text>
                <Text style={styles.reviewValue}>
                  {date} às {time}
                </Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Duração</Text>
                <Text style={styles.reviewValue}>{duration}h</Text>
              </View>

              {observations && (
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Observações</Text>
                  <Text style={styles.reviewValue}>{observations}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step < 4 ? (
          <Button
            title="Continuar"
            onPress={handleNext}
            disabled={
              (step === 1 && !isStep1Valid) ||
              (step === 2 && !isStep2Valid) ||
              (step === 3 && !isStep3Valid)
            }
          />
        ) : (
          <Button title="Publicar serviço" onPress={handlePublish} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerRight: {
    width: 32,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#4A90E2',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  mapWrapper: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  photoButton: {
    height: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  photoButtonText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
    marginTop: 8,
  },
  reviewCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
  },
  reviewRow: {
    marginBottom: 16,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});
