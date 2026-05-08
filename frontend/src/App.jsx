import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NegotiationProvider } from './context/NegotiationContext';
import AdminNegotiations from './pages/admin/AdminNegotiations';
import MyNegotiations from './pages/user/MyNegotiations';
import SpendingReport from './pages/user/SpendingReport';
import MyOrders from './pages/user/MyOrders';
import Profile from './pages/user/Profile';
import ManageOrders from './pages/admin/ManageOrders';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerNegotiations from './pages/seller/SellerNegotiations';
// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// User Pages
import Home from './pages/user/Home';
import Products from './pages/user/Products';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ProductDetails from './pages/user/ProductDetail';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false ,sellerOnly = false }) => {
  const { user, isAdmin, isSeller,loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (sellerOnly && !isSeller) return <Navigate to="/" replace />;

  return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NegotiationProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AppLayout><Home /></AppLayout>} />
            <Route path="/products" element={<AppLayout><Products /></AppLayout>} />
            <Route path="/products/:id" element={<AppLayout><ProductDetails/></AppLayout>} />
            <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
            <Route path="/register" element={<AppLayout><Register /></AppLayout>} />

            {/* Protected User Routes */}
            <Route
              path="/cart"
              element={
                <AppLayout>
                  <Cart />
                </AppLayout>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Checkout />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly>
                  <AppLayout>
                    <ManageProducts />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            

            {/* User Negotiations */}
            <Route
             path="/my-negotiations"
             element={
             <ProtectedRoute>
             <AppLayout>
             <MyNegotiations />
             </AppLayout>
             </ProtectedRoute>
             }
              />

        {/* Admin Negotiations */}
            <Route
             path="/admin/negotiations"
             element={
            <ProtectedRoute adminOnly>
            <AppLayout>
            <AdminNegotiations />
            </AppLayout>
            </ProtectedRoute>
             }
            />

            <Route
             path="/spending-report"
             element={
            <ProtectedRoute>
            <AppLayout>
            <SpendingReport />
            </AppLayout>
            </ProtectedRoute>
            }
            />

            <Route
            path="/orders"
            element={
            <ProtectedRoute>
            <AppLayout>
            <MyOrders />
            </AppLayout>
            </ProtectedRoute>
            }
            />

            <Route
            path="/profile"
            element={
            <ProtectedRoute>
            <AppLayout>
             <Profile />
            </AppLayout>
           </ProtectedRoute>
           }
          />

          <Route
           path="/admin/orders"
           element={
          <ProtectedRoute adminOnly>
          <AppLayout>
           <ManageOrders />
          </AppLayout>
       </ProtectedRoute>
       }
        />

        <Route
         path="/seller/dashboard"
         element={
        <ProtectedRoute sellerOnly>
        <AppLayout>
          <SellerDashboard />
        </AppLayout>
       </ProtectedRoute>
          }
          />

          <Route
             path="/seller/negotiations"
             element={
             <ProtectedRoute sellerOnly>
             <AppLayout>
               <SellerNegotiations />
             </AppLayout>
            </ProtectedRoute>
             }
          />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </NegotiationProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
