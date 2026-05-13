import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { CartProvider } from "@/lib/CartContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import FlashSalesPage from "@/pages/FlashSalesPage";
import FinancingPage from "@/pages/FinancingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import ProfilePage from "@/pages/ProfilePage";
import WishlistPage from "@/pages/WishlistPage";
import NotificationsPage from "@/pages/NotificationsPage";
import TrackOrderPage from "@/pages/TrackOrderPage";
import WholesalePage from "@/pages/WholesalePage";
import SupportPage from "@/pages/SupportPage";
import PickupStationsPage from "@/pages/PickupStationsPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/product/:id" component={ProductDetailPage} />
      <Route path="/flash-sales" component={FlashSalesPage} />
      <Route path="/financing" component={FinancingPage} />
      <Route path="/get-now" component={FinancingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/pay" component={CheckoutPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/wishlist" component={WishlistPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/track-order" component={TrackOrderPage} />
      <Route path="/wholesale" component={WholesalePage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/pickup-stations" component={PickupStationsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="kryros-theme">
        <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
