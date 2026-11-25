/**
 * HAATZA Dashboard 169 Widgets Single Source of Truth
 * 
 * Auto-generated clean, tracked TypeScript data source.
 * Contains mock items for all 169 HAATZA widgets across 18 real categories.
 * The 7 common widgets are defined ONCE as named constants and reused across all 18 pages.
 * All image URLs verified HTTP 200 OK & image/jpeg.
 */

import {
  ALL_CATEGORY_ID,
  MENS_FASHION_CATEGORY_ID,
  WOMENS_FASHION_CATEGORY_ID,
  ELECTRONICS_CATEGORY_ID,
  HOME_AND_LIVING_CATEGORY_ID,
  BEAUTY_CATEGORY_ID,
  APPLIANCES_CATEGORY_ID,
  TOYS_AND_GAMES_CATEGORY_ID,
  SPORTS_AND_FITNESS_CATEGORY_ID,
  BOOKS_CATEGORY_ID,
  FURNITURE_CATEGORY_ID,
  GROCERIES_CATEGORY_ID,
  AUTOMOTIVE_CATEGORY_ID,
  MOBILES_CATEGORY_ID,
  BABY_CARE_CATEGORY_ID,
  PET_SUPPLIES_CATEGORY_ID,
  JEWELRY_CATEGORY_ID,
  GIFT_CARD_CATEGORY_ID,
  PLACEHOLDER_MENS_TSHIRTS_POLOS_ID,
  PLACEHOLDER_MENS_CASUAL_SHIRTS_ID,
  PLACEHOLDER_MENS_JEANS_TROUSERS_ID,
  PLACEHOLDER_MENS_ETHNIC_KURTAS_ID,
  PLACEHOLDER_MENS_JACKETS_HOODIES_ID,
  PLACEHOLDER_MENS_FOOTWEAR_SNEAKERS_ID,
  PLACEHOLDER_MENS_WATCHES_ACCESSORIES_ID,
  PLACEHOLDER_WOMENS_KURTIS_SUITS_ID,
  PLACEHOLDER_WOMENS_SAREES_ID,
  PLACEHOLDER_WOMENS_WESTERN_TOPS_TEES_ID,
  PLACEHOLDER_WOMENS_DRESSES_JUMPSUITS_ID,
  PLACEHOLDER_WOMENS_JEANS_TROUSERS_ID,
  PLACEHOLDER_WOMENS_HEELS_FOOTWEAR_ID,
  PLACEHOLDER_WOMENS_JEWELRY_WATCHES_ID,
} from '../dashboard.config';

// ============================================================================
// 1. THE 7 COMMON WIDGETS (DEFINED ONCE, REUSED ACROSS ALL 18 PAGES)
// ============================================================================

export const COMMON_SUGGESTED_FOR_YOU_ITEMS: any[] = [
    {
      "product_id": "p-0001",
      "product_title": "boAt Airdopes 141 Bluetooth Truly Wireless Earbuds (42H Playtime, Low Latency Mode)",
      "product_image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
      "mrp": 2990,
      "discount_price": 1299,
      "discount_percentage": 57,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0002",
      "product_title": "Milton Thermosteel Flip Lid Insulated Water Flask 1000ml (Silver)",
      "product_image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
      "category_id": HOME_AND_LIVING_CATEGORY_ID,
      "mrp": 1199,
      "discount_price": 899,
      "discount_percentage": 25,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0003",
      "product_title": "Men's Slim Fit Stretch Cotton Chino Trousers (Olive Green)",
      "product_image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
      "category_id": MENS_FASHION_CATEGORY_ID,
      "mrp": 1999,
      "discount_price": 1299,
      "discount_percentage": 35,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0004",
      "product_title": "Plum Green Tea Oil-Free Daily Face Moisturizer for Acne Prone Skin 50ml",
      "product_image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
      "category_id": BEAUTY_CATEGORY_ID,
      "mrp": 570,
      "discount_price": 456,
      "discount_percentage": 20,
      "is_add_to_cart": false,
    },
    {
      "product_id": "p-0005",
      "product_title": "Prestige Iris 750 Watt Mixer Grinder with 3 Stainless Steel Jars",
      "product_image": "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80",
      "category_id": APPLIANCES_CATEGORY_ID,
      "mrp": 3499,
      "discount_price": 2899,
      "discount_percentage": 17,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0006",
      "product_title": "Cosco Rubber Basketball Official Size 7 Match Ball",
      "product_image": "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80",
      "category_id": SPORTS_AND_FITNESS_CATEGORY_ID,
      "mrp": 799,
      "discount_price": 799,
      "discount_percentage": 0,
      "is_add_to_cart": true,
    }
  ];

export const COMMON_PROMO_BANNERS_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80",
      "title": "Smart Living Gadgets for Modern Homes",
      "content": "Upgrade your lifestyle with IoT devices & smart plugs from ₹499",
      "redirect_category_id": HOME_AND_LIVING_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
      "title": "Luxury Fragrances & Skincare Festival",
      "content": "Top international fragrance brands at up to 45% off",
      "redirect_category_id": BEAUTY_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      "title": "Fitness Revolution & Home Workout Essentials",
      "content": "Treadmills, Dumbbells & Activewear at best prices",
      "redirect_category_id": SPORTS_AND_FITNESS_CATEGORY_ID,
      "redirect_url": "",
    }
  ];

export const COMMON_LIKED_BY_YOU_ITEMS: any[] = [
    {
      "product_id": "p-0007",
      "product_title": "Noise ColorFit Pulse 2 Max 1.85\" Display Bluetooth Calling Smart Watch",
      "product_image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
      "mrp": 4999,
      "discount_price": 1499,
      "discount_percentage": 70,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0008",
      "product_title": "Women's Floral Print Cotton Anarkali Kurta with Dupatta Set",
      "product_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
      "category_id": WOMENS_FASHION_CATEGORY_ID,
      "mrp": 2499,
      "discount_price": 999,
      "discount_percentage": 60,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0009",
      "product_title": "Philips Cordless Beard Trimmer Series 1000 with USB Charging",
      "product_image": "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80",
      "category_id": BEAUTY_CATEGORY_ID,
      "mrp": 1495,
      "discount_price": 1195,
      "discount_percentage": 20,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0010",
      "product_title": "Solimo Ceramic Stoneware Coffee Mug Set of 6 (Multicolor, 330ml)",
      "product_image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      "category_id": HOME_AND_LIVING_CATEGORY_ID,
      "mrp": 899,
      "discount_price": 649,
      "discount_percentage": 28,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0011",
      "product_title": "Puma Unisex-Adult Smash V2 Leather Casual Sneakers",
      "product_image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
      "category_id": MENS_FASHION_CATEGORY_ID,
      "mrp": 3999,
      "discount_price": 2199,
      "discount_percentage": 45,
      "is_add_to_cart": false,
    },
    {
      "product_id": "p-0012",
      "product_title": "Cadbury Celebrations Rich Assorted Chocolate Gift Box 340g",
      "product_image": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80",
      "category_id": GROCERIES_CATEGORY_ID,
      "mrp": 350,
      "discount_price": 315,
      "discount_percentage": 10,
      "is_add_to_cart": true,
    }
  ];

export const COMMON_TRENDING_FASHION_ITEMS: any[] = [
    {
      "product_id": "p-0019",
      "product_title": "Levi's Men's 511 Slim Fit Mid Rise Stretch Denim Jeans",
      "product_image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
      "category_id": MENS_FASHION_CATEGORY_ID,
      "mrp": 3499,
      "discount_price": 2099,
      "discount_percentage": 40,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0020",
      "product_title": "Biba Women's Embroidered Straight Fit Chanderi Kurti",
      "product_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      "category_id": WOMENS_FASHION_CATEGORY_ID,
      "mrp": 1899,
      "discount_price": 1139,
      "discount_percentage": 40,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0021",
      "product_title": "US Polo Assn. Men's Solid Pique Cotton Regular Fit Polo T-Shirt",
      "product_image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
      "category_id": MENS_FASHION_CATEGORY_ID,
      "mrp": 1999,
      "discount_price": 1399,
      "discount_percentage": 30,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0022",
      "product_title": "Allen Solly Women's Solid Single-Breasted Casual Formal Blazer",
      "product_image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
      "category_id": WOMENS_FASHION_CATEGORY_ID,
      "mrp": 3999,
      "discount_price": 2499,
      "discount_percentage": 38,
      "is_add_to_cart": false,
    },
    {
      "product_id": "p-0023",
      "product_title": "Peter England Men's Slim Fit Flat-Front Cotton Chinos",
      "product_image": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80",
      "category_id": MENS_FASHION_CATEGORY_ID,
      "mrp": 1499,
      "discount_price": 699,
      "discount_percentage": 53,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0024",
      "product_title": "Lavie Women's Betula Medium Structured Top-Handle Satchel Handbag",
      "product_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      "category_id": WOMENS_FASHION_CATEGORY_ID,
      "mrp": 2990,
      "discount_price": 1490,
      "discount_percentage": 50,
      "is_add_to_cart": true,
    }
  ];

export const COMMON_DEALS_OF_THE_DAY_ITEMS: any[] = [
    {
      "product_id": "p-0025",
      "product_title": "Samsung Galaxy M35 5G (Moonlight Blue, 6GB RAM, 128GB Storage)",
      "product_image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80",
      "category_id": MOBILES_CATEGORY_ID,
      "mrp": 24499,
      "discount_price": 19999,
      "discount_percentage": 18,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0026",
      "product_title": "Fire-Boltt Ninja Call Pro Plus 1.83\" HD Bluetooth Calling Smartwatch",
      "product_image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
      "mrp": 4999,
      "discount_price": 1099,
      "discount_percentage": 78,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0027",
      "product_title": "Bajaj New Shakti Neo 15L Vertical Storage Water Heater Geyser",
      "product_image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      "category_id": APPLIANCES_CATEGORY_ID,
      "mrp": 8990,
      "discount_price": 5499,
      "discount_percentage": 39,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0028",
      "product_title": "Lifelong PVC Hex Dumbbells Set for Home Workout (5kg x 2)",
      "product_image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80",
      "category_id": SPORTS_AND_FITNESS_CATEGORY_ID,
      "mrp": 1499,
      "discount_price": 799,
      "discount_percentage": 47,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0029",
      "product_title": "Cello Opalware Dazzle Tropical Lagoon Dinner Set (18 Pcs)",
      "product_image": "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80",
      "category_id": HOME_AND_LIVING_CATEGORY_ID,
      "mrp": 2150,
      "discount_price": 1299,
      "discount_percentage": 40,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0030",
      "product_title": "Bombay Shaving Company Precision 6-Blade Safety Shaving Razor",
      "product_image": "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&w=600&q=80",
      "category_id": BEAUTY_CATEGORY_ID,
      "mrp": 499,
      "discount_price": 499,
      "discount_percentage": 0,
      "is_add_to_cart": false,
    }
  ];

export const COMMON_FRESH_NEW_ARRIVALS_ITEMS: any[] = [
    {
      "product_id": "p-0049",
      "product_title": "realme Narzo 70 Pro 5G (Glass Green, 8GB RAM, 128GB Storage)",
      "product_image": "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
      "category_id": MOBILES_CATEGORY_ID,
      "mrp": 21999,
      "discount_price": 18999,
      "discount_percentage": 14,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0050",
      "product_title": "boAt Stone 352 Portable Bluetooth Speaker with 10W RMS Stereo Sound",
      "product_image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
      "mrp": 3490,
      "discount_price": 1699,
      "discount_percentage": 51,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0051",
      "product_title": "Boldfit Anti-Slip Exercise Yoga Mat with Alignment Lines 6mm",
      "product_image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
      "category_id": SPORTS_AND_FITNESS_CATEGORY_ID,
      "mrp": 1299,
      "discount_price": 799,
      "discount_percentage": 38,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0052",
      "product_title": "Forest Essentials Ayurvedic Soundarya Radiance Day Cream with SPF 25",
      "product_image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
      "category_id": BEAUTY_CATEGORY_ID,
      "mrp": 3450,
      "discount_price": 2999,
      "discount_percentage": 13,
      "is_add_to_cart": false,
    },
    {
      "product_id": "p-0053",
      "product_title": "Wipro Garnet 12W B22 Color Tuning LED Smart Bulb (WiFi + Bluetooth)",
      "product_image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
      "category_id": HOME_AND_LIVING_CATEGORY_ID,
      "mrp": 799,
      "discount_price": 499,
      "discount_percentage": 38,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0054",
      "product_title": "Urban Terrain Bolt 26T Single Speed Mountain Bike with Front Suspension",
      "product_image": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
      "category_id": SPORTS_AND_FITNESS_CATEGORY_ID,
      "mrp": 11999,
      "discount_price": 5499,
      "discount_percentage": 54,
      "is_add_to_cart": true,
    }
  ];

export const COMMON_MORE_TO_EXPLORE_ITEMS: any[] = [
    {
      "product_id": "p-0055",
      "product_title": "Canon EOS 1500D 24.1MP Digital SLR Camera with 18-55mm IS II Lens",
      "product_image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
      "mrp": 47995,
      "discount_price": 41990,
      "discount_percentage": 13,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0056",
      "product_title": "Royal Enfield Streetwind V3 Protective Breathable Riding Jacket",
      "product_image": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
      "category_id": AUTOMOTIVE_CATEGORY_ID,
      "mrp": 4950,
      "discount_price": 4455,
      "discount_percentage": 10,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0057",
      "product_title": "Pedigree Adult Complete Nutrition Dry Dog Food Meat & Rice 3kg Pack",
      "product_image": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
      "category_id": PET_SUPPLIES_CATEGORY_ID,
      "mrp": 900,
      "discount_price": 765,
      "discount_percentage": 15,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0058",
      "product_title": "Pampers All Round Protection Baby Diaper Pants (Size L, 64 Count)",
      "product_image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
      "category_id": BABY_CARE_CATEGORY_ID,
      "mrp": 1299,
      "discount_price": 999,
      "discount_percentage": 23,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0059",
      "product_title": "GIVA 925 Sterling Silver Classic Solitaire Crystal Ring with Certificate",
      "product_image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
      "category_id": JEWELRY_CATEGORY_ID,
      "mrp": 2199,
      "discount_price": 1599,
      "discount_percentage": 27,
      "is_add_to_cart": false,
    },
    {
      "product_id": "p-0060",
      "product_title": "Hasbro Monopoly Classic Family Board Game for Ages 8 and Up",
      "product_image": "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80",
      "category_id": TOYS_AND_GAMES_CATEGORY_ID,
      "mrp": 1499,
      "discount_price": 1199,
      "discount_percentage": 20,
      "is_add_to_cart": true,
    }
  ];

// ============================================================================
// 2. CATEGORY 101 SPECIFIC WIDGETS (ALL PAGE)
// ============================================================================

export const CAT101_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=600&q=80",
      "title": "Festive Autumn Men's Collection",
      "content": "Kurtas, Nehru Jackets & Casual Shirts at up to 60% off",
      "redirect_category_id": MENS_FASHION_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
      "title": "Flagship 5G Smartphones Carnival",
      "content": "Exchange bonus up to ₹5,000 on OnePlus, Samsung & Apple",
      "redirect_category_id": MOBILES_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "title": "Premium Audio & Electronics Fest",
      "content": "Studio Headphones, Laptops & Smart Wearables from ₹999",
      "redirect_category_id": ELECTRONICS_CATEGORY_ID,
      "redirect_url": "",
    }
  ];
export const CAT101_OFFERS_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80",
      "title": "Flat 50% Cashback on First Order via PhonePe",
      "content": "Use code PHONEPE50 on payments above ₹499 (T&C Apply)",
      "redirect_category_id": ALL_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=600&q=80",
      "title": "10% Instant Bank Discount with Credit Cards",
      "content": "Instant ₹1,500 savings on HDFC, SBI & ICICI Cards",
      "redirect_category_id": ALL_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80",
      "title": "Mega Festive Dhamaka Sale is Live",
      "content": "Up to 75% Off across Electronics, Fashion & Home",
      "redirect_category_id": ALL_CATEGORY_ID,
      "redirect_url": "",
    }
  ];
export const CAT101_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Men's Fashion",
      "category_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      "category_id": MENS_FASHION_CATEGORY_ID,
    },
    {
      "category_name": "Women's Fashion",
      "category_image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      "category_id": WOMENS_FASHION_CATEGORY_ID,
    },
    {
      "category_name": "Electronics",
      "category_image": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
    },
    {
      "category_name": "Home & Living",
      "category_image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      "category_id": HOME_AND_LIVING_CATEGORY_ID,
    },
    {
      "category_name": "Beauty & Care",
      "category_image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
      "category_id": BEAUTY_CATEGORY_ID,
    },
    {
      "category_name": "Appliances",
      "category_image": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80",
      "category_id": APPLIANCES_CATEGORY_ID,
    },
    {
      "category_name": "Toys & Games",
      "category_image": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80",
      "category_id": TOYS_AND_GAMES_CATEGORY_ID,
    },
    {
      "category_name": "Sports & Fitness",
      "category_image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      "category_id": SPORTS_AND_FITNESS_CATEGORY_ID,
    }
  ];
export const CAT101_RECENTLY_VIEWED_ITEMS: any[] = [
    {
      "product_id": "p-0013",
      "product_title": "Apple iPhone 15 (128 GB) - Midnight Black",
      "product_image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
      "category_id": MOBILES_CATEGORY_ID,
      "mrp": 79900,
      "discount_price": 69999,
      "discount_percentage": 12,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0014",
      "product_title": "Sony WH-1000XM4 Industry Leading Wireless Noise Canceling Headphones",
      "product_image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
      "mrp": 29990,
      "discount_price": 22990,
      "discount_percentage": 23,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0015",
      "product_title": "Fastrack Limitless FS1 Pro Smartwatch with Super AMOLED Display",
      "product_image": "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
      "mrp": 3995,
      "discount_price": 1795,
      "discount_percentage": 55,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0016",
      "product_title": "Urban Company Native M1 Smart Water Purifier (10-Stage RO+UV)",
      "product_image": "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=600&q=80",
      "category_id": APPLIANCES_CATEGORY_ID,
      "mrp": 17499,
      "discount_price": 13999,
      "discount_percentage": 20,
      "is_add_to_cart": false,
    },
    {
      "product_id": "p-0017",
      "product_title": "Atomic Habits: An Easy & Proven Way to Build Good Habits by James Clear",
      "product_image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
      "category_id": BOOKS_CATEGORY_ID,
      "mrp": 799,
      "discount_price": 499,
      "discount_percentage": 38,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0018",
      "product_title": "Wildcraft Casual 35L Water Resistant Travel Laptop Backpack",
      "product_image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
      "category_id": MENS_FASHION_CATEGORY_ID,
      "mrp": 2199,
      "discount_price": 1499,
      "discount_percentage": 32,
      "is_add_to_cart": true,
    }
  ];
export const CAT101_MID_PAGE_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=600&q=80",
      "title": "The ₹49 Store - Unbeatable Value Under ₹49",
      "content": "Stationery, personal grooming & daily kitchen essentials at ₹49",
      "redirect_category_id": ALL_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
      "title": "Trending Fashion Runway - Fresh Styles",
      "content": "Discover the hottest apparel, ethnic kurtis & footwear of the season",
      "redirect_category_id": MENS_FASHION_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
      "title": "Customer Bestseller Favorites - Highest Rated",
      "content": "Shop verified 4.5+ star rated products chosen by millions",
      "redirect_category_id": ALL_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=600&q=80",
      "title": "Big Deal Days - Limited Time Flash Offers",
      "content": "Exclusive lightning discounts on electronics, laptops and appliances",
      "redirect_category_id": ELECTRONICS_CATEGORY_ID,
      "redirect_url": "",
    }
  ];
export const CAT101_RS49_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
      "title": "Welcome to the ₹49 Budget Bazaar",
      "content": "Incredible products with flat ₹49 price point. No minimum purchase!",
      "redirect_category_id": ALL_CATEGORY_ID,
      "redirect_url": "",
    }
  ];
export const CAT101_RS49_PRODUCTS_ITEMS: any[] = [
    {
      "product_id": "p-0031",
      "product_title": "Classic Matte Metal Ballpoint Pen with Extra Black Refill",
      "product_image": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80",
      "category_id": BOOKS_CATEGORY_ID,
      "mrp": 99,
      "discount_price": 49,
      "discount_percentage": 51,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0032",
      "product_title": "High-Speed Micro USB to USB-A Braided Charging Cable 1m",
      "product_image": "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
      "mrp": 149,
      "discount_price": 49,
      "discount_percentage": 67,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0033",
      "product_title": "Organic Aloe Vera Refreshing Wet Wipes Pack of 25 Wipes",
      "product_image": "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80",
      "category_id": BEAUTY_CATEGORY_ID,
      "mrp": 75,
      "discount_price": 49,
      "discount_percentage": 35,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0034",
      "product_title": "Multipurpose Ergonomic Stainless Steel Kitchen Peeler",
      "product_image": "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&w=600&q=80",
      "category_id": HOME_AND_LIVING_CATEGORY_ID,
      "mrp": 120,
      "discount_price": 49,
      "discount_percentage": 59,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0035",
      "product_title": "Men's Cotton Rich Ankle Length Casual Socks Pair",
      "product_image": "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80",
      "category_id": MENS_FASHION_CATEGORY_ID,
      "mrp": 129,
      "discount_price": 49,
      "discount_percentage": 62,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0036",
      "product_title": "Compact Pocket Memo Notebook Diary Ruled (80 Pages)",
      "product_image": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      "category_id": BOOKS_CATEGORY_ID,
      "mrp": 49,
      "discount_price": 49,
      "discount_percentage": 0,
      "is_add_to_cart": true,
    }
  ];
export const CAT101_HURRY_DEALS_ITEMS: any[] = [
    {
      "product_id": "p-0037",
      "product_title": "JBL Flip 5 Waterproof Portable Bluetooth Speaker (Squad Edition)",
      "product_image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
      "mrp": 9999,
      "discount_price": 5999,
      "discount_percentage": 40,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0038",
      "product_title": "Kent Grand Plus RO + UV + UF 9L Water Purifier with TDS Controller",
      "product_image": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80",
      "category_id": APPLIANCES_CATEGORY_ID,
      "mrp": 19500,
      "discount_price": 14499,
      "discount_percentage": 26,
      "is_add_to_cart": false,
    },
    {
      "product_id": "p-0039",
      "product_title": "Pigeon by Stovekraft Cruise 1800-Watt Induction Cooktop with LED Display",
      "product_image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
      "category_id": APPLIANCES_CATEGORY_ID,
      "mrp": 3195,
      "discount_price": 1699,
      "discount_percentage": 47,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0040",
      "product_title": "Nivia Storm Rubber Moulded Football (Official Size 5)",
      "product_image": "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=80",
      "category_id": SPORTS_AND_FITNESS_CATEGORY_ID,
      "mrp": 599,
      "discount_price": 399,
      "discount_percentage": 33,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0041",
      "product_title": "Portronics Konnect L 1.2M Fast Charging Lightning Cable for iPhone",
      "product_image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
      "mrp": 399,
      "discount_price": 179,
      "discount_percentage": 55,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0042",
      "product_title": "Maybelline New York Colossal Waterproof Mascara (Glam Black, 10ml)",
      "product_image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
      "category_id": BEAUTY_CATEGORY_ID,
      "mrp": 399,
      "discount_price": 299,
      "discount_percentage": 25,
      "is_add_to_cart": true,
    }
  ];
export const CAT101_BESTSELLER_FAVORITES_ITEMS: any[] = [
    {
      "product_id": "p-0043",
      "product_title": "HP 15s 12th Gen Intel Core i3 Thin & Light Laptop (8GB RAM / 512GB SSD)",
      "product_image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
      "category_id": ELECTRONICS_CATEGORY_ID,
      "mrp": 46990,
      "discount_price": 37990,
      "discount_percentage": 19,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0044",
      "product_title": "Wakefit Orthopedic Memory Foam Mattress King Size 78x72x6 Inch",
      "product_image": "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=80",
      "category_id": FURNITURE_CATEGORY_ID,
      "mrp": 18450,
      "discount_price": 12999,
      "discount_percentage": 30,
      "is_add_to_cart": false,
    },
    {
      "product_id": "p-0045",
      "product_title": "Philips HD6975/00 25-Litre Digital Oven Toaster Grill (OTG)",
      "product_image": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80",
      "category_id": APPLIANCES_CATEGORY_ID,
      "mrp": 8095,
      "discount_price": 5999,
      "discount_percentage": 26,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0046",
      "product_title": "Safari Pentagon 3 Pc Set Polypropylene Hard Sided Luggage Trolley Bags",
      "product_image": "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=600&q=80",
      "category_id": MENS_FASHION_CATEGORY_ID,
      "mrp": 14999,
      "discount_price": 5999,
      "discount_percentage": 60,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0047",
      "product_title": "Bombay Dyeing 100% Pure Cotton Floral Double Bedsheet with 2 Pillow Covers",
      "product_image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      "category_id": HOME_AND_LIVING_CATEGORY_ID,
      "mrp": 1899,
      "discount_price": 999,
      "discount_percentage": 47,
      "is_add_to_cart": true,
    },
    {
      "product_id": "p-0048",
      "product_title": "The Psychology of Money by Morgan Housel (Timeless Lessons on Wealth)",
      "product_image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      "category_id": BOOKS_CATEGORY_ID,
      "mrp": 399,
      "discount_price": 275,
      "discount_percentage": 31,
      "is_add_to_cart": true,
    }
  ];

// ============================================================================
// 3. CATEGORIES 102 THROUGH 118 HERO & TOP CATEGORIES WIDGETS
// ============================================================================

export const CAT102_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80",
      "title": "Men's Festive Styles",
      "content": "Flat 40% Off on Kurtas & Nehru Jackets",
      "redirect_category_id": MENS_FASHION_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80",
      "title": "Casual & Streetwear",
      "content": "Oversized Tees, Hoodies & Cargoes",
      "redirect_category_id": MENS_FASHION_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
      "title": "Workwear & Formal Shirts",
      "content": "Crisp Cotton & Linen Formals",
      "redirect_category_id": MENS_FASHION_CATEGORY_ID,
      "redirect_url": "",
    }
  ];
export const CAT102_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_id": PLACEHOLDER_MENS_TSHIRTS_POLOS_ID,
      "category_name": "T-Shirts & Polos",
      "category_image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_MENS_CASUAL_SHIRTS_ID,
      "category_name": "Casual & Formal Shirts",
      "category_image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_MENS_JEANS_TROUSERS_ID,
      "category_name": "Jeans & Trousers",
      "category_image": "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_MENS_ETHNIC_KURTAS_ID,
      "category_name": "Ethnic Wear & Kurtas",
      "category_image": "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_MENS_JACKETS_HOODIES_ID,
      "category_name": "Jackets & Hoodies",
      "category_image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_MENS_FOOTWEAR_SNEAKERS_ID,
      "category_name": "Footwear & Sneakers",
      "category_image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_MENS_WATCHES_ACCESSORIES_ID,
      "category_name": "Watches & Accessories",
      "category_image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    }
  ];

export const CAT103_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      "title": "Elegance Redefined",
      "content": "Exclusive Kurtas, Lehengas & Sarees",
      "redirect_category_id": WOMENS_FASHION_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
      "title": "Western Wear & Dresses",
      "content": "Trendy Tops, Dresses & Denim",
      "redirect_category_id": WOMENS_FASHION_CATEGORY_ID,
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
      "title": "Handbags & Footwear Edit",
      "content": "Chic Heels, Flats & Leather Totes",
      "redirect_category_id": WOMENS_FASHION_CATEGORY_ID,
      "redirect_url": "",
    }
  ];
export const CAT103_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_id": PLACEHOLDER_WOMENS_KURTIS_SUITS_ID,
      "category_name": "Kurtis & Ethnic Sets",
      "category_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_WOMENS_SAREES_ID,
      "category_name": "Sarees & Dress Material",
      "category_image": "https://images.unsplash.com/photo-1610030469668-932ec596e7fa?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_WOMENS_WESTERN_TOPS_TEES_ID,
      "category_name": "Western Tops & Tees",
      "category_image": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_WOMENS_DRESSES_JUMPSUITS_ID,
      "category_name": "Dresses & Jumpsuits",
      "category_image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_WOMENS_JEANS_TROUSERS_ID,
      "category_name": "Jeans & Trousers",
      "category_image": "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_WOMENS_HEELS_FOOTWEAR_ID,
      "category_name": "Heels & Flats",
      "category_image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
    },
    {
      "category_id": PLACEHOLDER_WOMENS_JEWELRY_WATCHES_ID,
      "category_name": "Jewelry & Handbags",
      "category_image": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80",
    }
  ];

export const CAT104_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "title": "Performance Laptops & Workstations",
      "content": "Intel Core Ultra & M3 MacBooks with No Cost EMI",
      "redirect_category_id": "PLACEHOLDER_LAPTOPS_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
      "title": "Active Noise Cancelling Audio Fest",
      "content": "Sony, Bose & Sennheiser studio headphones from ₹4,999",
      "redirect_category_id": "PLACEHOLDER_HEADPHONES_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80",
      "title": "Smart TVs & Home Entertainment",
      "content": "4K OLED & QLED Displays at lowest festive prices",
      "redirect_category_id": APPLIANCES_CATEGORY_ID,
      "redirect_url": "",
    }
  ];
export const CAT104_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Mobiles & 5G",
      "category_image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
      "category_id": MOBILES_CATEGORY_ID,
    },
    {
      "category_name": "Laptops",
      "category_image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_LAPTOPS_ID",
    },
    {
      "category_name": "Headphones",
      "category_image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_HEADPHONES_ID",
    },
    {
      "category_name": "Smart Watches",
      "category_image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_SMART_WATCHES_ID",
    },
    {
      "category_name": "Cameras",
      "category_image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_CAMERAS_ID",
    },
    {
      "category_name": "Bluetooth Speakers",
      "category_image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_SPEAKERS_ID",
    },
    {
      "category_name": "Gaming Consoles",
      "category_image": "https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_GAMING_CONSOLES_ID",
    },
    {
      "category_name": "Electronic Accessories",
      "category_image": "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_ELECTRONIC_ACCESSORIES_ID",
    }
  ];

export const CAT105_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      "title": "Handcrafted Home Decor & Accents",
      "content": "Vases, Wall Clocks & Sculptures to elevate every corner",
      "redirect_category_id": "PLACEHOLDER_HOME_DECOR_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
      "title": "Premium Non-Stick Cookware & Dining",
      "content": "Cast iron pans, dinnerware & cutlery up to 50% off",
      "redirect_category_id": "PLACEHOLDER_KITCHENWARE_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      "title": "Cozy Bedroom & Bed Linen Specials",
      "content": "100% Egyptian Cotton bedsheets & duvets from ₹799",
      "redirect_category_id": "PLACEHOLDER_BEDDING_LINEN_ID",
      "redirect_url": "",
    }
  ];
export const CAT105_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Home Decor",
      "category_image": "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_HOME_DECOR_ID",
    },
    {
      "category_name": "Kitchenware",
      "category_image": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_KITCHENWARE_ID",
    },
    {
      "category_name": "Bedding & Linen",
      "category_image": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BEDDING_LINEN_ID",
    },
    {
      "category_name": "Lighting & Lamps",
      "category_image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_LIGHTING_ID",
    },
    {
      "category_name": "Storage & Organizers",
      "category_image": "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_STORAGE_ORGANIZERS_ID",
    },
    {
      "category_name": "Bath Essentials",
      "category_image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BATH_ESSENTIALS_ID",
    },
    {
      "category_name": "Furniture",
      "category_image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
      "category_id": FURNITURE_CATEGORY_ID,
    },
    {
      "category_name": "Appliances",
      "category_image": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80",
      "category_id": APPLIANCES_CATEGORY_ID,
    }
  ];

export const CAT106_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
      "title": "Glow Up Skincare Bonanza",
      "content": "Serums, sunscreens & night creams at flat 30% off",
      "redirect_category_id": "PLACEHOLDER_SKINCARE_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
      "title": "International Glamour Makeup Hub",
      "content": "Lipsticks, foundations & eye palettes from top brands",
      "redirect_category_id": "PLACEHOLDER_MAKEUP_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
      "title": "Signature Fragrance Boutique",
      "content": "Eau de Parfum & luxury mists for men & women",
      "redirect_category_id": "PLACEHOLDER_FRAGRANCES_ID",
      "redirect_url": "",
    }
  ];
export const CAT106_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Skincare",
      "category_image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_SKINCARE_ID",
    },
    {
      "category_name": "Makeup",
      "category_image": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_MAKEUP_ID",
    },
    {
      "category_name": "Haircare",
      "category_image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_HAIRCARE_ID",
    },
    {
      "category_name": "Fragrances",
      "category_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_FRAGRANCES_ID",
    },
    {
      "category_name": "Bath & Body",
      "category_image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BATH_BODY_ID",
    },
    {
      "category_name": "Men's Grooming",
      "category_image": "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_MENS_GROOMING_ID",
    },
    {
      "category_name": "Beauty Tools",
      "category_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BEAUTY_TOOLS_ID",
    }
  ];

export const CAT107_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80",
      "title": "Energy-Efficient Smart Inverter Refrigerators",
      "content": "Frost-free double door & multi-door fridges up to 40% off",
      "redirect_category_id": "PLACEHOLDER_REFRIGERATORS_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80",
      "title": "Smart Automatic Washing Machines",
      "content": "Front-load & top-load machines with steam wash tech",
      "redirect_category_id": "PLACEHOLDER_WASHING_MACHINES_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?auto=format&fit=crop&w=600&q=80",
      "title": "Split Inverter Air Conditioners & Coolers",
      "content": "Heavy duty cooling with 5-star BEE energy ratings",
      "redirect_category_id": "PLACEHOLDER_AIR_CONDITIONERS_ID",
      "redirect_url": "",
    }
  ];
export const CAT107_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Refrigerators",
      "category_image": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_REFRIGERATORS_ID",
    },
    {
      "category_name": "Washing Machines",
      "category_image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_WASHING_MACHINES_ID",
    },
    {
      "category_name": "Air Conditioners",
      "category_image": "https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_AIR_CONDITIONERS_ID",
    },
    {
      "category_name": "Microwaves & Ovens",
      "category_image": "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_MICROWAVES_ID",
    },
    {
      "category_name": "Kitchen Appliances",
      "category_image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_KITCHEN_APPLIANCES_ID",
    },
    {
      "category_name": "Vacuum Cleaners",
      "category_image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_VACUUM_CLEANERS_ID",
    },
    {
      "category_name": "Water Geysers",
      "category_image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_GEYSERS_ID",
    }
  ];

export const CAT108_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80",
      "title": "Action Figures & Superhero Collectibles",
      "content": "Marvel, DC & Anime collectible figures from ₹499",
      "redirect_category_id": "PLACEHOLDER_ACTION_FIGURES_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80",
      "title": "Classic Family Board Games & Puzzles",
      "content": "Monopoly, Catan, Scrabble & jigsaw puzzles on sale",
      "redirect_category_id": "PLACEHOLDER_BOARD_GAMES_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80",
      "title": "High-Speed Remote Control Cars & Drones",
      "content": "Rechargeable drift cars & 4K camera quadcopters",
      "redirect_category_id": "PLACEHOLDER_RC_TOYS_ID",
      "redirect_url": "",
    }
  ];
export const CAT108_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Action Figures",
      "category_image": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_ACTION_FIGURES_ID",
    },
    {
      "category_name": "Board Games",
      "category_image": "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BOARD_GAMES_ID",
    },
    {
      "category_name": "Jigsaw Puzzles",
      "category_image": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_PUZZLES_ID",
    },
    {
      "category_name": "Remote Control Toys",
      "category_image": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_RC_TOYS_ID",
    },
    {
      "category_name": "Dolls & Plush Toys",
      "category_image": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_DOLLS_PLUSH_ID",
    },
    {
      "category_name": "Educational STEM Toys",
      "category_image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_EDUCATIONAL_TOYS_ID",
    },
    {
      "category_name": "Outdoor Sports Play",
      "category_image": "https://images.unsplash.com/photo-1531565637446-32307b194362?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_OUTDOOR_PLAY_ID",
    }
  ];

export const CAT109_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80",
      "title": "Pro Fitness Equipment & Home Gym Gear",
      "content": "Adjustable dumbbells, benches & resistance bands",
      "redirect_category_id": "PLACEHOLDER_FITNESS_EQUIPMENT_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80",
      "title": "Cricket Gear & Match Grade Equipment",
      "content": "English willow bats, protective pads & leather balls",
      "redirect_category_id": "PLACEHOLDER_CRICKET_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
      "title": "Cycling & Outdoor Endurance Gear",
      "content": "MTB, Hybrid & Road cycles with gear accessories",
      "redirect_category_id": "PLACEHOLDER_CYCLING_ID",
      "redirect_url": "",
    }
  ];
export const CAT109_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Fitness Equipment",
      "category_image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_FITNESS_EQUIPMENT_ID",
    },
    {
      "category_name": "Yoga & Pilates",
      "category_image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_YOGA_PILATES_ID",
    },
    {
      "category_name": "Cricket Kits",
      "category_image": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_CRICKET_ID",
    },
    {
      "category_name": "Football Gear",
      "category_image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_FOOTBALL_ID",
    },
    {
      "category_name": "Badminton Rackets",
      "category_image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BADMINTON_ID",
    },
    {
      "category_name": "Cycling",
      "category_image": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_CYCLING_ID",
    },
    {
      "category_name": "Sports Nutrition",
      "category_image": "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_SPORTS_NUTRITION_ID",
    }
  ];

export const CAT110_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
      "title": "Bestselling Fiction & Thriller Novels",
      "content": "Dive into gripping page-turners from international authors",
      "redirect_category_id": "PLACEHOLDER_FICTION_BOOKS_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      "title": "Personal Growth, Leadership & Wealth",
      "content": "Transformative self-help & financial literacy bestsellers",
      "redirect_category_id": "PLACEHOLDER_SELF_HELP_BOOKS_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
      "title": "Manga, Graphic Novels & Comics",
      "content": "Latest shonen manga editions & superhero graphic novels",
      "redirect_category_id": "PLACEHOLDER_COMICS_MANGA_ID",
      "redirect_url": "",
    }
  ];
export const CAT110_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Fiction & Literature",
      "category_image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_FICTION_BOOKS_ID",
    },
    {
      "category_name": "Non-Fiction",
      "category_image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_NON_FICTION_BOOKS_ID",
    },
    {
      "category_name": "Self-Help & Mindset",
      "category_image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_SELF_HELP_BOOKS_ID",
    },
    {
      "category_name": "Academic & Textbooks",
      "category_image": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_ACADEMIC_BOOKS_ID",
    },
    {
      "category_name": "Children's Stories",
      "category_image": "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_CHILDRENS_BOOKS_ID",
    },
    {
      "category_name": "Biographies & Memoirs",
      "category_image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BIOGRAPHIES_ID",
    },
    {
      "category_name": "Comics & Manga",
      "category_image": "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_COMICS_MANGA_ID",
    }
  ];

export const CAT111_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
      "title": "Comfortable Living Room Sofas & Recliners",
      "content": "L-shaped sectional couches & velvet recliners at best prices",
      "redirect_category_id": "PLACEHOLDER_LIVING_ROOM_FURNITURE_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
      "title": "Solid Sheesham Wood Bedroom Sets",
      "content": "King size storage beds & wardrobes crafted to last a lifetime",
      "redirect_category_id": "PLACEHOLDER_BEDROOM_FURNITURE_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
      "title": "Ergonomic Home Office Chairs & Desks",
      "content": "Lumbar support mesh chairs & motorized standing desks",
      "redirect_category_id": "PLACEHOLDER_OFFICE_FURNITURE_ID",
      "redirect_url": "",
    }
  ];
export const CAT111_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Living Room",
      "category_image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_LIVING_ROOM_FURNITURE_ID",
    },
    {
      "category_name": "Bedroom Sets",
      "category_image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BEDROOM_FURNITURE_ID",
    },
    {
      "category_name": "Dining Sets",
      "category_image": "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_DINING_SETS_ID",
    },
    {
      "category_name": "Office Furniture",
      "category_image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_OFFICE_FURNITURE_ID",
    },
    {
      "category_name": "Mattresses",
      "category_image": "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_MATTRESSES_ID",
    },
    {
      "category_name": "Outdoor Furniture",
      "category_image": "https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_OUTDOOR_FURNITURE_ID",
    },
    {
      "category_name": "Shoe Racks & Cabinets",
      "category_image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_SHOE_RACKS_ID",
    }
  ];

export const CAT112_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
      "title": "Supermarket Daily Staples & Pulses",
      "content": "Atta, basmati rice, organic dals & cooking oils delivered fast",
      "redirect_category_id": "PLACEHOLDER_DAILY_ESSENTIALS_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?auto=format&fit=crop&w=600&q=80",
      "title": "Crispy Snacks, Premium Tea & Coffee",
      "content": "Artisanal roasts, herbal infusions & gourmet savory snacks",
      "redirect_category_id": "PLACEHOLDER_SNACKS_BEVERAGES_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=600&q=80",
      "title": "Farm-Fresh Breakfast Dairy & Cereals",
      "content": "Organic honey, oats, almond milk & artisan spreads",
      "redirect_category_id": "PLACEHOLDER_DAIRY_BREAKFAST_ID",
      "redirect_url": "",
    }
  ];
export const CAT112_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Daily Essentials",
      "category_image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_DAILY_ESSENTIALS_ID",
    },
    {
      "category_name": "Snacks & Beverages",
      "category_image": "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_SNACKS_BEVERAGES_ID",
    },
    {
      "category_name": "Packaged Foods",
      "category_image": "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_PACKAGED_FOODS_ID",
    },
    {
      "category_name": "Cooking Essentials",
      "category_image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_COOKING_ESSENTIALS_ID",
    },
    {
      "category_name": "Dairy & Breakfast",
      "category_image": "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_DAIRY_BREAKFAST_ID",
    },
    {
      "category_name": "Household Cleaners",
      "category_image": "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_HOUSEHOLD_CLEANERS_ID",
    },
    {
      "category_name": "Gourmet Chocolates",
      "category_image": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_GOURMET_CHOCOLATES_ID",
    }
  ];

export const CAT113_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1606577924006-27d39b132ae2?auto=format&fit=crop&w=600&q=80",
      "title": "Smart Automotive Gadgets & Accessories",
      "content": "Dashcams, wireless chargers & tire inflators on sale",
      "redirect_category_id": "PLACEHOLDER_CAR_ACCESSORIES_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80",
      "title": "DOT & ISI Certified Helmets & Riding Gear",
      "content": "Full face safety helmets, protective gloves & riding jackets",
      "redirect_category_id": "PLACEHOLDER_HELMETS_RIDING_GEAR_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
      "title": "Professional Car Care & Deep Detailing",
      "content": "Ceramic coat, foam washes & microfiber kits from ₹299",
      "redirect_category_id": "PLACEHOLDER_CAR_CARE_ID",
      "redirect_url": "",
    }
  ];
export const CAT113_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Car Accessories",
      "category_image": "https://images.unsplash.com/photo-1606577924006-27d39b132ae2?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_CAR_ACCESSORIES_ID",
    },
    {
      "category_name": "Bike Accessories",
      "category_image": "https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BIKE_ACCESSORIES_ID",
    },
    {
      "category_name": "Helmets & Gear",
      "category_image": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_HELMETS_RIDING_GEAR_ID",
    },
    {
      "category_name": "Car Detailing",
      "category_image": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_CAR_CARE_ID",
    },
    {
      "category_name": "Vehicle Electronics",
      "category_image": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_VEHICLE_ELECTRONICS_ID",
    },
    {
      "category_name": "Tyres & Care",
      "category_image": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_TYRES_PARTS_ID",
    }
  ];

export const CAT114_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
      "title": "Flagship 5G Smartphones Collection",
      "content": "Snapdragon 8 Gen 3 & Bionic processors at best prices",
      "redirect_category_id": "PLACEHOLDER_SMARTPHONES_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
      "title": "Budget 5G Mobiles Under ₹15,000",
      "content": "Massive battery, 120Hz displays & high res cameras",
      "redirect_category_id": "PLACEHOLDER_5G_MOBILES_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80",
      "title": "Rugged Phone Cases & Fast Power Banks",
      "content": "Military-grade protection & 65W fast chargers",
      "redirect_category_id": "PLACEHOLDER_CASES_COVERS_ID",
      "redirect_url": "",
    }
  ];
export const CAT114_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Smartphones",
      "category_image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_SMARTPHONES_ID",
    },
    {
      "category_name": "5G Mobiles",
      "category_image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_5G_MOBILES_ID",
    },
    {
      "category_name": "Feature Phones",
      "category_image": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_FEATURE_PHONES_ID",
    },
    {
      "category_name": "Cases & Covers",
      "category_image": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_CASES_COVERS_ID",
    },
    {
      "category_name": "Fast Chargers",
      "category_image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_CHARGERS_CABLES_ID",
    },
    {
      "category_name": "Screen Protectors",
      "category_image": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_SCREEN_PROTECTORS_ID",
    },
    {
      "category_name": "Power Banks",
      "category_image": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_POWER_BANKS_ID",
    }
  ];

export const CAT115_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
      "title": "Ultra-Soft Comfort Diapers & Gentle Wipes",
      "content": "Dermatologically tested tape & pant style baby diapers",
      "redirect_category_id": "PLACEHOLDER_DIAPERS_WIPES_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
      "title": "Natural Ayurvedic Baby Skincare",
      "content": "Tear-free shampoos, baby lotions & cold-pressed oils",
      "redirect_category_id": "PLACEHOLDER_BABY_SKINCARE_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
      "title": "Lightweight Baby Strollers & Safety Cots",
      "content": "Travel-friendly prams & rocking wooden cribs",
      "redirect_category_id": "PLACEHOLDER_BABY_GEAR_ID",
      "redirect_url": "",
    }
  ];
export const CAT115_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Diapers & Wipes",
      "category_image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_DIAPERS_WIPES_ID",
    },
    {
      "category_name": "Baby Skincare",
      "category_image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BABY_SKINCARE_ID",
    },
    {
      "category_name": "Feeding & Nursing",
      "category_image": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BABY_FEEDING_ID",
    },
    {
      "category_name": "Strollers & Gear",
      "category_image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BABY_GEAR_ID",
    },
    {
      "category_name": "Baby Toys & Teethers",
      "category_image": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_BABY_TOYS_ID",
    },
    {
      "category_name": "Nursery Bedding",
      "category_image": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_NURSERY_BEDDING_ID",
    }
  ];

export const CAT116_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
      "title": "Nutritious Dog Food, Gravy & Chews",
      "content": "Grain-free kibble, calcium bones & healthy treats",
      "redirect_category_id": "PLACEHOLDER_DOG_FOOD_TREATS_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80",
      "title": "Gourmet Cat Cuisine & Scratch Toys",
      "content": "Salmon pouches, kitten formula & multi-level cat trees",
      "redirect_category_id": "PLACEHOLDER_CAT_FOOD_TREATS_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80",
      "title": "Orthopedic Pet Beds, Collars & Harnesses",
      "content": "Cozy washable pet beds & reflective night leashes",
      "redirect_category_id": "PLACEHOLDER_PET_BEDS_CRATES_ID",
      "redirect_url": "",
    }
  ];
export const CAT116_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Dog Food & Treats",
      "category_image": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_DOG_FOOD_TREATS_ID",
    },
    {
      "category_name": "Cat Essentials",
      "category_image": "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_CAT_FOOD_TREATS_ID",
    },
    {
      "category_name": "Pet Toys",
      "category_image": "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_PET_TOYS_ID",
    },
    {
      "category_name": "Pet Grooming",
      "category_image": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_PET_GROOMING_ID",
    },
    {
      "category_name": "Collars & Leashes",
      "category_image": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_PET_COLLARS_LEASHES_ID",
    },
    {
      "category_name": "Pet Beds & Mats",
      "category_image": "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_PET_BEDS_CRATES_ID",
    }
  ];

export const CAT117_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
      "title": "BIS Hallmarked Pure 22K Gold Jewelry",
      "content": "Traditional necklaces, jhumkas & wedding bangles",
      "redirect_category_id": "PLACEHOLDER_GOLD_JEWELRY_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      "title": "Certified Real Diamond & Gemstone Solitaires",
      "content": "VVS clarity diamond engagement rings & earrings",
      "redirect_category_id": "PLACEHOLDER_DIAMOND_JEWELRY_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
      "title": "Anti-Tarnish 925 Sterling Silver Collection",
      "content": "Modern rhodium plated silver pendants & minimal rings",
      "redirect_category_id": "PLACEHOLDER_SILVER_JEWELRY_ID",
      "redirect_url": "",
    }
  ];
export const CAT117_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "Gold Jewelry",
      "category_image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_GOLD_JEWELRY_ID",
    },
    {
      "category_name": "Diamond Solitaires",
      "category_image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_DIAMOND_JEWELRY_ID",
    },
    {
      "category_name": "Silver Jewelry",
      "category_image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_SILVER_JEWELRY_ID",
    },
    {
      "category_name": "Fashion Jewelry",
      "category_image": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_FASHION_JEWELRY_ID",
    },
    {
      "category_name": "Earrings & Jhumkas",
      "category_image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_EARRINGS_ID",
    },
    {
      "category_name": "Necklaces & Pendants",
      "category_image": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_NECKLACES_PENDANTS_ID",
    },
    {
      "category_name": "Rings & Bands",
      "category_image": "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_RINGS_BANDS_ID",
    }
  ];

export const CAT118_HERO_BANNER_ITEMS: any[] = [
    {
      "banner_image": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
      "title": "All-In-One E-Commerce Instant Gift Cards",
      "content": "Give the freedom of unlimited choice with zero expiry cards",
      "redirect_category_id": "PLACEHOLDER_ECOMMERCE_GIFT_CARDS_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80",
      "title": "Dining, Cafe & Food Delivery Vouchers",
      "content": "Zomato, Swiggy, Starbucks & Domino vouchers up to 10% off",
      "redirect_category_id": "PLACEHOLDER_DINING_GIFT_CARDS_ID",
      "redirect_url": "",
    },
    {
      "banner_image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      "title": "Entertainment & Gaming Subscription Vouchers",
      "content": "PlayStation, Steam, Xbox & OTT streaming passes",
      "redirect_category_id": "PLACEHOLDER_ENTERTAINMENT_GIFT_CARDS_ID",
      "redirect_url": "",
    }
  ];
export const CAT118_TOP_CATEGORIES_ITEMS: any[] = [
    {
      "category_name": "E-Commerce Cards",
      "category_image": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_ECOMMERCE_GIFT_CARDS_ID",
    },
    {
      "category_name": "Dining & Food Vouchers",
      "category_image": "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_DINING_GIFT_CARDS_ID",
    },
    {
      "category_name": "Fashion Cards",
      "category_image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_FASHION_GIFT_CARDS_ID",
    },
    {
      "category_name": "Entertainment Cards",
      "category_image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_ENTERTAINMENT_GIFT_CARDS_ID",
    },
    {
      "category_name": "Travel & Hotels",
      "category_image": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_TRAVEL_GIFT_CARDS_ID",
    },
    {
      "category_name": "Grocery Vouchers",
      "category_image": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80",
      "category_id": "PLACEHOLDER_GROCERY_GIFT_CARDS_ID",
    }
  ];

// ============================================================================
// 4. MASTER 169 WIDGET ITEMS MAP (ALL 18 PAGES REUSE THE 7 COMMON WIDGETS)
// ============================================================================

export const HAATZA_DASHBOARD_ITEMS: Record<string, any[]> = {
  // Category 101 (All)
  "w0001": CAT101_HERO_BANNER_ITEMS,
  "w0002": CAT101_OFFERS_BANNER_ITEMS,
  "w0003": CAT101_TOP_CATEGORIES_ITEMS,
  "w0004": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0005": COMMON_PROMO_BANNERS_ITEMS,
  "w0006": COMMON_LIKED_BY_YOU_ITEMS,
  "w0007": CAT101_RECENTLY_VIEWED_ITEMS,
  "w0008": CAT101_MID_PAGE_BANNER_ITEMS,
  "w0009": COMMON_TRENDING_FASHION_ITEMS,
  "w0010": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0011": CAT101_RS49_BANNER_ITEMS,
  "w0012": CAT101_RS49_PRODUCTS_ITEMS,
  "w0013": CAT101_HURRY_DEALS_ITEMS,
  "w0014": CAT101_BESTSELLER_FAVORITES_ITEMS,
  "w0015": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0016": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 102
  "w0017": CAT102_HERO_BANNER_ITEMS,
  "w0018": CAT102_TOP_CATEGORIES_ITEMS,
  "w0019": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0020": COMMON_PROMO_BANNERS_ITEMS,
  "w0021": COMMON_LIKED_BY_YOU_ITEMS,
  "w0022": COMMON_TRENDING_FASHION_ITEMS,
  "w0023": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0024": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0025": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 103
  "w0026": CAT103_HERO_BANNER_ITEMS,
  "w0027": CAT103_TOP_CATEGORIES_ITEMS,
  "w0028": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0029": COMMON_PROMO_BANNERS_ITEMS,
  "w0030": COMMON_LIKED_BY_YOU_ITEMS,
  "w0031": COMMON_TRENDING_FASHION_ITEMS,
  "w0032": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0033": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0034": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 104
  "w0035": CAT104_HERO_BANNER_ITEMS,
  "w0036": CAT104_TOP_CATEGORIES_ITEMS,
  "w0037": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0038": COMMON_PROMO_BANNERS_ITEMS,
  "w0039": COMMON_LIKED_BY_YOU_ITEMS,
  "w0040": COMMON_TRENDING_FASHION_ITEMS,
  "w0041": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0042": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0043": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 105
  "w0044": CAT105_HERO_BANNER_ITEMS,
  "w0045": CAT105_TOP_CATEGORIES_ITEMS,
  "w0046": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0047": COMMON_PROMO_BANNERS_ITEMS,
  "w0048": COMMON_LIKED_BY_YOU_ITEMS,
  "w0049": COMMON_TRENDING_FASHION_ITEMS,
  "w0050": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0051": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0052": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 106
  "w0053": CAT106_HERO_BANNER_ITEMS,
  "w0054": CAT106_TOP_CATEGORIES_ITEMS,
  "w0055": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0056": COMMON_PROMO_BANNERS_ITEMS,
  "w0057": COMMON_LIKED_BY_YOU_ITEMS,
  "w0058": COMMON_TRENDING_FASHION_ITEMS,
  "w0059": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0060": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0061": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 107
  "w0062": CAT107_HERO_BANNER_ITEMS,
  "w0063": CAT107_TOP_CATEGORIES_ITEMS,
  "w0064": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0065": COMMON_PROMO_BANNERS_ITEMS,
  "w0066": COMMON_LIKED_BY_YOU_ITEMS,
  "w0067": COMMON_TRENDING_FASHION_ITEMS,
  "w0068": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0069": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0070": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 108
  "w0071": CAT108_HERO_BANNER_ITEMS,
  "w0072": CAT108_TOP_CATEGORIES_ITEMS,
  "w0073": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0074": COMMON_PROMO_BANNERS_ITEMS,
  "w0075": COMMON_LIKED_BY_YOU_ITEMS,
  "w0076": COMMON_TRENDING_FASHION_ITEMS,
  "w0077": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0078": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0079": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 109
  "w0080": CAT109_HERO_BANNER_ITEMS,
  "w0081": CAT109_TOP_CATEGORIES_ITEMS,
  "w0082": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0083": COMMON_PROMO_BANNERS_ITEMS,
  "w0084": COMMON_LIKED_BY_YOU_ITEMS,
  "w0085": COMMON_TRENDING_FASHION_ITEMS,
  "w0086": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0087": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0088": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 110
  "w0089": CAT110_HERO_BANNER_ITEMS,
  "w0090": CAT110_TOP_CATEGORIES_ITEMS,
  "w0091": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0092": COMMON_PROMO_BANNERS_ITEMS,
  "w0093": COMMON_LIKED_BY_YOU_ITEMS,
  "w0094": COMMON_TRENDING_FASHION_ITEMS,
  "w0095": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0096": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0097": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 111
  "w0098": CAT111_HERO_BANNER_ITEMS,
  "w0099": CAT111_TOP_CATEGORIES_ITEMS,
  "w0100": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0101": COMMON_PROMO_BANNERS_ITEMS,
  "w0102": COMMON_LIKED_BY_YOU_ITEMS,
  "w0103": COMMON_TRENDING_FASHION_ITEMS,
  "w0104": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0105": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0106": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 112
  "w0107": CAT112_HERO_BANNER_ITEMS,
  "w0108": CAT112_TOP_CATEGORIES_ITEMS,
  "w0109": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0110": COMMON_PROMO_BANNERS_ITEMS,
  "w0111": COMMON_LIKED_BY_YOU_ITEMS,
  "w0112": COMMON_TRENDING_FASHION_ITEMS,
  "w0113": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0114": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0115": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 113
  "w0116": CAT113_HERO_BANNER_ITEMS,
  "w0117": CAT113_TOP_CATEGORIES_ITEMS,
  "w0118": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0119": COMMON_PROMO_BANNERS_ITEMS,
  "w0120": COMMON_LIKED_BY_YOU_ITEMS,
  "w0121": COMMON_TRENDING_FASHION_ITEMS,
  "w0122": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0123": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0124": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 114
  "w0125": CAT114_HERO_BANNER_ITEMS,
  "w0126": CAT114_TOP_CATEGORIES_ITEMS,
  "w0127": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0128": COMMON_PROMO_BANNERS_ITEMS,
  "w0129": COMMON_LIKED_BY_YOU_ITEMS,
  "w0130": COMMON_TRENDING_FASHION_ITEMS,
  "w0131": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0132": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0133": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 115
  "w0134": CAT115_HERO_BANNER_ITEMS,
  "w0135": CAT115_TOP_CATEGORIES_ITEMS,
  "w0136": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0137": COMMON_PROMO_BANNERS_ITEMS,
  "w0138": COMMON_LIKED_BY_YOU_ITEMS,
  "w0139": COMMON_TRENDING_FASHION_ITEMS,
  "w0140": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0141": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0142": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 116
  "w0143": CAT116_HERO_BANNER_ITEMS,
  "w0144": CAT116_TOP_CATEGORIES_ITEMS,
  "w0145": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0146": COMMON_PROMO_BANNERS_ITEMS,
  "w0147": COMMON_LIKED_BY_YOU_ITEMS,
  "w0148": COMMON_TRENDING_FASHION_ITEMS,
  "w0149": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0150": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0151": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 117
  "w0152": CAT117_HERO_BANNER_ITEMS,
  "w0153": CAT117_TOP_CATEGORIES_ITEMS,
  "w0154": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0155": COMMON_PROMO_BANNERS_ITEMS,
  "w0156": COMMON_LIKED_BY_YOU_ITEMS,
  "w0157": COMMON_TRENDING_FASHION_ITEMS,
  "w0158": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0159": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0160": COMMON_MORE_TO_EXPLORE_ITEMS,

  // Category 118
  "w0161": CAT118_HERO_BANNER_ITEMS,
  "w0162": CAT118_TOP_CATEGORIES_ITEMS,
  "w0163": COMMON_SUGGESTED_FOR_YOU_ITEMS,
  "w0164": COMMON_PROMO_BANNERS_ITEMS,
  "w0165": COMMON_LIKED_BY_YOU_ITEMS,
  "w0166": COMMON_TRENDING_FASHION_ITEMS,
  "w0167": COMMON_DEALS_OF_THE_DAY_ITEMS,
  "w0168": COMMON_FRESH_NEW_ARRIVALS_ITEMS,
  "w0169": COMMON_MORE_TO_EXPLORE_ITEMS,
};

export function getWidgetItems(widgetId: string): any[] {
  return HAATZA_DASHBOARD_ITEMS[widgetId] || [];
}
