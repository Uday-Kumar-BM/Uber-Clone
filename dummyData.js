import 'dotenv/config';
import sequelize from './config/db.js';
import models from './models/index.js'; // Import all models
import bcrypt from 'bcryptjs';

const { User, DriverProfile, RiderProfile, Vehicle, Ride, PaymentMethod, Notification, SupportTicket, AdminProfile, DriverLocationHistory, PaymentTransaction, Rating, TripLog, FareComponent, SurgePricing, Location, AggregatedMetric } = models;

const seedData = async () => {
  try {
    // Synchronize models and potentially drop existing tables (for development)
    console.log('Synchronizing database models...');
    await sequelize.sync({ force: true }); // Use force: true for development, be careful in production!
    console.log('Database synchronized. Tables created/recreated.');

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

    // 1. Create Users (Admin, Driver, Rider)
    const adminPasswordHash = await bcrypt.hash('adminpassword', saltRounds);
    const driverPasswordHash = await bcrypt.hash('driverpassword', saltRounds);
    const riderPasswordHash = await bcrypt.hash('riderpassword', saltRounds);

    const adminUser = await User.create({
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      userType: 'admin',
      status: 'active',
      phone: '+1111111111'
    });
    console.log('Created Admin User:', adminUser.email);

    const driverUser = await User.create({
      email: 'driver@example.com',
      passwordHash: driverPasswordHash,
      firstName: 'Driver',
      lastName: 'Sam',
      userType: 'driver',
      status: 'active',
      phone: '+1222222222'
    });
    console.log('Created Driver User:', driverUser.email);

    const riderUser = await User.create({
      email: 'rider@example.com',
      passwordHash: riderPasswordHash,
      firstName: 'Rider',
      lastName: 'Pat',
      userType: 'rider',
      status: 'active',
      phone: '+1333333333'
    });
    console.log('Created Rider User:', riderUser.email);

    // 2. Create Profiles for Admin, Driver, Rider
    await AdminProfile.create({
      userId: adminUser.id,
      permissions: ['manage_users', 'manage_rides', 'manage_drivers'],
    });
    console.log('Created Admin Profile.');

    const driverProfile = await DriverProfile.create({
      userId: driverUser.id,
      licenseNumber: 'DRV12345',
      isAvailable: true,
      currentLatitude: 34.0522,
      currentLongitude: -118.2437,
      driverStatus: 'approved',
    });
    console.log('Created Driver Profile.');

    const riderProfile = await RiderProfile.create({
      userId: riderUser.id,
      loyaltyPoints: 100,
    });
    console.log('Created Rider Profile.');

    // 3. Create a Vehicle for the Driver
    const vehicle = await Vehicle.create({
      driverId: driverUser.id,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      licensePlate: 'ABC1234',
      color: 'Silver',
      vehicleType: 'sedan',
      capacity: 4,
      status: 'active',
    });
    console.log('Created Vehicle:', vehicle.licensePlate);

    // 4. Create a sample Ride
    const ride = await Ride.create({
      riderId: riderUser.id,
      driverId: driverUser.id,
      vehicleId: vehicle.id,
      originLat: 34.0522,
      originLong: -118.2437,
      destinationLat: 34.0000,
      destinationLong: -118.5000,
      pickupAddress: '123 Main St, Los Angeles',
      dropoffAddress: '456 Ocean Ave, Santa Monica',
      startTime: new Date(),
      fareAmount: 25.50,
      currency: 'USD',
      distanceKm: 20.1,
      durationMinutes: 30,
      status: 'completed',
      paymentStatus: 'completed',
    });
    console.log('Created Sample Ride:', ride.id);

    // 5. Create other related data for core models
    await PaymentMethod.create({
      userId: riderUser.id,
      type: 'card',
      last4Digits: '4242',
      provider: 'Stripe',
      token: 'tok_card_test_123',
      isDefault: true,
      expirationDate: '12/2025',
    });
    console.log('Created Rider Payment Method.');

    await Notification.create({
      userId: riderUser.id,
      type: 'ride_update',
      message: 'Your ride has been completed!',
      isRead: false,
      targetId: ride.id,
    });
    console.log('Created Rider Notification.');

    await SupportTicket.create({
      raiserUserId: riderUser.id,
      rideId: ride.id,
      subject: 'Issue with ride fare',
      description: 'The fare charged was higher than estimated.',
      status: 'open',
      priority: 'high',
    });
    console.log('Created Support Ticket.');

    await Rating.create({
      rideId: ride.id,
      raterUserId: riderUser.id,
      rateeUserId: driverUser.id,
      ratingValue: 4.5,
      comment: 'Great driver, arrived quickly!',
    });
    console.log('Created Ride Rating.');

    // Example of seeding for other models (demonstrating pattern)
    // For a real application, you'd add more comprehensive data here.
    await Location.create({
      name: 'Rider Home',
      latitude: 34.0522,
      longitude: -118.2437,
      address: '123 Home St',
      type: 'home',
      userId: riderUser.id,
    });
    console.log('Created Sample Location.');

    await SurgePricing.create({
      areaIdentifier: 'Downtown LA',
      latitude: 34.0522,
      longitude: -118.2437,
      radiusKm: 5.0,
      multiplier: 1.5,
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      endTime: new Date(Date.now() + 3600000),  // 1 hour from now
      isActive: true,
    });
    console.log('Created Sample Surge Pricing entry.');

    await AggregatedMetric.create({
      metricName: 'total_rides_daily',
      value: 100.00,
      dataType: 'count',
      period: 'daily',
      timestamp: new Date(Date.now() - 86400000), // Yesterday
      metaData: { city: 'Los Angeles' }
    });
    console.log('Created Sample Aggregated Metric.');

    console.log('Dummy data seeded successfully!');
  } catch (error) {
    console.error('Error seeding dummy data:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

seedData();
