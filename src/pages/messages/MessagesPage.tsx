import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from '@/db/api';
import type { Conversation, Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const MessagesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        selectConversation(conv);
      }
    }
  }, [searchParams, conversations]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      const convs = await getConversations(user.id);
      setConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    try {
      const msgs = await getMessages(conversation.id);
      setMessages(msgs);

      // Mark as read
      if (user) {
        await markMessagesAsRead(conversation.id, user.id);
        // Reload conversations to update unread count
        loadConversations();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation || !user) return;

    const receiverId = selectedConversation.participant_1_id === user.id
      ? selectedConversation.participant_2_id
      : selectedConversation.participant_1_id;

    try {
      await sendMessage({
        sender_id: user.id,
        receiver_id: receiverId,
        conversation_id: selectedConversation.id,
        message_text: messageText,
        property_id: selectedConversation.property_id,
      });

      setMessageText('');
      // Reload messages
      const msgs = await getMessages(selectedConversation.id);
      setMessages(msgs);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return null;
    return conversation.participant_1_id === user.id
      ? conversation.participant_2
      : conversation.participant_1;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conversation) => {
                    const otherUser = getOtherParticipant(conversation);
                    const isUnread = user && (
                      (conversation.participant_1_id === user.id && conversation.unread_count_1 > 0) ||
                      (conversation.participant_2_id === user.id && conversation.unread_count_2 > 0)
                    );

                    return (
                      <div
                        key={conversation.id}
                        className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => selectConversation(conversation)}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {otherUser?.name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold truncate">{otherUser?.name}</p>
                              {isUnread && (
                                <span className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                            {conversation.property && (
                              <p className="text-xs text-muted-foreground truncate">
                                {conversation.property.title}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {conversation.last_message_preview}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {getOtherParticipant(selectedConversation)?.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{getOtherParticipant(selectedConversation)?.name}</CardTitle>
                      {selectedConversation.property && (
                        <p className="text-sm text-muted-foreground">
                          Re: {selectedConversation.property.title}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[450px] p-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isOwn = message.sender_id === user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.message_text}</p>
                                <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="h-[600px] flex items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to view messages</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
