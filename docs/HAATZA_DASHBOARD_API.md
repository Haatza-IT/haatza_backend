# HAATZA & LITE Customer Dashboard API Documentation

**Base URL:**  
`https://haatza-backend.onrender.com`

This document provides technical documentation for the two customer-facing Dashboard `GET` APIs used by the Haatza mobile and web applications to render dynamic homepages.

---

## 1. HAATZA Customer Dashboard API

**Method:** `GET`

**Endpoint:**
```http
GET /api/dashboard?module=HAATZA&categoryId=c4000000-0000-4000-8000-000000000101&territory=AP&placement=DESKTOP
```

**Purpose:** Fetches the customer dashboard layout for HAATZA Shopping, including promotional hero banners, category grids, flash deals, and curated product shelves.

### Query Parameters

| Parameter | Required | Data Type | Default | Description & Validation Behavior |
|---|:---:|---|:---:|---|
| `module` | **Yes** | `string` | — | Dashboard module identifier. Must be strictly `HAATZA` (case-insensitive). Missing, invalid, or legacy values (e.g. `SHOPPING`) reject with HTTP 400 Bad Request. |
| `categoryId` | **Yes** | `string` | — | Category UUID (e.g. `c4000000-0000-4000-8000-000000000101` for All, `c4000000-0000-4000-8000-000000000102` for Men's Fashion, `c4000000-0000-4000-8000-000000000104` for Electronics). Filters layout widgets and items to the requested category. Missing or empty category ID rejects with HTTP 400 Bad Request. |
| `territory` | **Yes** | `string` | — | Exact 2-letter uppercase Indian state code (one of the 28 supported Indian states: `AP, AR, AS, BR, CG, GA, GJ, HR, HP, JH, KA, KL, MP, MH, MN, ML, MZ, NL, OD, PB, RJ, SK, TN, TS, TR, UP, UK, WB`). Missing, numeric PIN codes (e.g. `56`, `560001`), lowercase (`ap`), `ALL`, or non-state strings reject with HTTP 400 Bad Request. |
| `placement` | **Yes** | `string` | — | Layout placement filter. Must be strictly `DESKTOP` or `MOBILE` (case-sensitive uppercase). Missing or invalid values reject with HTTP 400 Bad Request. |

### Approved 18 HAATZA Categories

| No | Category Name | Category UUID (`categoryId`) | Type & Layout |
|:---:|---|---|---|
| 1 | **All** | `c4000000-0000-4000-8000-000000000101` | Home/Landing All page (16 widgets, sequence 1..16) |
| 2 | **Men's Fashion** | `c4000000-0000-4000-8000-000000000102` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 3 | **Women's Fashion** | `c4000000-0000-4000-8000-000000000103` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 4 | **Electronics** | `c4000000-0000-4000-8000-000000000104` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 5 | **Home and Living** | `c4000000-0000-4000-8000-000000000105` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 6 | **Beauty** | `c4000000-0000-4000-8000-000000000106` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 7 | **Appliances** | `c4000000-0000-4000-8000-000000000107` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 8 | **Toys and Games** | `c4000000-0000-4000-8000-000000000108` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 9 | **Sports and Fitness** | `c4000000-0000-4000-8000-000000000109` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 10 | **Books** | `c4000000-0000-4000-8000-000000000110` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 11 | **Furniture** | `c4000000-0000-4000-8000-000000000111` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 12 | **Groceries** | `c4000000-0000-4000-8000-000000000112` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 13 | **Automotive** | `c4000000-0000-4000-8000-000000000113` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 14 | **Mobiles** | `c4000000-0000-4000-8000-000000000114` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 15 | **Baby Care** | `c4000000-0000-4000-8000-000000000115` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 16 | **Pet Supplies** | `c4000000-0000-4000-8000-000000000116` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 17 | **Jewelry** | `c4000000-0000-4000-8000-000000000117` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |
| 18 | **Gift Card** | `c4000000-0000-4000-8000-000000000118` | Department category (9 widgets, sequence 1,3,4,5,6,9,10,15,16) |

**Configured Widgets:** Configured widgets `W001` through `W016` (sequence 1–16). All 16 layout containers are preserved; product shelves without matching category products return `items: []` rather than disappearing from the sequence.

> **Note:** Some items arrays in the documentation examples below are shortened for readability. The actual API response contains all applicable items, and `total_items` represents the actual number of items returned in the array.

### Complete HAATZA Success Response Example (`200 OK`)

```json
{
  "success": true,
  "module": "HAATZA",
  "categoryId": "c4000000-0000-4000-8000-000000000101",
  "territory": "AP",
  "count": 16,
  "widgets": [
    {
      "widget_id": "w0001",
      "widget_name": "Hero Banner",
      "sequence": 1,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "banner_image": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=600&q=80",
          "title": "Festive Autumn Men's Collection",
          "content": "Kurtas, Nehru Jackets & Casual Shirts at up to 60% off",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000102",
          "redirect_url": ""
        },
        {
          "banner_image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
          "title": "Flagship 5G Smartphones Carnival",
          "content": "Exchange bonus up to ₹5,000 on OnePlus, Samsung & Apple",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000114",
          "redirect_url": ""
        },
        {
          "banner_image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
          "title": "Premium Audio & Electronics Fest",
          "content": "Studio Headphones, Laptops & Smart Wearables from ₹999",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000104",
          "redirect_url": ""
        }
      ]
    },
    {
      "widget_id": "w0002",
      "widget_name": "Offers Banner",
      "sequence": 2,
      "widget_redirect_to": "OFFERS",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "banner_image": "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80",
          "title": "Flat 50% Cashback on First Order via PhonePe",
          "content": "Use code PHONEPE50 on payments above ₹499 (T&C Apply)",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000101",
          "redirect_url": ""
        },
        {
          "banner_image": "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=600&q=80",
          "title": "10% Instant Bank Discount with Credit Cards",
          "content": "Instant ₹1,500 savings on HDFC, SBI & ICICI Cards",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000101",
          "redirect_url": ""
        },
        {
          "banner_image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80",
          "title": "Mega Festive Dhamaka Sale is Live",
          "content": "Up to 75% Off across Electronics, Fashion & Home",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000101",
          "redirect_url": ""
        }
      ]
    },
    {
      "widget_id": "w0003",
      "widget_name": "Top Categories",
      "sequence": 3,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "category_name": "Men's Fashion",
          "category_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000102"
        },
        {
          "category_name": "Women's Fashion",
          "category_image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000103"
        },
        {
          "category_name": "Electronics",
          "category_image": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104"
        },
        {
          "category_name": "Home & Living",
          "category_image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000105"
        },
        {
          "category_name": "Beauty & Care",
          "category_image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000106"
        },
        {
          "category_name": "Appliances",
          "category_image": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000107"
        },
        {
          "category_name": "Toys & Games",
          "category_image": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000108"
        },
        {
          "category_name": "Sports & Fitness",
          "category_image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000109"
        }
      ]
    },
    {
      "widget_id": "w0004",
      "widget_name": "Suggested for You",
      "sequence": 4,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "product_id": "p-0001",
          "product_title": "boAt Airdopes 141 Bluetooth Truly Wireless Earbuds (42H Playtime, Low Latency Mode)",
          "product_image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104",
          "mrp": 2990,
          "discount_price": 1299,
          "discount_percentage": 57,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0002",
          "product_title": "Milton Thermosteel Flip Lid Insulated Water Flask 1000ml (Silver)",
          "product_image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000105",
          "mrp": 1199,
          "discount_price": 899,
          "discount_percentage": 25,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0003",
          "product_title": "Men's Slim Fit Stretch Cotton Chino Trousers (Olive Green)",
          "product_image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000102",
          "mrp": 1999,
          "discount_price": 1299,
          "discount_percentage": 35,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0004",
          "product_title": "Plum Green Tea Oil-Free Daily Face Moisturizer for Acne Prone Skin 50ml",
          "product_image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000106",
          "mrp": 570,
          "discount_price": 456,
          "discount_percentage": 20,
          "is_add_to_cart": false
        },
        {
          "product_id": "p-0005",
          "product_title": "Prestige Iris 750 Watt Mixer Grinder with 3 Stainless Steel Jars",
          "product_image": "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000107",
          "mrp": 3499,
          "discount_price": 2899,
          "discount_percentage": 17,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0006",
          "product_title": "Cosco Rubber Basketball Official Size 7 Match Ball",
          "product_image": "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000109",
          "mrp": 799,
          "discount_price": 799,
          "discount_percentage": 0,
          "is_add_to_cart": true
        }
      ]
    },
    {
      "widget_id": "w0005",
      "widget_name": "Promo Banners",
      "sequence": 5,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "banner_image": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80",
          "title": "Smart Living Gadgets for Modern Homes",
          "content": "Upgrade your lifestyle with IoT devices & smart plugs from ₹499",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000105",
          "redirect_url": ""
        },
        {
          "banner_image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
          "title": "Luxury Fragrances & Skincare Festival",
          "content": "Top international fragrance brands at up to 45% off",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000106",
          "redirect_url": ""
        },
        {
          "banner_image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
          "title": "Fitness Revolution & Home Workout Essentials",
          "content": "Treadmills, Dumbbells & Activewear at best prices",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000109",
          "redirect_url": ""
        }
      ]
    },
    {
      "widget_id": "w0006",
      "widget_name": "Liked by You",
      "sequence": 6,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "product_id": "p-0007",
          "product_title": "Noise ColorFit Pulse 2 Max 1.85\" Display Bluetooth Calling Smart Watch",
          "product_image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104",
          "mrp": 4999,
          "discount_price": 1499,
          "discount_percentage": 70,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0008",
          "product_title": "Women's Floral Print Cotton Anarkali Kurta with Dupatta Set",
          "product_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000103",
          "mrp": 2499,
          "discount_price": 999,
          "discount_percentage": 60,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0009",
          "product_title": "Philips Cordless Beard Trimmer Series 1000 with USB Charging",
          "product_image": "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000106",
          "mrp": 1495,
          "discount_price": 1195,
          "discount_percentage": 20,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0010",
          "product_title": "Solimo Ceramic Stoneware Coffee Mug Set of 6 (Multicolor, 330ml)",
          "product_image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000105",
          "mrp": 899,
          "discount_price": 649,
          "discount_percentage": 28,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0011",
          "product_title": "Puma Unisex-Adult Smash V2 Leather Casual Sneakers",
          "product_image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000102",
          "mrp": 3999,
          "discount_price": 2199,
          "discount_percentage": 45,
          "is_add_to_cart": false
        },
        {
          "product_id": "p-0012",
          "product_title": "Cadbury Celebrations Rich Assorted Chocolate Gift Box 340g",
          "product_image": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000112",
          "mrp": 350,
          "discount_price": 315,
          "discount_percentage": 10,
          "is_add_to_cart": true
        }
      ]
    },
    {
      "widget_id": "w0007",
      "widget_name": "Recently Viewed by You",
      "sequence": 7,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "product_id": "p-0013",
          "product_title": "Apple iPhone 15 (128 GB) - Midnight Black",
          "product_image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000114",
          "mrp": 79900,
          "discount_price": 69999,
          "discount_percentage": 12,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0014",
          "product_title": "Sony WH-1000XM4 Industry Leading Wireless Noise Canceling Headphones",
          "product_image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104",
          "mrp": 29990,
          "discount_price": 22990,
          "discount_percentage": 23,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0015",
          "product_title": "Fastrack Limitless FS1 Pro Smartwatch with Super AMOLED Display",
          "product_image": "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104",
          "mrp": 3995,
          "discount_price": 1795,
          "discount_percentage": 55,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0016",
          "product_title": "Urban Company Native M1 Smart Water Purifier (10-Stage RO+UV)",
          "product_image": "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000107",
          "mrp": 17499,
          "discount_price": 13999,
          "discount_percentage": 20,
          "is_add_to_cart": false
        },
        {
          "product_id": "p-0017",
          "product_title": "Atomic Habits: An Easy & Proven Way to Build Good Habits by James Clear",
          "product_image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000110",
          "mrp": 799,
          "discount_price": 499,
          "discount_percentage": 38,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0018",
          "product_title": "Wildcraft Casual 35L Water Resistant Travel Laptop Backpack",
          "product_image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000102",
          "mrp": 2199,
          "discount_price": 1499,
          "discount_percentage": 32,
          "is_add_to_cart": true
        }
      ]
    },
    {
      "widget_id": "w0008",
      "widget_name": "Banner for ₹49 Store, Trending Fashion, Bestseller Favorites, and Big Deals",
      "sequence": 8,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "banner_image": "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=600&q=80",
          "title": "The ₹49 Store - Unbeatable Value Under ₹49",
          "content": "Stationery, personal grooming & daily kitchen essentials at ₹49",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000101",
          "redirect_url": ""
        },
        {
          "banner_image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
          "title": "Trending Fashion Runway - Fresh Styles",
          "content": "Discover the hottest apparel, ethnic kurtis & footwear of the season",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000102",
          "redirect_url": ""
        },
        {
          "banner_image": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
          "title": "Customer Bestseller Favorites - Highest Rated",
          "content": "Shop verified 4.5+ star rated products chosen by millions",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000101",
          "redirect_url": ""
        },
        {
          "banner_image": "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=600&q=80",
          "title": "Big Deal Days - Limited Time Flash Offers",
          "content": "Exclusive lightning discounts on electronics, laptops and appliances",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000104",
          "redirect_url": ""
        }
      ]
    },
    {
      "widget_id": "w0009",
      "widget_name": "Trending Fashion",
      "sequence": 9,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "product_id": "p-0019",
          "product_title": "Levi's Men's 511 Slim Fit Mid Rise Stretch Denim Jeans",
          "product_image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000102",
          "mrp": 3499,
          "discount_price": 2099,
          "discount_percentage": 40,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0020",
          "product_title": "Biba Women's Embroidered Straight Fit Chanderi Kurti",
          "product_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000103",
          "mrp": 1899,
          "discount_price": 1139,
          "discount_percentage": 40,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0021",
          "product_title": "US Polo Assn. Men's Solid Pique Cotton Regular Fit Polo T-Shirt",
          "product_image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000102",
          "mrp": 1999,
          "discount_price": 1399,
          "discount_percentage": 30,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0022",
          "product_title": "Allen Solly Women's Solid Single-Breasted Casual Formal Blazer",
          "product_image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000103",
          "mrp": 3999,
          "discount_price": 2499,
          "discount_percentage": 38,
          "is_add_to_cart": false
        },
        {
          "product_id": "p-0023",
          "product_title": "Peter England Men's Slim Fit Flat-Front Cotton Chinos",
          "product_image": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000102",
          "mrp": 1499,
          "discount_price": 699,
          "discount_percentage": 53,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0024",
          "product_title": "Lavie Women's Betula Medium Structured Top-Handle Satchel Handbag",
          "product_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000103",
          "mrp": 2990,
          "discount_price": 1490,
          "discount_percentage": 50,
          "is_add_to_cart": true
        }
      ]
    },
    {
      "widget_id": "w0010",
      "widget_name": "Deals of the Day",
      "sequence": 10,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "product_id": "p-0025",
          "product_title": "Samsung Galaxy M35 5G (Moonlight Blue, 6GB RAM, 128GB Storage)",
          "product_image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000114",
          "mrp": 24499,
          "discount_price": 19999,
          "discount_percentage": 18,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0026",
          "product_title": "Fire-Boltt Ninja Call Pro Plus 1.83\" HD Bluetooth Calling Smartwatch",
          "product_image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104",
          "mrp": 4999,
          "discount_price": 1099,
          "discount_percentage": 78,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0027",
          "product_title": "Bajaj New Shakti Neo 15L Vertical Storage Water Heater Geyser",
          "product_image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000107",
          "mrp": 8990,
          "discount_price": 5499,
          "discount_percentage": 39,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0028",
          "product_title": "Lifelong PVC Hex Dumbbells Set for Home Workout (5kg x 2)",
          "product_image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000109",
          "mrp": 1499,
          "discount_price": 799,
          "discount_percentage": 47,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0029",
          "product_title": "Cello Opalware Dazzle Tropical Lagoon Dinner Set (18 Pcs)",
          "product_image": "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000105",
          "mrp": 2150,
          "discount_price": 1299,
          "discount_percentage": 40,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0030",
          "product_title": "Bombay Shaving Company Precision 6-Blade Safety Shaving Razor",
          "product_image": "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000106",
          "mrp": 499,
          "discount_price": 499,
          "discount_percentage": 0,
          "is_add_to_cart": false
        }
      ]
    },
    {
      "widget_id": "w0011",
      "widget_name": "₹49 Promotional Banner",
      "sequence": 11,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "banner_image": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
          "title": "Welcome to the ₹49 Budget Bazaar",
          "content": "Incredible products with flat ₹49 price point. No minimum purchase!",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000101",
          "redirect_url": ""
        }
      ]
    },
    {
      "widget_id": "w0012",
      "widget_name": "₹49 Products",
      "sequence": 12,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "product_id": "p-0031",
          "product_title": "Classic Matte Metal Ballpoint Pen with Extra Black Refill",
          "product_image": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000110",
          "mrp": 99,
          "discount_price": 49,
          "discount_percentage": 51,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0032",
          "product_title": "High-Speed Micro USB to USB-A Braided Charging Cable 1m",
          "product_image": "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104",
          "mrp": 149,
          "discount_price": 49,
          "discount_percentage": 67,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0033",
          "product_title": "Organic Aloe Vera Refreshing Wet Wipes Pack of 25 Wipes",
          "product_image": "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000106",
          "mrp": 75,
          "discount_price": 49,
          "discount_percentage": 35,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0034",
          "product_title": "Multipurpose Ergonomic Stainless Steel Kitchen Peeler",
          "product_image": "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000105",
          "mrp": 120,
          "discount_price": 49,
          "discount_percentage": 59,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0035",
          "product_title": "Men's Cotton Rich Ankle Length Casual Socks Pair",
          "product_image": "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000102",
          "mrp": 129,
          "discount_price": 49,
          "discount_percentage": 62,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0036",
          "product_title": "Compact Pocket Memo Notebook Diary Ruled (80 Pages)",
          "product_image": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000110",
          "mrp": 49,
          "discount_price": 49,
          "discount_percentage": 0,
          "is_add_to_cart": true
        }
      ]
    },
    {
      "widget_id": "w0013",
      "widget_name": "Hurry Deals – Ending Soon",
      "sequence": 13,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "product_id": "p-0037",
          "product_title": "JBL Flip 5 Waterproof Portable Bluetooth Speaker (Squad Edition)",
          "product_image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104",
          "mrp": 9999,
          "discount_price": 5999,
          "discount_percentage": 40,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0038",
          "product_title": "Kent Grand Plus RO + UV + UF 9L Water Purifier with TDS Controller",
          "product_image": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000107",
          "mrp": 19500,
          "discount_price": 14499,
          "discount_percentage": 26,
          "is_add_to_cart": false
        },
        {
          "product_id": "p-0039",
          "product_title": "Pigeon by Stovekraft Cruise 1800-Watt Induction Cooktop with LED Display",
          "product_image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000107",
          "mrp": 3195,
          "discount_price": 1699,
          "discount_percentage": 47,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0040",
          "product_title": "Nivia Storm Rubber Moulded Football (Official Size 5)",
          "product_image": "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000109",
          "mrp": 599,
          "discount_price": 399,
          "discount_percentage": 33,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0041",
          "product_title": "Portronics Konnect L 1.2M Fast Charging Lightning Cable for iPhone",
          "product_image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104",
          "mrp": 399,
          "discount_price": 179,
          "discount_percentage": 55,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0042",
          "product_title": "Maybelline New York Colossal Waterproof Mascara (Glam Black, 10ml)",
          "product_image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000106",
          "mrp": 399,
          "discount_price": 299,
          "discount_percentage": 25,
          "is_add_to_cart": true
        }
      ]
    },
    {
      "widget_id": "w0014",
      "widget_name": "Bestseller Favorites",
      "sequence": 14,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "product_id": "p-0043",
          "product_title": "HP 15s 12th Gen Intel Core i3 Thin & Light Laptop (8GB RAM / 512GB SSD)",
          "product_image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104",
          "mrp": 46990,
          "discount_price": 37990,
          "discount_percentage": 19,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0044",
          "product_title": "Wakefit Orthopedic Memory Foam Mattress King Size 78x72x6 Inch",
          "product_image": "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000111",
          "mrp": 18450,
          "discount_price": 12999,
          "discount_percentage": 30,
          "is_add_to_cart": false
        },
        {
          "product_id": "p-0045",
          "product_title": "Philips HD6975/00 25-Litre Digital Oven Toaster Grill (OTG)",
          "product_image": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000107",
          "mrp": 8095,
          "discount_price": 5999,
          "discount_percentage": 26,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0046",
          "product_title": "Safari Pentagon 3 Pc Set Polypropylene Hard Sided Luggage Trolley Bags",
          "product_image": "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000102",
          "mrp": 14999,
          "discount_price": 5999,
          "discount_percentage": 60,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0047",
          "product_title": "Bombay Dyeing 100% Pure Cotton Floral Double Bedsheet with 2 Pillow Covers",
          "product_image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000105",
          "mrp": 1899,
          "discount_price": 999,
          "discount_percentage": 47,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0048",
          "product_title": "The Psychology of Money by Morgan Housel (Timeless Lessons on Wealth)",
          "product_image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000110",
          "mrp": 399,
          "discount_price": 275,
          "discount_percentage": 31,
          "is_add_to_cart": true
        }
      ]
    },
    {
      "widget_id": "w0015",
      "widget_name": "Fresh New Arrivals",
      "sequence": 15,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "product_id": "p-0049",
          "product_title": "realme Narzo 70 Pro 5G (Glass Green, 8GB RAM, 128GB Storage)",
          "product_image": "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000114",
          "mrp": 21999,
          "discount_price": 18999,
          "discount_percentage": 14,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0050",
          "product_title": "boAt Stone 352 Portable Bluetooth Speaker with 10W RMS Stereo Sound",
          "product_image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104",
          "mrp": 3490,
          "discount_price": 1699,
          "discount_percentage": 51,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0051",
          "product_title": "Boldfit Anti-Slip Exercise Yoga Mat with Alignment Lines 6mm",
          "product_image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000109",
          "mrp": 1299,
          "discount_price": 799,
          "discount_percentage": 38,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0052",
          "product_title": "Forest Essentials Ayurvedic Soundarya Radiance Day Cream with SPF 25",
          "product_image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000106",
          "mrp": 3450,
          "discount_price": 2999,
          "discount_percentage": 13,
          "is_add_to_cart": false
        },
        {
          "product_id": "p-0053",
          "product_title": "Wipro Garnet 12W B22 Color Tuning LED Smart Bulb (WiFi + Bluetooth)",
          "product_image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000105",
          "mrp": 799,
          "discount_price": 499,
          "discount_percentage": 38,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0054",
          "product_title": "Urban Terrain Bolt 26T Single Speed Mountain Bike with Front Suspension",
          "product_image": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000109",
          "mrp": 11999,
          "discount_price": 5499,
          "discount_percentage": 54,
          "is_add_to_cart": true
        }
      ]
    },
    {
      "widget_id": "w0016",
      "widget_name": "More to Explore",
      "sequence": 16,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "product_id": "p-0055",
          "product_title": "Canon EOS 1500D 24.1MP Digital SLR Camera with 18-55mm IS II Lens",
          "product_image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000104",
          "mrp": 47995,
          "discount_price": 41990,
          "discount_percentage": 13,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0056",
          "product_title": "Royal Enfield Streetwind V3 Protective Breathable Riding Jacket",
          "product_image": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000113",
          "mrp": 4950,
          "discount_price": 4455,
          "discount_percentage": 10,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0057",
          "product_title": "Pedigree Adult Complete Nutrition Dry Dog Food Meat & Rice 3kg Pack",
          "product_image": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000116",
          "mrp": 900,
          "discount_price": 765,
          "discount_percentage": 15,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0058",
          "product_title": "Pampers All Round Protection Baby Diaper Pants (Size L, 64 Count)",
          "product_image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000115",
          "mrp": 1299,
          "discount_price": 999,
          "discount_percentage": 23,
          "is_add_to_cart": true
        },
        {
          "product_id": "p-0059",
          "product_title": "GIVA 925 Sterling Silver Classic Solitaire Crystal Ring with Certificate",
          "product_image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000117",
          "mrp": 2199,
          "discount_price": 1599,
          "discount_percentage": 27,
          "is_add_to_cart": false
        },
        {
          "product_id": "p-0060",
          "product_title": "Hasbro Monopoly Classic Family Board Game for Ages 8 and Up",
          "product_image": "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80",
          "category_id": "c4000000-0000-4000-8000-000000000108",
          "mrp": 1499,
          "discount_price": 1199,
          "discount_percentage": 20,
          "is_add_to_cart": true
        }
      ]
    }
  ]
}
```

---

## 2. LITE Customer Dashboard API

**Method:** `GET`

**Endpoint:**
```http
GET /api/dashboard?module=LITE&categoryId=c4000000-0000-4000-8000-000000000201&warehouseId=WAREHOUSE001&territory=AP&placement=DESKTOP
```

**Purpose:** Fetches the customer dashboard layout for Haatza LITE quick commerce, featuring express delivery banners, daily essentials, and fresh produce.

### Query Parameters

| Parameter | Required | Data Type | Default | Description & Validation Behavior |
|---|:---:|---|:---:|---|
| `module` | **Yes** | `string` | — | Dashboard module identifier. Must be strictly `LITE` (case-insensitive). Missing, invalid, or legacy values reject with HTTP 400 Bad Request. |
| `categoryId` | **Yes** | `string` | — | Category UUID (e.g. `c4000000-0000-4000-8000-000000000201` for All, `c4000000-0000-4000-8000-000000000202` for Fruits and Vegetables). Filters widgets configured with a category match. Missing or empty category ID rejects with HTTP 400 Bad Request. |
| `warehouseId` | **Yes** | `string` | — | Dark store warehouse identifier. Must be one of the 5 supported dark-store warehouses: `WAREHOUSE001`, `WAREHOUSE002`, `WAREHOUSE003`, `WAREHOUSE004`, `WAREHOUSE005`. Required for LITE module. Missing or invalid warehouse ID rejects with HTTP 400 Bad Request. |
| `territory` | **Yes** | `string` | — | Exact 2-letter uppercase Indian state code (one of the 28 supported Indian states: `AP, AR, AS, BR, CG, GA, GJ, HR, HP, JH, KA, KL, MP, MH, MN, ML, MZ, NL, OD, PB, RJ, SK, TN, TS, TR, UP, UK, WB`). Missing, numeric PIN codes (e.g. `56`, `560001`), lowercase (`ap`), `ALL`, or non-state strings reject with HTTP 400 Bad Request. |
| `placement` | **Yes** | `string` | — | Layout placement filter. Must be strictly `DESKTOP` or `MOBILE` (case-sensitive uppercase). Missing or invalid values reject with HTTP 400 Bad Request. |

### Approved 12 LITE Categories

| No | Category Name | Category UUID (`categoryId`) | Widgets & Sequences |
|:---:|---|---|---|
| 1 | **All** | `c4000000-0000-4000-8000-000000000201` | 7 widgets (sequences 1 to 7: Hero Banner, Everyday Essentials, Dispatch Belt, Promo Banner, Offer Banner, Fresh Fruits, Household Cleaning) |
| 2 | **Fruits and Vegetables** | `c4000000-0000-4000-8000-000000000202` | 2 widgets (seq 1 Hero Banner [2 banners], seq 2 Category Products [2 products]) |
| 3 | **Daily and Breakfast** | `c4000000-0000-4000-8000-000000000203` | 2 widgets (seq 1 Hero Banner [2 banners], seq 2 Category Products [2 products]) |
| 4 | **Snacks and Beverages** | `c4000000-0000-4000-8000-000000000204` | 2 widgets (seq 1 Hero Banner [2 banners], seq 2 Category Products [2 products]) |
| 5 | **Household Cleaning** | `c4000000-0000-4000-8000-000000000205` | 2 widgets (seq 1 Hero Banner [2 banners], seq 2 Category Products [2 products]) |
| 6 | **Personal Care** | `c4000000-0000-4000-8000-000000000206` | 2 widgets (seq 1 Hero Banner [2 banners], seq 2 Category Products [2 products]) |
| 7 | **Kitchen Essentials** | `c4000000-0000-4000-8000-000000000207` | 2 widgets (seq 1 Hero Banner [2 banners], seq 2 Category Products [2 products]) |
| 8 | **Bakery and Breads** | `c4000000-0000-4000-8000-000000000208` | 2 widgets (seq 1 Hero Banner [2 banners], seq 2 Category Products [2 products]) |
| 9 | **Staples and Cooking** | `c4000000-0000-4000-8000-000000000209` | 2 widgets (seq 1 Hero Banner [2 banners], seq 2 Category Products [2 products]) |
| 10 | **Frozen Foods** | `c4000000-0000-4000-8000-000000000210` | 2 widgets (seq 1 Hero Banner [2 banners], seq 2 Category Products [2 products]) |
| 11 | **Baby Care** | `c4000000-0000-4000-8000-000000000211` | 2 widgets (seq 1 Hero Banner [2 banners], seq 2 Category Products [2 products]) |
| 12 | **Pet Supplies** | `c4000000-0000-4000-8000-000000000212` | 2 widgets (seq 1 Hero Banner [2 banners], seq 2 Category Products [2 products]) |

**Dark-Store Structure & Widget Inventory:**
- Each warehouse block consists of 29 widgets (7 widgets for Category 201 + 22 widgets across Categories 202–212).
- 5 Warehouses (`WAREHOUSE001` through `WAREHOUSE005`) × 2 Placements (`DESKTOP`, `MOBILE`) = 10 warehouse blocks.
- Exactly 290 LITE rows total (`w0170` through `w0459`).
- Initial database territory is `ALL`. Territory query requests with an exact state code (e.g. `territory=AP`) match `ALL` default records and override with state-specific records if localized rows are defined.

### Complete LITE Success Response Example (`200 OK`)

```json
{
  "success": true,
  "module": "LITE",
  "categoryId": "c4000000-0000-4000-8000-000000000201",
  "territory": "AP",
  "count": 7,
  "widgets": [
    {
      "widget_id": "w0170",
      "widget_name": "Hero Banner",
      "sequence": 1,
      "widget_redirect_to": "NONE",
      "redirect_category_id": "",
      "redirect_product_id": "",
      "items": [
        {
          "banner_image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
          "title": "Lightning Fast 10-Minute Grocery Delivery",
          "content": "Fresh vegetables, dairy & daily breakfast delivered to your doorstep",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000202",
          "redirect_url": ""
        },
        {
          "banner_image": "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=600&q=80",
          "title": "Morning Dairy & Farm-Fresh Produce Specials",
          "content": "Pure organic milk, artisanal sourdough & crisp farm apples",
          "redirect_category_id": "c4000000-0000-4000-8000-000000000203",
          "redirect_url": ""
        }
      ]
    }
  ],
  "warehouseId": "WAREHOUSE001"
}
```

---

## 3. Architecture, Caching & Admin Security

### In-Memory LRU Cache Architecture
- **Engine:** In-memory Least Recently Used (`Map`-based) cache with O(1) reads, writes, and eviction.
- **Capacity:** Maximum 500 keys (`maxEntries: 500`).
- **TTL:** 300 seconds (5 minutes) per entry.
- **LRU Policy:** On every cache hit (`get`), the key is re-inserted to mark it as Most Recently Used. When cache exceeds 500 entries on insertion, the Least Recently Used (oldest accessed) key is evicted.
- **Standardized Key Structures:**
  - **HAATZA:** `dashboard:HAATZA:<placement>:<categoryId>:<territory>` (strictly isolated per placement)
  - **LITE:** `dashboard:LITE:<placement>:<categoryId>:<territory>:<warehouseId>` (strictly isolated per placement and dark-store warehouse)
- **Stampede Prevention:** In-flight promise deduplication ensures multiple concurrent misses share a single database lookup.
- **Invalidation:** Category invalidation loops across `ALLOWED_PLACEMENTS` (`DESKTOP`, `MOBILE`) to flush all views in one pass.

### Admin Authentication & Security
- **Authentication Method:** Administrative endpoints require authentication via `x-admin-key: <ADMIN_API_KEY>` header or `Authorization: Bearer <ADMIN_API_KEY>`.
- **Timing-Safe Comparison:** Compares SHA-256 hashes using `crypto.timingSafeEqual` to prevent side-channel timing attacks.
- **Protected Endpoints:**
  - `GET /api/dashboard/:id` — Single widget inspection (`AdminAuthGuard`).
  - `GET /api/dashboard?raw=true` — CMS raw listing (`401` on missing key, `403` on invalid key).
  - `POST /api/dashboard` — Create widget.
  - `PUT /api/dashboard/:id` / `PATCH /api/dashboard/:id` — Update widget.
  - `DELETE /api/dashboard/:id` — Delete widget.
  - `POST /api/dashboard/cache/clear` — Immediate cache flush.
  - `POST /api/dashboard/seed` — Seed HAATZA widgets (idempotent `DO NOTHING` on conflict).
- **Public Customer Endpoints:**
  - `GET /api/dashboard?...` (without `raw=true`) and `GET /api/dashboard/customer?...` remain strictly public with no authentication required.


