// class Friendship {
//     constructor({ user_id, friend_id, status, created_at, updated_at }) {
//       this.user_id = user_id;
//       this.friend_id = friend_id;
//       this.status = status;
//       this.created_at = created_at;
//       this.updated_at = updated_at;
//     }
  
//     isBetween(userA, userB) {
//       return (
//         (this.user_id === userA && this.friend_id === userB) ||
//         (this.user_id === userB && this.friend_id === userA)
//       );
//     }
  
//     isPending() {
//       return this.status === "PENDING";
//     }
  
//     isAccepted() {
//       return this.status === "ACCEPTED";
//     }
  
//     canBeAcceptedBy(userId) {
//       return this.isPending() && this.friend_id === userId;
//     }
  
//     canBeRejectedBy(userId) {
//       return this.isPending() && this.friend_id === userId;
//     }
  
//     canBeRemovedBy(userId) {
//       return this.isAccepted() && this.isBetween(userId, this.getOtherUser(userId));
//     }
  
//     getOtherUser(userId) {
//       return this.user_id === userId ? this.friend_id : this.user_id;
//     }
//   }
  