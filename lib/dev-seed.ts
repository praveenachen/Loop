import { hash } from "bcryptjs";
import {
  MarketplaceStatus,
  PrismaClient,
  RideMode,
  RideSeatStatus,
  VerificationLevel
} from "@prisma/client";

export async function resetAndSeed(prisma: PrismaClient) {
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.marketplaceListing.deleteMany();
  await prisma.rideListing.deleteMany();
  await prisma.studyGroup.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("LoopPass123!", 12);

  const [avery, noah, maya, liam, sana, ethan, betaOne, betaTwo] = await Promise.all([
    prisma.user.create({
      data: {
        email: "avery@uwaterloo.ca",
        name: "Avery Chen",
        program: "Software Engineering",
        year: "3A",
        avatar: "AC",
        rating: 4.9,
        reviewsCount: 42,
        verificationLevel: VerificationLevel.TRUSTED,
        completedTransactions: 31,
        ridesGiven: 18,
        groupsHosted: 9,
        passwordHash,
        verifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: "noah@uwaterloo.ca",
        name: "Noah Patel",
        program: "Computer Science",
        year: "2B",
        avatar: "NP",
        rating: 4.8,
        reviewsCount: 28,
        verificationLevel: VerificationLevel.VERIFIED,
        completedTransactions: 21,
        ridesGiven: 12,
        groupsHosted: 5,
        passwordHash,
        verifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: "maya@uwaterloo.ca",
        name: "Maya Singh",
        program: "Biomedical Engineering",
        year: "4A",
        avatar: "MS",
        rating: 5,
        reviewsCount: 61,
        verificationLevel: VerificationLevel.AMBASSADOR,
        completedTransactions: 54,
        ridesGiven: 27,
        groupsHosted: 14,
        passwordHash,
        verifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: "liam@uwaterloo.ca",
        name: "Liam O'Brien",
        program: "Math",
        year: "1B",
        avatar: "LO",
        rating: 4.7,
        reviewsCount: 16,
        verificationLevel: VerificationLevel.VERIFIED,
        completedTransactions: 12,
        ridesGiven: 4,
        groupsHosted: 3,
        passwordHash,
        verifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: "sana@uwaterloo.ca",
        name: "Sana Rahman",
        program: "Architecture",
        year: "2A",
        avatar: "SR",
        rating: 4.9,
        reviewsCount: 33,
        verificationLevel: VerificationLevel.TRUSTED,
        completedTransactions: 26,
        ridesGiven: 9,
        groupsHosted: 7,
        passwordHash,
        verifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: "ethan@uwaterloo.ca",
        name: "Ethan Wu",
        program: "Mechanical Engineering",
        year: "3B",
        avatar: "EW",
        rating: 4.8,
        reviewsCount: 39,
        verificationLevel: VerificationLevel.VERIFIED,
        completedTransactions: 29,
        ridesGiven: 16,
        groupsHosted: 4,
        passwordHash,
        verifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: "beta1@uwaterloo.ca",
        name: "Beta Tester One",
        program: "Management Engineering",
        year: "3A",
        avatar: "B1",
        rating: 4.6,
        reviewsCount: 7,
        verificationLevel: VerificationLevel.VERIFIED,
        completedTransactions: 5,
        ridesGiven: 2,
        groupsHosted: 1,
        passwordHash,
        verifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: "beta2@uwaterloo.ca",
        name: "Beta Tester Two",
        program: "Civil Engineering",
        year: "2B",
        avatar: "B2",
        rating: 4.7,
        reviewsCount: 9,
        verificationLevel: VerificationLevel.VERIFIED,
        completedTransactions: 8,
        ridesGiven: 3,
        groupsHosted: 2,
        passwordHash,
        verifiedAt: new Date()
      }
    })
  ]);

  await prisma.marketplaceListing.createMany({
    data: [
      {
        sellerId: maya.id,
        title: "iClicker Reef + PHYS 121 Notes Bundle",
        description: "Excellent condition. Includes formula cheat sheets and annotated lecture notes.",
        price: 55,
        postedAt: "12 mins ago",
        location: "E7 Atrium",
        category: "Textbooks",
        status: MarketplaceStatus.AVAILABLE
      },
      {
        sellerId: noah.id,
        title: "Herman Miller Aeron (Size B)",
        description: "Selling before co-op term. Fully working, no major scratches.",
        price: 540,
        postedAt: "1h ago",
        location: "ICON 330",
        category: "Furniture",
        status: MarketplaceStatus.PENDING
      },
      {
        sellerId: liam.id,
        title: "Request: CHEM 266 Lab Coat",
        description: "Need by Monday lab. Medium or large. Can pick up on campus today.",
        price: 25,
        postedAt: "2h ago",
        location: "QNC Lobby",
        category: "Requests",
        status: MarketplaceStatus.AVAILABLE
      },
      {
        sellerId: sana.id,
        title: "Dell 27-inch 4K Monitor (USB-C)",
        description: "Perfect for coding + design work. Includes stand and original box.",
        price: 280,
        postedAt: "3h ago",
        location: "UWP Beck Hall",
        category: "Electronics",
        status: MarketplaceStatus.AVAILABLE
      },
      {
        sellerId: ethan.id,
        title: "SYDE 252 + STAT 206 Midterm Prep Bundle",
        description: "Condensed formula sheets + solved practice sets with topic tags.",
        price: 30,
        postedAt: "5h ago",
        location: "RCH Foyer",
        category: "Textbooks",
        status: MarketplaceStatus.AVAILABLE
      },
      {
        sellerId: avery.id,
        title: "Request: Winter Convocation Dress Shirt",
        description: "Need a slim-fit medium shirt by Friday evening, can return dry-cleaned.",
        price: 20,
        postedAt: "7h ago",
        location: "SLC Turnkey",
        category: "Requests",
        status: MarketplaceStatus.PENDING
      }
    ]
  });

  await prisma.rideListing.createMany({
    data: [
      {
        driverId: avery.id,
        route: "Waterloo -> Pearson Airport",
        departure: "Sun, 6:30 PM",
        pricePerSeat: 24,
        seats: 2,
        seatStatus: RideSeatStatus.SEATS_OPEN,
        mode: RideMode.OFFER,
        car: "Toyota Corolla 2021"
      },
      {
        driverId: maya.id,
        route: "Waterloo -> Downtown Toronto",
        departure: "Fri, 4:45 PM",
        pricePerSeat: 19,
        seats: 0,
        seatStatus: RideSeatStatus.WAITLIST,
        mode: RideMode.OFFER,
        car: "Tesla Model 3"
      },
      {
        driverId: noah.id,
        route: "Mississauga -> Waterloo",
        departure: "Mon, 8:00 AM",
        pricePerSeat: 21,
        seats: 3,
        seatStatus: RideSeatStatus.SEATS_OPEN,
        mode: RideMode.OFFER,
        car: "Honda Civic 2020"
      },
      {
        driverId: sana.id,
        route: "Waterloo -> Vaughan",
        departure: "Wed, 5:15 PM",
        pricePerSeat: 17,
        seats: 1,
        seatStatus: RideSeatStatus.SEATS_OPEN,
        mode: RideMode.OFFER,
        car: "Mazda 3 2019"
      },
      {
        driverId: ethan.id,
        route: "Kitchener GO -> Waterloo Campus",
        departure: "Tue, 8:20 AM",
        pricePerSeat: 8,
        seats: 3,
        seatStatus: RideSeatStatus.SEATS_OPEN,
        mode: RideMode.OFFER,
        car: "Subaru Impreza 2018"
      },
      {
        driverId: maya.id,
        route: "Waterloo -> Hamilton",
        departure: "Sat, 10:30 AM",
        pricePerSeat: 22,
        seats: 0,
        seatStatus: RideSeatStatus.WAITLIST,
        mode: RideMode.REQUEST,
        car: "Hyundai Elantra 2022"
      }
    ]
  });

  await prisma.studyGroup.createMany({
    data: [
      {
        hostId: avery.id,
        course: "CS 341",
        title: "Midterm 2 Proof Practice Sprint",
        schedule: "Tue, 7:00 PM - 9:00 PM",
        location: "DC 1568",
        seatsLeft: 4,
        focus: "Graph reductions + NP-completeness drills"
      },
      {
        hostId: liam.id,
        course: "STAT 231",
        title: "Final Prep Problem Marathon",
        schedule: "Thu, 6:00 PM - 8:30 PM",
        location: "MC Comfy Lounge",
        seatsLeft: 2,
        focus: "Regression intuition and exam-style short answers"
      },
      {
        hostId: maya.id,
        course: "BIOL 373",
        title: "Cell Signalling Concept Mapping",
        schedule: "Sat, 11:00 AM - 1:00 PM",
        location: "Health Expansion Building",
        seatsLeft: 7,
        focus: "Pathway synthesis and memorization systems"
      },
      {
        hostId: ethan.id,
        course: "ECE 105",
        title: "Circuit Crunch Before Quiz 3",
        schedule: "Mon, 8:00 PM - 10:00 PM",
        location: "E7 Room 4433",
        seatsLeft: 5,
        focus: "Nodal analysis, op-amps, and timed quiz drills"
      },
      {
        hostId: sana.id,
        course: "SYDE 121",
        title: "Lab 2 Debug + Report Clinic",
        schedule: "Wed, 6:30 PM - 8:30 PM",
        location: "E5 Design Bay",
        seatsLeft: 3,
        focus: "Arduino debugging and polished report structure"
      },
      {
        hostId: noah.id,
        course: "MATH 239",
        title: "Combinatorics Final Problem Ladder",
        schedule: "Fri, 5:00 PM - 7:30 PM",
        location: "MC 3001",
        seatsLeft: 6,
        focus: "Inclusion-exclusion, recurrences, and counting proofs"
      }
    ]
  });

  const convo = await prisma.conversation.create({
    data: {
      contextType: "RIDE"
    }
  });

  await prisma.conversationParticipant.createMany({
    data: [
      { conversationId: convo.id, userId: avery.id },
      { conversationId: convo.id, userId: maya.id }
    ]
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: convo.id,
        senderId: maya.id,
        body: "Can do pickup at University Ave bus stop at 6:10 PM."
      },
      {
        conversationId: convo.id,
        senderId: avery.id,
        body: "Perfect, see you there."
      }
    ]
  });

  await prisma.review.createMany({
    data: [
      {
        authorId: maya.id,
        subjectId: avery.id,
        subject: "Smooth airport ride",
        body: "On time, clear communication, and super safe driving in snow.",
        rating: 5
      },
      {
        authorId: noah.id,
        subjectId: avery.id,
        subject: "Marketplace purchase",
        body: "Item matched photos and pickup was quick right after class.",
        rating: 5
      },
      {
        authorId: liam.id,
        subjectId: avery.id,
        subject: "Hosted CS 341 session",
        body: "Structured, focused session that helped our whole group improve.",
        rating: 4.8
      },
      {
        authorId: betaOne.id,
        subjectId: betaTwo.id,
        subject: "Reliable marketplace swap",
        body: "Fast responses and smooth handoff right after class.",
        rating: 4.7
      }
    ]
  });
}
