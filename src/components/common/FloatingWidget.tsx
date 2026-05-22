'use client'
import { useState } from 'react'
import { Bell, MessageSquare, X, Send, User, CheckCircle, AlertCircle, Package, Truck } from 'lucide-react'
import { clsx } from 'clsx'

interface Notification {
  id: string
  type: 'order' | 'rfq' | 'dispatch' | 'payment' | 'system'
  title: string
  message: string
  time: string
  read: boolean
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  time: string
  isUser: boolean
}

const initialNotifications: Notification[] = [
  { id: '1', type: 'order', title: 'New Order Received', message: 'Order #ORD-2024-001 from ABC Corp - ₹5,00,000', time: '2 min ago', read: false },
  { id: '2', type: 'rfq', title: 'RFQ Response', message: 'Sharma Industries responded to your RFQ', time: '15 min ago', read: false },
  { id: '3', type: 'dispatch', title: 'Dispatch Update', message: 'Order #ORD-2024-045 dispatched via Fast Move', time: '1 hour ago', read: true },
  { id: '4', type: 'payment', title: 'Payment Received', message: 'Payment of ₹2,50,000 received from XYZ Ltd', time: '2 hours ago', read: true },
]

const initialChats: Record<string, ChatMessage[]> = {
  'Sharma Industries': [
    { id: '1', sender: 'Sharma Industries', message: 'We can supply 100 units by next week', time: '10:30 AM', isUser: false },
    { id: '2', sender: 'You', message: 'Great! Please send the quotation', time: '10:35 AM', isUser: true },
    { id: '3', sender: 'Sharma Industries', message: 'Quotation sent via email', time: '10:40 AM', isUser: false },
  ],
  'Patel Traders': [
    { id: '1', sender: 'Patel Traders', message: 'Interested in bulk order', time: '9:00 AM', isUser: false },
  ],
  'Customer Support': [
    { id: '1', sender: 'Support', message: 'Your query has been resolved', time: 'Yesterday', isUser: false },
  ],
}

export function FloatingWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'notifications' | 'messages'>('notifications')
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(initialChats)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    }
    
    setChats(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), message]
    }))
    setNewMessage('')
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return <Package size={16} className="text-accent" />
      case 'rfq': return <AlertCircle size={16} className="text-warning" />
      case 'dispatch': return <Truck size={16} className="text-teal-400" />
      case 'payment': return <CheckCircle size={16} className="text-success" />
      default: return <Bell size={16} className="text-muted" />
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-accent to-cyan-400 shadow-lg shadow-accent/30 flex items-center justify-center hover:scale-110 transition-transform"
      >
        {isOpen ? (
          <X size={24} className="text-primary" />
        ) : (
          <div className="relative">
            <Bell size={24} className="text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 glass rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('notifications')}
                className={clsx(
                  'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'notifications' 
                    ? 'bg-accent text-primary' 
                    : 'text-muted hover:text-white'
                )}
              >
                <span className="flex items-center gap-2">
                  <Bell size={16} />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={clsx(
                  'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'messages' 
                    ? 'bg-accent text-primary' 
                    : 'text-muted hover:text-white'
                )}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  Messages
                </span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'notifications' && (
              <div className="p-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={40} className="text-muted mx-auto mb-2" />
                    <p className="text-muted">No notifications</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-accent hover:text-cyan-300 px-3 py-2"
                    >
                      Mark all as read
                    </button>
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={clsx(
                          'p-3 rounded-xl cursor-pointer transition-colors mb-2',
                          notification.read 
                            ? 'bg-white/5 hover:bg-white/10' 
                            : 'bg-accent/10 hover:bg-accent/20 border border-accent/30'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-white text-sm font-medium">{notification.title}</p>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-accent rounded-full" />
                              )}
                            </div>
                            <p className="text-muted text-xs mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-muted/50 text-xs mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {activeTab === 'messages' && !selectedChat && (
              <div className="p-2">
                <p className="text-muted text-xs px-3 py-2">Recent Chats</p>
                {Object.keys(chats).map(chatName => (
                  <div
                    key={chatName}
                    onClick={() => setSelectedChat(chatName)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors mb-2 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <User size={18} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{chatName}</p>
                      <p className="text-muted text-xs truncate">
                        {chats[chatName][chats[chatName].length - 1]?.message}
                      </p>
                    </div>
                    <p className="text-muted/50 text-xs">
                      {chats[chatName][chats[chatName].length - 1]?.time}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'messages' && selectedChat && (
              <div className="flex flex-col h-96">
                {/* Chat Header */}
                <div className="p-3 border-b border-white/10 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="text-muted hover:text-white"
                  >
                    ←
                  </button>
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <User size={16} className="text-accent" />
                  </div>
                  <p className="text-white font-medium">{selectedChat}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {chats[selectedChat]?.map(msg => (
                    <div
                      key={msg.id}
                      className={clsx(
                        'p-3 rounded-xl max-w-[80%]',
                        msg.isUser 
                          ? 'ml-auto bg-accent text-primary' 
                          : 'bg-white/10 text-white'
                      )}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={clsx(
                        'text-xs mt-1',
                        msg.isUser ? 'text-primary/70' : 'text-muted/50'
                      )}>
                        {msg.time}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-3 border-t border-white/10 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm outline-none focus:border-accent"
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2 rounded-xl bg-accent text-primary hover:bg-accent/80 transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}