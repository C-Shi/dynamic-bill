# DynamicBill

A modern expense tracking and bill splitting app built with React Native and Expo. DynamicBill helps groups manage shared expenses, track contributions, and settle debts efficiently.

## Features

- **Activity Management**: Create and manage different activities/events with multiple participants
- **Expense Tracking**: Add and track expenses for each activity
- **Smart Settlement**: Two settlement strategies available:
  - Minimum Transaction: Settles debts with the fewest possible transactions
  - Proportional One-To-Many: Distributes debts proportionally among participants
- **Visual Analytics**:
  - Contribution charts showing who paid what
  - Utilization tracking for budgeted activities
  - Settlement visualization
- **Budget Management**: Set and track budgets for activities
- **Real-time Updates**: Automatic calculations of balances and settlements

## Tech Stack

- React Native with Expo
- TypeScript
- SQLite for local data storage
- React Native Gifted Charts for visualizations
- Expo Router for navigation
- React Native Paper for UI components

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Run on your preferred platform:
   - iOS Simulator
   - Android Emulator
   - Expo Go app

## Development

The app uses a SQLite database for local storage with the following main tables:

- activities
- participants
- expenses
- participant_expenses

## Contributing

Feel free to submit issues and enhancement requests!
