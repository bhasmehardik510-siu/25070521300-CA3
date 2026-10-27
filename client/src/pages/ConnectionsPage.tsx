import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Connection } from '../types/index.ts';
import { useToast } from '../context/ToastContext.tsx';
import {
  Users,
  Check,
  X,
  Clock,
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Sliders,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  UserX,
  Info,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface ConnectionsPageProps {
  navigate: (path: string) => void;
}

export const ConnectionsPage: React.FC<ConnectionsPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeTab, setActiveTab] = useState<'CONNECTED' | 'RECEIVED' | 'SENT'>('CONNECTED');
  const [isLoading, setIsLoading] = useState(true);

  // Active expanded message vault
  const [expandedVaultId, setExpandedVaultId] = useState<string | null>(null);
  const [newMessageText, setNewMessageText] = useState<{ [connectionId: string]: string }>({});
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Privacy modal / settings per connection
  const [editingPrivacyConn, setEditingPrivacyConn] = useState<Connection | null>(null);
  const [myShareEmail, setMyShareEmail] = useState(true);
  const [mySharePhone, setMySharePhone] = useState(true);
  const [myPreferredChannel, setMyPreferredChannel] = useState<'EMAIL' | 'PHONE' | 'WHATSAPP' | 'LINKEDIN'>('WHATSAPP');
  const [myPrivateNote, setMyPrivateNote] = useState('');
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      const res = await api.getConnections();
      if (res.success) {
        setConnections(res.connections);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [user]);

  const handleUpdateStatus = async (connectionId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const res = await api.updateConnectionStatus(connectionId, status);
      if (res.success) {
        success(
          status === 'ACCEPTED' ? 'Connection Accepted' : 'Request Declined',
          status === 'ACCEPTED'
            ? 'Mutual Private Vault unlocked. Direct contact details are now accessible.'
            : 'The request has been removed.'
        );
        fetchConnections();
      }
    } catch (err: any) {
      error('Action Failed', err.message);
    }
  };

  const handleSendMessage = async (connectionId: string) => {
    const text = newMessageText[connectionId]?.trim();
    if (!text) return;

    try {
      setIsSendingMessage(true);
      const res = await api.addConnectionMessage(connectionId, text);
      if (res.success) {
        success('Private Note Shared', 'Sent securely inside your mutual connection vault.');
        setNewMessageText((prev) => ({ ...prev, [connectionId]: '' }));
        // Update state in place
        setConnections((prev) =>
          prev.map((c) => (c.id === connectionId ? res.connection : c))
        );
      }
    } catch (err: any) {
      error('Failed to Send Note', err.message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const openPrivacyEditor = (conn: Connection) => {
    const isSender = conn.senderId === user?.id;
    const myPrivacy = isSender ? conn.senderPrivacy : conn.receiverPrivacy;

    setEditingPrivacyConn(conn);
    setMyShareEmail(myPrivacy?.shareEmail ?? true);
    setMySharePhone(myPrivacy?.sharePhone ?? true);
    setMyPreferredChannel(myPrivacy?.preferredChannel ?? 'WHATSAPP');
    setMyPrivateNote(myPrivacy?.privateNote ?? '');
  };

  const handleSaveConnectionPrivacy = async () => {
    if (!editingPrivacyConn) return;

    try {
      setIsUpdatingPrivacy(true);
      const res = await api.updateConnectionPrivacy(editingPrivacyConn.id, {
        shareEmail: myShareEmail,
        sharePhone: mySharePhone,
        preferredChannel: myPreferredChannel,
        privateNote: myPrivateNote,
      });

      if (res.success) {
        success('Privacy Settings Updated', 'Your sharing preferences for this connection were updated.');
        setConnections((prev) =>
          prev.map((c) => (c.id === editingPrivacyConn.id ? res.connection : c))
        );
        setEditingPrivacyConn(null);
      }
    } catch (err: any) {
      error('Update Failed', err.message);
    } finally {
      setIsUpdatingPrivacy(false);
    }
  };

  const handleDisconnect = async (connectionId: string, peerName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to disconnect from ${peerName}? Mutual access to private emails, phone numbers, and direct notes will be revoked immediately.`
      )
    ) {
      return;
    }

    try {
      const res = await api.deleteConnection(connectionId);
      if (res.success) {
        success('Connection Removed', `Access to private contact details for ${peerName} has been revoked.`);
        fetchConnections();
      }
    } catch (err: any) {
      error('Disconnect Failed', err.message);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    info('Copied to Clipboard', `${label}: ${text}`);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Sign In Required</h2>
        <p className="text-xs text-slate-500">Sign in to manage your connections and network invites.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  const acceptedConnections = connections.filter((c) => c.status === 'ACCEPTED');
  const receivedRequests = connections.filter(
    (c) => c.receiverId === user.id && c.status === 'PENDING'
  );
  const sentRequests = connections.filter(
    (c) => c.senderId === user.id && c.status === 'PENDING'
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              My Professional Network & Private Vault
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {acceptedConnections.length} Mutual Connections
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Exchange verified contact information and private notes safely with connected alumni and students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/privacy')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Privacy & Sharing Info</span>
          </button>
          <button
            onClick={() => navigate('/directory')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition-colors"
          >
            Find Alumni to Connect
          </button>
        </div>
      </div>

      {/* Institutional Privacy & Mutual Consent Notice */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50 via-slate-50 to-emerald-50 border border-indigo-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5 shadow-sm">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>Mutual Consent Protection Active</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                <Check className="w-2.5 h-2.5" /> Mutual Vault
              </span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              Under college privacy policy, personal emails and phone numbers are shared <strong>only with accepted connections</strong>. You maintain full control to customize what you share or disconnect at any time.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/privacy')}
          className="self-start md:self-auto text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 shrink-0"
        >
          <span>Learn about privacy controls</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          id="tab-connected-network"
          onClick={() => setActiveTab('CONNECTED')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'CONNECTED'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Connected Network ({acceptedConnections.length})</span>
        </button>

        <button
          id="tab-received-invites"
          onClick={() => setActiveTab('RECEIVED')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'RECEIVED'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Received Invites</span>
          {receivedRequests.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px]">
              {receivedRequests.length}
            </span>
          )}
        </button>

        <button
          id="tab-sent-invites"
          onClick={() => setActiveTab('SENT')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'SENT'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Sent Invites ({sentRequests.length})</span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading your network...</div>
      ) : activeTab === 'CONNECTED' ? (
        acceptedConnections.length === 0 ? (
          <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No Connections in Your Vault Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse the verified alumni directory to send connection requests and safely exchange direct contact information.
            </p>
            <button
              onClick={() => navigate('/directory')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
            >
              Browse Directory
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {acceptedConnections.map((conn) => {
              const isSender = conn.senderId === user.id;
              const peerName = isSender ? conn.receiverName : conn.senderName;
              const peerRole = isSender ? conn.receiverRole : conn.senderRole;
              const peerCompany = isSender ? conn.receiverCompany : conn.senderCompany;
              const peerAvatar = isSender ? conn.receiverAvatar : conn.senderAvatar;

              // Peer's shared privacy details
              const peerPrivacy = isSender ? conn.receiverPrivacy : conn.senderPrivacy;
              // My own privacy sharing settings for this connection
              const myPrivacy = isSender ? conn.senderPrivacy : conn.receiverPrivacy;

              const isVaultOpen = expandedVaultId === conn.id;

              return (
                <div
                  key={conn.id}
                  id={`connection-card-${conn.id}`}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Top Bar: Profile & Primary Shared Contact Channels */}
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          peerAvatar ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
                        }
                        alt={peerName}
                        className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                      />
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{peerName}</h4>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            Verified Alumni
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs font-medium">
                          {peerRole || 'Alumni Member'}
                        </p>
                        {peerCompany && (
                          <p className="text-indigo-600 font-semibold text-xs flex items-center gap-1">
                            <Building2 className="w-3 h-3 shrink-0" />
                            <span>{peerCompany}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Shared Contacts & Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => openPrivacyEditor(conn)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Configure what information you share with this connection"
                      >
                        <Sliders className="w-3.5 h-3.5 text-slate-500" />
                        <span>My Sharing Settings</span>
                      </button>

                      <button
                        onClick={() => setExpandedVaultId(isVaultOpen ? null : conn.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isVaultOpen
                            ? 'bg-indigo-600 text-white'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isVaultOpen ? 'Close Vault' : 'Open Vault & Notes'}</span>
                        {conn.privateMessages && conn.privateMessages.length > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-indigo-200 text-indigo-900 text-[10px] font-bold">
                            {conn.privateMessages.length}
                          </span>
                        )}
                        {isVaultOpen ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDisconnect(conn.id, peerName)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Disconnect and revoke mutual contact access"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mutual Contact Info Grid */}
                  <div className="px-5 py-4 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-b border-slate-100">
                    {/* Personal Email */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-indigo-500" /> Direct Email
                        </span>
                        {peerPrivacy?.shareEmail ? (
                          <span className="text-emerald-600 font-bold text-[10px]">Shared</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Protected</span>
                        )}
                      </div>
                      {peerPrivacy?.shareEmail && peerPrivacy?.personalEmail ? (
                        <div className="flex items-center justify-between gap-1 pt-0.5">
                          <a
                            href={`mailto:${peerPrivacy.personalEmail}`}
                            className="font-medium text-slate-900 hover:text-indigo-600 truncate"
                          >
                            {peerPrivacy.personalEmail}
                          </a>
                          <button
                            onClick={() => copyToClipboard(peerPrivacy.personalEmail!, 'Email')}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="Copy email"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-slate-400 italic text-[11px] pt-0.5">
                          Direct email withheld by peer
                        </p>
                      )}
                    </div>

                    {/* Direct Phone / WhatsApp */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-emerald-500" /> Phone / WhatsApp
                        </span>
                        {peerPrivacy?.sharePhone ? (
                          <span className="text-emerald-600 font-bold text-[10px]">Shared</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Protected</span>
                        )}
                      </div>
                      {peerPrivacy?.sharePhone && peerPrivacy?.phone ? (
                        <div className="flex items-center justify-between gap-1 pt-0.5">
                          <span className="font-medium text-slate-900 truncate">
                            {peerPrivacy.phone}
                          </span>
                          <div className="flex items-center gap-1">
                            <a
                              href={`https://wa.me/${peerPrivacy.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[10px]"
                            >
                              WhatsApp
                            </a>
                            <button
                              onClick={() => copyToClipboard(peerPrivacy.phone!, 'Phone')}
                              className="p-1 text-slate-400 hover:text-slate-700"
                              title="Copy phone"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-400 italic text-[11px] pt-0.5">
                          Direct phone withheld by peer
                        </p>
                      )}
                    </div>

                    {/* Preferred Contact Channel & Status */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="font-semibold text-slate-700">Preferred Channel</span>
                        <span className="text-indigo-600 font-bold text-[10px]">
                          {peerPrivacy?.preferredChannel || 'WHATSAPP'}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] truncate pt-0.5">
                        {peerPrivacy?.privateNote || conn.note || 'Available for professional queries & coffee chats.'}
                      </p>
                    </div>
                  </div>

                  {/* Expandable Vault: Private Message Thread */}
                  {isVaultOpen && (
                    <div className="p-5 space-y-4 bg-indigo-50/20">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-indigo-600" />
                          <h5 className="font-bold text-slate-900 text-xs">
                            Private Connection Thread & Notes with {peerName}
                          </h5>
                        </div>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-600" /> Visible only to you & {peerName}
                        </span>
                      </div>

                      {/* Messages List */}
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {(!conn.privateMessages || conn.privateMessages.length === 0) ? (
                          <div className="py-6 text-center text-xs text-slate-400">
                            No private notes exchanged yet. Say hello or share your calendar link!
                          </div>
                        ) : (
                          conn.privateMessages.map((msg) => {
                            const isMe = msg.senderId === user.id;
                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                              >
                                <div
                                  className={`max-w-md p-3 rounded-xl text-xs ${
                                    isMe
                                      ? 'bg-indigo-600 text-white rounded-br-none'
                                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                                  }`}
                                >
                                  <div className="text-[10px] opacity-80 mb-1 font-semibold">
                                    {isMe ? 'You' : msg.senderName}
                                  </div>
                                  <p className="leading-relaxed">{msg.message}</p>
                                </div>
                                <span className="text-[9px] text-slate-400 mt-1 px-1">
                                  {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Message Input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={newMessageText[conn.id] || ''}
                          onChange={(e) =>
                            setNewMessageText((prev) => ({
                              ...prev,
                              [conn.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage(conn.id);
                          }}
                          placeholder={`Leave a private note for ${peerName}...`}
                          className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button
                          disabled={isSendingMessage || !newMessageText[conn.id]?.trim()}
                          onClick={() => handleSendMessage(conn.id)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : activeTab === 'RECEIVED' ? (
        receivedRequests.length === 0 ? (
          <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No pending received connection invites.
          </div>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={
                      req.senderAvatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
                    }
                    alt={req.senderName}
                    className="w-13 h-13 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{req.senderName}</h4>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        {req.senderRole}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">{req.senderCompany}</p>
                    {req.note && (
                      <p className="text-slate-600 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-lg">
                        "{req.note}"
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Accepting will exchange mutual direct phone & email inside your private vault</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept & Exchange Info</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        sentRequests.length === 0 ? (
          <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No outgoing connection invites.
          </div>
        ) : (
          <div className="space-y-3">
            {sentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 text-xs">
                  <img
                    src={
                      req.receiverAvatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
                    }
                    alt={req.receiverName}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{req.receiverName}</h4>
                    <p className="text-slate-600">{req.receiverRole} @ {req.receiverCompany}</p>
                    <span className="text-[10px] text-slate-400">
                      Sent on {new Date(req.createdAt).toLocaleDateString()} • Protected until accepted
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                  <Clock className="w-3.5 h-3.5" /> Pending Recipient Review
                </span>
              </div>
            ))}
          </div>
        )
      )}

      {/* Connection Privacy Modal */}
      {editingPrivacyConn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Privacy Settings for {editingPrivacyConn.senderId === user.id ? editingPrivacyConn.receiverName : editingPrivacyConn.senderName}
                </h3>
              </div>
              <button
                onClick={() => setEditingPrivacyConn(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Control what private information is revealed to this connection inside your mutual vault. Changes take effect immediately.
            </p>

            <div className="space-y-4 text-xs">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={myShareEmail}
                  onChange={(e) => setMyShareEmail(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Share my personal email</span>
                  <span className="text-slate-500 text-[11px]">
                    Allows this connection to see and email your personal address directly.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mySharePhone}
                  onChange={(e) => setMySharePhone(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Share my direct phone / WhatsApp</span>
                  <span className="text-slate-500 text-[11px]">
                    Allows this connection to call or message you on WhatsApp.
                  </span>
                </div>
              </label>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  Preferred Contact Platform
                </label>
                <select
                  value={myPreferredChannel}
                  onChange={(e: any) => setMyPreferredChannel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">Email</option>
                  <option value="PHONE">Direct Phone</option>
                  <option value="LINKEDIN">LinkedIn</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  Private Availability Note for this Connection
                </label>
                <input
                  type="text"
                  value={myPrivateNote}
                  onChange={(e) => setMyPrivateNote(e.target.value)}
                  placeholder="e.g. Best times to reach me, weekend coffee chats, referral requests..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setEditingPrivacyConn(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isUpdatingPrivacy}
                onClick={handleSaveConnectionPrivacy}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
              >
                {isUpdatingPrivacy ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
