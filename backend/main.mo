import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

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
    developerWebsite : Text;
    pressEmail : Text;
    bodyTextColorHex : Text;
    passwordEnabled : Bool;
  };

  public type UserProfile = {
    name : Text;
    principal : Principal;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let userProfiles = Map.empty<Principal, UserProfile>();

  let maxFeatures = 4;

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
  var developerWebsite = "";
  var pressEmail = "";

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, { profile with principal = caller });
  };

  public shared ({ caller }) func deleteCallerUserProfile() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete profiles");
    };
    let existed = userProfiles.containsKey(caller);
    if (not existed) {
      Runtime.trap("Unauthorized: No user to delete. Use create or update instead.");
    };
    userProfiles.remove(caller);
  };

  // Admin initialization - sets the first caller as admin
  public shared ({ caller }) func initializeAdmin() : async { #ok; #err : Text } {
    if (caller.isAnonymous()) {
      return #err("Access denied: Anonymous callers cannot become admin.");
    };
    // Check if an admin already exists by seeing if the AccessControl system has been initialized
    // We use the role check: if caller is already admin, return ok
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return #ok;
    };
    // Try to initialize - this sets the caller as the first admin
    AccessControl.initialize(accessControlState, caller, "", "");
    if (AccessControl.isAdmin(accessControlState, caller)) {
      #ok;
    } else {
      #err("Access denied: This press kit is owned by another admin principal.");
    };
  };

  public query ({ caller }) func verifyAdmin() : async { #ok : Bool; #err : Text } {
    if (caller.isAnonymous()) {
      return #ok(false);
    };
    if (AccessControl.isAdmin(accessControlState, caller)) {
      #ok(true);
    } else {
      #ok(false);
    };
  };

  public shared ({ caller }) func enablePasswordProtection(password : Text) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Access denied: Only the admin can enable password protection.");
    };
    passwordHash := password;
    passwordEnabled := true;
    #ok;
  };

  public shared ({ caller }) func disablePasswordProtection() : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Access denied: Only the admin can disable password protection.");
    };
    passwordEnabled := false;
    passwordHash := "";
    #ok;
  };

  public query func verifyPassword(password : Text) : async { #ok : Bool; #err : Text } {
    if (not passwordEnabled) {
      return #ok(false);
    };
    #ok(password == passwordHash);
  };

  public query func getContent() : async Content {
    {
      aboutText;
      features;
      gameDetails;
      instagramLink;
      developerWebsite;
      pressEmail;
      bodyTextColorHex;
      passwordEnabled;
    };
  };

  public shared ({ caller }) func updateAbout(text : Text) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Access denied: Only the admin can update content.");
    };
    aboutText := text;
    #ok;
  };

  public shared ({ caller }) func updateFeatures(newFeatures : [Text]) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Access denied: Only the admin can update content.");
    };
    if (newFeatures.size() > maxFeatures) {
      return #err("Too many features: Maximum 4 features allowed.");
    };
    features := newFeatures;
    #ok;
  };

  public shared ({ caller }) func updateGameDetails(genre : Text, platforms : Text, releaseDate : Text) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Access denied: Only the admin can update content.");
    };
    gameDetails := {
      genre;
      platforms;
      releaseDate;
    };
    #ok;
  };

  public shared ({ caller }) func updateInstagram(link : Text) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Access denied: Only the admin can update content.");
    };
    instagramLink := link;
    #ok;
  };

  public shared ({ caller }) func updateDeveloperWebsite(link : Text) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Access denied: Only the admin can update content.");
    };
    developerWebsite := link;
    #ok;
  };

  public shared ({ caller }) func updatePressEmail(email : Text) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Access denied: Only the admin can update content.");
    };
    pressEmail := email;
    #ok;
  };

  public shared ({ caller }) func updateBodyTextColor(colorHex : Text) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Access denied: Only the admin can update content.");
    };
    bodyTextColorHex := colorHex;
    #ok;
  };
};
