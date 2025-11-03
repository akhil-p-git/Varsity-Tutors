# Varsity Tutors - Viral Learning Platform MVP

A Next.js 14 application demonstrating viral loops, social learning, and gamification in education technology.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎭 Demo Credentials

Three mock users are available for testing:

1. **Student**: Alex Chen
   - ID: 1
   - Subject: Algebra
   - Role: student

2. **Parent**: Maria Rodriguez
   - ID: 2
   - Role: parent

3. **Tutor**: Dr. Smith
   - ID: 3
   - Subject: Algebra
   - Role: tutor

## 🎬 Demo Flow Walkthrough

### Automated Demo

Click "Run Full Demo Flow" on the landing page or navigate to `/demo` to see the complete automated walkthrough:

1. Auto-login as Student (Alex)
2. Dashboard view (activity feed, quick actions)
3. Navigate to practice session
4. Auto-complete session with 85% score
5. Results page with agent decision logic
6. Agent triggers Buddy Challenge (score > 70%)
7. Personalization agent customizes invite message
8. Auto-send challenge to friend
9. Switch to friend's view (auto-login)
10. Friend sees invite notification
11. Friend accepts and completes challenge
12. Both users earn rewards (50 gems each)
13. Voice room invite triggered
14. Both join voice room
15. Analytics dashboard with updated metrics
16. K-factor calculation displayed (1.0)

### Manual Demo Flow

1. **Login** as Student (Alex Chen)
2. **Dashboard** - See activity feed, quick actions, leaderboard
3. **Start Practice Session** - Complete Algebra quiz
4. **Session Results** - View score, skills improved
5. **Send Buddy Challenge** - Click "Send Challenge" button
6. **Select Friend** - Choose from online friends
7. **Copy Link** - Share invite link (or use in another browser)
8. **Accept Invite** - Login as friend, accept challenge
9. **Complete Challenge** - Friend completes session
10. **Rewards** - Both users see gem rewards
11. **Voice Room** - Join voice room with friends
12. **Analytics** - View conversion metrics

## ✨ Key Features Implemented

### Viral Loops

- **Buddy Challenge System**: Shareable links with UTM tracking
- **Voice Room Invites**: Social study sessions
- **Smart Link Generation**: Trackable invites with attribution
- **Conversion Funnel**: link_created → link_clicked → signup → session_completed → conversion

### Agent System

- **Orchestrator Agent**: Rule-based logic for triggering viral loops
  - Score > 70% → Buddy Challenge
  - Challenge accepted → Voice Room Invite
  - Voice room > 15 min → Tutor Spotlight
  - Parent + student session → Proud Parent Share

- **Personalization Agent**: Customized messages based on:
  - User role (student/parent/tutor)
  - Subject being studied
  - Time of day
  - Performance level (high/medium/low)

- **Throttling & Cooldowns**:
  - Max 3 invites per day
  - 2-hour cooldown between same loop type

### Social Features

- **Activity Feed**: Real-time friend activities
- **Voice Rooms**: Study together in real-time
- **Leaderboard**: Friends, Global, Weekly rankings
- **Presence System**: See who's studying now

### Reward System

- **Gems**: Earned through various actions
  - Session completed: +20 gems
  - Buddy challenge: +50 gems
  - Voice room join: +10 gems
  - 30 min in room: +25 gems
  - Invite accepted: +15 gems

- **Streak Milestones**: 
  - 7 days: +100 gems
  - 30 days: +500 gems

- **Level Progression**: Based on total points (1000 points per level)
- **Achievements**: Unlockable badges

### Analytics

- **K-Factor Calculation**: Viral coefficient measurement
- **Funnel Tracking**: Full conversion tracking
- **UTM Attribution**: Track all invite sources
- **Agent Decision Logging**: Real-time agent decisions

## 🏗️ Architecture

### Tech Stack

- **Next.js 14** with App Router
- **TypeScript** (strict mode)
- **Tailwind CSS** v4
- **Zustand** for state management
- **Sonner** for toast notifications
- **Heroicons** for icons
- **Canvas Confetti** for celebrations

### Project Structure

```
/app
  /api              # API routes
  /(auth)           # Authentication routes
  /(dashboard)      # Dashboard routes
  /components       # React components
  /demo             # Automated demo flow
  /invite           # Invite landing page
  /profile          # User profile
  /analytics        # Analytics dashboard
  /leaderboard      # Leaderboard page
  /rooms            # Voice rooms
  /session          # Practice sessions & results
/lib
  /agents           # Agent orchestrator & personalization
  /data             # Mock data (sessions, friends, rooms)
  /utils             # Utility functions
  auth-context.tsx   # Auth context
  store.ts          # Zustand store
  rewards.ts        # Reward system
  smart-links.ts    # Link tracking & attribution
```

### State Management

- **Zustand Store**: Global state for sessions, friends, invites, rewards, analytics, voice rooms
- **React Context**: Authentication state
- **Local State**: Component-specific state

### Mock Data

- **3 Users**: Student, Parent, Tutor
- **6 Friends**: Mock friend network
- **3 Sessions**: Example completed sessions
- **4 Voice Rooms**: Active study rooms
- **Activity Feed**: Real-time friend activities

## 🎮 Keyboard Shortcuts

- **Cmd/Ctrl + D**: Toggle demo controls
- **Cmd/Ctrl + A**: Toggle agent debugger
- **Cmd/Ctrl + 1/2/3**: Switch to user 1/2/3
- **Cmd/Ctrl + R**: Reset demo state

## 📊 What's Mocked vs Real

### Mocked (For Demo)

- User authentication (hardcoded users)
- WebRTC voice rooms (state-based simulation)
- Real-time presence (polling simulation)
- Database (in-memory Zustand store)
- Agent decisions (rule-based, not ML)
- Link generation (no actual signing)

### Real Implementation Would Need

- Real authentication (Auth0, Clerk, etc.)
- WebRTC infrastructure (Agora, Twilio, etc.)
- Real-time database (Firebase, Supabase, etc.)
- ML-based agent decisions
- Signed/encrypted invite links
- Email notifications
- Push notifications
- Payment processing

## 🎯 Viral Loop Design

### K-Factor Calculation

K-factor = (Invites sent × Conversion rate) / Active users

Current demo shows: 1 user → 1 new user = 1.0 K-factor

### Funnel Tracking

1. **Link Created**: Invite generated with UTM params
2. **Link Clicked**: User clicks invite link
3. **Signup**: User creates account
4. **Session Completed**: User completes practice session
5. **Conversion**: Challenge completed, both users rewarded

### Attribution

All links include UTM parameters:
- `utm_source`: Source of invite (buddy_challenge, voice_room, etc.)
- `utm_medium`: Medium (invite, share, etc.)
- `utm_campaign`: Campaign name (viral_mvp, etc.)

## 🎨 Design System

### Colors

- **Primary Purple**: `#7c3aed` (purple-600)
- **Accent Teal**: `#14b8a6` (teal-500)
- **Success Green**: `#10b981` (green-500)
- **Warning Amber**: `#f59e0b` (amber-500)
- **Error Red**: `#ef4444` (red-500)

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large sizes
- **Body**: Regular weight, readable sizes

### Components

- **Cards**: Rounded-2xl, shadow-xl, border
- **Buttons**: Rounded-xl, gradient backgrounds
- **Modals**: Slide-in from bottom (mobile) or center (desktop)

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically
4. Test production URL

### Environment Variables

None required for MVP (all data is mocked)

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login as all 3 user types
- [ ] Complete practice session
- [ ] Send buddy challenge
- [ ] Accept challenge as friend
- [ ] Complete challenge
- [ ] Verify rewards awarded
- [ ] Join voice room
- [ ] Check analytics dashboard
- [ ] View leaderboard
- [ ] Test on mobile viewport
- [ ] Run full demo flow

## 📝 Notes

- All data is in-memory and resets on page refresh
- Voice rooms use simulated speaking (no real audio)
- Agent decisions are rule-based (not ML)
- Analytics are mocked calculations
- K-factor is simplified calculation

## 🎓 Next Steps (Production)

1. Real authentication system
2. Database integration
3. WebRTC for voice rooms
4. Real-time presence updates
5. ML-based agent decisions
6. Email/push notifications
7. Payment processing
8. Mobile app (React Native)
9. Advanced analytics dashboard
10. A/B testing framework

## 📄 License

This is a demo project for educational purposes.

---

Built with ❤️ for Varsity Tutors
