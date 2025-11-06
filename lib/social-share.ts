export interface ShareContent {
  title: string;
  text: string;
  url: string;
  hashtags?: string[];
}

export type SocialPlatform = 'twitter' | 'facebook' | 'linkedin' | 'native';

export function shareToTwitter(content: ShareContent) {
  const { text, url, hashtags } = content;
  const hashtagsString = hashtags ? hashtags.map(tag => `#${tag}`).join(' ') : '';
  const tweetText = `${text} ${hashtagsString}`.trim();

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
}

export function shareToFacebook(content: ShareContent) {
  const { url } = content;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=550,height=420');
}

export function shareToLinkedIn(content: ShareContent) {
  const { title, text, url } = content;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedInUrl, '_blank', 'width=550,height=420');
}

export async function shareNative(content: ShareContent): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: content.title,
        text: content.text,
        url: content.url,
      });
      return true;
    } catch (error) {
      // User cancelled or error occurred
      console.error('Error sharing:', error);
      return false;
    }
  }
  return false;
}

export function shareToPlatform(platform: SocialPlatform, content: ShareContent) {
  switch (platform) {
    case 'twitter':
      shareToTwitter(content);
      break;
    case 'facebook':
      shareToFacebook(content);
      break;
    case 'linkedin':
      shareToLinkedIn(content);
      break;
    case 'native':
      shareNative(content);
      break;
  }
}

// Pre-built share content generators
export function generateAchievementShare(achievement: {
  type: string;
  score?: number;
  subject?: string;
  streak?: number;
  improvement?: number;
}): ShareContent {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  let title = '';
  let text = '';

  if (achievement.type === 'high_score') {
    title = `🎯 Perfect Score Achievement!`;
    text = `I just scored ${achievement.score}% in ${achievement.subject}! Join me on Varsity Tutors and let's study together! 🚀`;
  } else if (achievement.type === 'streak') {
    title = `🔥 ${achievement.streak} Day Streak!`;
    text = `I'm on a ${achievement.streak}-day study streak on Varsity Tutors! Join me and let's keep each other motivated! 💪`;
  } else if (achievement.type === 'improvement') {
    title = `📈 Major Improvement!`;
    text = `I improved my ${achievement.subject} score by ${achievement.improvement}% using Varsity Tutors! Come study with me! 🎓`;
  } else {
    title = `🎓 Learning with Varsity Tutors`;
    text = `I'm studying on Varsity Tutors and making great progress! Join me! 📚`;
  }

  return {
    title,
    text,
    url: `${baseUrl}?ref=social_share`,
    hashtags: ['VarsityTutors', 'StudyTogether', 'Education', 'Learning'],
  };
}

export function generateChallengeShare(challenge: {
  fromName: string;
  subject: string;
  score?: number;
}): ShareContent {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return {
    title: `⚔️ Study Challenge on Varsity Tutors`,
    text: `I just challenged ${challenge.fromName} to a ${challenge.subject} showdown on Varsity Tutors! Who wants to join? 🎯`,
    url: `${baseUrl}?ref=challenge_share`,
    hashtags: ['VarsityTutors', 'StudyChallenge', 'Competition'],
  };
}

export function generateTutorMatchShare(tutor: {
  name: string;
  subject: string;
}): ShareContent {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return {
    title: `🎓 Found My Perfect Tutor!`,
    text: `AI matched me with ${tutor.name} for ${tutor.subject} on Varsity Tutors! The future of personalized learning is here! 🚀`,
    url: `${baseUrl}?ref=tutor_match_share`,
    hashtags: ['VarsityTutors', 'AI', 'PersonalizedLearning', 'EdTech'],
  };
}

export function generateInviteShare(): ShareContent {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return {
    title: `📚 Join me on Varsity Tutors!`,
    text: `I'm using Varsity Tutors for studying and it's amazing! Join me and let's learn together! 🎓✨`,
    url: `${baseUrl}?ref=friend_invite`,
    hashtags: ['VarsityTutors', 'StudyTogether', 'Education'],
  };
}
