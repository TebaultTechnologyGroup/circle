import { a, defineData } from "@aws-amplify/backend";
import type { ClientSchema } from "@aws-amplify/backend";

/**
 * Circle App — Amplify Gen2 Data Schema
 *
 * Terminology:
 * Circle = the top-level support group record
 * Center = the *person* being supported (a field/role on the Circle,
 * not a separate table — keeps lookups simple)
 *
 * Design decisions:
 * - Reactions and Comments are first-class models (not embedded JSON arrays)
 * so they can be queried, paginated, and deleted individually.
 * DynamoDB embedded arrays cannot be partially updated safely at scale.
 *
 * - CircleMember is an explicit join table carrying the role enum.
 * This is the standard pattern for many-to-many with attributes.
 *
 * - Funding is 1:1 with Circle (a Circle has at most one active campaign).
 * Contributions are a child model of Funding.
 *
 * - PlatformDonation is separate from Contribution — one is money to a
 * Circle, the other is money to keep the platform running.
 *
 * - SubscriptionPlan is a reference/lookup table seeded manually.
 * BillingRecord tracks each charge event per Circle.
 *
 * - MembershipRequest tracks pending join requests (search-to-join flow).
 * Share-link joins bypass this and create a CircleMember directly.
 *
 * - NotificationPreference is per-user (not per-circle, per the spec).
 *
 * - CheckIn is the daily symptom log for the AI Doctor Summary feature.
 * This data IS stored (unlike the medical document upload, which is
 * ephemeral on S3). If you decide CheckIn data should also be
 * ephemeral, remove this model.
 */
const schema = a.schema({
  // ─────────────────────────────────────────────
  // ENUMS
  // ─────────────────────────────────────────────
  CircleRole: a.enum(["CENTER", "CAREGIVER", "FAMILY", "FRIEND"]),
  MembershipStatus: a.enum(["PENDING", "APPROVED", "DENIED"]),
  HelpRequestStatus: a.enum(["OPEN", "CLAIMED", "COMPLETE"]),
  HelpRequestCategory: a.enum([
    "MEAL",
    "ERRAND",
    "RIDE",
    "CHILDCARE",
    "PETCARE",
    "YARD",
    "CLEANING",
    "OTHER",
  ]),
  ReactionType: a.enum([
    "HEART",
    "STRENGTH",
    "PRAY",
    "CANDLE",
    "HUG",
    "SMILE",
  ]),
  NotificationChannel: a.enum(["SMS", "EMAIL"]),
  SubscriptionTier: a.enum(["FREE", "PAID"]),
  // ─────────────────────────────────────────────
  // USER PROFILE
  // ─────────────────────────────────────────────
  UserProfile: a
    .model({
      cognitoUserId: a.string().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      email: a.string().required(),
      phone: a.string(),
      avatarS3Key: a.string(),
      lastLoginAt: a.datetime(),
      // Relationships
      circleMembers: a.hasMany("CircleMember", "userProfileId"),
      membershipRequests: a.hasMany("MembershipRequest", "userProfileId"),
      notificationPreference: a.hasOne("NotificationPreference", "userProfileId"),
      platformDonations: a.hasMany("PlatformDonation", "userProfileId"),
      checkIns: a.hasMany("CheckIn", "userProfileId"),

      // ← FIXED: Reverse relationship for Circle.centerProfile
      centerCircle: a.hasOne("Circle", "centerProfileId"),
    })
    .authorization((allow: any) => [
      allow.owner(),
      allow.authenticated().to(["read"]),
    ]),

  // ─────────────────────────────────────────────
  // NOTIFICATION PREFERENCES
  // ─────────────────────────────────────────────
  NotificationPreference: a
    .model({
      userProfileId: a.id().required(),
      userProfile: a.belongsTo("UserProfile", "userProfileId"),
      smsOnUpdate: a.boolean().default(true),
      smsOnHelpRequest: a.boolean().default(true),
      emailOnUpdate: a.boolean().default(true),
      emailOnHelpRequest: a.boolean().default(true),
      emailWeeklyDigest: a.boolean().default(true),
    })
    .authorization((allow: any) => [allow.owner()]),

  // ─────────────────────────────────────────────
  // CIRCLE
  // ─────────────────────────────────────────────
  Circle: a
    .model({
      name: a.string().required(),
      centerEmail: a.string(),
      centerPhone: a.string(),
      centerProfileId: a.id(),
      centerProfile: a.belongsTo("UserProfile", "centerProfileId"),
      description: a.string(),
      isDiscoverable: a.boolean().default(false),
      requiresMemberApproval: a.boolean().default(true),
      isActive: a.boolean().default(true),
      centerFirstName: a.string().required(),
      centerLastName: a.string().required(),
      centerCondition: a.string(),
      centerAvatarS3Key: a.string(),
      centerBio: a.string(),
      shareToken: a.string().required(),
      ownerCognitoId: a.string().required(),
      featureAIComposer: a.boolean().default(true),
      featureVoiceToUpdate: a.boolean().default(false),
      featureMedicalSummary: a.boolean().default(false),
      featurePredictiveTask: a.boolean().default(false),
      featureSmartMatching: a.boolean().default(false),

      // Relationships
      members: a.hasMany("CircleMember", "circleId"),
      updates: a.hasMany("Update", "circleId"),
      helpRequests: a.hasMany("HelpRequest", "circleId"),
      funding: a.hasOne("Funding", "circleId"),
      membershipRequests: a.hasMany("MembershipRequest", "circleId"),
      billingRecords: a.hasMany("BillingRecord", "circleId"),
      checkIns: a.hasMany("CheckIn", "circleId"),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  // ... (the rest of your models remain unchanged)
  CircleMember: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),
      userProfileId: a.id().required(),
      userProfile: a.belongsTo("UserProfile", "userProfileId"),
      role: a.ref("CircleRole").required(),
      joinedAt: a.datetime(),
      displayName: a.string(),
      avatarS3Key: a.string(),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  MembershipRequest: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),
      userProfileId: a.id().required(),
      userProfile: a.belongsTo("UserProfile", "userProfileId"),
      requestedRole: a.ref("CircleRole").required(),
      assignedRole: a.ref("CircleRole"),
      status: a.ref("MembershipStatus").required(),
      requestedAt: a.datetime(),
      resolvedAt: a.datetime(),
      resolvedByCognitoId: a.string(),
      denialReason: a.string(),
    })
    .authorization((allow: any) => [allow.owner(), allow.authenticated()]),

  Update: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),
      authorCognitoId: a.string().required(),
      authorDisplayName: a.string(),
      rawContent: a.string().required(),
      content: a.string(),
      aiProcessed: a.boolean().default(false),
      reactions: a.hasMany("Reaction", "updateId"),
      comments: a.hasMany("Comment", "updateId"),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  Reaction: a
    .model({
      updateId: a.id().required(),
      update: a.belongsTo("Update", "updateId"),
      userCognitoId: a.string().required(),
      userDisplayName: a.string(),
      reactionType: a.ref("ReactionType").required(),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  Comment: a
    .model({
      updateId: a.id().required(),
      update: a.belongsTo("Update", "updateId"),
      authorCognitoId: a.string().required(),
      authorDisplayName: a.string(),
      content: a.string().required(),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  HelpRequest: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),
      authorCognitoId: a.string().required(),
      title: a.string().required(),
      description: a.string(),
      category: a.ref("HelpRequestCategory").required(),
      status: a.ref("HelpRequestStatus").required(),
      dueAt: a.datetime(),
      completedAt: a.datetime(),
      volunteerCognitoId: a.string(),
      volunteerDisplayName: a.string(),
      claimedAt: a.datetime(),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  Funding: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),
      heading: a.string().required(),
      description: a.string(),
      footer: a.string(),
      goalAmountCents: a.integer(),
      raisedAmountCents: a.integer().default(0),
      isActive: a.boolean().default(true),
      stripePaymentLinkId: a.string(),
      contributions: a.hasMany("Contribution", "fundingId"),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  Contribution: a
    .model({
      fundingId: a.id().required(),
      funding: a.belongsTo("Funding", "fundingId"),
      donorCognitoId: a.string(),
      donorDisplayName: a.string(),
      amountCents: a.integer().required(),
      feeCents: a.integer().required(),
      netCents: a.integer().required(),
      note: a.string(),
      stripePaymentIntentId: a.string().required(),
      stripeStatus: a.string().required(),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  PlatformDonation: a
    .model({
      userProfileId: a.id(),
      userProfile: a.belongsTo("UserProfile", "userProfileId"),
      amountCents: a.integer().required(),
      note: a.string(),
      stripePaymentIntentId: a.string().required(),
      stripeStatus: a.string().required(),
    })
    .authorization((allow: any) => [allow.owner()]),

  SubscriptionPlan: a
    .model({
      name: a.string().required(),
      tier: a.ref("SubscriptionTier").required(),
      pricePerMonthCents: a.integer().required(),
      description: a.string(),
      includesVoiceToUpdate: a.boolean().default(false),
      includesMedicalSummary: a.boolean().default(false),
      includesPredictiveTask: a.boolean().default(false),
      includesSmartMatching: a.boolean().default(false),
      stripeProductId: a.string(),
      stripePriceId: a.string(),
      isActive: a.boolean().default(true),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  BillingRecord: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),
      payerCognitoId: a.string().required(),
      subscriptionPlanId: a.id().required(),
      amountCents: a.integer().required(),
      billingPeriodStart: a.datetime().required(),
      billingPeriodEnd: a.datetime().required(),
      stripeInvoiceId: a.string().required(),
      stripeStatus: a.string().required(),
      featuresSnapshot: a.json(),
    })
    .authorization((allow: any) => [allow.owner()]),

  CheckIn: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),
      userProfileId: a.id().required(),
      userProfile: a.belongsTo("UserProfile", "userProfileId"),
      painLevel: a.integer(),
      fatigueLevel: a.integer(),
      moodLevel: a.integer(),
      appetiteLevel: a.integer(),
      notes: a.string(),
      medications: a.string(),
      checkInDate: a.date().required(),
    })
    .authorization((allow: any) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});