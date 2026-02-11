import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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
    userProfiles.add(caller, profile);
  };

  // Study and Exercise Data Models
  public type StudyItem = {
    title : Text;
    completed : Bool;
    notes : Text;
  };

  public type ExerciseItem = {
    description : Text;
    reps : Nat;
    completed : Bool;
  };

  public type DayLog = {
    id : Nat;
    owner : Principal;
    date : Time.Time;
    studyItems : [StudyItem];
    exerciseItems : [ExerciseItem];
  };

  public type DailyLog = {
    totalStudyItems : Nat;
    totalExerciseItems : Nat;
    completedStudyItems : Nat;
    completedExerciseItems : Nat;
  };

  module DailyLog {
    public func compare(a : DailyLog, b : DailyLog) : Order.Order {
      switch (Int.compare(a.completedStudyItems + a.completedExerciseItems, b.completedStudyItems + b.completedExerciseItems)) {
        case (#equal) { Nat.compare(a.completedStudyItems, b.completedStudyItems) };
        case (order) { order };
      };
    };

    public func compareByDateDesc(_a : DailyLog, _b : DailyLog) : Order.Order {
      #greater;
    };
  };

  var nextId = 1;
  let dayLogs = Map.empty<Nat, DayLog>();
  let userDayLogs = Map.empty<Principal, List.List<Nat>>();

  public type DailyLogInput = {
    studyItems : [StudyItem];
    exerciseItems : [ExerciseItem];
  };

  public shared ({ caller }) func saveDayLog(content : DailyLogInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save day logs");
    };

    let id = nextId;
    let dayLog : DayLog = {
      id;
      owner = caller;
      date = Time.now();
      studyItems = content.studyItems;
      exerciseItems = content.exerciseItems;
    };
    dayLogs.add(id, dayLog);

    // Add to user's log list
    let userLogs = switch (userDayLogs.get(caller)) {
      case (null) { List.empty<Nat>() };
      case (?logs) { logs };
    };

    let updatedUserLog = List.fromArray<Nat>([id]);
    userDayLogs.add(caller, updatedUserLog);

    nextId += 1;
  };

  public query ({ caller }) func getDayLog(_id : Nat) : async DayLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access day logs");
    };

    switch (dayLogs.get(_id)) {
      case (null) { Runtime.trap("No day log found with Id " # _id.toText()) };
      case (?dayLog) {
        // Verify ownership: only the owner or admin can access
        if (dayLog.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only access your own day logs");
        };
        dayLog;
      };
    };
  };

  public query ({ caller }) func getAllDayLogs() : async [DayLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access day logs");
    };

    // Return only the caller's day logs
    let userLogIds = switch (userDayLogs.get(caller)) {
      case (null) { List.empty<Nat>() };
      case (?logs) { logs };
    };

    userLogIds.toArray().map(func(id) { dayLogs.get(id) }).filter(func(x) { x != null }).map(func(x) { switch (x) { case (?log) { log } } });
  };

  public query ({ caller }) func getDailyLogsByCompletionStats() : async [DailyLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access daily logs");
    };

    // Get only the caller's day logs
    let userLogIds = switch (userDayLogs.get(caller)) {
      case (null) { List.empty<Nat>() };
      case (?logs) { logs };
    };

    let dailyLogsList = userLogIds.toArray().map(
      func(id) {
        switch (dayLogs.get(id)) {
          case (null) { null };
          case (?dayLog) {
            let completedStudy = dayLog.studyItems.filter(func(item) { item.completed }).size();
            let completedExercise = dayLog.exerciseItems.filter(func(item) { item.completed }).size();
            ?{
              totalStudyItems = dayLog.studyItems.size();
              totalExerciseItems = dayLog.exerciseItems.size();
              completedStudyItems = completedStudy;
              completedExerciseItems = completedExercise;
            };
          };
        };
      }
    );

    dailyLogsList.filter(func(x) { x != null }).map(func(x) { switch (x) { case (?log) { log } } });
  };
};
