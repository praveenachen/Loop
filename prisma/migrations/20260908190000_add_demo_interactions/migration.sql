-- CreateTable
CREATE TABLE "public"."RideSeatRequest" (
    "id" TEXT NOT NULL,
    "rideId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RideSeatRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudyGroupMember" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RideSeatRequest_rideId_userId_key" ON "public"."RideSeatRequest"("rideId", "userId");
CREATE INDEX "RideSeatRequest_userId_idx" ON "public"."RideSeatRequest"("userId");
CREATE UNIQUE INDEX "StudyGroupMember_groupId_userId_key" ON "public"."StudyGroupMember"("groupId", "userId");
CREATE INDEX "StudyGroupMember_userId_idx" ON "public"."StudyGroupMember"("userId");

-- AddForeignKey
ALTER TABLE "public"."RideSeatRequest" ADD CONSTRAINT "RideSeatRequest_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "public"."RideListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."RideSeatRequest" ADD CONSTRAINT "RideSeatRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."StudyGroupMember" ADD CONSTRAINT "StudyGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."StudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."StudyGroupMember" ADD CONSTRAINT "StudyGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
