import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldGameDetails = {
    genre : Text;
    platforms : Text;
    releaseDate : Text;
  };

  type OldContent = {
    aboutText : Text;
    features : [Text];
    gameDetails : OldGameDetails;
    instagramLink : Text;
    youtubeLink : Text;
    developerWebsite : Text;
    pressEmail : Text;
    bodyTextColorHex : Text;
    passwordEnabled : Bool;
  };

  type OldUserProfile = {
    name : Text;
    principal : Principal.Principal;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal.Principal, OldUserProfile>;
    passwordEnabled : Bool;
    passwordHash : Text;
    bodyTextColorHex : Text;
    aboutText : Text;
    features : [Text];
    gameDetails : OldGameDetails;
    instagramLink : Text;
    youtubeLink : Text;
    developerWebsite : Text;
    pressEmail : Text;
  };

  type NewGameDetails = {
    genre : Text;
    platforms : Text;
    releaseDate : Text;
  };

  type NewContent = {
    aboutText : Text;
    features : [Text];
    gameDetails : NewGameDetails;
    instagramLink : Text;
    youtubeLink : Text;
    developerWebsite : Text;
    pressEmail : Text;
    bodyTextColorHex : Text;
    passwordEnabled : Bool;
    iframeSrc : Text;
  };

  type NewUserProfile = {
    name : Text;
    principal : Principal.Principal;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal.Principal, NewUserProfile>;
    passwordEnabled : Bool;
    passwordHash : Text;
    bodyTextColorHex : Text;
    aboutText : Text;
    features : [Text];
    gameDetails : NewGameDetails;
    instagramLink : Text;
    youtubeLink : Text;
    developerWebsite : Text;
    pressEmail : Text;
    iframeSrc : Text;
  };

  public func run(old : OldActor) : NewActor {
    { old with iframeSrc = "" };
  };
};
