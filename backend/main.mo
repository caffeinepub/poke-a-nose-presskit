import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

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
  };

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
  var youtubeLink = "";
  var developerWebsite = "";
  var pressEmail = "";

  public query ({ caller }) func getUserProfile(user : Principal) : async UserProfile {
    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func saveUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user profiles");
    };
    userProfiles.values().toArray();
  };

  public shared ({ caller }) func enablePasswordProtection(password : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can enable password protection");
    };
    passwordHash := password;
    passwordEnabled := true;
  };

  public shared ({ caller }) func disablePasswordProtection() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can disable password protection");
    };
    passwordEnabled := false;
    passwordHash := "";
  };

  public query ({ caller }) func verifyPassword(password : Text) : async Bool {
    if (not passwordEnabled) {
      return true;
    };
    password == passwordHash;
  };

  public shared ({ caller }) func updateAbout(text : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    aboutText := text;
  };

  public shared ({ caller }) func updateFeatures(newFeatures : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    let maxFeatures = 4;
    if (newFeatures.size() > maxFeatures) {
      Runtime.trap("Please keep features list to 4 items or less. Avoid overloading users.");
    };
    features := newFeatures;
  };

  public shared ({ caller }) func updateGameDetails(genre : Text, platforms : Text, releaseDate : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    gameDetails := {
      genre;
      platforms;
      releaseDate;
    };
  };

  public shared ({ caller }) func updateInstagram(link : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    instagramLink := link;
  };

  public shared ({ caller }) func updateYoutubeLink(link : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    youtubeLink := link;
  };

  public shared ({ caller }) func updateDeveloperWebsite(link : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    developerWebsite := link;
  };

  public shared ({ caller }) func updatePressEmail(email : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    pressEmail := email;
  };

  public shared ({ caller }) func updateBodyTextColor(colorHex : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    bodyTextColorHex := colorHex;
  };

  public query ({ caller }) func getContent() : async Content {
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
};
