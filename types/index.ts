export type Vertical = "marketplace" | "rides" | "study";

export type VerificationLevel = "verified" | "trusted" | "ambassador";

export type ListingStatus = "available" | "pending" | "sold";

export type RideSeatStatus = "seats-open" | "waitlist";

export interface User {
  id: string;
  name: string;
  program: string;
  year: string;
  avatar: string;
  rating: number;
  reviews: number;
  verification: VerificationLevel;
  completedTransactions: number;
  ridesGiven: number;
  groupsHosted: number;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  postedAt: string;
  location: string;
  category: string;
  status: ListingStatus;
  seller: User;
  contactedByCurrentUser?: boolean;
  isOwner?: boolean;
}

export interface RideListing {
  id: string;
  route: string;
  departure: string;
  pricePerSeat: number;
  seats: number;
  driver: User;
  seatStatus: RideSeatStatus;
  car: string;
  mode?: "offer" | "request";
  requestedByCurrentUser?: boolean;
  isOwner?: boolean;
}

export interface StudyGroup {
  id: string;
  course: string;
  title: string;
  schedule: string;
  location: string;
  seatsLeft: number;
  host: User;
  focus: string;
  joinedByCurrentUser?: boolean;
  isOwner?: boolean;
}

export interface ChatPreview {
  id: string;
  with: User;
  context: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export interface Review {
  id: string;
  author: User;
  subject: string;
  body: string;
  rating: number;
  createdAt: string;
}

export interface AppStats {
  activeListings: number;
  openRideRequests: number;
  liveStudyGroups: number;
  verifiedRate: number;
}
