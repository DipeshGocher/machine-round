import { User } from '../models/userModel.js';
import { Franchise } from '../models/franchiseModel.js';

export const autoSeedInitialRoles = async () => {
  try {
    // 1. Hardcoded Super Admin Account
    const adminEmail = 'dipesh@gmail.com';
    const adminPassword = 'Dipesh@123';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        name: 'Dipesh Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        status: 'Active'
      });
      await admin.save();
      console.log('✅ Auto-Seeded Super Admin: dipesh@gmail.com');
    }

    // 2. Hardcoded Franchise Owner Account & Franchise Record
    const ownerEmail = 'rahul@gmail.com';
    const ownerPassword = 'Rahul@123';
    const franchiseName = 'Rahul Food Franchise';
    const city = 'Delhi';

    let ownerUser = await User.findOne({ email: ownerEmail });
    if (!ownerUser) {
      ownerUser = new User({
        name: 'Rahul Owner',
        email: ownerEmail,
        password: ownerPassword,
        role: 'franchise',
        status: 'Active'
      });
      await ownerUser.save();
    }

    let franchise = await Franchise.findOne({ name: franchiseName });
    if (!franchise) {
      franchise = new Franchise({
        name: franchiseName,
        owner: ownerUser._id,
        city: city,
        status: 'Active'
      });
      await franchise.save();
    }

    if (!ownerUser.franchise || ownerUser.franchise.toString() !== franchise._id.toString()) {
      ownerUser.franchise = franchise._id;
      await ownerUser.save();
    }
    console.log('✅ Auto-Seeded Franchise Owner: rahul@gmail.com');

    // 3. Hardcoded Staff Account
    const staffEmail = 'staff@gmail.com';
    const staffPassword = 'Staff@123';

    let staffUser = await User.findOne({ email: staffEmail });
    if (!staffUser) {
      staffUser = new User({
        name: 'Alex Staff',
        email: staffEmail,
        password: staffPassword,
        role: 'staff',
        designation: 'Senior Chef',
        franchise: franchise._id,
        status: 'Active'
      });
      await staffUser.save();
      console.log('✅ Auto-Seeded Staff Member: staff@gmail.com');
    }
  } catch (err) {
    console.error('Auto-seed notice:', err.message);
  }
};
