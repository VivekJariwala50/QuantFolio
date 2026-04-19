# 📈 Stock Portfolio Tracker

A modern web application for managing and analyzing a personal stock portfolio. The app allows users to track holdings, calculate portfolio performance, and visualize gains and losses in real time.

## Overview

The Stock Portfolio Tracker is a React-based web application designed to help users manage their stock investments in a clear and structured way. Users can add, update, and remove stock positions while viewing calculated metrics such as market value and unrealized gains or losses.

**This project originated as a school assignment 6 years ago and has been completely modernized with current technologies and best practices.** The updated version features improved mobile responsiveness, modern React patterns, TypeScript integration, and enhanced user experience.

This project demonstrates practical frontend development skills, state management, financial data handling, and modern web development practices.

## Features

### Core Functionality
- ✅ Add and manage stock positions with symbol, shares, cost basis, and market price
- ✅ Edit existing positions inline
- ✅ Automatic calculation of market value and unrealized gain/loss per stock
- ✅ Portfolio summary with total value and overall gain/loss
- ✅ Data persistence using localStorage
- ✅ Input validation and error handling

### Advanced Features
- ✅ Real-time stock price integration via Alpha Vantage API
- ✅ Auto-refresh market prices every 5 minutes
- ✅ Daily change percentage display
- ✅ Portfolio allocation pie chart
- ✅ Gain/loss over time line chart
- ✅ Best and worst performing stocks analysis
- ✅ Export portfolio data to CSV
- ✅ Clean, responsive UI with accessibility features

### Developer Experience
- ✅ Built with TypeScript for type safety
- ✅ Modern React 19 with hooks and useReducer for state management
- ✅ Vite for fast development and optimized builds
- ✅ ESLint for code linting
- ✅ Vitest for unit testing
- ✅ CI/CD with GitHub Actions
- ✅ Progressive Web App (PWA) support
- ✅ Ready for deployment on Vercel/Netlify

### Recent Improvements (2026 Update)
- ✅ Enhanced mobile responsiveness for iPhone SE and iPhone 14
- ✅ Improved table layouts with responsive column hiding
- ✅ Full-width component layouts for better space utilization
- ✅ Modern CSS with custom properties and mobile-first design
- ✅ Environment variable configuration for API keys
- ✅ Updated dependencies and build tools

## Tech Stack

- **React 19** – Component-based UI development with hooks
- **TypeScript** – Type-safe JavaScript
- **Vite** – Fast build tool and dev server
- **Tailwind CSS** – Utility-first CSS framework
- **Recharts** – Data visualization library
- **Alpha Vantage API** – Real-time stock market data
- **Papaparse** – CSV export functionality
- **Vitest** – Unit testing framework
- **ESLint** – Code linting

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- A Supabase Project

### Supabase Setup

1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor in your Supabase dashboard and run the contents of `supabase/schema.sql` to create the necessary tables and Row Level Security (RLS) policies.
3. Obtain your Project URL and anon key from Project Settings > API.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yosephdev/stock-portfolio-app
cd stock-portfolio-app
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Configure Environment Variables:
Create a `.env` file in the root directory and add your keys (see `.env.example`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FINNHUB_API_KEY=your_finnhub_api_key
VITE_ALPHAVANTAGE_API_KEY=your_alphavantage_api_key
```
You can get a free API key for real-time market data from [Finnhub](https://finnhub.io/).

4. Start the development server:
```bash
npm run dev
```

The app will be available at:
👉 http://localhost:5173

### Build for Production

```bash
npm run build
```
## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings if needed

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run linting: `npm run lint`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Status

This project was originally created as a school assignment 6 years ago and has been completely modernized in 2026 with current technologies and best practices. The updated version includes enhanced mobile responsiveness, improved user experience, and modern development tools.

Future enhancements may include:
- User authentication and multiple portfolios
- Advanced analytics and reporting
- Mobile app version
- Integration with more data providers

## Contact

Yoseph Berhane  
Fullstack Developer  
📧 contact@yoseph.dev  

🌐 https://yoseph.dev  

🐙 GitHub: https://github.com/yosephdev  

---
