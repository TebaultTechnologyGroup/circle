import { a, defineData } from "@aws-amplify/backend";
import type { ClientSchema } from "@aws-amplify/backend";



/**
 * Circle App — Amplify Gen2 Data Schema
 *
 * Terminology:
 *   Circle  = the top-level support group record
 *   Center  = the *person* being supported (a field/role on the Circle,
 *             not a separate table — keeps lookups simple)
 *
 * Design decisions:
 *   - Reactions and Comments are first-class models (not embedded JSON arrays)
 *     so they can be queried, paginated, and deleted individually.
 *     DynamoDB embedded arrays cannot be partially updated safely at scale.
 *
 *   - CircleMember is an explicit join table carrying the role enum.
 *     This is the standard pattern for many-to-many with attributes.
 *
 *   - Funding is 1:1 with Circle (a Circle has at most one active campaign).
 *     Contributions are a child model of Funding.
 *
 *   - PlatformDonation is separate from Contribution — one is money to a
 *     Circle, the other is money to keep the platform running.
 *
 *   - SubscriptionPlan is a reference/lookup table seeded manually.
 *     BillingRecord tracks each charge event per Circle.
 *
 *   - MembershipRequest tracks pending join requests (search-to-join flow).
 *     Share-link joins bypass this and create a CircleMember directly.
 *
 *   - NotificationPreference is per-user (not per-circle, per the spec).
 *
 *   - CheckIn is the daily symptom log for the AI Doctor Summary feature.
 *     This data IS stored (unlike the medical document upload, which is
 *     ephemeral on S3). If you decide CheckIn data should also be
 *     ephemeral, remove this model.
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
  // Cognito owns auth; this model stores app-level profile data.
  // The `owner` field is the Cognito sub (userId).
  // ─────────────────────────────────────────────

  UserProfile: a
    .model({
      // Cognito userId links auth identity to this profile
      cognitoUserId: a.string().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      email: a.string().required(),
      phone: a.string(), // E.164 format, e.g. +14045551234
      avatarS3Key: a.string(), // S3 key for profile photo
      lastLoginAt: a.datetime(),

      // Relationships
      circleMembers: a.hasMany("CircleMember", "userProfileId"),
      membershipRequests: a.hasMany("MembershipRequest", "userProfileId"),
      notificationPreference: a.hasOne(
        "NotificationPreference",
        "userProfileId"
      ),
      platformDonations: a.hasMany("PlatformDonation", "userProfileId"),
      checkIns: a.hasMany("CheckIn", "userProfileId"),
    })
    .authorization((allow: any) => [
      allow.owner(), // user can read/write their own profile
      allow.authenticated().to(["read"]), // other users can read basic profile info
    ]),

  // ─────────────────────────────────────────────
  // NOTIFICATION PREFERENCES
  // One record per user. Settings apply across ALL circles (per spec).
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
  // The top-level support group. "Center" is the supported person's
  // name/info stored on the Circle record — not a separate model.
  // ─────────────────────────────────────────────

  Circle: a
    .model({
      // Circle identity
      name: a.string().required(), // e.g. "Support Circle for Jane Smith"

      // Contact points for identity matching
      centerEmail: a.string(),
      centerPhone: a.string(),

      // The actual link to the User once they "claim" it
      centerProfileId: a.id(),
      centerProfile: a.belongsTo("UserProfile", "centerProfileId"),

      description: a.string(),
      isDiscoverable: a.boolean().default(false), // appears in search
      requiresMemberApproval: a.boolean().default(true),
      isActive: a.boolean().default(true), // false = archived/closed

      // The person being supported ("Center" persona)
      centerFirstName: a.string().required(),
      centerLastName: a.string().required(),
      centerCondition: a.string(), // e.g. "Breast Cancer - Stage 2"
      centerAvatarS3Key: a.string(),
      centerBio: a.string(), // short intro shown to new joiners

      // Share link token — a short unique token for the share URL
      // e.g. circleapp.com/join/abc123
      shareToken: a.string().required(),

      // Owner = Cognito userId of the person who created the Circle
      // (not necessarily the Center persona — could be a Caregiver)
      ownerCognitoId: a.string().required(),

      // Paid feature flags for this Circle
      featureAIComposer: a.boolean().default(true), // free tier
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
      // Any authenticated user can read discoverable circles (for search)
      allow.authenticated().to(["read"]),
      // Full access controlled via custom Lambda authorizer or field-level rules
      allow.owner(),
    ]),

  // ─────────────────────────────────────────────
  // CIRCLE MEMBER (join table: User <-> Circle with role)
  // ─────────────────────────────────────────────

  CircleMember: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),

      userProfileId: a.id().required(),
      userProfile: a.belongsTo("UserProfile", "userProfileId"),

      role: a.ref("CircleRole").required(),
      joinedAt: a.datetime(),

      // Denormalized for display performance (avoids fetching full UserProfile
      // just to show a member list)
      displayName: a.string(), // "Jane S."
      avatarS3Key: a.string(),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  // ─────────────────────────────────────────────
  // MEMBERSHIP REQUEST (search-to-join flow)
  // Share-link joiners skip this and get a CircleMember record directly.
  // ─────────────────────────────────────────────

  MembershipRequest: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),

      userProfileId: a.id().required(),
      userProfile: a.belongsTo("UserProfile", "userProfileId"),

      requestedRole: a.ref("CircleRole").required(), // what they asked for
      assignedRole: a.ref("CircleRole"), // what was granted (may differ)
      status: a.ref("MembershipStatus").required(),

      requestedAt: a.datetime(),
      resolvedAt: a.datetime(),
      resolvedByCognitoId: a.string(), // who approved/denied
      denialReason: a.string(),
    })
    .authorization((allow: any) => [allow.owner(), allow.authenticated()]),

  // ─────────────────────────────────────────────
  // UPDATE (journal post from Center or Caregiver)
  // ─────────────────────────────────────────────

  Update: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),

      authorCognitoId: a.string().required(),
      authorDisplayName: a.string(), // denormalized for display

      rawContent: a.string().required(), // what the user typed
      content: a.string(), // AI-polished version (null if not yet processed)
      aiProcessed: a.boolean().default(false),

      // Relationships
      reactions: a.hasMany("Reaction", "updateId"),
      comments: a.hasMany("Comment", "updateId"),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  // ─────────────────────────────────────────────
  // REACTION (on an Update)
  // One record per user per update — enforced at app layer.
  // ─────────────────────────────────────────────

  Reaction: a
    .model({
      updateId: a.id().required(),
      update: a.belongsTo("Update", "updateId"),

      userCognitoId: a.string().required(),
      userDisplayName: a.string(), // denormalized
      reactionType: a.ref("ReactionType").required(),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  // ─────────────────────────────────────────────
  // COMMENT (on an Update)
  // ─────────────────────────────────────────────

  Comment: a
    .model({
      updateId: a.id().required(),
      update: a.belongsTo("Update", "updateId"),

      authorCognitoId: a.string().required(),
      authorDisplayName: a.string(), // denormalized
      content: a.string().required(),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  // ─────────────────────────────────────────────
  // HELP REQUEST
  // ─────────────────────────────────────────────

  HelpRequest: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),

      authorCognitoId: a.string().required(),
      title: a.string().required(),
      description: a.string(),
      category: a.ref("HelpRequestCategory").required(),
      status: a.ref("HelpRequestStatus").required(),

      dueAt: a.datetime(), // optional — for time-specific requests
      completedAt: a.datetime(),

      // Volunteer who claimed it
      volunteerCognitoId: a.string(),
      volunteerDisplayName: a.string(), // denormalized
      claimedAt: a.datetime(),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  // ─────────────────────────────────────────────
  // FUNDING CAMPAIGN (one per Circle)
  // ─────────────────────────────────────────────

  Funding: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),

      heading: a.string().required(),
      description: a.string(),
      footer: a.string(),

      goalAmountCents: a.integer(), // store money as cents, never floats
      raisedAmountCents: a.integer().default(0),
      isActive: a.boolean().default(true),

      // Stripe payment link or product ID for this campaign
      stripePaymentLinkId: a.string(),

      contributions: a.hasMany("Contribution", "fundingId"),
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  // ─────────────────────────────────────────────
  // CONTRIBUTION (donation to a Circle's Funding campaign)
  // Created by Stripe webhook — not directly by the user.
  // ─────────────────────────────────────────────

  Contribution: a
    .model({
      fundingId: a.id().required(),
      funding: a.belongsTo("Funding", "fundingId"),

      donorCognitoId: a.string(), // null if anonymous
      donorDisplayName: a.string(),

      amountCents: a.integer().required(),
      feeCents: a.integer().required(), // 3% + $0.30 in cents
      netCents: a.integer().required(), // amountCents - feeCents
      note: a.string(),

      stripePaymentIntentId: a.string().required(), // for reconciliation
      stripeStatus: a.string().required(), // 'succeeded', 'refunded', etc.
    })
    .authorization((allow: any) => [
      allow.authenticated().to(["read"]),
      allow.owner(),
    ]),

  // ─────────────────────────────────────────────
  // PLATFORM DONATION (money to keep the site running — separate from
  // Contribution which goes to a specific Circle)
  // ─────────────────────────────────────────────

  PlatformDonation: a
    .model({
      userProfileId: a.id(), // null if anonymous
      userProfile: a.belongsTo("UserProfile", "userProfileId"),

      amountCents: a.integer().required(),
      note: a.string(),

      stripePaymentIntentId: a.string().required(),
      stripeStatus: a.string().required(),
    })
    .authorization((allow: any) => [allow.owner()]),

  // ─────────────────────────────────────────────
  // SUBSCRIPTION PLAN (lookup/reference table — seed manually)
  // e.g. { id: "plan_paid_monthly", name: "Paid Monthly", pricePerMonthCents: 999 }
  // ─────────────────────────────────────────────

  SubscriptionPlan: a
    .model({
      name: a.string().required(),
      tier: a.ref("SubscriptionTier").required(),
      pricePerMonthCents: a.integer().required(),
      description: a.string(),

      // Which features this plan includes
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

  // ─────────────────────────────────────────────
  // BILLING RECORD (one per billing event per Circle)
  // Created by Stripe webhook, linked to a Circle (not a User) because
  // any member can pay for a Circle's features.
  // ─────────────────────────────────────────────

  BillingRecord: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),

      payerCognitoId: a.string().required(), // who paid
      subscriptionPlanId: a.id().required(),

      amountCents: a.integer().required(),
      billingPeriodStart: a.datetime().required(),
      billingPeriodEnd: a.datetime().required(),

      stripeInvoiceId: a.string().required(),
      stripeStatus: a.string().required(), // 'paid', 'past_due', 'void'

      // Which features were active during this billing period
      featuresSnapshot: a.json(), // { voiceToUpdate: true, medicalSummary: false, ... }
    })
    .authorization((allow: any) => [allow.owner()]),

  // ─────────────────────────────────────────────
  // CHECK-IN (daily symptom log — AI Doctor Summary feature)
  // Stored in DB (unlike the medical document upload which is ephemeral).
  // Only visible to CENTER and CAREGIVER roles.
  // ─────────────────────────────────────────────

  CheckIn: a
    .model({
      circleId: a.id().required(),
      circle: a.belongsTo("Circle", "circleId"),

      userProfileId: a.id().required(),
      userProfile: a.belongsTo("UserProfile", "userProfileId"),

      // Symptom tracking
      painLevel: a.integer(), // 0–10
      fatigueLevel: a.integer(), // 0–10
      moodLevel: a.integer(), // 0–10
      appetiteLevel: a.integer(), // 0–10
      notes: a.string(), // free-text notes for the day
      medications: a.string(), // what was taken

      // AI-generated summary for the doctor (generated on demand, not stored by default)
      // If you want to cache the AI summary, add: aiSummary: a.string()
      checkInDate: a.date().required(), // YYYY-MM-DD
    })
    .authorization((allow: any) => [
      // Only the owner (who logged it) can read/write
      // Additional access for Caregiver/Center enforced at Lambda layer
      allow.owner(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      // API key used only for public-facing Circle search (discoverable circles)
      expiresInDays: 365,
    },
  },
});