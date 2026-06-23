export type LoyaltyProgramType = "points" | "stamp-cards" | "cashback" | "memberships" | "vouchers";

export type Promotion = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  expirationDate: string;
  badge: string;
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  image: string;
};

export type Activity = {
  id: string;
  title: string;
  date: string;
  earnedPoints: number;
  image: string;
};

export type BookingSlot = {
  id: string;
  time: string;
  available: boolean;
};

export type BookingDay = {
  id: string;
  label: string;
  date: string;
  slots: BookingSlot[];
};

export type BookingService = {
  id: string;
  name: string;
  duration: string;
  price: string;
};

export type BookingModule = {
  enabled: boolean;
  type: "car-wash" | "restaurant" | "barber" | "pickup";
  title: string;
  subtitle: string;
  ctaLabel: string;
  paymentLabel: string;
  services: BookingService[];
  days: BookingDay[];
};

export type MerchantCardDesign = {
  gradient: [string, string];
  foregroundColor: string;
  patternColor: string;
};

export type MerchantConfig = {
  id: string;
  merchantName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  coverImage: string;
  loyaltyProgramType: LoyaltyProgramType;
  currentBalance: number;
  progressPercentage: number;
  nextReward: string;
  rewardTargetPoints: number;
  membershipTier: string;
  promotions: Promotion[];
  rewards: Reward[];
  activities: Activity[];
  bookingModule?: BookingModule;
  cardDesign: MerchantCardDesign;
};

export type MerchantTheme = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  cardGradient: [string, string];
  cardForeground: string;
  pattern: string;
};
