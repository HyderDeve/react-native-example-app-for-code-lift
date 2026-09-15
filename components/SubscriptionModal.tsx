import { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { icons } from '@/constants/icons';
import { useSubscriptionStore } from '@/lib/subscriptionStore';

const FREQUENCIES = ['Monthly', 'Yearly'] as const;
type Frequency = (typeof FREQUENCIES)[number];

const CATEGORIES = [
    'Entertainment',
    'AI Tools',
    'Developer Tools',
    'Design',
    'Productivity',
    'Cloud',
    'Music',
    'Other',
] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
    Entertainment: '#f4b8c1',
    'AI Tools': '#b8d4e3',
    'Developer Tools': '#e8def8',
    Design: '#f5c542',
    Productivity: '#c9e4b8',
    Cloud: '#bcd8f7',
    Music: '#f7c8e0',
    Other: '#d9d9d9',
};

interface SubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
}

const SubscriptionModal = ({ visible, onClose }: SubscriptionModalProps) => {
    const addSubscription = useSubscriptionStore((state) => state.addSubscription);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('Monthly');
    const [category, setCategory] = useState<Category>('Entertainment');

    const trimmedName = name.trim();
    const parsedPrice = parseFloat(price);
    const isNameValid = trimmedName.length > 0;
    const isPriceValid = !Number.isNaN(parsedPrice) && parsedPrice > 0;
    const isFormValid = isNameValid && isPriceValid;

    const resetForm = () => {
        setName('');
        setPrice('');
        setFrequency('Monthly');
        setCategory('Entertainment');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = () => {
        if (!isFormValid) return;

        const now = dayjs();
        const renewalDate = frequency === 'Monthly' ? now.add(1, 'month') : now.add(1, 'year');

        const newSubscription: Subscription = {
            id: `sub-${Date.now()}`,
            icon: icons.wallet,
            name: trimmedName,
            category,
            status: 'active',
            startDate: now.toISOString(),
            price: parsedPrice,
            currency: 'USD',
            billing: frequency,
            renewalDate: renewalDate.toISOString(),
            color: CATEGORY_COLORS[category],
        };

        addSubscription(newSubscription);
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <Pressable className="modal-overlay" onPress={handleClose}>
                    <Pressable className="modal-container" onPress={() => {}}>
                        <View className="modal-header">
                            <Text className="modal-title">New Subscription</Text>
                            <Pressable className="modal-close" onPress={handleClose}>
                                <Text className="modal-close-text">✕</Text>
                            </Pressable>
                        </View>

                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerClassName="modal-body"
                        >
                            <View className="auth-field">
                                <Text className="auth-label">Name</Text>
                                <TextInput
                                    className="auth-input"
                                    placeholder="e.g. Netflix"
                                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Price</Text>
                                <TextInput
                                    className="auth-input"
                                    placeholder="0.00"
                                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="decimal-pad"
                                />
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Frequency</Text>
                                <View className="picker-row">
                                    {FREQUENCIES.map((option) => {
                                        const active = frequency === option;
                                        return (
                                            <Pressable
                                                key={option}
                                                className={clsx(
                                                    'picker-option',
                                                    active && 'picker-option-active'
                                                )}
                                                onPress={() => setFrequency(option)}
                                            >
                                                <Text
                                                    className={clsx(
                                                        'picker-option-text',
                                                        active && 'picker-option-text-active'
                                                    )}
                                                >
                                                    {option}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Category</Text>
                                <View className="category-scroll">
                                    {CATEGORIES.map((option) => {
                                        const active = category === option;
                                        return (
                                            <Pressable
                                                key={option}
                                                className={clsx(
                                                    'category-chip',
                                                    active && 'category-chip-active'
                                                )}
                                                onPress={() => setCategory(option)}
                                            >
                                                <Text
                                                    className={clsx(
                                                        'category-chip-text',
                                                        active && 'category-chip-text-active'
                                                    )}
                                                >
                                                    {option}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>

                            <Pressable
                                className={clsx('auth-button', !isFormValid && 'auth-button-disabled')}
                                onPress={handleSubmit}
                                disabled={!isFormValid}
                            >
                                <Text className="auth-button-text">Add Subscription</Text>
                            </Pressable>
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default SubscriptionModal;