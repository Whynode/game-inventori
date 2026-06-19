'use client'

import { useState } from 'react'
import { Mail, Search, Copy, Check, Shield, Inbox, Square, CheckSquare, RefreshCw, MoreVertical, ArrowLeft, Star } from 'lucide-react'

interface Email {
  id: string
  sender: string
  senderEmail: string
  subject: string
  time: string
  date: string
  body: string
  otp: string
  avatarBg: string
  avatarText: string
  isChecked?: boolean
  isStarred?: boolean
}

const publishers = [
  { sender: 'Moonton', senderEmail: 'no-reply@moonton.com', avatarBg: 'bg-gradient-to-br from-amber-500 to-orange-600', avatarText: 'M' },
  { sender: 'Riot Games', senderEmail: 'noreply@mail.accounts.riotgames.com', avatarBg: 'bg-gradient-to-br from-red-600 to-rose-700', avatarText: 'R' },
  { sender: 'VK', senderEmail: 'support@vk.com', avatarBg: 'bg-gradient-to-br from-blue-500 to-indigo-600', avatarText: 'V' },
  { sender: 'Steam Support', senderEmail: 'noreply@steampowered.com', avatarBg: 'bg-gradient-to-br from-slate-700 to-slate-900', avatarText: 'S' },
  { sender: 'Hoyoverse', senderEmail: 'noreply@hoyoverse.com', avatarBg: 'bg-gradient-to-br from-indigo-400 to-purple-600', avatarText: 'H' },
]

const subjects = [
  { sub: 'New Sign-in from unrecognized device', body: 'Dear player,\n\nWe detected a login attempt from an unrecognized device. If this was you, please use the following verification code to confirm your sign-in:\n\n[OTP]\n\nThis code is valid for 15 minutes.' },
  { sub: 'Your Login Code', body: 'Verification.\n\nUse the security code below to complete your login.\n\nSecurity Code: [OTP]\n\nIf you did not request this code, please secure your credentials immediately and contact support.' },
  { sub: 'Confirmation code', body: 'Confirmation code.\n\nEnter the code [OTP] to confirm your identity.\n\nDo not share this code with anyone. If this wasn\'t requested by you, change your password.' },
  { sub: 'Account Verification', body: 'Here is your account verification code: [OTP]. Please do not share it with anyone.' },
  { sub: 'Security Alert: New Login', body: 'We noticed a new login. Use this OTP to verify your session: [OTP]. Stay safe!' }
]

const generateMockEmails = (): Email[] => {
  return Array.from({ length: 100 }).map((_, i) => {
    const pub = publishers[i % publishers.length]
    const subj = subjects[i % subjects.length]
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const body = subj.body.replace('[OTP]', otp)
    
    let timeStr = ''
    let dateStr = ''
    if (i < 3) {
      timeStr = `18:${(10 + i).toString().padStart(2, '0')}`
      dateStr = '18 Jun 2026'
    } else if (i < 8) {
      timeStr = 'Kemarin'
      dateStr = '17 Jun 2026'
    } else {
      const d = new Date(2026, 5, 18 - Math.floor(i / 4))
      const day = d.getDate().toString().padStart(2, '0')
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()]
      timeStr = `${day} ${month}`
      dateStr = `${day} ${month} 2026`
    }

    return {
      id: (i + 1).toString(),
      sender: pub.sender,
      senderEmail: pub.senderEmail,
      subject: subj.sub,
      time: timeStr,
      date: dateStr,
      body: body,
      otp: otp,
      avatarBg: pub.avatarBg,
      avatarText: pub.avatarText,
      isChecked: false,
      isStarred: Math.random() > 0.8
    }
  })
}

export default function FerryMailPage() {
  const [emails, setEmails] = useState<Email[]>(generateMockEmails)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('utama')

  const filteredEmails = emails.filter((email) => {
    const matchesSearch = email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          email.subject.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false;
    
    if (activeTab === 'favorit') {
      return email.isStarred;
    }
    return true;
  })

  const handleCopy = () => {
    if (!selectedEmail) return
    navigator.clipboard.writeText(selectedEmail.otp)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const toggleCheck = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setEmails(emails.map(email => email.id === id ? { ...email, isChecked: !email.isChecked } : email))
  }

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setEmails(emails.map(email => email.id === id ? { ...email, isStarred: !email.isStarred } : email))
  }

  const allFilteredChecked = filteredEmails.length > 0 && filteredEmails.every(e => e.isChecked)
  
  const toggleAllChecks = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEmails(emails.map(email => {
      if (filteredEmails.some(f => f.id === email.id)) {
        return { ...email, isChecked: !allFilteredChecked }
      }
      return email
    }))
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-8 -my-8 overflow-hidden bg-white select-none font-sans border-t border-slate-200">
      {!selectedEmail ? (
        // INBOX LIST VIEW
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Unified Header Bar */}
          <div className="px-4 pt-2 border-b border-slate-200 flex items-center shrink-0 min-h-[48px]">
            {/* Actions */}
            <div className="w-[252px] shrink-0 flex items-center gap-2 text-slate-500">
              <button onClick={toggleAllChecks} className="p-1 hover:bg-slate-100 rounded transition-colors">
                {allFilteredChecked ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </button>
              <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
              <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 self-end mb-[-1px]">
              <button
                onClick={() => setActiveTab('utama')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'utama'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Inbox className="h-4 w-4" />
                Utama
              </button>
              <button
                onClick={() => setActiveTab('notifikasi')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'notifikasi'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Shield className="h-4 w-4" />
                Notifikasi
              </button>
              <button
                onClick={() => setActiveTab('favorit')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'favorit'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Star className="h-4 w-4" />
                Favorit
              </button>
            </div>

            {/* Search */}
            <div className="ml-auto w-64">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Telusuri dalam email"
                  className="w-full pl-8 pr-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200/60 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:shadow-sm outline-none transition-all duration-200 font-sans"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {filteredEmails.length > 0 ? (
              filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`flex items-center px-4 py-1.5 border-b border-slate-100 cursor-pointer transition-colors group ${
                    email.isChecked ? 'bg-blue-50/40 hover:bg-blue-50/60' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-[52px] flex items-center gap-2 shrink-0 text-slate-300">
                    <button onClick={(e) => toggleCheck(e, email.id)} className="hover:text-slate-500 transition-colors p-0.5">
                      {email.isChecked ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4 group-hover:text-slate-400" />
                      )}
                    </button>
                    <button onClick={(e) => toggleStar(e, email.id)} className="hover:text-slate-500 transition-colors p-0.5">
                      {email.isStarred ? (
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <Star className="h-4 w-4 group-hover:text-slate-400" />
                      )}
                    </button>
                  </div>
                  <div className="min-w-[200px] max-w-[200px] w-[200px] text-left shrink-0 truncate pr-4">
                    <span className={`text-sm font-bold ${email.isChecked ? 'text-blue-900' : 'text-slate-800'}`}>
                      {email.sender}
                    </span>
                  </div>
                  <div className="flex-1 text-left justify-start truncate">
                    <span className={`text-sm font-medium ${email.isChecked ? 'text-blue-900' : 'text-slate-800'}`}>
                      {email.subject}
                    </span>
                    <span className={`text-sm ${email.isChecked ? 'text-blue-700' : 'text-slate-500'}`}>
                      <span className="mx-1.5">-</span>
                      {email.body.replace(/\n/g, ' ').substring(0, 100)}...
                    </span>
                  </div>
                  <div className="w-20 shrink-0 text-right">
                    <span className={`text-xs font-medium ${email.isChecked ? 'text-blue-900' : 'text-slate-500'}`}>
                      {email.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                <Inbox className="h-10 w-10 text-slate-300" />
                <span>Kotak masuk kosong. Tidak ada email yang ditemukan.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        // EMAIL DETAIL VIEW
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Detail View Action Bar */}
          <div className="px-4 py-1 border-b border-slate-200 flex items-center gap-3 text-slate-500 shrink-0 min-h-[48px]">
            <button
              onClick={() => {
                setSelectedEmail(null)
                setCopied(false)
              }}
              className="flex items-center gap-2 px-2 py-1 hover:bg-slate-100 rounded-md transition-colors text-sm font-medium text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
            <div className="h-4 w-px bg-slate-300 mx-1"></div>
            <button className="p-1 hover:bg-slate-100 rounded transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-slate-100 rounded transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
            <div className="max-w-3xl mx-auto flex flex-col space-y-6">
              {/* Subject */}
              <h1 className="text-lg font-medium text-slate-900 flex items-center gap-3">
                {selectedEmail.subject}
                <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.5 rounded">
                  Kotak Masuk
                </span>
              </h1>

              {/* Sender Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${selectedEmail.avatarBg}`}>
                    {selectedEmail.avatarText}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">{selectedEmail.sender}</span>
                      <span className="text-xs text-slate-500">&lt;{selectedEmail.senderEmail}&gt;</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      kepada customer
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="text-xs">{selectedEmail.date}, {selectedEmail.time}</span>
                  <Star className="h-4 w-4 cursor-pointer hover:text-slate-600" />
                  <MoreVertical className="h-4 w-4 cursor-pointer hover:text-slate-600" />
                </div>
              </div>

              {/* Security Warning Banner */}
              <div className="bg-amber-50/60 border border-amber-200/40 rounded p-3 flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Mode Akses Baca Saja</p>
                  <p className="text-xs text-amber-800/80 mt-0.5 leading-relaxed font-sans">
                    FerryMail hanya memiliki akses baca terbatas. Pemulihan, pengaturan, penghapusan, dan pengiriman email dinonaktifkan sepenuhnya untuk melindungi kredensial.
                  </p>
                </div>
              </div>

              {/* OTP Code Massive Highlight Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-6 flex flex-col items-center justify-center space-y-4 text-center">
                <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">OTP Code</span>
                
                <div className="w-full max-w-xs bg-white border border-blue-100 text-blue-700 text-4xl font-bold tracking-widest rounded-xl py-4 px-6 flex items-center justify-center relative font-mono shadow-sm">
                  {selectedEmail.otp}
                </div>

                {/* Interactive Copy Button */}
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm ${
                    copied
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 shadow-sm'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 shadow-sm'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>

              {/* Email Content Container */}
              <div className="border border-slate-200/80 rounded-lg p-6 bg-white">
                <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line font-sans select-text">
                  {selectedEmail.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
