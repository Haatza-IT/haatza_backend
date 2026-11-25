/**
 * LITE Dashboard Items Data Source
 *
 * Defines the complete items dictionary and catalog for Haatza LITE quick-commerce.
 * Contains:
 * - 7 legacy Category 201 widgets (sequences 1 to 7)
 * - 22 category widgets across Categories 202 to 212 (sequences 1 and 2 per category)
 * - 5 Dark-store warehouses constant
 * - Complete 29-widget block template replicated across 5 warehouses and 2 placements (290 rows total)
 */

import {
  LITE_ALL_CATEGORY_ID,
  LITE_FRUITS_VEGETABLES_CATEGORY_ID,
  LITE_DAILY_BREAKFAST_CATEGORY_ID,
  LITE_SNACKS_BEVERAGES_CATEGORY_ID,
  LITE_HOUSEHOLD_CLEANING_CATEGORY_ID,
  LITE_PERSONAL_CARE_CATEGORY_ID,
  LITE_KITCHEN_ESSENTIALS_CATEGORY_ID,
  LITE_BAKERY_BREADS_CATEGORY_ID,
  LITE_STAPLES_COOKING_CATEGORY_ID,
  LITE_FROZEN_FOODS_CATEGORY_ID,
  LITE_BABY_CARE_CATEGORY_ID,
  LITE_PET_SUPPLIES_CATEGORY_ID,
  LITE_FRUITS_AND_VEGETABLES_CATEGORY_ID,
  LITE_DAILY_AND_BREAKFAST_CATEGORY_ID,
  LITE_SNACKS_AND_BEVERAGES_CATEGORY_ID,
  LITE_BAKERY_AND_BREADS_CATEGORY_ID,
  LITE_STAPLES_AND_COOKING_CATEGORY_ID,
  LITE_WAREHOUSES,
  type LiteWarehouseId,
} from '../dashboard.config';

export { LITE_WAREHOUSES, type LiteWarehouseId };

// ============================================================================
// 1. CATEGORY 201 (ALL) - 7 LEGACY LITE WIDGETS
// ============================================================================

export const LITE_CAT201_HERO_BANNER_ITEMS: any[] = [
  {
    "id": "lite-hero-1",
    "badge": "10 Min Delivery",
    "title": "Groceries Delivered in 10 Minutes",
    "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    "subtitle": "Fresh farm veggies, milk, fruits & daily staples at wholesale prices",
    "buttonText": "Order Now",
    "redirectUrl": "/lite/category/c4000000-0000-4000-8000-000000000201",
    "redirectType": "CATEGORY"
  }
];
export const LITE_CAT201_EVERYDAY_ESSENTIALS_ITEMS: any[] = [
  {
    "product_id": "lp-3001",
    "product_title": "Toned Milk 1L",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Milk_glass.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 66,
    "discount_price": 60,
    "discount_percentage": 9,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3002",
    "product_title": "Brown Eggs 6 pcs",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Chicken_egg_2009-06-04.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 80,
    "discount_price": 72,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3003",
    "product_title": "Whole Wheat Atta 5kg",
    "product_image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000209",
    "mrp": 280,
    "discount_price": 240,
    "discount_percentage": 14,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3004",
    "product_title": "Sona Masoori Rice 5kg",
    "product_image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000209",
    "mrp": 400,
    "discount_price": 350,
    "discount_percentage": 13,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3005",
    "product_title": "Sunflower Oil 1L",
    "product_image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000209",
    "mrp": 160,
    "discount_price": 140,
    "discount_percentage": 13,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3006",
    "product_title": "Iodised Salt 1kg",
    "product_image": "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000209",
    "mrp": 30,
    "discount_price": 27,
    "discount_percentage": 10,
    "is_add_to_cart": true
  }
];
export const LITE_CAT201_DISPATCH_BELT_ITEMS: any[] = [
  {
    "id": "lite-dispatch-1",
    "badge": "HAATZA LITE",
    "title": "HAATZA Lite Express Delivery Hub",
    "imageUrl": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "subtitle": "Automated packing and rapid 10-minute neighbourhood dispatch",
    "buttonText": "Learn More",
    "redirectUrl": "/lite/delivery-info",
    "redirectType": "CAMPAIGN"
  }
];
export const LITE_CAT201_PROMO_BANNER_ITEMS: any[] = [
  {
    "id": "banner-promo-banner-1",
    "badge": "Offers",
    "title": "Promo Banner",
    "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    "subtitle": "Curated offers for Haatza LITE",
    "buttonText": "Explore",
    "redirectUrl": "/offers",
    "redirectType": "CAMPAIGN"
  }
];
export const LITE_CAT201_OFFER_BANNER_ITEMS: any[] = [
  {
    "id": "banner-offer-banner-1",
    "badge": "Offers",
    "title": "Offer Banner",
    "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    "subtitle": "Curated offers for Haatza LITE",
    "buttonText": "Explore",
    "redirectUrl": "/offers",
    "redirectType": "CAMPAIGN"
  }
];
export const LITE_CAT201_FRUITS_GREENS_ITEMS: any[] = [
  {
    "product_id": "lp-3011",
    "product_title": "Robusta Bananas 6 pcs",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 50,
    "discount_price": 42,
    "discount_percentage": 16,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3012",
    "product_title": "Red Apples 4 pcs",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 120,
    "discount_price": 99,
    "discount_percentage": 18,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3013",
    "product_title": "Hybrid Tomato 500g",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 40,
    "discount_price": 32,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3014",
    "product_title": "Onion 1kg",
    "product_image": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 50,
    "discount_price": 40,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3015",
    "product_title": "Spinach Bunch",
    "product_image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 30,
    "discount_price": 24,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3016",
    "product_title": "Coriander Bunch",
    "product_image": "https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 20,
    "discount_price": 16,
    "discount_percentage": 20,
    "is_add_to_cart": true
  }
];
export const LITE_CAT201_HOUSEHOLD_HYGIENE_ITEMS: any[] = [
  {
    "product_id": "lp-3021",
    "product_title": "Dishwash Liquid 500ml",
    "product_image": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000205",
    "mrp": 110,
    "discount_price": 95,
    "discount_percentage": 14,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3022",
    "product_title": "Floor Cleaner 1L",
    "product_image": "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000205",
    "mrp": 220,
    "discount_price": 189,
    "discount_percentage": 14,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3023",
    "product_title": "Laundry Detergent Powder 1kg",
    "product_image": "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000205",
    "mrp": 140,
    "discount_price": 120,
    "discount_percentage": 14,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3024",
    "product_title": "Toilet Cleaner 500ml",
    "product_image": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000205",
    "mrp": 95,
    "discount_price": 80,
    "discount_percentage": 16,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3025",
    "product_title": "Hand Wash Refill 750ml",
    "product_image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000205",
    "mrp": 130,
    "discount_price": 110,
    "discount_percentage": 15,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-3026",
    "product_title": "Scrub Pad 3 pcs",
    "product_image": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000205",
    "mrp": 60,
    "discount_price": 50,
    "discount_percentage": 17,
    "is_add_to_cart": true
  }
];

// ============================================================================
// 2. CATEGORIES 202 TO 212 - 22 CATEGORY WIDGETS (HERO BANNER & PRODUCTS)
// ============================================================================

export const LITE_FRUITS_AND_VEGETABLES_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://i.pinimg.com/736x/ff/5d/a3/ff5da3ca53789e33510f3c7bf32894a2.jpg",
    "title": "Fresh Fruits",
    "content": "Enjoy fresh and juicy fruits at great prices",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000202",
    "redirect_url": ""
  },
  {
    "banner_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqHk9rUod0s5Tib3eku3maTlqKRbrAf1wggQOemExyJw&s=10",
    "title": "Fresh Vegetables",
    "content": "Shop fresh and healthy vegetables delivered to your doorsteps",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000202",
    "redirect_url": ""
  }
];
export const LITE_FRUITS_AND_VEGETABLES_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "lp-1001",
    "product_title": "Apples",
    "product_image": "https://marketplace.canva.com/Pk_Vc/MAFsWnPk_Vc/1/tl/canva-red-apple-fruit-MAFsWnPk_Vc.png",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 60,
    "discount_price": 49,
    "discount_percentage": 18,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1002",
    "product_title": "Banana",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 180,
    "discount_price": 150,
    "discount_percentage": 17,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1003",
    "product_title": "Oranges",
    "product_image": "https://media.gettyimages.com/id/185284489/photo/orange.jpg?s=612x612&w=gi&k=20&c=HZYbLyTgUgxD1WE-O-ltBo_Lui6pX6rQLHQJdYdyl_g=",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 100,
    "discount_price": 90,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1004",
    "product_title": "Grapes",
    "product_image": "https://www.dole.com/sites/default/files/styles/1024w768h-80/public/media/2025-01/grapes.png?itok=YugivX6G-5BSFx78-",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 80,
    "discount_price": 50,
    "discount_percentage": 38,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1005",
    "product_title": "Pomegranate",
    "product_image": "https://images.ctfassets.net/2fp0gqefx40t/6thedjyTTErzkwTQ75DEVS/c667f3fe9af032cb7301ad495aa34019/ANPomegranateHeader.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 200,
    "discount_price": 170,
    "discount_percentage": 15,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1006",
    "product_title": "Papaya",
    "product_image": "https://tropicalexotics.in/cdn/shop/files/rn-image_picker_lib_temp_68579d65-b3ea-49c0-bab8-d5c6383f8362_2048x.png?v=1774677272",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 80,
    "discount_price": 64,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1007",
    "product_title": "Watermelon",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLxJfIpTaHtDij3fP-keZgf0mjdHg0_5A2DaQcBiFlcsvjL_Ebd-RfuE4&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 50,
    "discount_price": 40,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1008",
    "product_title": "Guava",
    "product_image": "https://www.bbassets.com/media/uploads/p/l/40083741_3-fresho-guava-pink.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 90,
    "discount_price": 72,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1009",
    "product_title": "Pineapple",
    "product_image": "https://www.bbassets.com/media/uploads/p/l/10000156_31-fresho-pineapple.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 70,
    "discount_price": 56,
    "discount_percentage": 20,
    "is_add_to_cart": false
  },
  {
    "product_id": "lp-1010",
    "product_title": "Mango",
    "product_image": "https://blog.bigbasket.com/wp-content/uploads/2026/04/Gemini_Generated_Image_1p7kwo1p7kwo1p7k.png",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 150,
    "discount_price": 120,
    "discount_percentage": 20,
    "is_add_to_cart": false
  },
  {
    "product_id": "lp-1011",
    "product_title": "Tomato",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 40,
    "discount_price": 32,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1012",
    "product_title": "Potatoes",
    "product_image": "https://images.ctfassets.net/0dkgxhks0leg/RKiZ605RAV8kjDQnxFCWP/b03b8729817c90b29b88d536bfd37ac5/9-Unusual-Uses-For-Potatoes.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 35,
    "discount_price": 28,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1013",
    "product_title": "Onions",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYOmJ_fRqnB-L4vNFBIRRSQG4Xbw_zEqn4-Sjn2KryzQ&s",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 45,
    "discount_price": 36,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1014",
    "product_title": "Carrot",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfFWZlC9wHFT2LNbjIgEwW8ynaWjqQGo4nV7qAknS8Ow&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 60,
    "discount_price": 48,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1015",
    "product_title": "Cucumber",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-HExDQCDsrpfDyLJGFwwCaLng8qdeIUQlfIxYlDZ4eg&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 40,
    "discount_price": 30,
    "discount_percentage": 25,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1016",
    "product_title": "Green Beans",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-BdrvWbY26ExzQ3jCY4ibtGSeTvi-bawIGJZO9_dMkw&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 80,
    "discount_price": 64,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1017",
    "product_title": "Capsicum",
    "product_image": "https://www.bbassets.com/media/uploads/p/l/10000067_27-fresho-capsicum-green.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 70,
    "discount_price": 56,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1018",
    "product_title": "Cauliflower",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ34uAdlCjfRTmItMo8B11jK24SWIQ9wkJ0SvovGrj2DA&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 50,
    "discount_price": 40,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1019",
    "product_title": "Broccoli",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX0BQUYRkc1q8T9VOzTEdsMZjeogTOKOc6qxgmiNXdDw&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 120,
    "discount_price": 96,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1020",
    "product_title": "Mint",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZUWcvebcnVKEKhNV6YDBAoIKmi6jlSdaOkQfdwxzgeQ&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 25,
    "discount_price": 20,
    "discount_percentage": 20,
    "is_add_to_cart": false
  },
  {
    "product_id": "lp-1021",
    "product_title": "Spinach",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLTLsGGBA2YLJCEMIiqFYpyGK0HKRjuPYtIkTjN60npA&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 30,
    "discount_price": 24,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1022",
    "product_title": "Coriander",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShsWsDb347z0oGViTG7F9NtgCQaakaq7x01IQ2iyGJHA&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 20,
    "discount_price": 16,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1023",
    "product_title": "Green chillies",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSMS13N_z6F143F1Ph5133iSDHLvZ5rAMGnqTYwLJbew&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 50,
    "discount_price": 40,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1024",
    "product_title": "Beetroot",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Ii3Ni04_MweHiZ1PPa5U4DgSAbyKJ8ydguUz1ynKdQ&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 45,
    "discount_price": 36,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1025",
    "product_title": "Radish",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyN0soxecoPvbBbjGnpzuyFA7BPC5u-JYRa8g2cH_X2A&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 35,
    "discount_price": 28,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1026",
    "product_title": "Lemon",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjv3wH66wuZAreBqsZasIwbaibPHh8IsuL992gB_YR1g&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 60,
    "discount_price": 48,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1027",
    "product_title": "Sweet corn",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWC-4yBzGWSmnOqYVy2LDXVFpqzvd6-zBIfRnhAMR7tw&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 50,
    "discount_price": 40,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1028",
    "product_title": "Drumstick",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGeqbSPx0YofWhyCal4MxEV4iqGC6PfCrh-WbVz3zL4A&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 70,
    "discount_price": 56,
    "discount_percentage": 20,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-1029",
    "product_title": "Bottle Gourd",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-TuIM2KZlS0lCXeoV-9JIuB4Gqsmry7YEcGPXeKIpsA&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 40,
    "discount_price": 32,
    "discount_percentage": 20,
    "is_add_to_cart": false
  },
  {
    "product_id": "lp-1030",
    "product_title": "Cabbage",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-TuIM2KZlS0lCXeoV-9JIuB4Gqsmry7YEcGPXeKIpsA&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000202",
    "mrp": 35,
    "discount_price": 28,
    "discount_percentage": 20,
    "is_add_to_cart": true
  }
];

export const LITE_DAILY_AND_BREAKFAST_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://i.pinimg.com/736x/74/07/fa/7407faebaf32aa8c177be37cde62a142.jpg",
    "title": "Start Your Day with Fresh Breakfast",
    "content": "Shop your favourite breakfast essentials in one place",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000203",
    "redirect_url": ""
  },
  {
    "banner_image": "https://brownliving.in/cdn/shop/articles/daily-essentials-for-plastic-free-living-658203.jpg?v=1748069880",
    "title": "Everyday Dairy Essentials",
    "content": "Fresh milk, curd, butter and more for your daily needs",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000203",
    "redirect_url": ""
  }
];
export const LITE_DAILY_AND_BREAKFAST_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "lp-2001",
    "product_title": "Fresh Milk 500ml",
    "product_image": "https://rethinkrural.raydientrural.com/hubfs/Blog_Photos/Rural_Life/Food/Uses_for_milk_lead.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 60,
    "discount_price": 55,
    "discount_percentage": 8,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2002",
    "product_title": "Toned Milk 500ml",
    "product_image": "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=1080/da/cms-assets/cms/product/a538dae1-f4a3-49c9-aaf0-586b2855f825.png?bg_token=color.background.quaternary",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 50,
    "discount_price": 45,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2003",
    "product_title": "Full Cream Milk 500ml",
    "product_image": "https://m.media-amazon.com/images/I/61xRQ6AmscL._AC_UF894,1000_QL80_.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 35,
    "discount_price": 32,
    "discount_percentage": 9,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2004",
    "product_title": "Curd 500g",
    "product_image": "https://www.vegrecipesofindia.com/wp-content/uploads/2012/05/how-to-make-curd-recipe-1.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 45,
    "discount_price": 40,
    "discount_percentage": 11,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2005",
    "product_title": "ButterMilk 500ml",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Buttermilk.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 25,
    "discount_price": 22,
    "discount_percentage": 12,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2006",
    "product_title": "Paneer 200g",
    "product_image": "https://5.imimg.com/data5/ANDROID/Default/2023/3/EH/YT/EO/108385388/product-jpeg-500x500.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 90,
    "discount_price": 80,
    "discount_percentage": 11,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2007",
    "product_title": "Butter 100g",
    "product_image": "https://cdn.britannica.com/27/122027-050-EAA86783/Butter.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 58,
    "discount_price": 52,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2008",
    "product_title": "Cheese Slices 200g",
    "product_image": "https://5.imimg.com/data5/SELLER/Default/2024/11/467060274/TD/IK/XV/8960632/cheese-slice-765g-50-slices.png",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 130,
    "discount_price": 115,
    "discount_percentage": 12,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2009",
    "product_title": "Cheese cubes 200g",
    "product_image": "https://www.starquik.com/cdn/shop/files/SQ101686_5_25022e6d-2964-4db2-a007-0c2368f2c1ab.jpg?v=1776845422&width=416",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 125,
    "discount_price": 110,
    "discount_percentage": 12,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2010",
    "product_title": "Ghee 200ml",
    "product_image": "https://www.cookwithkushi.com/wp-content/uploads/2022/10/best_homemade_traditional_desi_ghee.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 150,
    "discount_price": 135,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2011",
    "product_title": "White Bread",
    "product_image": "https://www.allrecipes.com/thmb/3Bhpg3W6sjCn0VTQ_yXLUyHr-3k=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/6788-amish-white-bread-DDMFS-4x3-6faa1e552bdb4f6eabdd7791e59b3c84.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 40,
    "discount_price": 35,
    "discount_percentage": 13,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2012",
    "product_title": "Brown Bread",
    "product_image": "https://sallysbakingaddiction.com/wp-content/uploads/2024/01/whole-wheat-sandwich-bread-2.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 50,
    "discount_price": 45,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2013",
    "product_title": "Whole Wheat Bread",
    "product_image": "https://www.allrecipes.com/thmb/_Mgp9ObZqGUJAnsdsvoCHq_yoUc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/272420-easy-100-whole-wheat-bread-VAT-Beauty-4x3-d2b2488a1ce04a4eaac67658cfc99e45.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 55,
    "discount_price": 49,
    "discount_percentage": 11,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2014",
    "product_title": "Pav(6 pcs)",
    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVxtfQFwh-y2M56K8bZSMhIA9BOrmb7mRxcEnrDQMhAjkyZaQKpk5w5Wu6&s=10",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 30,
    "discount_price": 27,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2015",
    "product_title": "Buns",
    "product_image": "https://www.thereciperebel.com/wp-content/uploads/2020/04/moms-homemade-buns-www.thereciperebel.com-600-12-of-22.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 35,
    "discount_price": 30,
    "discount_percentage": 14,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2016",
    "product_title": "Eggs(6pcs)",
    "product_image": "https://images-prod.healthline.com/hlcmsresource/images/AN_images/health-benefits-of-eggs-1296x728-feature.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 48,
    "discount_price": 43,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2017",
    "product_title": "Oats 500g",
    "product_image": "https://chandanbrothers.com/wp-content/uploads/2024/05/Rolled-oats-min.jpeg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 120,
    "discount_price": 105,
    "discount_percentage": 13,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2018",
    "product_title": "Cornflakes 250g",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Cornflakes.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 95,
    "discount_price": 85,
    "discount_percentage": 11,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2019",
    "product_title": "Muesli 500g",
    "product_image": "https://tastesbetterfromscratch.com/wp-content/uploads/2025/01/Muesli25-1.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 220,
    "discount_price": 199,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2020",
    "product_title": "Chocos 250g",
    "product_image": "https://www.omnisun.in/wp-content/uploads/2021/09/Choco-Flakes.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 110,
    "discount_price": 99,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2021",
    "product_title": "Peanut Butter 340g",
    "product_image": "https://www.occasionallyeggs.com/wp-content/uploads/2022/09/Homemade-Peanut-Butter.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 180,
    "discount_price": 160,
    "discount_percentage": 11,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2022",
    "product_title": "Jam 200g",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Mix_Fruit_Jam.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 85,
    "discount_price": 75,
    "discount_percentage": 12,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2023",
    "product_title": "Honey 250g",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/2/24/Organic_Honey.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 160,
    "discount_price": 144,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2024",
    "product_title": "Tea Powder 250g",
    "product_image": "https://www.greendna.in/cdn/shop/products/assam-ctc-tea-500x500_500x.jpg?v=1591199209",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 120,
    "discount_price": 108,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2025",
    "product_title": "Coffee Powder 100g",
    "product_image": "https://hindustanspices.in/storage/products/IId7cywyKVHOK9ln3nIWn01yDLgtjTfUGHZaF5V2.png",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 95,
    "discount_price": 85,
    "discount_percentage": 11,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2026",
    "product_title": "Green Tea (25 bags)",
    "product_image": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Teabag_with_green_tag.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 150,
    "discount_price": 135,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2027",
    "product_title": "Sugar 1kg",
    "product_image": "https://www.tasteofhome.com/wp-content/uploads/2019/11/sugar-shutterstock_615908132.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 50,
    "discount_price": 45,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2028",
    "product_title": "Jaggery 500g",
    "product_image": "https://www.health.com/thmb/sjw6tl9BsMoU490NoiI_Wk7ljYc=/2121x0/filters:no_upscale():max_bytes(150000):strip_icc()/Health-GettyImages-2185398044-78d583abd4cc492aaef1c55a3a403a5f.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 60,
    "discount_price": 54,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2029",
    "product_title": "Idli Batter 1kg",
    "product_image": "https://spicecravings.com/wp-content/uploads/2020/06/Idli-Dosa-Batter-2.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 60,
    "discount_price": 54,
    "discount_percentage": 10,
    "is_add_to_cart": true
  },
  {
    "product_id": "lp-2030",
    "product_title": "Dosa Batter 1kg",
    "product_image": "https://sandhyahariharan.co.uk/wp-content/uploads/2020/07/idli-dosa-batter-5-of-13.jpg",
    "category_id": "c4000000-0000-4000-8000-000000000203",
    "mrp": 65,
    "discount_price": 58,
    "discount_percentage": 11,
    "is_add_to_cart": true
  }
];

export const LITE_SNACKS_AND_BEVERAGES_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80",
    "title": "Chai Time Treats & Cold Drinks",
    "content": "Crunchy namkeen, artisan biscuits & ice-cold sodas in 10 minutes",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000204",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80",
    "title": "Gourmet Roasted Nuts & Healthy Bars",
    "content": "Guilt-free snacking with roasted almonds, trail mix and dark chocolates",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000204",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_SNACKS_AND_BEVERAGES_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0005",
    "product_title": "Haldiram's Nagpur Spicy Crispy Aloo Bhujia Namkeen (400g Pouch)",
    "product_image": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000204",
    "mrp": 120,
    "discount_price": 99,
    "discount_percentage": 18,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0006",
    "product_title": "Tata Tea Gold Premium Assam & Long Leaves Rich Aroma (500g Pack)",
    "product_image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000204",
    "mrp": 350,
    "discount_price": 295,
    "discount_percentage": 16,
    "is_add_to_cart": true
  }
];

export const LITE_HOUSEHOLD_CLEANING_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
    "title": "Sparkling Clean Home & Kitchen",
    "content": "Top-rated dishwash gels, floor cleaners, detergents & garbage bags",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000205",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80",
    "title": "Disinfection & Hygiene Super Savers",
    "content": "Keep your home 99.9% germ-free with trusted hygiene essentials",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000205",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_HOUSEHOLD_CLEANING_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0007",
    "product_title": "Vim Lemon Dishwash Liquid Gel with Tough Grease Removal (750ml Bottle)",
    "product_image": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000205",
    "mrp": 199,
    "discount_price": 169,
    "discount_percentage": 15,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0008",
    "product_title": "Lizol Disinfectant Surface & Floor Cleaner Citrus Fragrance (1 Litre)",
    "product_image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000205",
    "mrp": 235,
    "discount_price": 199,
    "discount_percentage": 15,
    "is_add_to_cart": true
  }
];

export const LITE_PERSONAL_CARE_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    "title": "Daily Bath & Glow Essentials",
    "content": "Luxurious body soaps, refreshing washes & gentle deodorants",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000206",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    "title": "Hair Care & Oral Hygiene Must-Haves",
    "content": "Dermatologist-tested shampoos, conditioners and dental care",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000206",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_PERSONAL_CARE_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0009",
    "product_title": "Dettol Original Germ Protection Bathing Soap (125g x 4 Value Pack)",
    "product_image": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000206",
    "mrp": 240,
    "discount_price": 199,
    "discount_percentage": 17,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0010",
    "product_title": "Dove Intense Repair Deep Nourishing Shampoo with Keratin (650ml)",
    "product_image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000206",
    "mrp": 650,
    "discount_price": 499,
    "discount_percentage": 23,
    "is_add_to_cart": true
  }
];

export const LITE_KITCHEN_ESSENTIALS_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    "title": "Non-Stick Cookware & Smart Prep Tools",
    "content": "Durable frying pans, kadhais, pressure cookers & chef knives",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000207",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80",
    "title": "Airtight Glass & Stainless Steel Storage",
    "content": "Organise your pantry with leakproof containers and spice jars",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000207",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_KITCHEN_ESSENTIALS_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0011",
    "product_title": "Prestige Omega Deluxe Granite Induction Base Omni Tawa (280mm)",
    "product_image": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000207",
    "mrp": 1250,
    "discount_price": 899,
    "discount_percentage": 28,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0012",
    "product_title": "Cello Checkers Airtight Food-Grade Plastic Storage Container Set (6 Pcs)",
    "product_image": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000207",
    "mrp": 450,
    "discount_price": 329,
    "discount_percentage": 27,
    "is_add_to_cart": true
  }
];

export const LITE_BAKERY_AND_BREADS_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    "title": "Artisan Sourdough & Freshly Baked Loaves",
    "content": "Oven-fresh whole wheat breads, burger buns, pav & garlic toasts",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000208",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    "title": "Sweet Bakes, Muffins & Butter Cookies",
    "content": "Indulgent tea-time cakes, croissants and bakery biscuits",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000208",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_BAKERY_AND_BREADS_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0013",
    "product_title": "Britannia 100% Whole Wheat Fresh Sliced Bread (400g Loaf)",
    "product_image": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000208",
    "mrp": 55,
    "discount_price": 50,
    "discount_percentage": 9,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0014",
    "product_title": "The Baker's Dozen Soft Eggless Butter Croissant (Pack of 2)",
    "product_image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000208",
    "mrp": 149,
    "discount_price": 125,
    "discount_percentage": 16,
    "is_add_to_cart": true
  }
];

export const LITE_STAPLES_AND_COOKING_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    "title": "Premium Sharbati Atta, Basmati Rice & Dals",
    "content": "Direct from selected mandis, unpolished pulses and pure whole grains",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000209",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    "title": "Cold Pressed Mustard, Sunflower Oils & Cow Ghee",
    "content": "Purity guaranteed with filtered cooking oils, spices and pink salt",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000209",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_STAPLES_AND_COOKING_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0015",
    "product_title": "Aashirvaad Superior MP Sharbati Whole Wheat Atta (5kg Bag)",
    "product_image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000209",
    "mrp": 310,
    "discount_price": 275,
    "discount_percentage": 11,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0016",
    "product_title": "Fortune Sunlite Refined Sunflower Cooking Oil (1 Litre Pouch)",
    "product_image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000209",
    "mrp": 165,
    "discount_price": 139,
    "discount_percentage": 16,
    "is_add_to_cart": true
  }
];

export const LITE_FROZEN_FOODS_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80",
    "title": "Crispy Evening Finger Foods Ready in 5 Mins",
    "content": "French fries, cheese nuggets, aloo tikki & veg burgers in instant freeze pack",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000210",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "title": "Farm Frozen Green Peas & Sweet Corn",
    "content": "Preserved nutrients with rapid cryogenic freezing technology",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000210",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_FROZEN_FOODS_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0017",
    "product_title": "McCain Crispy Masala French Fries Frozen Snack (420g Pack)",
    "product_image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000210",
    "mrp": 145,
    "discount_price": 119,
    "discount_percentage": 18,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0018",
    "product_title": "Safal Frozen Tender Sweet Green Peas (1kg Family Pack)",
    "product_image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000210",
    "mrp": 180,
    "discount_price": 145,
    "discount_percentage": 19,
    "is_add_to_cart": true
  }
];

export const LITE_BABY_CARE_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
    "title": "Ultra-Soft Anti-Rash Diapers & Wet Wipes",
    "content": "Keep your little one smiling all day with dermatologist-approved gentle diapers",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000211",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
    "title": "Pure Tear-Free Baby Bath & Nourishing Oils",
    "content": "Hypoallergenic baby lotions, massage oils and organic baby cereal",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000211",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_BABY_CARE_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0019",
    "product_title": "Pampers All Round Protection Baby Diaper Pants (Size M, 54 Count)",
    "product_image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000211",
    "mrp": 1199,
    "discount_price": 899,
    "discount_percentage": 25,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0020",
    "product_title": "Johnson's Baby Tear-Free Gentle Top-to-Toe Bath Wash (500ml)",
    "product_image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000211",
    "mrp": 425,
    "discount_price": 349,
    "discount_percentage": 18,
    "is_add_to_cart": true
  }
];

export const LITE_PET_SUPPLIES_BANNER_ITEMS: any[] = [
  {
    "banner_image": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    "title": "Healthy Dog Nutrition, Wet Gravy & Biscuits",
    "content": "Tail-wagging goodness with real meat dog kibbles & chew treats",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000212",
    "redirect_url": "/lite/category/${c.catId}"
  },
  {
    "banner_image": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
    "title": "Cat Food, Scratchers & Odour-Free Litter",
    "content": "Purr-fect seafood recipes and premium clumping bentonite cat litter",
    "redirect_category_id": "c4000000-0000-4000-8000-000000000212",
    "redirect_url": "/lite/category/${c.catId}"
  }
];
export const LITE_PET_SUPPLIES_PRODUCT_ITEMS: any[] = [
  {
    "product_id": "l-0021",
    "product_title": "Pedigree Adult Complete Nutrition Dry Dog Food Meat & Rice (3kg Bag)",
    "product_image": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000212",
    "mrp": 1150,
    "discount_price": 975,
    "discount_percentage": 15,
    "is_add_to_cart": true
  },
  {
    "product_id": "l-0022",
    "product_title": "Whiskas Adult Cat Food Ocean Fish Flavour with Real Fish (1.2kg Pack)",
    "product_image": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    "category_id": "c4000000-0000-4000-8000-000000000212",
    "mrp": 450,
    "discount_price": 385,
    "discount_percentage": 14,
    "is_add_to_cart": true
  }
];

// ============================================================================
// 3. MASTER 29-WIDGET BLOCK TEMPLATE (USED ACROSS ALL 5 WAREHOUSES & 2 PLACEMENTS)
// ============================================================================

export interface LiteWidgetTemplate {
  offset: number;
  sequence: number;
  widgetName: string;
  categoryId: string;
  items: any[];
}

export const LITE_29_WIDGET_TEMPLATE: LiteWidgetTemplate[] = [
  { offset: 0, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_HERO_BANNER_ITEMS },
  { offset: 1, sequence: 2, widgetName: 'Everyday Essentials', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_EVERYDAY_ESSENTIALS_ITEMS },
  { offset: 2, sequence: 3, widgetName: 'Live Automated Dispatch Belt', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_DISPATCH_BELT_ITEMS },
  { offset: 3, sequence: 4, widgetName: 'Promo Banner', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_PROMO_BANNER_ITEMS },
  { offset: 4, sequence: 5, widgetName: 'Offer Banner', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_OFFER_BANNER_ITEMS },
  { offset: 5, sequence: 6, widgetName: 'Fresh Fruits and Daily Greens', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_FRUITS_GREENS_ITEMS },
  { offset: 6, sequence: 7, widgetName: 'Household Cleaning and Hygiene', categoryId: LITE_ALL_CATEGORY_ID, items: LITE_CAT201_HOUSEHOLD_HYGIENE_ITEMS },
  { offset: 7, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_FRUITS_AND_VEGETABLES_CATEGORY_ID, items: LITE_FRUITS_AND_VEGETABLES_BANNER_ITEMS },
  { offset: 8, sequence: 2, widgetName: 'Category Products', categoryId: LITE_FRUITS_AND_VEGETABLES_CATEGORY_ID, items: LITE_FRUITS_AND_VEGETABLES_PRODUCT_ITEMS },
  { offset: 9, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_DAILY_AND_BREAKFAST_CATEGORY_ID, items: LITE_DAILY_AND_BREAKFAST_BANNER_ITEMS },
  { offset: 10, sequence: 2, widgetName: 'Category Products', categoryId: LITE_DAILY_AND_BREAKFAST_CATEGORY_ID, items: LITE_DAILY_AND_BREAKFAST_PRODUCT_ITEMS },
  { offset: 11, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_SNACKS_AND_BEVERAGES_CATEGORY_ID, items: LITE_SNACKS_AND_BEVERAGES_BANNER_ITEMS },
  { offset: 12, sequence: 2, widgetName: 'Category Products', categoryId: LITE_SNACKS_AND_BEVERAGES_CATEGORY_ID, items: LITE_SNACKS_AND_BEVERAGES_PRODUCT_ITEMS },
  { offset: 13, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_HOUSEHOLD_CLEANING_CATEGORY_ID, items: LITE_HOUSEHOLD_CLEANING_BANNER_ITEMS },
  { offset: 14, sequence: 2, widgetName: 'Category Products', categoryId: LITE_HOUSEHOLD_CLEANING_CATEGORY_ID, items: LITE_HOUSEHOLD_CLEANING_PRODUCT_ITEMS },
  { offset: 15, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_PERSONAL_CARE_CATEGORY_ID, items: LITE_PERSONAL_CARE_BANNER_ITEMS },
  { offset: 16, sequence: 2, widgetName: 'Category Products', categoryId: LITE_PERSONAL_CARE_CATEGORY_ID, items: LITE_PERSONAL_CARE_PRODUCT_ITEMS },
  { offset: 17, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_KITCHEN_ESSENTIALS_CATEGORY_ID, items: LITE_KITCHEN_ESSENTIALS_BANNER_ITEMS },
  { offset: 18, sequence: 2, widgetName: 'Category Products', categoryId: LITE_KITCHEN_ESSENTIALS_CATEGORY_ID, items: LITE_KITCHEN_ESSENTIALS_PRODUCT_ITEMS },
  { offset: 19, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_BAKERY_AND_BREADS_CATEGORY_ID, items: LITE_BAKERY_AND_BREADS_BANNER_ITEMS },
  { offset: 20, sequence: 2, widgetName: 'Category Products', categoryId: LITE_BAKERY_AND_BREADS_CATEGORY_ID, items: LITE_BAKERY_AND_BREADS_PRODUCT_ITEMS },
  { offset: 21, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_STAPLES_AND_COOKING_CATEGORY_ID, items: LITE_STAPLES_AND_COOKING_BANNER_ITEMS },
  { offset: 22, sequence: 2, widgetName: 'Category Products', categoryId: LITE_STAPLES_AND_COOKING_CATEGORY_ID, items: LITE_STAPLES_AND_COOKING_PRODUCT_ITEMS },
  { offset: 23, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_FROZEN_FOODS_CATEGORY_ID, items: LITE_FROZEN_FOODS_BANNER_ITEMS },
  { offset: 24, sequence: 2, widgetName: 'Category Products', categoryId: LITE_FROZEN_FOODS_CATEGORY_ID, items: LITE_FROZEN_FOODS_PRODUCT_ITEMS },
  { offset: 25, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_BABY_CARE_CATEGORY_ID, items: LITE_BABY_CARE_BANNER_ITEMS },
  { offset: 26, sequence: 2, widgetName: 'Category Products', categoryId: LITE_BABY_CARE_CATEGORY_ID, items: LITE_BABY_CARE_PRODUCT_ITEMS },
  { offset: 27, sequence: 1, widgetName: 'Hero Banner', categoryId: LITE_PET_SUPPLIES_CATEGORY_ID, items: LITE_PET_SUPPLIES_BANNER_ITEMS },
  { offset: 28, sequence: 2, widgetName: 'Category Products', categoryId: LITE_PET_SUPPLIES_CATEGORY_ID, items: LITE_PET_SUPPLIES_PRODUCT_ITEMS },
];

/**
 * Builds the complete dictionary of 290 LITE rows (w0170 to w0459).
 */
export function buildAllLiteRows(): Record<string, { widgetName: string; sequence: number; categoryId: string; warehouseId: string; placement: 'DESKTOP' | 'MOBILE'; items: any[] }> {
  const result: Record<string, any> = {};
  let currentWidgetNum = 170;

  for (const warehouse of LITE_WAREHOUSES) {
    for (const placement of ['DESKTOP', 'MOBILE'] as const) {
      for (const t of LITE_29_WIDGET_TEMPLATE) {
        const widgetId = 'w' + String(currentWidgetNum).padStart(4, '0');
        result[widgetId] = {
          widgetName: t.widgetName,
          sequence: t.sequence,
          categoryId: t.categoryId,
          warehouseId: warehouse,
          placement,
          items: t.items,
        };
        currentWidgetNum++;
      }
    }
  }

  return result;
}

export const ALL_LITE_WIDGET_ITEMS: Record<string, any[]> = (() => {
  const all = buildAllLiteRows();
  const dict: Record<string, any[]> = {};
  for (const [wid, row] of Object.entries(all)) {
    dict[wid] = row.items;
  }
  return dict;
})();
