# 🍽️ Food View - TikTok-Style Food Discovery Platform

A modern, full-stack food discovery application that combines the engaging vertical video format of TikTok with food ordering capabilities similar to Zomato. Built with React, Node.js, and MongoDB.

## 🌟 Features

### 🎥 Core Video Experience
- **TikTok-Style Vertical Feed**: Swipeable vertical video reels for food content
- **Auto-Play Videos**: Videos automatically play when in view with intersection observer
- **Smooth Navigation**: Touch and scroll gestures for seamless video browsing
- **Responsive Design**: Optimized for mobile and desktop viewing

### 👥 Dual User System
- **Food Partners**: Restaurants and food businesses can create and manage their content
- **Regular Users**: Food enthusiasts can discover, like, save, and order food
- **Separate Authentication**: Dedicated login/registration for each user type

### 🍕 Food Content Management
- **Video Upload**: Food partners can upload promotional videos of their dishes
- **Rich Metadata**: Name, description, price, cuisine type, and tags
- **Order Integration**: Direct links to order food items
- **Media Storage**: Secure video storage with ImageKit integration

### 💬 Social Engagement
- **Like System**: Users can like/unlike food videos
- **Save Collections**: Save favorite food items for later viewing
- **Comments**: Interactive comment system with accordion UI
- **Rating System**: 5-star rating system with aggregated statistics
- **Real-time Updates**: Optimistic UI updates for better user experience

### 🗺️ Location & Discovery
- **Text-Based Search**: Search food partners by name or address
- **Store-Specific Feeds**: View reels from specific food partners
- **Nearby Discovery**: Find food partners in your area
- **Store Profiles**: Detailed partner profiles with their food items

### 🛒 E-Commerce Integration
- **Shopping Cart**: Database-backed cart system (no local storage)
- **Single Partner Orders**: Enforce orders from one partner at a time
- **Razorpay Integration**: Secure payment processing
- **Order Management**: Complete order lifecycle management
- **Tax Calculation**: Automatic tax calculation (7% default)
- **Order History**: Track past orders for users and partners

### 🎨 Modern UI/UX
- **Dark Theme**: Elegant dark theme with light theme toggle
- **Tailwind CSS**: Modern, responsive styling
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: ARIA labels and keyboard navigation
- **Mobile-First**: Optimized for mobile devices

## 🏗️ Architecture

### Frontend (React + Vite)
```
frontend-v2/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Page components
│   │   ├── auth/          # Authentication screens
│   │   └── general/       # General app screens
│   ├── ui/                # UI components (ReelFeed, CartDrawer, etc.)
│   ├── lib/               # API clients and utilities
│   └── routes/            # Route configuration
```

### Backend (Node.js + Express)
```
backend/
├── src/
│   ├── controllers/       # Business logic
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middlewares/      # Authentication & validation
│   ├── services/         # External service integrations
│   └── db/              # Database connection
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- ImageKit account (for video storage)
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-view
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend-v2
   npm install
   ```

4. **Environment Configuration**
   
   Create `backend/.env` file:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/food-view
   
   # Authentication
   SECRET_KEY=your-jwt-secret-key
   
   # ImageKit (for video storage)
   IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
   IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
   IMAGEKIT_URL_ENDPOINT=your-imagekit-url-endpoint
   
   # Razorpay (for payments)
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   
   # Tax Configuration
   TAX_PERCENTAGE=7
   CURRENCY=INR
   ```

5. **Start the Application**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm start
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend-v2
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📱 User Flows

### For Food Partners
1. **Registration**: Create account with business details
2. **Login**: Access partner dashboard
3. **Create Content**: Upload food videos with details
4. **Manage Orders**: View and update order status
5. **Profile Management**: Update business information

### For Users
1. **Registration/Login**: Create user account
2. **Discover Food**: Browse vertical video feed
3. **Interact**: Like, save, rate, and comment on food
4. **Search**: Find specific restaurants or cuisines
5. **Order**: Add items to cart and checkout
6. **Track Orders**: View order history

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/user/register` - User registration
- `POST /api/auth/user/login` - User login
- `POST /api/auth/food-partner/register` - Partner registration
- `POST /api/auth/food-partner/login` - Partner login
- `GET /api/auth/logout` - Logout

### Food Management
- `GET /api/food` - Get all food items
- `POST /api/food` - Create food item (Partner only)
- `POST /api/food/like` - Like/unlike food
- `POST /api/food/save` - Save/unsave food
- `GET /api/food/save` - Get saved food items
- `GET /api/food/partner/:partnerId` - Get food by partner

### Social Features
- `POST /api/food/comment` - Add comment
- `GET /api/food/:foodId/comments` - Get comments
- `POST /api/food/rate` - Rate food
- `GET /api/food/:foodId/rating` - Get rating summary

### Partner Management
- `GET /api/food-partner/:id` - Get partner details
- `GET /api/food-partner/search` - Search partners
- `GET /api/food-partner/nearby/search` - Find nearby partners

### E-Commerce
- `GET /api/orders/cart` - Get user cart
- `POST /api/orders/cart/items` - Add to cart
- `PATCH /api/orders/cart/items` - Update cart item
- `DELETE /api/orders/cart/items/:itemId` - Remove from cart
- `POST /api/orders` - Create order
- `GET /api/orders/me` - Get user orders
- `GET /api/orders/partner/me` - Get partner orders
- `POST /api/orders/payments/razorpay/webhook` - Payment webhook

## 🗄️ Database Schema

### Food Partner
```javascript
{
  fullName: String,
  contactName: String,
  phone: Number,
  address: String,
  email: String (unique),
  password: String (hashed)
}
```

### Food Item
```javascript
{
  name: String,
  description: String,
  video: String (URL),
  foodPartner: ObjectId,
  price: Number,
  orderUrl: String,
  tags: [String],
  cuisine: String,
  likeCount: Number,
  saveCount: Number,
  averageRating: Number,
  ratingsCount: Number
}
```

### User
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed)
}
```

### Order
```javascript
{
  user: ObjectId,
  partner: ObjectId,
  items: [{
    food: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  subtotal: Number,
  taxAmount: Number,
  total: Number,
  status: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling and logging
- **Payment Security**: Razorpay integration with webhook verification

## 🎨 UI Components

### Core Components
- **ReelFeed**: TikTok-style vertical video feed
- **CartDrawer**: Shopping cart with Razorpay integration
- **Comments**: Interactive comment system
- **Rating**: Star rating component
- **Layout**: Main app layout with navigation
- **BottomNav**: Bottom navigation bar

### Features
- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: CSS transitions and hover effects
- **Accessibility**: ARIA labels and keyboard navigation

## 🔄 State Management

- **React Hooks**: useState, useEffect for local state
- **Context API**: For global state management
- **Optimistic Updates**: Immediate UI updates for better UX
- **Error Boundaries**: Graceful error handling

## 📦 Key Dependencies

### Backend
- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **Multer**: File uploads
- **ImageKit**: Video storage
- **Razorpay**: Payment processing
- **CORS**: Cross-origin requests

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Styling framework

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or Vercel
4. Set up ImageKit and Razorpay accounts

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👨‍💻 Author

**Gaya Singh**
- GitHub: [@YadavGaya031](https://github.com/YadavGaya031)

## 🙏 Acknowledgments

- TikTok for the vertical video format inspiration
- Zomato for food ordering UX patterns
- Tailwind CSS for the styling framework
- React community for excellent documentation

---

**Food View** - Where food discovery meets social engagement! 🍽️✨
