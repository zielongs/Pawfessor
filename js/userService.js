/* ============================================
   File Name  : userService.js
   Author     : Nur 'Aainaa Hamraa binti Hamka
   Description: User data service (simulated DB)
   ============================================ */

const UserService = {
  getAllUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  },

  saveAllUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  },

  findUserByEmail(email) {
    return this.getAllUsers().find(u => u.email === email);
  },

  registerUser(user) {
    const users = this.getAllUsers();
    users.push(user);
    this.saveAllUsers(users);
  }
};
