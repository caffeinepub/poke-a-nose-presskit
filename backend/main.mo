import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  public type GameDetails = {
    genre : Text;
    platforms : Text;
    releaseDate : Text;
  };

  public type Content = {
    aboutText : Text;
    features : [Text];
    gameDetails : GameDetails;
    instagramLink : Text;
    youtubeLink : Text;
    developerWebsite : Text;
    pressEmail : Text;
    bodyTextColorHex : Text;
    passwordEnabled : Bool;
  };

  public type UserProfile = {
    name : Text;
    principal : Principal;
  };

  public type AdminStatus = {
    adminClaimed : Bool;
    callerIsAdmin : Bool;
  };

  // Initialize access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  var passwordEnabled = false;
  var passwordHash = "";
  var bodyTextColorHex = "#000000";
  var aboutText = "";
  var features : [Text] = [];
  var gameDetails : GameDetails = {
    genre = "";
    platforms = "";
    releaseDate = "";
  };
  var instagramLink = "";
  var youtubeLink = "https://youtu.be/5in-hIASH08";
  var developerWebsite = "";
  var pressEmail = "";

  var adminPrincipal : ?Principal = null;

  include MixinStorage();

  // ── User Profile Management ──────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Admin Claim ──────────────────────────────────────────────────────────

  public shared ({ caller }) func claimAdmin() : async () {
    // Reject anonymous principals
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot claim admin");
    };
    switch (adminPrincipal) {
      case (null) {
        // First authenticated caller becomes admin
        adminPrincipal := ?caller;
        // Also register in the access control system
        let adminToken = "presetAdminToken";
        let userProvidedToken = "presetUserToken";
        AccessControl.initialize(accessControlState, caller, adminToken, userProvidedToken);
      };
      case (?existingAdmin) {
        if (caller != existingAdmin) {
          Runtime.trap("Admin already claimed");
        };
        // Idempotent: caller is already the admin, succeed silently
      };
    };
  };

  public query ({ caller }) func getAdminStatus() : async AdminStatus {
    let claimed = switch (adminPrincipal) {
      case (null) { false };
      case (?_admin) { true };
    };
    let callerIsAdmin = switch (adminPrincipal) {
      case (null) { false };
      case (?admin) { caller == admin };
    };
    {
      adminClaimed = claimed;
      callerIsAdmin = callerIsAdmin;
    };
  };

  // ── Internal Admin Guard ─────────────────────────────────────────────────

  func requireAdmin(caller : Principal) {
    switch (adminPrincipal) {
      case (null) {
        Runtime.trap("No admin has claimed control yet");
      };
      case (?admin) {
        if (caller != admin) {
          Runtime.trap("Access denied: Only admin can perform this action");
        };
      };
    };
  };

  // ── Password Protection ──────────────────────────────────────────────────

  public shared ({ caller }) func enablePasswordProtection(password : Text) : async () {
    requireAdmin(caller);
    passwordHash := password;
    passwordEnabled := true;
  };

  public shared ({ caller }) func disablePasswordProtection() : async () {
    requireAdmin(caller);
    passwordEnabled := false;
    passwordHash := "";
  };

  public query func verifyPassword(password : Text) : async Bool {
    if (not passwordEnabled) {
      return false;
    };
    password == passwordHash;
  };

  // ── Content Queries ──────────────────────────────────────────────────────

  public query func getContent() : async Content {
    {
      aboutText;
      features;
      gameDetails;
      instagramLink;
      youtubeLink;
      developerWebsite;
      pressEmail;
      bodyTextColorHex;
      passwordEnabled;
    };
  };

  // ── Content Management Methods (Admin Only) ──────────────────────────────

  public shared ({ caller }) func updateAbout(text : Text) : async () {
    requireAdmin(caller);
    aboutText := text;
  };

  public shared ({ caller }) func updateFeatures(newFeatures : [Text]) : async () {
    requireAdmin(caller);
    let maxFeatures = 4;
    if (newFeatures.size() > maxFeatures) {
      Runtime.trap("Please keep features list to 4 items or less.");
    };
    features := newFeatures;
  };

  public shared ({ caller }) func updateGameDetails(genre : Text, platforms : Text, releaseDate : Text) : async () {
    requireAdmin(caller);
    gameDetails := {
      genre;
      platforms;
      releaseDate;
    };
  };

  public shared ({ caller }) func updateInstagram(link : Text) : async () {
    requireAdmin(caller);
    instagramLink := link;
  };

  public shared ({ caller }) func updateYoutubeLink(link : Text) : async () {
    requireAdmin(caller);
    youtubeLink := link;
  };

  public shared ({ caller }) func updateDeveloperWebsite(link : Text) : async () {
    requireAdmin(caller);
    developerWebsite := link;
  };

  public shared ({ caller }) func updatePressEmail(email : Text) : async () {
    requireAdmin(caller);
    pressEmail := email;
  };

  public shared ({ caller }) func updateBodyTextColor(colorHex : Text) : async () {
    requireAdmin(caller);
    bodyTextColorHex := colorHex;
  };
};
