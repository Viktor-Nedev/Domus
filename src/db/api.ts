import { supabase } from './supabase';
import type {
  Profile,
  Property,
  SavedProperty,
  Conversation,
  Message,
  MessageTemplate,
  CurrencyRate,
  MarketData,
  BuyerPreferences,
  PropertyFormData,
  MessageFormData,
} from '@/types';

// ============ PROFILES ============

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ============ PROPERTIES ============

export const getProperties = async (filters?: {
  status?: string;
  country?: string;
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}): Promise<Property[]> => {
  let query = supabase
    .from('properties')
    .select(`
      *,
      broker:profiles!broker_id(id, name, account_type, agency_name)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.country) query = query.eq('country', filters.country);
  if (filters?.city) query = query.eq('city', filters.city);
  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.minPrice) query = query.gte('price_eur', filters.minPrice);
  if (filters?.maxPrice) query = query.lte('price_eur', filters.maxPrice);
  
  if (filters?.limit) query = query.limit(filters.limit);
  if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getProperty = async (propertyId: string): Promise<Property | null> => {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      broker:profiles!broker_id(id, name, account_type, agency_name, phone, email)
    `)
    .eq('id', propertyId)
    .maybeSingle();

  if (error) throw error;
  
  // Increment view count
  if (data) {
    await supabase
      .from('properties')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', propertyId);
  }
  
  return data;
};

export const getBrokerProperties = async (brokerId: string): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('broker_id', brokerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createProperty = async (propertyData: PropertyFormData, brokerId: string): Promise<Property | null> => {
  // Convert price to EUR for storage
  const priceEur = propertyData.currency === 'EUR' 
    ? propertyData.price 
    : propertyData.price; // Will be converted by Edge Function

  const { data, error } = await supabase
    .from('properties')
    .insert({
      ...propertyData,
      broker_id: brokerId,
      price_eur: priceEur,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateProperty = async (propertyId: string, updates: Partial<PropertyFormData>): Promise<Property | null> => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', propertyId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteProperty = async (propertyId: string): Promise<void> => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId);

  if (error) throw error;
};

export const getTopProperties = async (limit = 6): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      broker:profiles!broker_id(id, name, account_type, agency_name)
    `)
    .eq('status', 'active')
    .gte('domus_score', 70)
    .order('domus_score', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// ============ SAVED PROPERTIES ============

export const getSavedProperties = async (userId: string): Promise<SavedProperty[]> => {
  const { data, error } = await supabase
    .from('saved_properties')
    .select(`
      *,
      property:properties!property_id(
        *,
        broker:profiles!broker_id(id, name, account_type, agency_name)
      )
    `)
    .eq('user_id', userId)
    .order('saved_date', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const saveProperty = async (userId: string, propertyId: string, notes?: string): Promise<SavedProperty | null> => {
  const { data, error } = await supabase
    .from('saved_properties')
    .insert({ user_id: userId, property_id: propertyId, notes: notes || null })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const unsaveProperty = async (userId: string, propertyId: string): Promise<void> => {
  const { error } = await supabase
    .from('saved_properties')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId);

  if (error) throw error;
};

export const isPropertySaved = async (userId: string, propertyId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('saved_properties')
    .select('id')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .maybeSingle();

  if (error) return false;
  return !!data;
};

// ============ CONVERSATIONS & MESSAGES ============

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participant_1:profiles!participant_1_id(id, name, account_type, agency_name),
      participant_2:profiles!participant_2_id(id, name, account_type, agency_name),
      property:properties!property_id(id, title, photos, price, currency)
    `)
    .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getConversation = async (conversationId: string): Promise<Conversation | null> => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participant_1:profiles!participant_1_id(id, name, account_type, agency_name),
      participant_2:profiles!participant_2_id(id, name, account_type, agency_name),
      property:properties!property_id(id, title, photos, price, currency)
    `)
    .eq('id', conversationId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getOrCreateConversation = async (
  userId: string,
  otherUserId: string,
  propertyId?: string
): Promise<Conversation | null> => {
  // Try to find existing conversation
  let query = supabase
    .from('conversations')
    .select('*')
    .or(`and(participant_1_id.eq.${userId},participant_2_id.eq.${otherUserId}),and(participant_1_id.eq.${otherUserId},participant_2_id.eq.${userId})`);

  if (propertyId) {
    query = query.eq('property_id', propertyId);
  }

  const { data: existing } = await query.maybeSingle();

  if (existing) return existing;

  // Create new conversation
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      participant_1_id: userId,
      participant_2_id: otherUserId,
      property_id: propertyId || null,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!sender_id(id, name, account_type)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const sendMessage = async (messageData: MessageFormData & { sender_id: string; conversation_id: string }): Promise<Message | null> => {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .maybeSingle();

  if (error) throw error;

  // Update conversation
  if (data) {
    await supabase
      .from('conversations')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: messageData.message_text.substring(0, 100),
      })
      .eq('id', messageData.conversation_id);
  }

  return data;
};

export const markMessagesAsRead = async (conversationId: string, userId: string): Promise<void> => {
  await supabase
    .from('messages')
    .update({ read_status: true })
    .eq('conversation_id', conversationId)
    .eq('receiver_id', userId)
    .eq('read_status', false);
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('read_status', false);

  if (error) return 0;
  return count || 0;
};

// ============ MESSAGE TEMPLATES ============

export const getMessageTemplates = async (brokerId: string): Promise<MessageTemplate[]> => {
  const { data, error } = await supabase
    .from('message_templates')
    .select('*')
    .eq('broker_id', brokerId)
    .order('usage_count', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createMessageTemplate = async (brokerId: string, name: string, text: string): Promise<MessageTemplate | null> => {
  const { data, error } = await supabase
    .from('message_templates')
    .insert({ broker_id: brokerId, template_name: name, template_text: text })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ============ CURRENCY RATES ============

export const getCurrencyRates = async (): Promise<CurrencyRate[]> => {
  const { data, error } = await supabase
    .from('currency_rates')
    .select('*');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const convertCurrency = async (amount: number, fromCurrency: string, toCurrency: string): Promise<number> => {
  if (fromCurrency === toCurrency) return amount;

  const { data: rates } = await supabase
    .from('currency_rates')
    .select('*')
    .in('currency_code', [fromCurrency, toCurrency]);

  if (!rates || rates.length < 2) return amount;

  const fromRate = rates.find(r => r.currency_code === fromCurrency)?.rate_to_eur || 1;
  const toRate = rates.find(r => r.currency_code === toCurrency)?.rate_to_eur || 1;

  // Convert to EUR first, then to target currency
  const amountInEur = amount / fromRate;
  return amountInEur * toRate;
};

// ============ BUYER PREFERENCES ============

export const getBuyerPreferences = async (userId: string): Promise<BuyerPreferences | null> => {
  const { data, error } = await supabase
    .from('buyer_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const saveBuyerPreferences = async (userId: string, preferences: Partial<BuyerPreferences>): Promise<BuyerPreferences | null> => {
  // Check if preferences exist
  const existing = await getBuyerPreferences(userId);

  if (existing) {
    const { data, error } = await supabase
      .from('buyer_preferences')
      .update({ ...preferences, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('buyer_preferences')
    .insert({ ...preferences, user_id: userId })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ============ MARKET DATA ============

export const getMarketData = async (filters?: {
  country?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
}): Promise<MarketData[]> => {
  let query = supabase
    .from('market_data')
    .select('*')
    .order('date', { ascending: true });

  if (filters?.country) query = query.eq('country', filters.country);
  if (filters?.city) query = query.eq('city', filters.city);
  if (filters?.startDate) query = query.gte('date', filters.startDate);
  if (filters?.endDate) query = query.lte('date', filters.endDate);

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};
