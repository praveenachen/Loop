import { hash } from "bcryptjs";
import {
  ConversationContextType,
  MarketplaceStatus,
  PrismaClient,
  RideMode,
  RideSeatStatus,
  VerificationLevel
} from "@prisma/client";

// Deterministic demo dataset. No randomness: every row, order, price and timestamp offset is fixed,
// so each reset produces the same app state. Primary demo account: avery@uwaterloo.ca.
// Timestamps are offsets from "now" so relative times ("35m", "3h") read naturally right after a reset.
export const DEMO_PASSWORD = "LoopPass123!";

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000);

export async function resetAndSeed(prisma: PrismaClient) {
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.rideSeatRequest.deleteMany();
  await prisma.studyGroupMember.deleteMany();
  await prisma.marketplaceListing.deleteMany();
  await prisma.rideListing.deleteMany();
  await prisma.studyGroup.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash(DEMO_PASSWORD, 12);
  const verifiedAt = ago(60 * 24 * 90);

  const person = (
    email: string,
    name: string,
    program: string,
    year: string,
    rating: number,
    reviewsCount: number,
    verificationLevel: VerificationLevel,
    completedTransactions: number,
    ridesGiven: number,
    groupsHosted: number
  ) =>
    prisma.user.create({
      data: {
        email,
        name,
        program,
        year,
        avatar: name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2),
        rating,
        reviewsCount,
        verificationLevel,
        completedTransactions,
        ridesGiven,
        groupsHosted,
        passwordHash,
        verifiedAt
      }
    });

  // Sequential (not Promise.all) so creation order is stable.
  const avery = await person("avery@uwaterloo.ca", "Avery Chen", "Software Engineering", "3A", 4.9, 38, VerificationLevel.TRUSTED, 24, 12, 6);
  const noah = await person("noah@uwaterloo.ca", "Noah Patel", "Computer Science", "2B", 4.8, 28, VerificationLevel.VERIFIED, 21, 12, 5);
  const maya = await person("maya@uwaterloo.ca", "Maya Singh", "Biomedical Engineering", "4A", 4.9, 61, VerificationLevel.AMBASSADOR, 54, 27, 14);
  const liam = await person("liam@uwaterloo.ca", "Liam O'Brien", "Mathematics", "2B", 4.7, 16, VerificationLevel.VERIFIED, 12, 4, 3);
  const sana = await person("sana@uwaterloo.ca", "Sana Rahman", "Architecture", "2A", 4.9, 33, VerificationLevel.TRUSTED, 26, 9, 7);
  const ethan = await person("ethan@uwaterloo.ca", "Ethan Wu", "Mechanical Engineering", "3B", 4.8, 39, VerificationLevel.VERIFIED, 29, 16, 4);
  const priya = await person("priya@uwaterloo.ca", "Priya Nair", "Computer Engineering", "3B", 4.9, 24, VerificationLevel.TRUSTED, 18, 6, 8);
  const jordan = await person("jordan@uwaterloo.ca", "Jordan Lee", "Systems Design Engineering", "2A", 4.8, 19, VerificationLevel.VERIFIED, 14, 3, 5);
  // Existing beta accounts are kept for the web QA tools described in docs/BACKEND_SETUP.md.
  const betaOne = await person("beta1@uwaterloo.ca", "Beta Tester One", "Management Engineering", "3A", 4.6, 7, VerificationLevel.VERIFIED, 5, 2, 1);
  const betaTwo = await person("beta2@uwaterloo.ca", "Beta Tester Two", "Civil Engineering", "2B", 4.7, 9, VerificationLevel.VERIFIED, 8, 3, 2);

  // ---- Marketplace: newest first. createdAt drives list order. -----------------------------
  const listing = (
    sellerId: string,
    title: string,
    description: string,
    price: number,
    postedAt: string,
    location: string,
    category: string,
    createdMinutesAgo: number,
    status: MarketplaceStatus = MarketplaceStatus.AVAILABLE
  ) =>
    prisma.marketplaceListing.create({
      data: { sellerId, title, description, price, postedAt, location, category, status, createdAt: ago(createdMinutesAgo) }
    });

  const airpods = await listing(sana.id, "AirPods Pro (2nd Gen)", "Like new, with case and extra ear tips.", 160, "40 min ago", "SLC", "Electronics", 40);
  await listing(noah.id, "TI-84 Plus CE Calculator", "Fresh batteries, no scratches. Cable included.", 85, "1h ago", "DC Library", "Electronics", 75);
  await listing(ethan.id, "Mini Fridge (3.1 cu ft)", "Quiet and compact. Pickup before Dec 15.", 70, "3h ago", "UWP Lobby", "Appliances", 190, MarketplaceStatus.PENDING);
  await listing(jordan.id, "Engineering Mechanics: Statics", "14th edition. Light highlighting in ch. 1-3.", 45, "5h ago", "E5 Foyer", "Textbooks", 300);
  await listing(priya.id, "Adjustable LED Desk Lamp", "Dimmable with USB charging port.", 15, "1d ago", "V1 Lobby", "Furniture", 60 * 26);
  await listing(avery.id, "Logitech MX Master 3S", "Used one term. Box and receiver included.", 65, "2d ago", "DC Library", "Electronics", 60 * 50);
  await listing(liam.id, "Casio fx-991 Calculator", "Needed for MATH 135 this term. Flexible on brand.", 20, "2d ago", "MC Lobby", "Requests", 60 * 52);
  await listing(avery.id, "Anker 20K Power Bank", "Sold. Thanks to everyone who messaged!", 30, "4d ago", "SLC", "Electronics", 60 * 96, MarketplaceStatus.SOLD);

  // ---- Rides ---------------------------------------------------------------------------------
  const ride = (
    driverId: string,
    route: string,
    departure: string,
    pricePerSeat: number,
    seats: number,
    car: string,
    createdMinutesAgo: number
  ) =>
    prisma.rideListing.create({
      data: {
        driverId,
        route,
        departure,
        pricePerSeat,
        seats,
        car,
        mode: RideMode.OFFER,
        seatStatus: seats > 0 ? RideSeatStatus.SEATS_OPEN : RideSeatStatus.WAITLIST,
        createdAt: ago(createdMinutesAgo)
      }
    });

  // Cleanest Request Seat demo: Avery has not requested it, 3 open seats, strong driver.
  await ride(ethan.id, "Waterloo → Markham", "Sat, 9:00 AM", 18, 3, "Subaru Impreza", 30);
  // Avery's upcoming ride: seat already requested (2 left of 3).
  const torontoRide = await ride(maya.id, "Waterloo → Toronto", "Fri, 4:30 PM", 20, 2, "Tesla Model 3", 120);
  // Avery drives this one.
  await ride(avery.id, "Waterloo → Mississauga", "Sun, 6:00 PM", 16, 2, "Honda Civic", 240);
  await ride(noah.id, "Toronto → Waterloo", "Mon, 7:30 AM", 20, 3, "Toyota Corolla", 600);
  await ride(sana.id, "Waterloo → Pearson Airport", "Thu, 5:15 PM", 28, 0, "Mazda 3", 900);
  await prisma.rideSeatRequest.create({ data: { rideId: torontoRide.id, userId: avery.id, createdAt: ago(60 * 5) } });

  // ---- Study groups ----------------------------------------------------------------------------
  const group = (
    hostId: string,
    course: string,
    title: string,
    schedule: string,
    location: string,
    seatsLeft: number,
    focus: string,
    createdMinutesAgo: number
  ) =>
    prisma.studyGroup.create({
      data: { hostId, course, title, schedule, location, seatsLeft, focus, createdAt: ago(createdMinutesAgo) }
    });

  const syde = await group(jordan.id, "SYDE 121", "Midterm Review", "Tue, 6:00 – 8:00 PM", "E5 4106", 3, "Digital computation and problem walkthroughs", 45);
  await group(priya.id, "ECE 105", "Problem Session", "Wed, 7:00 – 9:00 PM", "DC Library", 4, "Electrostatics and circuit problem sets", 100);
  await group(liam.id, "STAT 231", "Exam Prep", "Thu, 5:30 – 7:30 PM", "SLC Great Hall", 5, "Regression practice and past exam questions", 160);
  const mathGroup = await group(avery.id, "MATH 239", "Final Review", "Sat, 11:00 AM – 1:00 PM", "DC Library", 6, "Counting, recurrences, and proof practice", 400);
  void mathGroup;
  await prisma.studyGroupMember.create({ data: { groupId: syde.id, userId: avery.id, joinedAt: ago(60 * 20) } });

  // ---- Conversations (Avery's inbox: 2 unread, 1 read) ---------------------------------------------
  const convo = async (
    contextType: ConversationContextType,
    contextId: string,
    other: { id: string },
    startedMinutesAgo: number,
    lines: { from: "avery" | "other"; body: string; minutesAgo: number }[],
    readThroughMinutesAgo: number | null
  ) => {
    const created = await prisma.conversation.create({ data: { contextType, contextId } });
    await prisma.conversationParticipant.createMany({
      data: [
        {
          conversationId: created.id,
          userId: avery.id,
          joinedAt: ago(startedMinutesAgo),
          lastReadAt: readThroughMinutesAgo === null ? null : ago(readThroughMinutesAgo)
        },
        { conversationId: created.id, userId: other.id, joinedAt: ago(startedMinutesAgo), lastReadAt: ago(0) }
      ]
    });
    for (const line of lines) {
      await prisma.message.create({
        data: {
          conversationId: created.id,
          senderId: line.from === "avery" ? avery.id : other.id,
          body: line.body,
          createdAt: ago(line.minutesAgo)
        }
      });
    }
  };

  // Marketplace: AirPods. Sana's reply is unread.
  await convo(
    ConversationContextType.MARKETPLACE,
    airpods.id,
    sana,
    35,
    [
      { from: "avery", body: "Hi! Is the AirPods Pro listing still available?", minutesAgo: 35 },
      { from: "other", body: "Yes! I can meet at the SLC today after 4.", minutesAgo: 28 }
    ],
    33
  );
  // Ride Coordination: Maya's Toronto ride. Latest message is unread.
  await convo(
    ConversationContextType.RIDE,
    torontoRide.id,
    maya,
    180,
    [
      { from: "avery", body: "Thanks for the seat! Where's pickup?", minutesAgo: 180 },
      { from: "other", body: "University Ave bus stop, 4:30 sharp.", minutesAgo: 165 },
      { from: "other", body: "I'll message when I'm 5 min away.", minutesAgo: 20 }
    ],
    160
  );
  // Study Group: SYDE 121. Fully read.
  await convo(
    ConversationContextType.STUDY_GROUP,
    syde.id,
    jordan,
    60 * 24,
    [
      { from: "other", body: "Welcome to the group! Bring your lab notes.", minutesAgo: 60 * 24 },
      { from: "avery", body: "Will do, thanks!", minutesAgo: 60 * 23 }
    ],
    60 * 22
  );

  // ---- Reviews for Avery (cross-feature) --------------------------------------------------------------
  await prisma.review.createMany({
    data: [
      { authorId: maya.id, subjectId: avery.id, subject: "Ride to Toronto", body: "On time and a very smooth drive.", rating: 5, createdAt: ago(60 * 24 * 2) },
      { authorId: noah.id, subjectId: avery.id, subject: "Marketplace sale", body: "Item matched the listing. Quick pickup after class.", rating: 5, createdAt: ago(60 * 24 * 5) },
      { authorId: jordan.id, subjectId: avery.id, subject: "MATH 239 study session", body: "Well organized and genuinely helpful.", rating: 4.8, createdAt: ago(60 * 24 * 9) },
      { authorId: priya.id, subjectId: avery.id, subject: "Ride to Mississauga", body: "Friendly, punctual, great communication.", rating: 5, createdAt: ago(60 * 24 * 14) }
    ]
  });
  await prisma.review.create({
    data: {
      authorId: betaOne.id,
      subjectId: betaTwo.id,
      subject: "Marketplace swap",
      body: "Fast replies and an easy handoff.",
      rating: 4.7,
      createdAt: ago(60 * 24 * 3)
    }
  });
}
