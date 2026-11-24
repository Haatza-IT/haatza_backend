import {
  HAATZA_CATEGORIES,
  HAATZA_WIDGETS,
  RULE_B_SEQUENCES,
  ALL_CATEGORY_ID,
  PLACEHOLDER_MENS_FASHION_ID,
  PLACEHOLDER_WOMENS_FASHION_ID,
  PLACEHOLDER_KIDS_FASHION_ID,
} from './dashboard.config';

export const EFFECTIVE_FROM = '2026-11-01 00:00:00+05:30';
export const EFFECTIVE_TO = '2026-12-31 23:59:59+05:30';

/**
 * Builds realistic mock items for the 16 widgets of Category 101 (All)
 */
export function buildAllCategoryItems(widgetNo: number): any[] {
  switch (widgetNo) {
    case 1: // Hero Banner (3 banners)
      return [
        {
          banner_image: 'https://placeholder.example/banners/mens-fashion-hero.jpg',
          title: "Men's Festive Collection 2026",
          content: 'Flat 50% Off on Kurtas, Shirts & Casual Wear',
          redirect_category_id: PLACEHOLDER_MENS_FASHION_ID,
          redirect_url: '',
        },
        {
          banner_image: 'https://placeholder.example/banners/mobiles-hero.jpg',
          title: 'Flagship Mobiles & 5G Smartphones',
          content: 'Starting ₹9,999 with No Cost EMI & Exchange Bonus',
          redirect_category_id: 'c4000000-0000-4000-8000-000000000112',
          redirect_url: '',
        },
        {
          banner_image: 'https://placeholder.example/banners/electronics-hero.jpg',
          title: 'Electronics & Gadgets Mega Fest',
          content: 'Up to 70% Off on Headphones, Smartwatches & Laptops',
          redirect_category_id: 'c4000000-0000-4000-8000-000000000102',
          redirect_url: '',
        },
      ];

    case 2: // Offers Banner (3 banners) - widget_redirect_to = OFFERS
      return [
        {
          banner_image: 'https://placeholder.example/banners/offer-phonepe.jpg',
          title: 'PhonePe UPI Cashback',
          content: 'Get Flat ₹150 Cashback on orders above ₹999',
          redirect_category_id: '',
          redirect_url: '',
        },
        {
          banner_image: 'https://placeholder.example/banners/offer-hdfc.jpg',
          title: 'Instant Bank Discount',
          content: '10% Instant Discount on HDFC & ICICI Cards',
          redirect_category_id: '',
          redirect_url: '',
        },
        {
          banner_image: 'https://placeholder.example/banners/offer-festive.jpg',
          title: 'Festival Mega Bonanza',
          content: 'Use Code HAATZA500 for extra ₹500 off',
          redirect_category_id: '',
          redirect_url: '',
        },
      ];

    case 3: // Top Categories (7 category tiles)
      return [
        {
          category_name: "Men's Fashion",
          category_image: 'https://placeholder.example/categories/mens-fashion.jpg',
          category_id: PLACEHOLDER_MENS_FASHION_ID,
        },
        {
          category_name: "Women's Fashion",
          category_image: 'https://placeholder.example/categories/womens-fashion.jpg',
          category_id: PLACEHOLDER_WOMENS_FASHION_ID,
        },
        {
          category_name: "Kids' Fashion",
          category_image: 'https://placeholder.example/categories/kids-fashion.jpg',
          category_id: PLACEHOLDER_KIDS_FASHION_ID,
        },
        {
          category_name: 'Electronics',
          category_image: 'https://placeholder.example/categories/electronics.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
        },
        {
          category_name: 'Home and Living',
          category_image: 'https://placeholder.example/categories/home-living.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
        },
        {
          category_name: 'Beauty',
          category_image: 'https://placeholder.example/categories/beauty.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000104',
        },
        {
          category_name: 'Appliances',
          category_image: 'https://placeholder.example/categories/appliances.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000105',
        },
      ];

    case 4: // Suggested for You (6 products)
      return [
        {
          product_id: 'p-0001',
          product_title: 'Wireless Active Noise Cancelling Earbuds',
          product_image: 'https://placeholder.example/products/anc-earbuds.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 2999.0,
          discount_price: 1499.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0002',
          product_title: 'Ceramic Non-Stick Cookware Fry Pan 24cm',
          product_image: 'https://placeholder.example/products/fry-pan.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 1899.0,
          discount_price: 899.0,
          discount_percentage: 53,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0003',
          product_title: 'Hydrating Face Serum with Niacinamide 30ml',
          product_image: 'https://placeholder.example/products/face-serum.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000104',
          mrp: 699.0,
          discount_price: 399.0,
          discount_percentage: 43,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0004',
          product_title: 'Fast-Charging 65W GaN USB-C Charger',
          product_image: 'https://placeholder.example/products/gan-charger.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 2499.0,
          discount_price: 1299.0,
          discount_percentage: 48,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0005',
          product_title: 'Stainless Steel Insulated Water Bottle 1L',
          product_image: 'https://placeholder.example/products/water-bottle.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 999.0,
          discount_price: 549.0,
          discount_percentage: 45,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0006',
          product_title: 'Smart Fitness Tracker with SpO2 & Heart Rate',
          product_image: 'https://placeholder.example/products/fitness-band.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000107',
          mrp: 3499.0,
          discount_price: 1799.0,
          discount_percentage: 49,
          is_add_to_cart: true,
        },
      ];

    case 5: // Promo Banners (3 banners)
      return [
        {
          banner_image: 'https://placeholder.example/banners/promo-appliances.jpg',
          title: 'Upgrade Your Home Appliances',
          content: 'Smart Fridges, Washing Machines & Microwaves at Best Prices',
          redirect_category_id: 'c4000000-0000-4000-8000-000000000105',
          redirect_url: '',
        },
        {
          banner_image: 'https://placeholder.example/banners/promo-fitness.jpg',
          title: 'Health & Fitness Gear',
          content: 'Dumbbells, Yoga Mats & Exercise Cycles under ₹1,999',
          redirect_category_id: 'c4000000-0000-4000-8000-000000000107',
          redirect_url: '',
        },
        {
          banner_image: 'https://placeholder.example/banners/promo-books.jpg',
          title: 'Bestseller Books Fair',
          content: 'Fiction, Non-Fiction & Self-Help starting ₹149',
          redirect_category_id: 'c4000000-0000-4000-8000-000000000108',
          redirect_url: '',
        },
      ];

    case 6: // Liked by You (6 products)
      return [
        {
          product_id: 'p-0007',
          product_title: 'Noise-Cancelling Over-Ear Bluetooth Headphones',
          product_image: 'https://placeholder.example/products/headphones.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 4999.0,
          discount_price: 2499.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0008',
          product_title: '100% Cotton 300TC Double Bed Sheet Set',
          product_image: 'https://placeholder.example/products/bedsheet.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 1499.0,
          discount_price: 799.0,
          discount_percentage: 47,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0009',
          product_title: 'Natural Vitamin C Foaming Face Wash 150ml',
          product_image: 'https://placeholder.example/products/facewash.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000104',
          mrp: 499.0,
          discount_price: 299.0,
          discount_percentage: 40,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0010',
          product_title: 'Portable Bluetooth Speaker with Deep Bass 16W',
          product_image: 'https://placeholder.example/products/speaker.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 2999.0,
          discount_price: 1399.0,
          discount_percentage: 53,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0011',
          product_title: 'Ergonomic Memory Foam Cervical Pillow',
          product_image: 'https://placeholder.example/products/pillow.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 1999.0,
          discount_price: 999.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0012',
          product_title: 'Organic Green Tea Herbal Infusion 100 Tea Bags',
          product_image: 'https://placeholder.example/products/green-tea.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000110',
          mrp: 650.0,
          discount_price: 390.0,
          discount_percentage: 40,
          is_add_to_cart: true,
        },
      ];

    case 7: // Recently Viewed by You (6 products)
      return [
        {
          product_id: 'p-0013',
          product_title: 'High-Speed Electric Kettle 1.8L Stainless Steel',
          product_image: 'https://placeholder.example/products/kettle.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000105',
          mrp: 1299.0,
          discount_price: 699.0,
          discount_percentage: 46,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0014',
          product_title: 'Compact 10000mAh Power Bank 22.5W Fast Charging',
          product_image: 'https://placeholder.example/products/powerbank.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 1999.0,
          discount_price: 899.0,
          discount_percentage: 55,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0015',
          product_title: 'Microfiber Car Cleaning & Drying Towels (Pack of 4)',
          product_image: 'https://placeholder.example/products/car-towel.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000111',
          mrp: 599.0,
          discount_price: 299.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0016',
          product_title: 'Adjustable Metal Laptop Stand with Heat Venting',
          product_image: 'https://placeholder.example/products/laptop-stand.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 1499.0,
          discount_price: 599.0,
          discount_percentage: 60,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0017',
          product_title: 'Anti-Dandruff Tea Tree Shampoo 250ml',
          product_image: 'https://placeholder.example/products/shampoo.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000104',
          mrp: 449.0,
          discount_price: 269.0,
          discount_percentage: 40,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0018',
          product_title: 'Multi-Compartment Travel Backpack Water Resistant',
          product_image: 'https://placeholder.example/products/backpack.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000107',
          mrp: 2499.0,
          discount_price: 1199.0,
          discount_percentage: 52,
          is_add_to_cart: true,
        },
      ];

    case 8: // Banner for ₹49 Store, Trending Fashion, Bestseller Favorites, and Big Deals (4 banners)
      return [
        {
          banner_image: 'https://placeholder.example/banners/banner-49-store.jpg',
          title: '₹49 Super Store',
          content: 'Everyday Household Essentials & Accessories at just ₹49',
          redirect_category_id: 'c4000000-0000-4000-8000-000000000101',
          redirect_url: '',
        },
        {
          banner_image: 'https://placeholder.example/banners/banner-trending-fashion.jpg',
          title: 'Trending Fashion Hub',
          content: 'Freshest Looks in Streetwear, Ethnic & Athleisure',
          redirect_category_id: PLACEHOLDER_MENS_FASHION_ID,
          redirect_url: '',
        },
        {
          banner_image: 'https://placeholder.example/banners/banner-bestseller-favorites.jpg',
          title: 'Bestseller Favorites',
          content: 'Top Rated by Thousands of Happy Shoppers',
          redirect_category_id: 'c4000000-0000-4000-8000-000000000102',
          redirect_url: '',
        },
        {
          banner_image: 'https://placeholder.example/banners/banner-big-deals.jpg',
          title: 'Big Deals Carnival',
          content: 'Massive Price Drops on Kitchen & Home Essentials',
          redirect_category_id: 'c4000000-0000-4000-8000-000000000105',
          redirect_url: '',
        },
      ];

    case 9: // Trending Fashion (6 products)
      return [
        {
          product_id: 'p-0019',
          product_title: 'Pure Linen Slim Fit Casual Shirt',
          product_image: 'https://placeholder.example/products/linen-shirt.jpg',
          category_id: PLACEHOLDER_MENS_FASHION_ID,
          mrp: 1999.0,
          discount_price: 999.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0020',
          product_title: 'Ankle Length Relaxed Chino Trousers',
          product_image: 'https://placeholder.example/products/chinos.jpg',
          category_id: PLACEHOLDER_MENS_FASHION_ID,
          mrp: 2299.0,
          discount_price: 1149.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0021',
          product_title: 'Embroidered Floral Cotton Kurti',
          product_image: 'https://placeholder.example/products/kurti.jpg',
          category_id: PLACEHOLDER_WOMENS_FASHION_ID,
          mrp: 1499.0,
          discount_price: 699.0,
          discount_percentage: 53,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0022',
          product_title: 'High-Waist Stretch Denim Jeans',
          product_image: 'https://placeholder.example/products/jeans.jpg',
          category_id: PLACEHOLDER_WOMENS_FASHION_ID,
          mrp: 2499.0,
          discount_price: 1299.0,
          discount_percentage: 48,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0023',
          product_title: 'Breathable Lightweight Running Sneakers',
          product_image: 'https://placeholder.example/products/sneakers.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000107',
          mrp: 2999.0,
          discount_price: 1499.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0024',
          product_title: 'Classic UV-Protected Aviator Sunglasses',
          product_image: 'https://placeholder.example/products/sunglasses.jpg',
          category_id: PLACEHOLDER_MENS_FASHION_ID,
          mrp: 1299.0,
          discount_price: 499.0,
          discount_percentage: 62,
          is_add_to_cart: true,
        },
      ];

    case 10: // Deals of the Day (6 products)
      return [
        {
          product_id: 'p-0025',
          product_title: 'Smart LED Bulb 9W B22 WiFi & Voice Control',
          product_image: 'https://placeholder.example/products/smart-bulb.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 799.0,
          discount_price: 299.0,
          discount_percentage: 63,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0026',
          product_title: 'Automatic Handheld Milk Frother for Coffee',
          product_image: 'https://placeholder.example/products/milk-frother.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000105',
          mrp: 699.0,
          discount_price: 249.0,
          discount_percentage: 64,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0027',
          product_title: 'Organic Cold Pressed Virgin Coconut Oil 500ml',
          product_image: 'https://placeholder.example/products/coconut-oil.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000110',
          mrp: 450.0,
          discount_price: 270.0,
          discount_percentage: 40,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0028',
          product_title: 'Braided Fast Charging 3-in-1 Cable (Type C, Micro, Lightning)',
          product_image: 'https://placeholder.example/products/usb-cable.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 499.0,
          discount_price: 199.0,
          discount_percentage: 60,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0029',
          product_title: 'Scented Soy Wax Aroma Candle Lavender 200g',
          product_image: 'https://placeholder.example/products/candle.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 599.0,
          discount_price: 249.0,
          discount_percentage: 58,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0030',
          product_title: 'Matte Finish Liquid Lipstick Waterproof 12hr',
          product_image: 'https://placeholder.example/products/lipstick.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000104',
          mrp: 499.0,
          discount_price: 229.0,
          discount_percentage: 54,
          is_add_to_cart: true,
        },
      ];

    case 11: // ₹49 Promotional Banner (1 banner)
      return [
        {
          banner_image: 'https://placeholder.example/banners/49-store-hero.jpg',
          title: 'Haatza ₹49 Super Store!',
          content: 'Unbelievable Deals: Kitchenware, Stationery, Beauty & Daily Accessories at ₹49',
          redirect_category_id: 'c4000000-0000-4000-8000-000000000101',
          redirect_url: '',
        },
      ];

    case 12: // ₹49 Products (6 products priced at ₹49)
      return [
        {
          product_id: 'p-0031',
          product_title: 'Stainless Steel Potato Peeler & Vegetable Slicer',
          product_image: 'https://placeholder.example/products/peeler-49.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 149.0,
          discount_price: 49.0,
          discount_percentage: 67,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0032',
          product_title: 'Self-Adhesive Wall Hooks Heavy Duty (Pack of 6)',
          product_image: 'https://placeholder.example/products/wall-hooks-49.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 199.0,
          discount_price: 49.0,
          discount_percentage: 75,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0033',
          product_title: 'Microfiber Screen Cleaning Cloth for Phone & Laptops',
          product_image: 'https://placeholder.example/products/screen-cloth-49.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 99.0,
          discount_price: 49.0,
          discount_percentage: 51,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0034',
          product_title: 'Silicone Cable Organizer Clips (Pack of 3)',
          product_image: 'https://placeholder.example/products/cable-clip-49.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 129.0,
          discount_price: 49.0,
          discount_percentage: 62,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0035',
          product_title: 'Soft Cotton Handkerchiefs Set of 3',
          product_image: 'https://placeholder.example/products/handkerchief-49.jpg',
          category_id: PLACEHOLDER_MENS_FASHION_ID,
          mrp: 149.0,
          discount_price: 49.0,
          discount_percentage: 67,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0036',
          product_title: 'Travel Friendly Mini Pill Box Organizer',
          product_image: 'https://placeholder.example/products/pill-box-49.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 119.0,
          discount_price: 49.0,
          discount_percentage: 59,
          is_add_to_cart: true,
        },
      ];

    case 13: // Hurry Deals – Ending Soon (6 products)
      return [
        {
          product_id: 'p-0037',
          product_title: 'Electric Sandwich Toaster 750W Non-Stick',
          product_image: 'https://placeholder.example/products/toaster.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000105',
          mrp: 1699.0,
          discount_price: 849.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0038',
          product_title: 'Smart Home Security Camera 1080p Night Vision',
          product_image: 'https://placeholder.example/products/security-cam.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 2999.0,
          discount_price: 1399.0,
          discount_percentage: 53,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0039',
          product_title: 'Cast Iron Skillet Heavy Duty 25cm Pre-Seasoned',
          product_image: 'https://placeholder.example/products/cast-iron.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 1899.0,
          discount_price: 949.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0040',
          product_title: 'Professional Hair Dryer 2000W with Cool Shot',
          product_image: 'https://placeholder.example/products/hair-dryer.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000104',
          mrp: 1499.0,
          discount_price: 749.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0041',
          product_title: 'LED Desk Lamp with Wireless Charging Base',
          product_image: 'https://placeholder.example/products/desk-lamp.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 2499.0,
          discount_price: 1199.0,
          discount_percentage: 52,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0042',
          product_title: 'Waterproof Action Sports Camera 4K 30fps',
          product_image: 'https://placeholder.example/products/action-cam.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 4999.0,
          discount_price: 2499.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
      ];

    case 14: // Bestseller Favorites (6 products)
      return [
        {
          product_id: 'p-0043',
          product_title: 'Air Fryer 4.2L Rapid Air Technology 1400W',
          product_image: 'https://placeholder.example/products/air-fryer.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000105',
          mrp: 5999.0,
          discount_price: 2999.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0044',
          product_title: 'Robot Vacuum Cleaner with Smart App Mapping',
          product_image: 'https://placeholder.example/products/robot-vacuum.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000105',
          mrp: 18999.0,
          discount_price: 10999.0,
          discount_percentage: 42,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0045',
          product_title: 'Premium Soundbar 2.1 Channel with Subwoofer 120W',
          product_image: 'https://placeholder.example/products/soundbar.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000102',
          mrp: 8999.0,
          discount_price: 4499.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0046',
          product_title: 'Organic Raw Wild Honey 500g Glass Jar',
          product_image: 'https://placeholder.example/products/honey.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000110',
          mrp: 550.0,
          discount_price: 330.0,
          discount_percentage: 40,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0047',
          product_title: 'Cotton Canvas Cushion Covers 40x40cm Set of 5',
          product_image: 'https://placeholder.example/products/cushions.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 1299.0,
          discount_price: 599.0,
          discount_percentage: 54,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0048',
          product_title: 'Waterproof Digital Sports Watch 50m Resistant',
          product_image: 'https://placeholder.example/products/sports-watch.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000107',
          mrp: 1499.0,
          discount_price: 699.0,
          discount_percentage: 53,
          is_add_to_cart: true,
        },
      ];

    case 15: // Fresh New Arrivals (6 products)
      return [
        {
          product_id: 'p-0049',
          product_title: 'Ultrasonic Cool Mist Essential Oil Diffuser 300ml',
          product_image: 'https://placeholder.example/products/diffuser.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 1899.0,
          discount_price: 899.0,
          discount_percentage: 53,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0050',
          product_title: 'Stainless Steel Manual Coffee Grinder with Ceramic Burr',
          product_image: 'https://placeholder.example/products/coffee-grinder.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 1499.0,
          discount_price: 749.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0051',
          product_title: 'Sun Protection Tinted Sunscreen SPF 50 PA+++ 50g',
          product_image: 'https://placeholder.example/products/sunscreen.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000104',
          mrp: 599.0,
          discount_price: 349.0,
          discount_percentage: 42,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0052',
          product_title: 'Universal Magnetic Car Dashboard Phone Mount',
          product_image: 'https://placeholder.example/products/car-mount.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000111',
          mrp: 699.0,
          discount_price: 299.0,
          discount_percentage: 57,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0053',
          product_title: 'Premium Hardcover Ruled Journal Notebook A5 200 Pages',
          product_image: 'https://placeholder.example/products/notebook.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000108',
          mrp: 499.0,
          discount_price: 249.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0054',
          product_title: 'Silicone Collapsible Food Storage Containers Set of 4',
          product_image: 'https://placeholder.example/products/collapsible-box.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 1299.0,
          discount_price: 599.0,
          discount_percentage: 54,
          is_add_to_cart: true,
        },
      ];

    case 16: // More to Explore (6 products)
      return [
        {
          product_id: 'p-0055',
          product_title: 'Portable Garment Steamer for Clothes 1200W',
          product_image: 'https://placeholder.example/products/garment-steamer.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000105',
          mrp: 2499.0,
          discount_price: 1299.0,
          discount_percentage: 48,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0056',
          product_title: 'Rechargeable LED Emergency Light with Solar Panel',
          product_image: 'https://placeholder.example/products/emergency-light.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000103',
          mrp: 1499.0,
          discount_price: 699.0,
          discount_percentage: 53,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0057',
          product_title: 'Dual-Color Non-Slip Yoga Mat 6mm with Carry Strap',
          product_image: 'https://placeholder.example/products/yoga-mat.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000107',
          mrp: 1299.0,
          discount_price: 599.0,
          discount_percentage: 54,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0058',
          product_title: 'Wooden Desktop Organizer with Pen & Phone Holder',
          product_image: 'https://placeholder.example/products/desk-organizer.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000109',
          mrp: 999.0,
          discount_price: 499.0,
          discount_percentage: 50,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0059',
          product_title: 'Organic Roasted Almonds & Cashews Mix 250g',
          product_image: 'https://placeholder.example/products/nuts-mix.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000110',
          mrp: 450.0,
          discount_price: 299.0,
          discount_percentage: 34,
          is_add_to_cart: true,
        },
        {
          product_id: 'p-0060',
          product_title: 'Silver Plated Cubic Zirconia Pendant Necklace',
          product_image: 'https://placeholder.example/products/pendant.jpg',
          category_id: 'c4000000-0000-4000-8000-000000000115',
          mrp: 1499.0,
          discount_price: 599.0,
          discount_percentage: 60,
          is_add_to_cart: true,
        },
      ];

    default:
      return [];
  }
}

/**
 * Generates all 169 rows for territory 56
 */
export function generate169DashboardRows(): Array<{
  widget_id: string;
  widget_name: string;
  widget_redirect_to: string;
  placement: string;
  sequence: number;
  territory: string;
  items: any[];
  product_id: string;
  category_id: string;
  warehouse_id: string;
  redirect_category_id: string;
  redirect_product_id: string;
  effective_from: string;
  effective_to: string;
  status: boolean;
  module: string;
  created_by: string;
  updated_by: string;
}> {
  const rows: any[] = [];
  let widgetCounter = 1;

  for (const cat of HAATZA_CATEGORIES) {
    if (cat.categoryId === ALL_CATEGORY_ID) {
      for (const w of HAATZA_WIDGETS) {
        const widgetId = `w${String(widgetCounter).padStart(4, '0')}`;
        widgetCounter++;

        const items = buildAllCategoryItems(w.widgetNo);

        rows.push({
          widget_id: widgetId,
          widget_name: w.widgetName,
          widget_redirect_to: w.widgetRedirectTo,
          placement: 'DESKTOP',
          sequence: w.sequence,
          territory: '56',
          items,
          product_id: '',
          category_id: cat.categoryId,
          warehouse_id: '',
          redirect_category_id: '',
          redirect_product_id: '',
          effective_from: EFFECTIVE_FROM,
          effective_to: EFFECTIVE_TO,
          status: true,
          module: 'HAATZA',
          created_by: 'admin1',
          updated_by: 'admin1',
        });
      }
    } else {
      const selectedWidgets = HAATZA_WIDGETS.filter((w) => RULE_B_SEQUENCES.includes(w.sequence));

      for (const w of selectedWidgets) {
        const widgetId = `w${String(widgetCounter).padStart(4, '0')}`;
        widgetCounter++;

        rows.push({
          widget_id: widgetId,
          widget_name: w.widgetName,
          widget_redirect_to: w.widgetRedirectTo,
          placement: 'DESKTOP',
          sequence: w.sequence,
          territory: '56',
          items: [],
          product_id: '',
          category_id: cat.categoryId,
          warehouse_id: '',
          redirect_category_id: '',
          redirect_product_id: '',
          effective_from: EFFECTIVE_FROM,
          effective_to: EFFECTIVE_TO,
          status: true,
          module: 'HAATZA',
          created_by: 'admin1',
          updated_by: 'admin1',
        });
      }
    }
  }

  return rows;
}
