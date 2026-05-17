import {
  AppStats,
  ChatPreview,
  MarketplaceListing,
  Review,
  RideListing,
  StudyGroup,
  User
} from "@/types";

const users: User[] = [
  {
    id: "u1",
    name: "Avery Chen",
    program: "Software Engineering",
    year: "3A",
    avatar: "AC",
    rating: 4.9,
    reviews: 42,
    verification: "trusted",
    completedTransactions: 31,
    ridesGiven: 18,
    groupsHosted: 9
  },
  {
    id: "u2",
    name: "Noah Patel",
    program: "Computer Science",
    year: "2B",
    avatar: "NP",
    rating: 4.8,
    reviews: 28,
    verification: "verified",
    completedTransactions: 21,
    ridesGiven: 12,
    groupsHosted: 5
  },
  {
    id: "u3",
    name: "Maya Singh",
    program: "Biomedical Engineering",
    year: "4A",
    avatar: "MS",
    rating: 5,
    reviews: 61,
    verification: "ambassador",
    completedTransactions: 54,
    ridesGiven: 27,
    groupsHosted: 14
  },
  {
    id: "u4",
    name: "Liam O'Brien",
    program: "Math",
    year: "1B",
    avatar: "LO",
    rating: 4.7,
    reviews: 16,
    verification: "verified",
    completedTransactions: 12,
    ridesGiven: 4,
    groupsHosted: 3
  },
  {
    id: "u5",
    name: "Sana Rahman",
    program: "Architecture",
    year: "2A",
    avatar: "SR",
    rating: 4.9,
    reviews: 33,
    verification: "trusted",
    completedTransactions: 26,
    ridesGiven: 9,
    groupsHosted: 7
  },
  {
    id: "u6",
    name: "Ethan Wu",
    program: "Mechanical Engineering",
    year: "3B",
    avatar: "EW",
    rating: 4.8,
    reviews: 39,
    verification: "verified",
    completedTransactions: 29,
    ridesGiven: 16,
    groupsHosted: 4
  }
];

export const currentUser = users[0];

export const appStats: AppStats = {
  activeListings: 248,
  openRideRequests: 73,
  liveStudyGroups: 39,
  verifiedRate: 98
};

export const marketplaceListings: MarketplaceListing[] = [
  {
    id: "m1",
    title: "iClicker Reef + PHYS 121 Notes Bundle",
    description: "Excellent condition. Includes formula cheat sheets and annotated lecture notes.",
    price: 55,
    postedAt: "12 mins ago",
    location: "E7 Atrium",
    category: "Textbooks",
    status: "available",
    seller: users[2]
  },
  {
    id: "m2",
    title: "Herman Miller Aeron (Size B)",
    description: "Selling before co-op term. Fully working, no major scratches.",
    price: 540,
    postedAt: "1h ago",
    location: "ICON 330",
    category: "Furniture",
    status: "pending",
    seller: users[1]
  },
  {
    id: "m3",
    title: "Request: CHEM 266 Lab Coat",
    description: "Need by Monday lab. Medium or large. Can pick up on campus today.",
    price: 25,
    postedAt: "2h ago",
    location: "QNC Lobby",
    category: "Requests",
    status: "available",
    seller: users[3]
  },
  {
    id: "m4",
    title: "Dell 27-inch 4K Monitor (USB-C)",
    description: "Perfect for coding + design work. Includes stand and original box.",
    price: 280,
    postedAt: "3h ago",
    location: "UWP Beck Hall",
    category: "Electronics",
    status: "available",
    seller: users[4]
  },
  {
    id: "m5",
    title: "SYDE 252 + STAT 206 Midterm Prep Bundle",
    description: "Condensed formula sheets + solved practice sets with topic tags.",
    price: 30,
    postedAt: "5h ago",
    location: "RCH Foyer",
    category: "Textbooks",
    status: "available",
    seller: users[5]
  },
  {
    id: "m6",
    title: "Request: Winter Convocation Dress Shirt",
    description: "Need a slim-fit medium shirt by Friday evening, can return dry-cleaned.",
    price: 20,
    postedAt: "7h ago",
    location: "SLC Turnkey",
    category: "Requests",
    status: "pending",
    seller: users[0]
  }
];

export const rideListings: RideListing[] = [
  {
    id: "r1",
    route: "Waterloo -> Pearson Airport",
    departure: "Sun, 6:30 PM",
    pricePerSeat: 24,
    seats: 2,
    driver: users[0],
    seatStatus: "seats-open",
    car: "Toyota Corolla 2021"
  },
  {
    id: "r2",
    route: "Waterloo -> Downtown Toronto",
    departure: "Fri, 4:45 PM",
    pricePerSeat: 19,
    seats: 0,
    driver: users[2],
    seatStatus: "waitlist",
    car: "Tesla Model 3"
  },
  {
    id: "r3",
    route: "Mississauga -> Waterloo",
    departure: "Mon, 8:00 AM",
    pricePerSeat: 21,
    seats: 3,
    driver: users[1],
    seatStatus: "seats-open",
    car: "Honda Civic 2020"
  },
  {
    id: "r4",
    route: "Waterloo -> Vaughan",
    departure: "Wed, 5:15 PM",
    pricePerSeat: 17,
    seats: 1,
    driver: users[4],
    seatStatus: "seats-open",
    car: "Mazda 3 2019"
  },
  {
    id: "r5",
    route: "Kitchener GO -> Waterloo Campus",
    departure: "Tue, 8:20 AM",
    pricePerSeat: 8,
    seats: 3,
    driver: users[5],
    seatStatus: "seats-open",
    car: "Subaru Impreza 2018"
  },
  {
    id: "r6",
    route: "Waterloo -> Hamilton",
    departure: "Sat, 10:30 AM",
    pricePerSeat: 22,
    seats: 0,
    driver: users[2],
    seatStatus: "waitlist",
    car: "Hyundai Elantra 2022"
  }
];

export const studyGroups: StudyGroup[] = [
  {
    id: "s1",
    course: "CS 341",
    title: "Midterm 2 Proof Practice Sprint",
    schedule: "Tue, 7:00 PM - 9:00 PM",
    location: "DC 1568",
    seatsLeft: 4,
    host: users[0],
    focus: "Graph reductions + NP-completeness drills"
  },
  {
    id: "s2",
    course: "STAT 231",
    title: "Final Prep Problem Marathon",
    schedule: "Thu, 6:00 PM - 8:30 PM",
    location: "MC Comfy Lounge",
    seatsLeft: 2,
    host: users[3],
    focus: "Regression intuition and exam-style short answers"
  },
  {
    id: "s3",
    course: "BIOL 373",
    title: "Cell Signalling Concept Mapping",
    schedule: "Sat, 11:00 AM - 1:00 PM",
    location: "Health Expansion Building",
    seatsLeft: 7,
    host: users[2],
    focus: "Pathway synthesis and memorization systems"
  },
  {
    id: "s4",
    course: "ECE 105",
    title: "Circuit Crunch Before Quiz 3",
    schedule: "Mon, 8:00 PM - 10:00 PM",
    location: "E7 Room 4433",
    seatsLeft: 5,
    host: users[5],
    focus: "Nodal analysis, op-amps, and timed quiz drills"
  },
  {
    id: "s5",
    course: "SYDE 121",
    title: "Lab 2 Debug + Report Clinic",
    schedule: "Wed, 6:30 PM - 8:30 PM",
    location: "E5 Design Bay",
    seatsLeft: 3,
    host: users[4],
    focus: "Arduino debugging and polished report structure"
  },
  {
    id: "s6",
    course: "MATH 239",
    title: "Combinatorics Final Problem Ladder",
    schedule: "Fri, 5:00 PM - 7:30 PM",
    location: "MC 3001",
    seatsLeft: 6,
    host: users[1],
    focus: "Inclusion-exclusion, recurrences, and counting proofs"
  }
];

export const chats: ChatPreview[] = [
  {
    id: "c1",
    with: users[2],
    context: "Ride to Pearson",
    lastMessage: "Can do pickup at University Ave bus stop at 6:10 PM.",
    time: "3m",
    unread: 2
  },
  {
    id: "c2",
    with: users[1],
    context: "Aeron chair listing",
    lastMessage: "I can include the headrest if you can pick up tonight.",
    time: "18m",
    unread: 0
  },
  {
    id: "c3",
    with: users[3],
    context: "STAT 231 group",
    lastMessage: "Shared a doc with solved old final questions.",
    time: "1h",
    unread: 1
  }
];

export const reviews: Review[] = [
  {
    id: "rev1",
    author: users[2],
    subject: "Smooth airport ride",
    body: "On time, clear communication, and super safe driving in snow.",
    rating: 5,
    createdAt: "2 days ago"
  },
  {
    id: "rev2",
    author: users[1],
    subject: "Marketplace purchase",
    body: "Item matched photos and pickup was quick right after class.",
    rating: 5,
    createdAt: "5 days ago"
  },
  {
    id: "rev3",
    author: users[3],
    subject: "Hosted CS 341 session",
    body: "Structured, focused session that helped our whole group improve.",
    rating: 4.8,
    createdAt: "1 week ago"
  }
];
